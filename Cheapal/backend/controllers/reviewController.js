// import asyncHandler from 'express-async-handler';
// import { Review } from '../models/Review.js';
// import { Order } from '../models/Order.js';
// import User from '../models/User.js';

// // @desc    Create a review
// // @route   POST /api/reviews
// // @access  Private
// const createReview = asyncHandler(async (req, res) => {
//   const { orderId, rating, comment } = req.body;
//   const order = await Order.findById(orderId);
//   if (!order) {
//     res.status(404);
//     throw new Error('Order not found');
//   }
//   // Check if order is completed and buyer is the reviewer
//   if (order.status !== 'completed' || order.buyer.toString() !== req.user._id.toString()) {
//     res.status(400);
//     throw new Error('You can only review completed orders that you purchased');
//   }
//   // Check if review already exists
//   const reviewExists = await Review.findOne({ order: orderId });
//   if (reviewExists) {
//     res.status(400);
//     throw new Error('You have already reviewed this order');
//   }
//   const review = new Review({
//     order: order._id,
//     reviewer: req.user._id,
//     seller: order.seller,
//     subscription: order.subscription,
//     rating,
//     comment
//   });
//   const createdReview = await review.save();
//   // Update seller's average rating
//   const seller = await User.findById(order.seller);
//   const reviews = await Review.find({ seller: seller._id });
//   const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
//   seller.rating = totalRating / reviews.length;
//   await seller.save();
//   res.status(201).json(createdReview);
// });

// // @desc    Get reviews for a seller
// // @route   GET /api/reviews/seller/:id
// // @access  Public
// const getSellerReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ seller: req.params.id })
//     .populate('reviewer', 'name avatar')
//     .populate('subscription', 'title')
//     .sort({ createdAt: -1 });
//   res.json(reviews);
// });

// // @desc    Get reviews for an order
// // @route   GET /api/reviews/order/:id
// // @access  Private
// const getOrderReview = asyncHandler(async (req, res) => {
//   const review = await Review.findOne({ order: req.params.id })
//     .populate('reviewer', 'name avatar');
//   if (!review) {
//     res.status(404);
//     throw new Error('Review not found');
//   }
//   // Check if user is either buyer, seller, or admin
//   const order = await Order.findById(req.params.id);
//   if (
//     order.buyer.toString() !== req.user._id.toString() &&
//     order.seller.toString() !== req.user._id.toString() &&
//     req.user.role !== 'admin'
//   ) {
//     res.status(401);
//     throw new Error('Not authorized to view this review');
//   }
//   res.json(review);
// });

// export { createReview, getSellerReviews, getOrderReview };


//from grok

import asyncHandler from 'express-async-handler';
import Review from '../models/reviews.js';
import Order from '../models/orders.js';
import User from '../models/users.js';
import Notification from '../models/notifications.js';

const updateSellerRating = async (sellerId) => {
  const reviews = await Review.find({ seller: sellerId });
  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  await User.findByIdAndUpdate(sellerId, { averageRating: avgRating.toFixed(1) });
};

export const submitReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId || !rating || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
    res.status(400);
    throw new Error('Order ID and valid rating (1-5) are required');
  }

  const order = await Order.findById(orderId).populate({
    path: 'orderItems.listing',
    select: 'sellerId',
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to review this order');
  }

  if (order.status !== 'completed') {
    res.status(400);
    throw new Error('Order must be completed to submit a review');
  }

  const existingReview = await Review.findOne({ order: orderId });
  if (existingReview) {
    res.status(400);
    throw new Error('Review already submitted for this order');
  }

  const sellerId = order.orderItems[0]?.listing?.sellerId;
  if (!sellerId) {
    res.status(400);
    throw new Error('Seller not found for this order');
  }

  const review = new Review({
    order: orderId,
    buyer: req.user._id,
    seller: sellerId,
    rating: Number(rating),
    comment: comment ? comment.trim() : null,
  });

  await review.save();
  await updateSellerRating(sellerId);

  const notification = new Notification({
    user: sellerId,
    title: 'New Review Received',
    message: `A buyer has submitted a ${rating}-star review for your order.`,
    link: `/seller/reviews`,
  });
  await notification.save();

  const io = req.app.get('io');
  io.to(`user_${sellerId}`).emit('new_notification', notification);

  res.status(201).json({ success: true, data: review });
});

export const respondToReview = asyncHandler(async (req, res) => {
  const { reviewId, response } = req.body;

  if (!reviewId || !response?.trim()) {
    res.status(400);
    throw new Error('Review ID and response are required');
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this review');
  }

  if (review.sellerResponse) {
    res.status(400);
    throw new Error('Response already submitted');
  }

  review.sellerResponse = response.trim();
  review.updatedAt = new Date();
  await review.save();

  res.status(200).json({ success: true, data: review });
});

export const getReviewsForSeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    res.status(400);
    throw new Error('Invalid seller ID');
  }

  const reviews = await Review.find({ seller: sellerId })
    .populate('buyer', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: reviews });
});