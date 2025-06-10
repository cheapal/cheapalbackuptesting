// // models/subscription.js
// import mongoose from 'mongoose';

// const subscriptionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   duration: { type: String, required: true },
//   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   features: [String],
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// const Subscription = mongoose.model('Subscription', subscriptionSchema);
// export default Subscription;


import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, restrictTo } from '../middlewares/auth.js';
import { listingUpload } from '../utils/upload.js';
import {
  createListingSubcriptions,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
  getApprovedListings,
  getSellerListingsPublic,
  getApprovedListingsByCategory,
  getFeaturedListings,
  getHomepageFeaturedSubscriptions,
  addMainRankedSubscription,
  updateMainRankedSubscription,
  removeMainRankedSubscription,
  submitMainRanked
} from '../controllers/listingController.js';
import asyncHandler from 'express-async-handler';

console.log("✅ [ROUTE FILE START] Loading: backend/routes/subscriptions.js");
const router = express.Router();
console.log("✅ Router initialized in subscriptions.js");

// Middleware to log query parameters for debugging
const logQueryParams = (req, res, next) => {
  console.log(`[subscriptions.js] ${req.method} ${req.originalUrl} - Query parameters:`, req.query);
  next();
};

// Validation rules for creating/updating listings
const listingValidationRules = () => {
  return [
    body('title', 'Title is required and cannot be empty.')
      .not().isEmpty({ ignore_whitespace: true })
      .trim()
      .escape(),
    body('description', 'Description is required and cannot be empty.')
      .not().isEmpty({ ignore_whitespace: true })
      .trim()
      .escape(),
    body('price', 'Price is required and must be a valid positive number.')
      .exists({ checkFalsy: true })
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than $0.00.'),
    body('category', 'Category is required.')
      .not().isEmpty({ ignore_whitespace: true })
      .trim()
      .escape(),
    body('duration', 'Duration is required and cannot be empty.')
      .not().isEmpty({ ignore_whitespace: true })
      .trim()
      .escape()
      .isLength({ min: 1, max: 50 })
      .withMessage('Duration must be between 1 and 50 characters.'),
    body('autoReply')
      .optional()
      .trim()
      .escape()
      .isLength({ max: 500 })
      .withMessage('Auto-reply message must be 500 characters or less.'),
  ];
};

// Validation rules for main ranking
const mainRankValidationRules = () => {
  return [
    body('listingId', 'Listing ID is required and must be a valid ObjectId.')
      .isMongoId(),
    body('mainRank', 'Main rank is required and must be a positive integer.')
      .isInt({ min: 1 }),
  ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));
  console.error("❌ [VALIDATION FAILED] Path:", req.originalUrl, "Errors:", extractedErrors);
  return res.status(422).json({
    success: false,
    message: 'Validation Error',
    errors: extractedErrors,
  });
};

// --- Route Definitions ---

// GET /api/subscriptions (Get all listings, optionally filtered by status - public)
router.get('/', logQueryParams, getApprovedListings);

// GET /api/subscriptions/featured (Get featured listings - public)
router.get('/featured', logQueryParams, getFeaturedListings);

// GET /api/subscriptions/homepage-featured (Get homepage featured listings - public)
router.get('/homepage-featured', logQueryParams, getHomepageFeaturedSubscriptions);

// GET /api/subscriptions/category/:categoryName (Get approved listings by category - public)
router.get('/category/:categoryName', logQueryParams, getApprovedListingsByCategory);

// GET /api/subscriptions/seller/:sellerId (Get approved listings for a specific seller - public)
router.get('/seller/:sellerId', logQueryParams, getSellerListingsPublic);

// GET /api/subscriptions/my (Get seller's own listings - seller only)
router.get('/my', logQueryParams, protect, restrictTo(['seller', 'admin']), getMyListings);

// GET /api/subscriptions/:id (Get a single listing by ID - public)
router.get(
  '/:id',
  logQueryParams,
  asyncHandler(async (req, res, next) => {
    const { ObjectId } = await import('mongoose').then(m => m.Types);
    if (!ObjectId.isValid(req.params.id)) {
      console.error(`[subscriptions.js] Invalid ObjectId: ${req.params.id}`);
      return res.status(400).json({ success: false, message: 'Invalid listing ID format.' });
    }
    next();
  }),
  getListingById
);

// Protected routes (require authentication)
router.use(protect);

// POST /api/subscriptions (Create a new listing - seller only)
router.post(
  '/',
  logQueryParams,
  restrictTo(['seller', 'admin']),
  listingUpload.single('image'),
  listingValidationRules(),
  validate,
  createListingSubcriptions
);

// PUT /api/subscriptions/:id (Update a listing - seller only)
router.put(
  '/:id',
  logQueryParams,
  restrictTo(['seller', 'admin']),
  listingUpload.single('image'),
  listingValidationRules(),
  validate,
  updateListing
);

// DELETE /api/subscriptions/:id (Delete a listing - seller only)
router.delete('/:id', logQueryParams, restrictTo(['seller', 'admin']), deleteListing);

// POST /api/subscriptions/promote/main-ranked (Submit a main ranked bid - seller only)
router.post(
  '/promote/main-ranked',
  logQueryParams,
  restrictTo(['seller']),
  mainRankValidationRules(),
  validate,
  submitMainRanked
);

// Admin routes for main ranking
router.post(
  '/admin/main-ranked',
  logQueryParams,
  restrictTo(['admin']),
  mainRankValidationRules(),
  validate,
  addMainRankedSubscription
);

router.put(
  '/admin/main-ranked/:id',
  logQueryParams,
  restrictTo(['admin']),
  mainRankValidationRules(),
  validate,
  updateMainRankedSubscription
);

router.delete(
  '/admin/main-ranked/:id',
  logQueryParams,
  restrictTo(['admin']),
  asyncHandler(async (req, res, next) => {
    const { ObjectId } = await import('mongoose').then(m => m.Types);
    if (!ObjectId.isValid(req.params.id)) {
      console.error(`[subscriptions.js] Invalid ObjectId for main-ranked: ${req.params.id}`);
      return res.status(400).json({ success: false, message: 'Invalid listing ID format.' });
    }
    next();
  }),
  removeMainRankedSubscription
);

console.log("✅ [ROUTE FILE END] Exporting router from backend/routes/subscriptions.js");
export default router;