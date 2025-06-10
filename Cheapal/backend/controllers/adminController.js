import asyncHandler from 'express-async-handler';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

console.log("✅ [CONTROLLER FILE START] Loading: backend/controllers/adminController.js");

// --- Helper for pagination ---
const paginateResults = (page, limit, totalDocs, data) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;
  const totalPages = Math.ceil(totalDocs / limitNum);

  return {
    data,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalDocs,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

// --- Helper for Socket.IO ---
const getIo = (req) => {
  return req.app?.locals?.io || req.io || null;
};

// --- Listing Approval Controllers ---

export const getPendingListings = asyncHandler(async (req, res) => {
  console.log("Admin Controller: Fetching pending listings...");
  const pendingListings = await Listing.find({ status: 'pending' })
    .populate('sellerId', 'name email avatar')
    .sort({ createdAt: 1 })
    .lean();

  console.log(`Admin Controller: Found ${pendingListings.length} pending listings.`);
  res.status(200).json({
    success: true,
    message: 'Fetched pending listings successfully.',
    data: pendingListings,
  });
});

export const approveListingAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Admin Controller: Attempting to approve listing ID: ${id}`);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.status === 'approved') {
    res.status(400);
    throw new Error('Listing is already approved.');
  }

  listing.status = 'approved';
  const updatedListing = await listing.save();
  console.log(`Admin Controller: Listing approved successfully: ${id}`);

  const io = getIo(req);
  if (io && listing.sellerId) {
    const sellerRoom = `user_${listing.sellerId}`;
    io.to(sellerRoom).emit('listing_approved', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" has been approved.`,
    });
    console.log(`Emitted 'listing_approved' notification to room ${sellerRoom}`);
  }

  res.status(200).json({
    success: true,
    message: 'Listing approved successfully.',
    data: updatedListing,
  });
});

export const rejectListingAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  console.log(`Admin Controller: Attempting to reject listing ID: ${id} ${reason ? `with reason: ${reason}` : ''}`);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.status === 'rejected') {
    res.status(400);
    throw new Error('Listing is already rejected.');
  }

  listing.status = 'rejected';
  if (reason) {
    listing.rejectionReason = reason;
  }
  const updatedListing = await listing.save();
  console.log(`Admin Controller: Listing rejected successfully: ${id}`);

  const io = getIo(req);
  if (io && listing.sellerId) {
    const sellerRoom = `user_${listing.sellerId}`;
    io.to(sellerRoom).emit('listing_rejected', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" has been rejected.` + (reason ? ` Reason: ${reason}` : ''),
    });
    console.log(`Emitted 'listing_rejected' notification to room ${sellerRoom}`);
  }

  res.status(200).json({
    success: true,
    message: 'Listing rejected successfully.',
    data: updatedListing,
  });
});

export const getAllListingsAdmin = asyncHandler(async (req, res) => {
  console.log("Admin Controller: Fetching all listings (admin)...");
  const { page = 1, limit = 15 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [listings, total] = await Promise.all([
    Listing.find({})
      .populate('sellerId', 'name email')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Listing.countDocuments({}),
  ]);

  console.log(`Admin Controller: Found ${listings.length} listings (Total matching filter: ${total}).`);
  const paginatedResult = paginateResults(pageNum, limitNum, total, listings);
  res.status(200).json({
    success: true,
    message: 'Fetched listings successfully.',
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
  });
});

// --- Featured Subscriptions Controllers ---

export const addFeaturedSubscription = asyncHandler(async (req, res) => {
  const { listingId, gradient, rank } = req.body;
  console.log(`Admin Controller: Adding featured subscription for listing ID: ${listingId}, rank: ${rank}`);

  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    res.status(400);
    throw new Error('Invalid or missing listing ID format.');
  }
  if (!gradient) {
    res.status(400);
    throw new Error('Gradient is required.');
  }

  let parsedRank = rank ? parseInt(rank) : null;
  if (parsedRank && (isNaN(parsedRank) || parsedRank < 1)) {
    res.status(400);
    throw new Error('Rank must be a positive integer if provided.');
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.status !== 'approved') {
    res.status(400);
    throw new Error('Only approved listings can be featured.');
  }

  if (parsedRank) {
    await Listing.updateMany(
      { isFeatured: true, 'featuredConfig.rank': { $gte: parsedRank } },
      { $inc: { 'featuredConfig.rank': 1 } }
    );
  }

  listing.isFeatured = true;
  listing.featuredConfig = {
    icon: req.file ? `Uploads/listings/${req.file.filename}` : null,
    gradient,
    rank: parsedRank || (await Listing.countDocuments({ isFeatured: true }) + 1),
  };
  const updatedListing = await listing.save();

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_featured', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" has been featured.`,
    });
  }

  console.log(`Admin Controller: Featured subscription added for listing ID: ${listingId}`);
  res.status(200).json({
    success: true,
    message: 'Listing added to featured subscriptions.',
    data: updatedListing,
  });
});

