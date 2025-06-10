// server/routes/payments.js
import express from 'express'; // Use ES Module import
import { 
  createPaymentIntent,
  stripeWebhook 
} from '../controllers/paymentController.js'; // Ensure controller path is correct
import { protect } from '../middleware/auth.js'; // Ensure auth middleware path is correct

const router = express.Router();

// POST /api/payments/create-payment-intent - Create a Stripe Payment Intent
router.post('/create-payment-intent', protect, createPaymentIntent);

// POST /api/payments/webhook - Handle Stripe webhook events
// Stripe sends raw body, so use express.raw for this specific route
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default router; // Use ES Module default export
