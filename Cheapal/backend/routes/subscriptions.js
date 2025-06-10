// import express from 'express';
// import { body, validationResult } from 'express-validator';
// import { protect, restrictTo } from '../middleware/auth.js';
// import upload from '../middleware/uploadMiddleware.js';
// import {
//   createListing,
//   getMyListings,
//   getListingById,
//   updateListing,
//   deleteListing,
//   getApprovedListings,
//   getSellerListingsPublic,
//   getApprovedListingsByCategory
// } from '../controllers/listingController.js';
// import Listing from '../models/Listing.js';
// import Order from '../models/Order.js';
// import mongoose from 'mongoose';

// console.log("✅ [ROUTE FILE START] Loading: backend/routes/subscriptions.js");
// const router = express.Router();
// console.log("✅ Router initialized in subscriptions.js");

// // Validation rules for creating/updating listings
// const listingValidationRules = () => {
//   return [
//     body('title', 'Title is required and cannot be empty.').not().isEmpty({ ignore_whitespace: true }).trim().escape(),
//     body('description', 'Description is required and cannot be empty.').not().isEmpty({ ignore_whitespace: true }).trim().escape(),
//     body('price', 'Price is required and must be a valid positive number.').exists({ checkFalsy: true }).isFloat({ gt: 0 }).withMessage('Price must be greater than $0.00.'),
//     body('category', 'Category is required.').not().isEmpty({ ignore_whitespace: true }).trim().escape(),
//     body('duration', 'Duration is required and cannot be empty.')
//         .not().isEmpty({ ignore_whitespace: true })
//         .trim()
//         .escape()
//         .isLength({ min: 1, max: 50 }).withMessage('Duration must be between 1 and 50 characters.'),
//   ];
// };

// // Middleware to handle validation results
// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map(err => extractedErrors.push({ field: err.path, message: err.msg }));
//   console.error("❌ [VALIDATION FAILED] Path:", req.originalUrl, "Errors:", extractedErrors);
//   return res.status(422).json({
//     success: false,
//     message: 'Validation failed. Please check your input.',
//     errors: extractedErrors,
//   });
// };

// // --- Route Definitions ---

// // POST /api/subscriptions (Create a new listing)
// router.post('/',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received POST request to /api/subscriptions/`); next(); },
//     protect,
//     restrictTo('seller'),
//     upload.single('image'),
//     listingValidationRules(),
//     validate,
//     createListing
// );

// // GET /api/subscriptions/my (Get seller's own listings)
// router.get('/my',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received GET request to /api/subscriptions/my`); next(); },
//     protect,
//     restrictTo('seller'),
//     async (req, res) => {
//       try {
//         const sellerId = req.user._id;
//         console.log(`[getMyListings] Fetching listings for seller: ${sellerId}`);
//         const listings = await Listing.find({ sellerId });

//         const listingIds = listings.map(l => l._id);
//         const sales = await Order.aggregate([
//           { $unwind: '$orderItems' },
//           {
//             $match: {
//               'orderItems.seller': new mongoose.Types.ObjectId(sellerId),
//               'orderItems.listing': { $in: listingIds },
//               status: { $in: ['completed', 'active'] }
//             }
//           },
//           {
//             $group: {
//               _id: '$orderItems.listing',
//               salesCount: { $sum: 1 },
//               totalRevenue: { $sum: '$orderItems.price' }
//             }
//           }
//         ]);

//         const listingsWithSales = listings.map(listing => {
//           const saleData = sales.find(s => s._id.toString() === listing._id.toString());
//           return {
//             ...listing.toObject(),
//             salesCount: saleData ? saleData.salesCount : 0,
//             totalRevenue: saleData ? saleData.totalRevenue : 0
//           };
//         });

//         console.log('[getMyListings] Listings:', JSON.stringify(listingsWithSales, null, 2));
//         res.json({ success: true, listings: listingsWithSales });
//       } catch (error) {
//         console.error('[getMyListings] Error:', error);
//         res.status(500).json({ success: false, message: 'Failed to fetch listings' });
//       }
//     }
// );

// // PUT /api/subscriptions/:id (Update a listing)
// router.put('/:id',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received PUT request to /api/subscriptions/${req.params.id}`); next(); },
//     protect,
//     restrictTo('seller'),
//     upload.single('image'),
//     listingValidationRules(),
//     validate,
//     updateListing
// );

// // DELETE /api/subscriptions/:id (Delete a listing)
// router.delete('/:id',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received DELETE request to /api/subscriptions/${req.params.id}`); next(); },
//     protect,
//     restrictTo('seller'),
//     deleteListing
// );

// // --- Public Routes for Listings ---

// // GET /api/subscriptions (Get all approved listings - public)
// router.get('/',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received GET request to /api/subscriptions/ (Public)`); next(); },
//     getApprovedListings
// );

// // GET /api/subscriptions/category/:categoryName (Get approved listings by category - public)
// router.get('/category/:categoryName',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received GET request for category: ${req.params.categoryName}`); next(); },
//     getApprovedListingsByCategory
// );

// // GET /api/subscriptions/seller/:sellerId (Get approved listings for a specific seller - public)
// router.get('/seller/:sellerId',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received GET request to /api/subscriptions/seller/${req.params.sellerId} (Public)`); next(); },
//     getSellerListingsPublic
// );

// // GET /api/subscriptions/:id (Get a single listing by ID - public)
// router.get('/:id',
//     (req, res, next) => { console.log(`➡️  [ROUTE HIT] Received GET request to /api/subscriptions/${req.params.id} (Public)`); next(); },
//     getListingById
// );

// console.log("✅ [ROUTE FILE END] Exporting router from backend/routes/subscriptions.js");
// export default router;




// from grok
import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, restrictTo } from '../middleware/auth.js';
import { listingUpload } from '../utils/upload.js';
import {
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
  addMainRankedSubscription,
  updateMainRankedSubscription,
  removeMainRankedSubscription,
  submitMainRanked,
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
router.get('/homepage-featured', logQueryParams, getHomepageFeaturedListings);

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
  createListing
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