export const updateFeaturedSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gradient, rank } = req.body;
  console.log(`Admin Controller: Updating featured subscription for listing ID: ${id}, rank: ${rank}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (!listing.isFeatured) {
    res.status(400);
    throw new Error('Listing is not featured.');
  }

  let parsedRank = rank ? parseInt(rank) : listing.featuredConfig.rank;
  if (parsedRank && (isNaN(parsedRank) || parsedRank < 1)) {
    res.status(400);
    throw new Error('Rank must be a positive integer if provided.');
  }

  if (parsedRank && parsedRank !== listing.featuredConfig.rank) {
    await Listing.updateMany(
      { isFeatured: true, 'featuredConfig.rank': { $gte: parsedRank }, _id: { $ne: id } },
      { $inc: { 'featuredConfig.rank': 1 } }
    );
    await Listing.updateMany(
      { isFeatured: true, 'featuredConfig.rank': { $gte: listing.featuredConfig.rank, $lt: parsedRank }, _id: { $ne: id } },
      { $inc: { 'featuredConfig.rank': -1 } }
    );
  }

  listing.featuredConfig = {
    icon: req.file ? `Uploads/listings/${req.file.filename}` : listing.featuredConfig.icon,
    gradient: gradient || listing.featuredConfig.gradient,
    rank: parsedRank,
  };
  const updatedListing = await listing.save();

  console.log(`Admin Controller: Featured subscription updated for listing ID: ${id}`);
  res.status(200).json({
    success: true,
    message: 'Featured subscription updated.',
    data: updatedListing,
  });
});

export const removeFeaturedSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Admin Controller: Removing featured subscription for listing ID: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (!listing.isFeatured) {
    res.status(400);
    throw new Error('Listing is not featured.');
  }

  const oldRank = listing.featuredConfig.rank;
  listing.isFeatured = false;
  listing.featuredConfig = { icon: null, gradient: null, rank: null };
  const updatedListing = await listing.save();

  await Listing.updateMany(
    { isFeatured: true, 'featuredConfig.rank': { $gt: oldRank } },
    { $inc: { 'featuredConfig.rank': -1 } }
  );

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_unfeatured', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" is no longer featured.`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Listing removed from featured subscriptions.',
    data: updatedListing,
  });
});

export const getFeaturedSubscriptions = asyncHandler(async (req, res) => {
  console.log("Admin Controller: Fetching featured subscriptions...");
  const { page = 1, limit = 15 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [listings, total] = await Promise.all([
    Listing.find({ isFeatured: true })
      .populate('sellerId', 'name email avatar')
      .sort({ 'featuredConfig.rank': 1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Listing.countDocuments({ isFeatured: true }),
  ]);

  console.log(`Admin Controller: Found ${listings.length} featured subscriptions (Total: ${total}).`);
  const paginatedResult = paginateResults(pageNum, limitNum, total, listings);
  res.status(200).json({
    success: true,
    message: 'Fetched featured subscriptions successfully.',
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
  });
});

// --- Homepage Featured Subscriptions Controllers ---

export const addHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  let listingId, rank, gradient, border;
  console.log(`[adminController] Request body:`, req.body);

  if (req.body instanceof FormData) {
    listingId = req.body.get('listingId');
    rank = req.body.get('rank');
    gradient = req.body.get('gradient');
    border = req.body.get('border');
  } else {
    ({ listingId, rank, gradient, border } = req.body);
  }

  console.log(`Admin Controller: Adding homepage featured subscription for listing ID: ${listingId}, rank: ${rank}, gradient: ${gradient}, border: ${border}`);

  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    console.error(`[adminController] Invalid or missing listingId: ${listingId}`);
    res.status(400);
    throw new Error('Invalid or missing listing ID format.');
  }
  if (!rank || isNaN(parseInt(rank)) || parseInt(rank) < 1) {
    console.error(`[adminController] Invalid or missing rank: ${rank}`);
    res.status(400);
    throw new Error('Rank is required and must be a positive integer.');
  }
  if (!gradient || typeof gradient !== 'string' || gradient.trim() === '') {
    console.error(`[adminController] Invalid or missing gradient: ${gradient}`);
    res.status(400);
    throw new Error('Gradient is required and must be a valid string.');
  }
  if (!border || typeof border !== 'string' || border.trim() === '') {
    console.error(`[adminController] Invalid or missing border: ${border}`);
    res.status(400);
    throw new Error('Border is required and must be a valid string.');
  }

  const parsedRank = parseInt(rank);
  const listing = await Listing.findById(listingId);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.status !== 'approved') {
    res.status(400);
    throw new Error('Only approved listings can be featured.');
  }

  await Listing.updateMany(
    { isHomepageFeatured: true, 'homepageFeaturedConfig.rank': { $gte: parsedRank } },
    { $inc: { 'homepageFeaturedConfig.rank': 1 } }
  );

  listing.isHomepageFeatured = true;
  listing.homepageFeaturedConfig = {
    rank: parsedRank,
    gradient,
    border,
  };
  const updatedListing = await listing.save();

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_homepage_featured', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" has been featured on the homepage.`,
    });
  }

  console.log(`Admin Controller: Homepage featured subscription added for listing ID: ${listingId}`);
  res.status(201).json({
    success: true,
    message: 'Listing added to homepage featured subscriptions.',
    data: updatedListing,
  });
});

