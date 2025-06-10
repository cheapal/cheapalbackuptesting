import express from 'express';
import { createReview, getSellerReviews, getOrderReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.post('/', protect, createReview);
router.get('/seller/:id', protect, getSellerReviews);
router.get('/order/:id', protect, getOrderReview);

export { router };