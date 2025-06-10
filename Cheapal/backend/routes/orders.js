// import express from 'express';
// import { protect } from '../middleware/auth.js'; // Ensure this middleware calls next()
// import Order from '../models/Order.js';
// import Listing from '../models/Listing.js';
// import { body, param, validationResult } from 'express-validator'; // Added param
// import mongoose from 'mongoose';
// // import User from '../models/User.js'; // Import User model if needed for notifications

// const router = express.Router();

// // POST /api/orders - Create a new order
// router.post(
//   '/',
//   protect, // This middleware should attach req.user
//   [
//     body('orderItems').isArray({ min: 1 }).withMessage('Order items must be a non-empty array'),
//     body('orderItems.*.listing').isMongoId().withMessage('Invalid listing ID'),
//     body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
//     body('paymentMethod').optional().isString().trim().withMessage('Payment method must be a string')
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.error('[createOrder] Validation errors:', errors.array());
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     if (!req.io) {
//         console.error('[createOrder] Error: req.io is not defined. Socket.IO middleware might be missing or misconfigured.');
//         return res.status(500).json({ success: false, message: 'Server configuration error: Socket.IO not available.' });
//     }

//     try {
//       const { orderItems, paymentMethod } = req.body;
//       const userId = req.user._id;

//       const listingIds = orderItems.map(item => item.listing);
//       const listings = await Listing.find({ _id: { $in: listingIds }, status: 'approved' })
//         .select('price title duration image status sellerId');

//       if (listings.length !== listingIds.length) {
//         const foundListingIds = listings.map(l => l._id.toString());
//         const notFoundOrApproved = listingIds.filter(id => !foundListingIds.includes(id));
//         console.error('[createOrder] One or more listings not found or not approved:', notFoundOrApproved);
//         return res.status(400).json({ success: false, message: `Listings not available: ${notFoundOrApproved.join(', ')}` });
//       }

//       for (const listing of listings) {
//         if (!listing.sellerId || !mongoose.Types.ObjectId.isValid(listing.sellerId)) {
//           console.error('[createOrder] Invalid or missing sellerId for listing:', listing._id);
//           return res.status(400).json({ success: false, message: `Listing "${listing.title || listing._id}" has an invalid or missing seller.` });
//         }
//       }

//       let calculatedTotalPrice = 0;
//       const itemsToSave = orderItems.map(item => {
//         const listing = listings.find(l => l._id.toString() === item.listing);
//         if (!listing) {
//           console.error(`[createOrder] Critical error: Listing ${item.listing} not found after initial check.`);
//           throw new Error(`Listing ${item.listing} not found in approved listings during item mapping.`);
//         }
//         calculatedTotalPrice += listing.price * item.quantity;
//         return {
//           listing: listing._id,
//           seller: listing.sellerId,
//           title: listing.title,
//           quantity: item.quantity,
//           price: listing.price,
//           duration: listing.duration,
//           image: listing.image
//         };
//       });

//       const order = new Order({
//         user: userId,
//         orderItems: itemsToSave,
//         totalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
//         paymentMethod: paymentMethod || 'Not Specified',
//         status: 'completed'
//       });

//       await order.save();

//       const sellerIds = [...new Set(itemsToSave.map(item => item.seller?.toString()).filter(id => id))];
//       console.log(`[createOrder] Emitting new_order_for_seller to seller IDs:`, sellerIds);
//       sellerIds.forEach(sellerId => {
//         if (sellerId) {
//           const roomName = `user_${sellerId}`;
//           const itemsForThisSeller = itemsToSave.filter(item => item.seller?.toString() === sellerId);
//           const payload = {
//             message: `You have a new order for: ${itemsForThisSeller.map(item => item.title).join(', ')}`,
//             orderId: order._id,
//             amount: itemsForThisSeller.reduce((sum, item) => sum + item.price * item.quantity, 0),
//             buyerName: req.user.name || 'A buyer',
//             timestamp: new Date().toISOString()
//           };
//           console.log(`[createOrder] Emitting to room: ${roomName} with payload:`, payload);
//           req.io.to(roomName).emit('new_order_for_seller', payload);
//         } else {
//             console.warn('[createOrder] Attempted to emit to undefined sellerId for order:', order._id);
//         }
//       });

//       const populatedOrder = await Order.findById(order._id)
//         .populate({
//           path: 'orderItems.listing',
//           select: 'title category image sellerId duration',
//           populate: {
//             path: 'sellerId',
//             select: 'name avatar'
//           }
//         })
//         .populate('user', 'name email');

//       res.status(201).json({ success: true, data: populatedOrder });
//     } catch (error) {
//       console.error('[createOrder] Error:', error.message, error.stack);
//       res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
//     }
//   }
// );

// // GET /api/orders/my - Get the authenticated user's orders
// router.get('/my', protect, async (req, res) => {
//   console.log(`[getMyOrders] Route hit by user: ${req.user._id}`);
//   try {
//     const userId = req.user._id;
//     const orders = await Order.find({ user: userId })
//       .populate({
//         path: 'orderItems.listing',
//         select: 'title category image sellerId duration',
//         populate: {
//           path: 'sellerId',
//           select: 'name avatar'
//         }
//       })
//       .sort({ createdAt: -1 })
//       .lean();
//     console.log(`[getMyOrders] Found ${orders.length} orders for user ${userId}`);
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.error('[getMyOrders] Error:', error.message, error.stack);
//     res.status(500).json({ success: false, message: 'Failed to fetch orders' });
//   }
// });

// // GET /api/orders/:orderId - Get a specific order by ID
// router.get(
//   '/:orderId',
//   protect, // Ensure user is authenticated
//   [
//     param('orderId').isMongoId().withMessage('Invalid order ID format')
//   ],
//   async (req, res) => {
//     console.log(`[getOrderById] Route hit for orderId: ${req.params.orderId}`); // LOG WHEN ROUTE IS HIT
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.error('[getOrderById] Validation errors:', errors.array());
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     try {
//       const orderId = req.params.orderId;
//       const userId = req.user._id;
//       const userRole = req.user.role;

//       console.log(`[getOrderById] Attempting to fetch order ${orderId} for user ${userId} (Role: ${userRole})`);

//       const order = await Order.findById(orderId)
//         .populate({
//           path: 'orderItems.listing',
//           select: 'title category image sellerId duration',
//           populate: {
//             path: 'sellerId',
//             select: 'name avatar'
//           }
//         })
//         .populate('user', 'name email');

//       if (!order) {
//         console.warn(`[getOrderById] Order not found in DB: ${orderId}`);
//         return res.status(404).json({ success: false, message: 'Order not found' });
//       }
//       console.log(`[getOrderById] Order found in DB: ${orderId}`, order);


//       // Authorization check: User must own the order or be an admin
//       if (order.user._id.toString() !== userId.toString() && userRole !== 'admin') {
//         console.warn(`[getOrderById] Unauthorized access attempt for order ${orderId} by user ${userId}. Order user: ${order.user._id.toString()}`);
//         return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
//       }

//       console.log(`[getOrderById] Successfully fetched and authorized order ${orderId}`);
//       res.json({ success: true, data: order });

//     } catch (error) {
//       console.error('[getOrderById] Catch block error:', error.message, error.stack);
//       if (error.name === 'CastError' && error.kind === 'ObjectId') {
//         console.error(`[getOrderById] CastError for orderId: ${req.params.orderId}`);
//         return res.status(400).json({ success: false, message: 'Invalid order ID format (CastError)' });
//       }
//       res.status(500).json({ success: false, message: 'Failed to fetch order details' });
//     }
//   }
// );


// export default router;














//from grok


import express from 'express';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

// POST /api/orders - Create a new order
router.post(
  '/',
  protect,
  [
    body('orderItems').isArray({ min: 1 }).withMessage('Order items must be a non-empty array'),
    body('orderItems.*.listing').isMongoId().withMessage('Invalid listing ID'),
    body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('paymentMethod').optional().isString().trim().withMessage('Payment method must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('[createOrder] Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.io) {
        console.error('[createOrder] Error: req.io is not defined. Socket.IO middleware might be missing or misconfigured.');
        return res.status(500).json({ success: false, message: 'Server configuration error: Socket.IO not available.' });
    }

    try {
      const { orderItems, paymentMethod } = req.body;
      const userId = req.user._id;

      const listingIds = orderItems.map(item => item.listing);
      const listings = await Listing.find({ _id: { $in: listingIds }, status: 'approved' })
        .select('price title duration image status sellerId')
        .populate('sellerId', 'sellerProfile.autoReplyMessage');

      if (listings.length !== listingIds.length) {
        const foundListingIds = listings.map(l => l._id.toString());
        const notFoundOrApproved = listingIds.filter(id => !foundListingIds.includes(id));
        console.error('[createOrder] One or more listings not found or not approved:', notFoundOrApproved);
        return res.status(400).json({ success: false, message: `Listings not available: ${notFoundOrApproved.join(', ')}` });
      }

      for (const listing of listings) {
        if (!listing.sellerId || !mongoose.Types.ObjectId.isValid(listing.sellerId)) {
          console.error('[createOrder] Invalid or missing sellerId for listing:', listing._id);
          return res.status(400).json({ success: false, message: `Listing "${listing.title || listing._id}" has an invalid or missing seller.` });
        }
      }

      let calculatedTotalPrice = 0;
      const itemsToSave = orderItems.map(item => {
        const listing = listings.find(l => l._id.toString() === item.listing);
        if (!listing) {
          console.error(`[createOrder] Critical error: Listing ${item.listing} not found after initial check.`);
          throw new Error(`Listing ${item.listing} not found in approved listings during item mapping.`);
        }
        calculatedTotalPrice += listing.price * item.quantity;
        return {
          listing: listing._id,
          seller: listing.sellerId._id,
          title: listing.title,
          quantity: item.quantity,
          price: listing.price,
          duration: listing.duration,
          image: listing.image
        };
      });

      // Aggregate seller messages
      const sellerIds = [...new Set(itemsToSave.map(item => item.seller.toString()))];
      const sellerMessages = await Promise.all(
        sellerIds.map(async (sellerId) => {
          const seller = listings.find(l => l.sellerId._id.toString() === sellerId)?.sellerId;
          return seller?.sellerProfile?.autoReplyMessage || 'Thank you for your order!';
        })
      );
      const aggregatedMessage = sellerMessages.join(' ');
      
      const order = new Order({
        user: userId,
        orderItems: itemsToSave,
        totalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
        paymentMethod: paymentMethod || 'Not Specified',
        status: 'completed',
        sellerMessage: {
          message: aggregatedMessage,
          loginDetails: {} // Placeholder; populate if login details are available
        }
      });

      await order.save();

      console.log(`[createOrder] Emitting new_order_for_seller to seller IDs:`, sellerIds);
      sellerIds.forEach(sellerId => {
        if (sellerId) {
          const roomName = `user_${sellerId}`;
          const itemsForThisSeller = itemsToSave.filter(item => item.seller?.toString() === sellerId);
          const payload = {
            message: `You have a new order for: ${itemsForThisSeller.map(item => item.title).join(', ')}`,
            orderId: order._id,
            amount: itemsForThisSeller.reduce((sum, item) => sum + item.price * item.quantity, 0),
            buyerName: req.user.name || 'A buyer',
            timestamp: new Date().toISOString()
          };
          console.log(`[createOrder] Emitting to room: ${roomName} with payload:`, payload);
          req.io.to(roomName).emit('new_order_for_seller', payload);
        } else {
            console.warn('[createOrder] Attempted to emit to undefined sellerId for order:', order._id);
        }
      });

      const populatedOrder = await Order.findById(order._id)
        .populate({
          path: 'orderItems.listing',
          select: 'title category image sellerId duration',
          populate: {
            path: 'sellerId',
            select: 'name avatar sellerProfile.autoReplyMessage'
          }
        })
        .populate('user', 'name email');

      res.status(201).json({ success: true, data: populatedOrder });
    } catch (error) {
      console.error('[createOrder] Error:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
    }
  }
);

// GET /api/orders/my - Get the authenticated user's orders
router.get('/my', protect, async (req, res) => {
  console.log(`[getMyOrders] Route hit by user: ${req.user._id}`);
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'orderItems.listing',
        select: 'title category image sellerId duration',
        populate: {
          path: 'sellerId',
          select: 'name avatar sellerProfile.autoReplyMessage'
        }
      })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`[getMyOrders] Found ${orders.length} orders for user ${userId}`);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('[getMyOrders] Error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - Get a specific order by ID
router.get(
  '/:orderId',
  protect,
  [
    param('orderId').isMongoId().withMessage('Invalid order ID format')
  ],
  async (req, res) => {
    console.log(`[getOrderById] Route hit for orderId: ${req.params.orderId}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('[getOrderById] Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const orderId = req.params.orderId;
      const userId = req.user._id;
      const userRole = req.user.role;

      console.log(`[getOrderById] Attempting to fetch order ${orderId} for user ${userId} (Role: ${userRole})`);

      const order = await Order.findById(orderId)
        .populate({
          path: 'orderItems.listing',
          select: 'title category image sellerId duration',
          populate: {
            path: 'sellerId',
            select: 'name avatar sellerProfile.autoReplyMessage'
          }
        })
        .populate('user', 'name email');

      if (!order) {
        console.warn(`[getOrderById] Order not found in DB: ${orderId}`);
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      console.log(`[getOrderById] Order found in DB: ${orderId}`, order);

      if (order.user._id.toString() !== userId.toString() && userRole !== 'admin') {
        console.warn(`[getOrderById] Unauthorized access attempt for order ${orderId} by user ${userId}. Order user: ${order.user._id.toString()}`);
        return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
      }

      console.log(`[getOrderById] Successfully fetched and authorized order ${orderId}`);
      res.json({ success: true, data: order });

    } catch (error) {
      console.error('[getOrderById] Catch block error:', error.message, error.stack);
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        console.error(`[getOrderById] CastError for orderId: ${req.params.orderId}`);
        return res.status(400).json({ success: false, message: 'Invalid order ID format (CastError)' });
      }
      res.status(500).json({ success: false, message: 'Failed to fetch order details' });
    }
  }
);

export default router;