export const updateHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let rank, gradient, border;
  if (req.body instanceof FormData) {
    rank = req.body.get('rank');
    gradient = req.body.get('gradient');
    border = req.body.get('border');
  } else {
    ({ rank, gradient, border } = req.body);
  }
  console.log(`Admin Controller: Updating homepage featured subscription for listing ID: ${id}, rank: ${rank}, gradient: ${gradient}, border: ${border}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (!listing.isHomepageFeatured) {
    res.status(400);
    throw new Error('Listing is not homepage featured.');
  }

  let parsedRank = rank ? parseInt(rank) : listing.homepageFeaturedConfig.rank;
  if (!parsedRank || isNaN(parsedRank) || parsedRank < 1) {
    res.status(400);
    throw new Error('Rank is required and must be a positive integer.');
  }
  if (!gradient || typeof gradient !== 'string' || gradient.trim() === '') {
    res.status(400);
    throw new Error('Gradient is required and must be a valid string.');
  }
  if (!border || typeof border !== 'string' || border.trim() === '') {
    res.status(400);
    throw new Error('Border is required and must be a valid string.');
  }

  if (parsedRank !== listing.homepageFeaturedConfig.rank) {
    await Listing.updateMany(
      { isHomepageFeatured: true, 'homepageFeaturedConfig.rank': { $gte: parsedRank }, _id: { $ne: id } },
      { $inc: { 'homepageFeaturedConfig.rank': 1 } }
    );
    await Listing.updateMany(
      { isHomepageFeatured: true, 'homepageFeaturedConfig.rank': { $gte: listing.homepageFeaturedConfig.rank, $lt: parsedRank }, _id: { $ne: id } },
      { $inc: { 'homepageFeaturedConfig.rank': -1 } }
    );
  }

  listing.homepageFeaturedConfig = { rank: parsedRank, gradient, border };
  const updatedListing = await listing.save();

  console.log(`Admin Controller: Homepage featured subscription updated for listing ID: ${id}`);
  res.status(200).json({
    success: true,
    message: 'Homepage featured subscription updated.',
    data: updatedListing,
  });
});

export const removeHomepageFeaturedSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Admin Controller: Removing homepage featured subscription for listing ID: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (!listing.isHomepageFeatured) {
    res.status(400);
    throw new Error('Listing is not homepage featured.');
  }

  const oldRank = listing.homepageFeaturedConfig.rank;
  listing.isHomepageFeatured = false;
  listing.homepageFeaturedConfig = { rank: null, gradient: null, border: null };
  const updatedListing = await listing.save();

  await Listing.updateMany(
    { isHomepageFeatured: true, 'homepageFeaturedConfig.rank': { $gt: oldRank } },
    { $inc: { 'homepageFeaturedConfig.rank': -1 } }
  );

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_unfeatured_homepage', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" is no longer featured on the homepage.`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Listing removed from homepage featured subscriptions.',
    data: updatedListing,
  });
});

// --- Main Ranked Subscriptions Controllers ---

