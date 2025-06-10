import express from "express"
import { protect } from "../middleware/auth.js"
import * as stripeConnectController from "../controllers/StripeConnectController.js"

const router = express.Router()

// Test route to verify Stripe Connect is working
router.get("/test", (req, res) => {
  console.log("🧪 Stripe Connect test route accessed")
  res.json({
    success: true,
    message: "Stripe Connect routes are working",
    timestamp: new Date().toISOString(),
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    environment: process.env.NODE_ENV || "development",
  })
})

// All routes require authentication except webhook and test
router.use((req, res, next) => {
  // Skip auth for webhook endpoint and test endpoint
  if (req.path === "/webhook" || req.path === "/test") {
    return next()
  }
  // Apply auth middleware for all other routes
  protect(req, res, next)
})

// Create Stripe Connect account
router.post("/account/create", stripeConnectController.createConnectAccount)

// Get onboarding link
router.get("/account/onboarding-link", stripeConnectController.getOnboardingLink)

// Create identity verification session
router.post("/identity/verify", stripeConnectController.createIdentityVerification)

// Get account status and requirements
router.get("/account/status", stripeConnectController.getAccountStatus)

// Get payout balance
router.get("/balance", stripeConnectController.getPayoutBalance)

// Get payout history
router.get("/payouts", stripeConnectController.getPayoutHistory)

// Webhook endpoint (no auth required)
router.post("/webhook", express.raw({ type: "application/json" }), stripeConnectController.handleConnectWebhook)

export default router
