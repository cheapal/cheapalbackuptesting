import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import { uploadFile, deleteFile } from '../utils/upload.js';

console.log("✅ [CONTROLLER FILE START] Loading: backend/controllers/listingController.js");

// @desc    Create a new listing
// @route   POST /api/subscriptions
// @access  Private/Seller
const createListing = asyncHandler(async (req, res) => {
  console.log("[listingController] createListing - Request body:", req.body);
  const { title, description, price, category, duration, autoReply } = req.body;
  const image = req.file;

  let imageUrl = '';
  if (image) {
    try {
      imageUrl = await uploadFile(image, 'subscriptions');
      console.log("[listingController] createListing - Image uploaded:", imageUrl);
    } catch (error) {
      console.error("[listingController] createListing - Image upload failed:", error);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    duration,
    autoReply,
    image: imageUrl,
    sellerId: req.user._id,
    status: 'pending',
  });

  console.log("[listingController] createListing - Listing created:", listing._id);
  res.status(201).json({
    success: true,
    data: listing,
    message: 'Listing created successfully, pending admin approval.',
  });
});

// @desc    Get seller's own listings
// @route   GET /api/subscriptions/my
// @access  Private/Seller
const getMyListings = asyncHandler(async (req, res) => {
  console.log("[listingController] getMyListings - Seller ID:", req.user._id);
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    console.error("[listingController] getMyListings - Invalid seller ID:", req.user._id);
    res.status(400);
    throw new Error('Invalid seller ID format.');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({ sellerId: req.user._id })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges');

  const total = await Listing.countDocuments({ sellerId: req.user._id });

  console.log("[listingController] getMyListings - Listings found:", listings.length, "Listings:", listings.map(l => ({ _id: l._id, title: l.title })));
  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get a single listing by ID
// @route   GET /api/subscriptions/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  console.log("[listingController] getListingById - Listing ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] getListingById - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id)
    .populate('sellerId', 'name email verificationStatus badges');

  if (!listing) {
    console.error("[listingController] getListingById - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  console.log("[listingController] getListingById - Listing retrieved:", listing._id);
  res.status(200).json({
    success: true,
    data: listing,
  });
});

// @desc    Update a listing
// @route   PUT /api/subscriptions/:id
// @access  Private/Seller
const updateListing = asyncHandler(async (req, res) => {
  console.log("[listingController] updateListing - Listing ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] updateListing - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    console.error("[listingController] updateListing - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.sellerId.toString() !== req.user._id.toString()) {
    console.error("[listingController] updateListing - Unauthorized user:", req.user._id);
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  const { title, description, price, category, duration, autoReply } = req.body;
  const image = req.file;

  let imageUrl = listing.image;
  if (image) {
    try {
      if (listing.image) {
        await deleteFile(listing.image);
        console.log("[listingController] updateListing - Old image deleted:", listing.image);
      }
      imageUrl = await uploadFile(image, 'subscriptions');
      console.log("[listingController] updateListing - New image uploaded:", imageUrl);
    } catch (error) {
      console.error("[listingController] updateListing - Image upload failed:", error);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  listing.title = title || listing.title;
  listing.description = description || listing.description;
  listing.price = price || listing.price;
  listing.category = category || listing.category;
  listing.duration = duration || listing.duration;
  listing.autoReply = autoReply || listing.autoReply;
  listing.image = imageUrl;

  const updatedListing = await listing.save();
  console.log("[listingController] updateListing - Listing updated:", updatedListing._id);

  res.status(200).json({
    success: true,
    data: updatedListing,
    message: 'Listing updated successfully',
  });
});

// @desc    Delete a listing
// @route   DELETE /api/subscriptions/:id
// @access  Private/Seller
const deleteListing = asyncHandler(async (req, res) => {
  console.log("[listingController] deleteListing - Listing ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] deleteListing - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    console.error("[listingController] deleteListing - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.sellerId.toString() !== req.user._id.toString()) {
    console.error("[listingController] deleteListing - Unauthorized user:", req.user._id);
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }

  if (listing.image) {
    try {
      await deleteFile(listing.image);
      console.log("[listingController] deleteListing - Image deleted:", listing.image);
    } catch (error) {
      console.error("[listingController] deleteListing - Image deletion failed:", error);
    }
  }

  await Listing.deleteOne({ _id: listing._id });
  console.log("[listingController] deleteListing - Listing deleted:", req.params.id);

  res.status(200).json({
    success: true,
    message: 'Listing deleted successfully',
  });
});

// @desc    Get all listings (filtered by status if provided)
// @route   GET /api/subscriptions
// @access  Public
const getApprovedListings = asyncHandler(async (req, res) => {
  console.log("[listingController] getApprovedListings - Query:", req.query);
  const { status } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = status ? { status } : { status: 'approved' };
  const listings = await Listing.find(query)
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges')
    .sort({ mainRank: 1, createdAt: -1 });

  const total = await Listing.countDocuments(query);

  console.log("[listingController] getApprovedListings - Listings found:", listings.length);
  console.log("[listingController] getApprovedListings - Listings order:", listings.map(l => ({ _id: l._id, mainRank: l.mainRank })));

  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get approved listings for a specific seller
// @route   GET /api/subscriptions/seller/:sellerId
// @access  Public
const getSellerListingsPublic = asyncHandler(async (req, res) => {
  console.log("[listingController] getSellerListingsPublic - Seller ID:", req.params.sellerId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(req.params.sellerId)) {
    console.error("[listingController] getSellerListingsPublic - Invalid sellerId:", req.params.sellerId);
    res.status(400);
    throw new Error('Invalid seller ID format.');
  }

  const listings = await Listing.find({
    sellerId: req.params.sellerId,
    status: 'approved',
  })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges')
    .sort({ mainRank: 1, createdAt: -1 });

  const total = await Listing.countDocuments({
    sellerId: req.params.sellerId,
    status: 'approved',
  });

  console.log("[listingController] getSellerListingsPublic - Listings found:", listings.length);
  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get approved listings by category
// @route   GET /api/subscriptions/category/:categoryName
// @access  Public
const getApprovedListingsByCategory = asyncHandler(async (req, res) => {
  console.log("[listingController] getApprovedListingsByCategory - Category:", req.params.categoryName);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({
    category: req.params.categoryName,
    status: 'approved',
  })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges')
    .sort({ mainRank: 1, createdAt: -1 });

  const total = await Listing.countDocuments({
    category: req.params.categoryName,
    status: 'approved',
  });

  console.log("[listingController] getApprovedListingsByCategory - Listings found:", listings.length);
  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get featured listings
// @route   GET /api/subscriptions/featured
// @access  Public
const getFeaturedListings = asyncHandler(async (req, res) => {
  console.log("[listingController] getFeaturedListings - Query:", req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({ isFeatured: true, status: 'approved' })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges')
    .sort({ 'featuredConfig.rank': 1 });

  const total = await Listing.countDocuments({ isFeatured: true, status: 'approved' });

  console.log("[listingController] getFeaturedListings - Listings found:", listings.length);
  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get homepage featured listings
// @route   GET /api/subscriptions/homepage-featured
// @access  Public
const getHomepageFeaturedListings = asyncHandler(async (req, res) => {
  console.log("[listingController] getHomepageFeaturedListings - Query:", req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({ isHomepageFeatured: true, status: 'approved' })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name email verificationStatus badges')
    .sort({ 'homepageFeaturedConfig.rank': 1 });

  const total = await Listing.countDocuments({ isHomepageFeatured: true, status: 'approved' });

  console.log("[listingController] getHomepageFeaturedListings - Listings found:", listings.length);
  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Add a listing to homepage featured
// @route   POST /api/subscriptions/admin/homepage-featured
// @access  Private/Admin
const addHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] addHomepageFeaturedSubscription - Request body:", req.body);
  const { listingId, rank, gradient, border } = req.body;

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    console.error("[listingController] addHomepageFeaturedSubscription - Invalid listingId:", listingId);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    console.error("[listingController] addHomepageFeaturedSubscription - Listing not found:", listingId);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.status !== 'approved') {
    console.error("[listingController] addHomepageFeaturedSubscription - Listing not approved:", listingId);
    res.status(400);
    throw new Error('Only approved listings can be featured');
  }

  const existingRanked = await Listing.findOne({ 'homepageFeaturedConfig.rank': rank, _id: { $ne: listingId } });
  if (existingRanked) {
    console.error("[listingController] addHomepageFeaturedSubscription - Rank already taken:", rank);
    res.status(400);
    throw new Error('This rank is already assigned to another listing');
  }

  listing.isHomepageFeatured = true;
  listing.homepageFeaturedConfig = { rank: parseInt(rank), gradient, border };
  const updatedListing = await listing.save();

  console.log("[listingController] addHomepageFeaturedSubscription - Listing featured:", updatedListing._id);
  res.status(201).json({
    success: true,
    data: updatedListing,
    message: 'Listing added to homepage featured successfully',
  });
});

// @desc    Update a homepage featured listing
// @route   PUT /api/subscriptions/admin/homepage-featured/:id
// @access  Private/Admin
const updateHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] updateHomepageFeaturedSubscription - Listing ID:", req.params.id);
  const { rank, gradient, border } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] updateHomepageFeaturedSubscription - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    console.error("[listingController] updateHomepageFeaturedSubscription - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.status !== 'approved') {
    console.error("[listingController] updateHomepageFeaturedSubscription - Listing not approved:", req.params.id);
    res.status(400);
    throw new Error('Only approved listings can be featured');
  }

  const existingRanked = await Listing.findOne({ 'homepageFeaturedConfig.rank': rank, _id: { $ne: req.params.id } });
  if (existingRanked) {
    console.error("[listingController] updateHomepageFeaturedSubscription - Rank already taken:", rank);
    res.status(400);
    throw new Error('This rank is already assigned to another listing');
  }

  listing.isHomepageFeatured = true;
  listing.homepageFeaturedConfig = { rank: parseInt(rank), gradient, border };
  const updatedListing = await listing.save();

  console.log("[listingController] updateHomepageFeaturedSubscription - Listing updated:", updatedListing._id);
  res.status(200).json({
    success: true,
    data: updatedListing,
    message: 'Homepage featured listing updated successfully',
  });
});

// @desc    Remove a listing from homepage featured
// @route   DELETE /api/subscriptions/admin/homepage-featured/:id
// @access  Private/Admin
const removeHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] removeHomepageFeaturedSubscription - Listing ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] removeHomepageFeaturedSubscription - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    console.error("[listingController] removeHomepageFeaturedSubscription - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  listing.isHomepageFeatured = false;
  listing.homepageFeaturedConfig = {};
  await listing.save();

  console.log("[listingController] removeHomepageFeaturedSubscription - Listing removed:", req.params.id);
  res.status(200).json({
    success: true,
    message: 'Listing removed from homepage featured successfully',
  });
});

// @desc    Add a listing to main ranked (SubscriptionPage and category pages)
// @route   POST /api/subscriptions/admin/main-ranked
// @access  Private/Admin
const addMainRankedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] addMainRankedSubscription - Request body:", req.body);
  const { listingId, mainRank } = req.body;

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    console.error("[listingController] addMainRankedSubscription - Invalid listingId:", listingId);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    console.error("[listingController] addMainRankedSubscription - Listing not found:", listingId);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.status !== 'approved') {
    console.error("[listingController] addMainRankedSubscription - Listing not approved:", listingId);
    res.status(400);
    throw new Error('Only approved listings can be ranked');
  }

  const existingRanked = await Listing.findOne({ mainRank });
  if (existingRanked) {
    console.error("[listingController] addMainRankedSubscription - Rank already taken:", mainRank);
    res.status(400);
    throw new Error('This rank is already assigned to another listing');
  }

  listing.mainRank = mainRank;
  const updatedListing = await listing.save();

  console.log("[listingController] addMainRankedSubscription - Listing ranked:", updatedListing._id);
  res.status(201).json({
    success: true,
    data: updatedListing,
    message: 'Listing ranked successfully',
  });
});

// @desc    Update a listing's main rank
// @route   PUT /api/subscriptions/admin/main-ranked/:id
// @access  Private/Admin
const updateMainRankedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] updateMainRankedSubscription - Listing ID:", req.params.id);
  const { mainRank } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] updateMainRankedSubscription - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    console.error("[listingController] updateMainRankedSubscription - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.status !== 'approved') {
    console.error("[listingController] updateMainRankedSubscription - Listing not approved:", req.params.id);
    res.status(400);
    throw new Error('Only approved listings can be ranked');
  }

  const existingRanked = await Listing.findOne({ mainRank, _id: { $ne: req.params.id } });
  if (existingRanked) {
    console.error("[listingController] updateMainRankedSubscription - Rank already taken:", mainRank);
    res.status(400);
    throw new Error('This rank is already assigned to another listing');
  }

  listing.mainRank = mainRank;
  const updatedListing = await listing.save();

  console.log("[listingController] updateMainRankedSubscription - Listing updated:", updatedListing._id);
  res.status(200).json({
    success: true,
    data: updatedListing,
    message: 'Listing rank updated successfully',
  });
});