export const addMainRankedListing = asyncHandler(async (req, res) => {
  let listingId, mainRank;
  console.log(`[adminController] addMainRankedListing - Request body:`, req.body);

  if (req.body instanceof FormData) {
    listingId = req.body.get('listingId');
    mainRank = req.body.get('mainRank');
  } else {
    ({ listingId, mainRank } = req.body);
  }

  console.log(`Admin Controller: Adding main ranked subscription for listing ID: ${listingId}, mainRank: ${mainRank}`);

  if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
    console.error(`[adminController] Invalid or missing listingId: ${listingId}`);
    res.status(400);
    throw new Error('Invalid or missing listing ID format.');
  }
  if (!mainRank || isNaN(parseInt(mainRank)) || parseInt(mainRank) < 1) {
    console.error(`[adminController] Invalid or missing mainRank: ${mainRank}`);
    res.status(400);
    throw new Error('Main rank is required and must be a positive integer.');
  }

  const parsedRank = parseInt(mainRank);
  const listing = await Listing.findById(listingId);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.status !== 'approved') {
    res.status(400);
    throw new Error('Only approved listings can be main-ranked.');
  }

  // Update existing ranks to avoid conflicts
  await Listing.updateMany(
    { mainRank: { $gte: parsedRank } },
    { $inc: { mainRank: 1 } }
  );

  listing.mainRank = parsedRank;
  const updatedListing = await listing.save();

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_main_ranked', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" has been main-ranked with rank ${parsedRank}.`,
    });
  }

  console.log(`Admin Controller: Main ranked subscription added for listing ID: ${listingId}`);
  res.status(201).json({
    success: true,
    message: 'Main ranked subscription added successfully.',
    data: updatedListing,
  });
});

export const updateMainRankedListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let mainRank;
  if (req.body instanceof FormData) {
    mainRank = req.body.get('mainRank');
  } else {
    ({ mainRank } = req.body);
  }
  console.log(`Admin Controller: Updating main ranked subscription for listing ID: ${id}, mainRank: ${mainRank}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }
  if (!mainRank || isNaN(parseInt(mainRank)) || parseInt(mainRank) < 1) {
    res.status(400);
    throw new Error('Main rank is required and must be a positive integer.');
  }

  const parsedRank = parseInt(mainRank);
  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.mainRank == null) {
    res.status(400);
    throw new Error('Listing is not main-ranked.');
  }

  if (parsedRank !== listing.mainRank) {
    await Listing.updateMany(
      { mainRank: { $gte: parsedRank }, _id: { $ne: id } },
      { $inc: { mainRank: 1 } }
    );
    await Listing.updateMany(
      { mainRank: { $gte: listing.mainRank, $lt: parsedRank }, _id: { $ne: id } },
      { $inc: { mainRank: -1 } }
    );
  }

  listing.mainRank = parsedRank;
  const updatedListing = await listing.save();

  console.log(`Admin Controller: Main ranked subscription updated for listing ID: ${id}`);
  res.status(200).json({
    success: true,
    message: 'Main ranked subscription updated successfully.',
    data: updatedListing,
  });
});

export const removeMainRankedListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Admin Controller: Removing main ranked subscription for listing ID: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid listing ID format.');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }
  if (listing.mainRank == null) {
    res.status(400);
    throw new Error('Listing is not main-ranked.');
  }

  const oldRank = listing.mainRank;
  listing.mainRank = null;
  const updatedListing = await listing.save();

  await Listing.updateMany(
    { mainRank: { $gt: oldRank } },
    { $inc: { mainRank: -1 } }
  );

  const io = getIo(req);
  if (io && listing.sellerId) {
    io.to(`user_${listing.sellerId}`).emit('listing_unranked_main', {
      listingId: updatedListing._id,
      title: updatedListing.title,
      message: `Your listing "${updatedListing.title}" is no longer main-ranked.`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Main ranked subscription removed successfully.',
    data: updatedListing,
  });
});

// --- User Management Controllers ---

export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("Admin Controller: Fetching all users (admin)...", req.query);
  const { page = 1, limit = 15, search = '' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  const paginatedResult = paginateResults(pageNum, limitNum, total, users);
  res.status(200).json({
    success: true,
    message: 'Users fetched successfully.',
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
  });
});

export const getUserByIdAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(`Admin Controller: Fetching user details for ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.status(200).json({
    success: true,
    message: 'User fetched successfully.',
    data: user,
  });
});

