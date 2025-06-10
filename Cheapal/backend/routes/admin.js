import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { listingUpload } from '../utils/upload.js';
import {
  getPendingListings,
  approveListingAdmin,
  rejectListingAdmin,
  getAllListingsAdmin,
  addFeaturedSubscription,
  updateFeaturedSubscription,
  removeFeaturedSubscription,
  getFeaturedSubscriptions,
  addHomepageFeaturedSubscription,
  updateHomepageFeaturedSubscription,
  removeHomepageFeaturedSubscription,
  getAllUsers,
  getUserByIdAdmin,
  toggleUserBlock,
  warnUserAdmin,
  updateUserAdmin,
  awardBadgeAdmin,
  getAvailableBadges,
  getUserChatsAdmin,
  deleteUserAdmin,
  toggleUserVerificationAdmin,
  addMainRankedListing, // Added
  updateMainRankedListing, // Added
  removeMainRankedListing, // Added
} from '../controllers/adminController.js';

console.log("✅ [ROUTE FILE START] Loading: backend/routes/admin.js");
const router = express.Router();
console.log("✅ Router initialized in admin.js");

// Middleware to log requests
const logRequest = (req, res, next) => {
  console.log(`[admin.js] ${req.method} ${req.originalUrl} - Query:`, req.query, 'Body:', req.body);
  next();
};

// --- Listing Management Routes ---
router.get('/listings/pending', logRequest, protect, restrictTo('admin'), getPendingListings);
router.put('/listings/:id/approve', logRequest, protect, restrictTo('admin'), approveListingAdmin);
router.put('/listings/:id/reject', logRequest, protect, restrictTo('admin'), rejectListingAdmin);
router.get('/listings', logRequest, protect, restrictTo('admin'), getAllListingsAdmin);

// --- Featured Subscriptions Routes ---
router.post('/featured-subscriptions', logRequest, protect, restrictTo('admin'), listingUpload.single('icon'), addFeaturedSubscription);
router.put('/featured-subscriptions/:id', logRequest, protect, restrictTo('admin'), listingUpload.single('icon'), updateFeaturedSubscription);
router.delete('/featured-subscriptions/:id', logRequest, protect, restrictTo('admin'), removeFeaturedSubscription);
router.get('/featured-subscriptions', logRequest, protect, restrictTo('admin'), getFeaturedSubscriptions);

// --- Homepage Featured Subscriptions Routes ---
router.post('/homepage-featured', logRequest, protect, restrictTo('admin'), listingUpload.none(), addHomepageFeaturedSubscription);
router.put('/homepage-featured/:id', logRequest, protect, restrictTo('admin'), listingUpload.none(), updateHomepageFeaturedSubscription);
router.delete('/homepage-featured/:id', logRequest, protect, restrictTo('admin'), removeHomepageFeaturedSubscription);

// --- Main Ranked Subscriptions Routes ---
router.post('/main-ranked', logRequest, protect, restrictTo('admin'), listingUpload.none(), addMainRankedListing);
router.put('/main-ranked/:id', logRequest, protect, restrictTo('admin'), listingUpload.none(), updateMainRankedListing);
router.delete('/main-ranked/:id', logRequest, protect, restrictTo('admin'), removeMainRankedListing);

// --- User Management Routes ---
router.get('/users', logRequest, protect, restrictTo('admin'), getAllUsers);
router.get('/users/:userId', logRequest, protect, restrictTo('admin'), getUserByIdAdmin);
router.put('/users/:userId/toggle-block', logRequest, protect, restrictTo('admin'), toggleUserBlock);
router.post('/users/:userId/warn', logRequest, protect, restrictTo('admin'), warnUserAdmin);
router.put('/users/:userId/update', logRequest, protect, restrictTo('admin'), updateUserAdmin);
router.post('/users/:userId/award-badge', logRequest, protect, restrictTo('admin'), awardBadgeAdmin);
router.get('/users/:userId/chats', logRequest, protect, restrictTo('admin'), getUserChatsAdmin);
router.delete('/users/:userId', logRequest, protect, restrictTo('admin'), deleteUserAdmin);
router.put('/users/:userId/verification', logRequest, protect, restrictTo('admin'), toggleUserVerificationAdmin);

// --- Badge Management Route ---
router.get('/badges/available', logRequest, protect, restrictTo('admin'), getAvailableBadges);

console.log("✅ [ROUTE FILE END] Exporting router from backend/routes/admin.js");
export default router;