// @desc    Remove a listing from main ranked
// @route   DELETE /api/subscriptions/admin/main-ranked/:id
// @access  Private/Admin
const removeMainRankedSubscription = asyncHandler(async (req, res) => {
  console.log("[listingController] removeMainRankedSubscription - Listing ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("[listingController] removeMainRankedSubscription - Invalid listing ID:", req.params.id);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    console.error("[listingController] removeMainRankedSubscription - Listing not found:", req.params.id);
    res.status(404);
    throw new Error('Listing not found');
  }

  listing.mainRank = null;
  await listing.save();

  console.log("[listingController] removeMainRankedSubscription - Rank removed:", req.params.id);
  res.status(200).json({
    success: true,
    message: 'Listing rank removed successfully',
  });
});

// @desc    Submit a bid for main ranked subscription
// @route   POST /api/subscriptions/promote/main-ranked
// @access  Private/Seller
const submitMainRanked = asyncHandler(async (req, res) => {
  console.log("[listingController] submitMainRanked - Request body:", req.body);
  const { listingId, mainRank } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    console.error("[listingController] submitMainRanked - Invalid listingId:", listingId);
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  if (!mainRank || isNaN(mainRank) || parseInt(mainRank) < 1) {
    console.error("[listingController] submitMainRanked - Invalid mainRank:", mainRank);
    res.status(400);
    throw new Error('Main rank must be a positive integer.');
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    console.error("[listingController] submitMainRanked - Listing not found:", listingId);
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.sellerId.toString() !== userId.toString()) {
    console.error("[listingController] submitMainRanked - Unauthorized user:", userId);
    res.status(403);
    throw new Error('Not authorized to promote this listing');
  }

  if (listing.status !== 'approved') {
    console.error("[listingController] submitMainRanked - Listing not approved:", listingId);
    res.status(400);
    throw new Error('Listing must be approved to submit a ranked bid');
  }

  const existingRanked = await Listing.findOne({ mainRank, _id: { $ne: listingId } });
  if (existingRanked) {
    console.error("[listingController] submitMainRanked - Rank already taken:", mainRank);
    res.status(400);
    throw new Error('This rank is already assigned to another listing');
  }

  listing.mainRank = parseInt(mainRank);
  const updatedListing = await listing.save();

  console.log("[listingController] submitMainRanked - Bid submitted:", updatedListing._id);
  res.status(200).json({
    success: true,
    data: updatedListing,
    message: 'Main ranked bid submitted successfully',
  });
});

console.log("✅ [CONTROLLER FILE END] Exporting controllers from backend/controllers/listingController.js");

export {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
  getApprovedListings,
  getSellerListingsPublic,
  getApprovedListingsByCategory,
  getFeaturedListings,
  getHomepageFeaturedListings,
  addHomepageFeaturedSubscription,
  updateHomepageFeaturedSubscription,
  removeHomepageFeaturedSubscription,
  addMainRankedSubscription,
  updateMainRankedSubscription,
  removeMainRankedSubscription,
  submitMainRanked,
};