export const toggleUserBlock = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(`Admin Controller: Toggling block status for user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();
  const action = user.isBlocked ? 'blocked' : 'unblocked';
  console.log(`Admin Controller: User ${userId} has been ${action}.`);

  const io = getIo(req);
  if (io) {
    io.to(`user_${userId}`).emit('account_status_changed', {
      isBlocked: user.isBlocked,
      message: `Your account has been ${action} by an administrator.`,
    });
  }

  res.status(200).json({
    success: true,
    message: `User successfully ${action}.`,
    data: { _id: user._id, isBlocked: user.isBlocked },
  });
});

export const warnUserAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;
  console.log(`Admin Controller: Attempting to warn user ID: ${userId}`);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }
  if (!message) {
    res.status(400);
    throw new Error('Warning message is required.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const io = getIo(req);
  if (io) {
    io.to(`user_${userId}`).emit('new_warning', {
      title: 'Admin Warning',
      message,
      issuedBy: req.user.name,
      date: new Date().toISOString(),
    });
    console.log(`Emitted 'new_warning' to user ${userId}`);
  }

  res.status(200).json({
    success: true,
    message: `Warning sent to ${user.name}.`,
  });
});

export const updateUserAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;
  console.log(`Admin Controller: Attempting to update user ID: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  if (name) user.name = name;
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email already in use.');
    }
    user.email = email;
  }
  if (role && ['buyer', 'seller', 'admin', 'user'].includes(role)) user.role = role;

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role },
  });
});

const AVAILABLE_BADGES = [
  { id: 'rising_seller', name: 'Rising Seller', icon: 'TrendingUpIcon', color: 'cyan' },
  { id: 'top_rated_seller', name: 'Top Rated Seller', icon: 'StarIcon', color: 'amber' },
  { id: 'verified_user', name: 'Verified User', icon: 'CheckShieldIcon', color: 'green' },
  { id: 'community_helper', name: 'Community Helper', icon: 'UsersGroupIcon', color: 'indigo' },
  { id: 'early_adopter', name: 'Early Adopter', icon: 'ZapIcon', color: 'pink' },
  { id: 'pro_seller', name: 'Pro Seller', icon: 'ShieldCheckIcon', color: 'blue' },
  { id: 'expert_contributor', name: 'Expert Contributor', icon: 'AcademicCapIcon', color: 'purple' },
];

export const getAvailableBadges = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: AVAILABLE_BADGES,
  });
});

export const awardBadgeAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { badgeId } = req.body;
  console.log(`Admin Controller: Attempting to award badge '${badgeId}' to user ID: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
  if (!badge) {
    res.status(400);
    throw new Error('Invalid badge ID.');
  }

  user.badges = user.badges || [];
  if (user.badges.some(b => b.id === badgeId)) {
    res.status(400);
    throw new Error(`User already has the '${badge.name}' badge.`);
  }

  user.badges.push({
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    color: badge.color,
    awardedAt: new Date(),
  });

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    message: `Badge '${badge.name}' awarded successfully.`,
    data: { _id: updatedUser._id, badges: updatedUser.badges },
  });
});

export const getUserChatsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(`Admin Controller: Fetching chats for user ID: ${userId} (mocked)`);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const mockChats = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      participants: [
        { _id: userId, name: user.name, avatar: user.avatar },
        { _id: new mongoose.Types.ObjectId().toString(), name: 'Admin Support', avatar: '/Uploads/default-avatar.png' },
      ],
      lastMessage: {
        _id: new mongoose.Types.ObjectId().toString(),
        sender: { _id: new mongoose.Types.ObjectId().toString(), name: 'Admin Support' },
        content: 'Hello! This is a mock message from Admin Support.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  res.status(200).json({
    success: true,
    message: 'Mock chat list for user fetched.',
    data: { chats: mockChats },
  });
});

export const deleteUserAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(`Admin Controller: Attempting to soft delete user ID: ${userId}`);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.deletedAt = new Date();
  user.isBlocked = true;
  user.email = `${user.email}_deleted_${Date.now()}_${userId.slice(-4)}`;
  user.name = `Deleted User ${userId.slice(-4)}`;
  await user.save();

  console.log(`Admin Controller: User ${userId} soft deleted successfully.`);
  res.status(200).json({
    success: true,
    message: 'User account has been deactivated and marked for deletion.',
  });
});

export const toggleUserVerificationAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  console.log(`Admin Controller: Toggling verification for user ID: ${userId} to status: ${status}`);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format.');
  }

  const validStatuses = ['unverified', 'pending', 'verified', 'rejected'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid verification status.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  if (user.verificationStatus === status) {
    res.status(400);
    throw new Error(`User is already ${status}.`);
  }

  user.verificationStatus = status;
  await user.save();

  const io = getIo(req);
  if (io) {
    io.to(`user_${userId}`).emit('user_verification_updated', {
      userId: user._id,
      status,
      message: `Your verification status has been updated to ${status}.`,
    });
  }

  console.log(`Admin Controller: Verification status for user ${userId} updated to ${status}.`);
  res.status(200).json({
    success: true,
    message: `Verification status updated to ${status}.`,
    data: { _id: user._id, verificationStatus: user.verificationStatus },
  });
});

console.log("✅ [CONTROLLER FILE END] Exporting controllers from backend/controllers/adminController.js");