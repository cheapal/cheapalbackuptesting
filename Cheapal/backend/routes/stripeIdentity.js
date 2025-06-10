import express from "express"
import { protect, restrictTo } from "../middleware/auth.js"
import {
  createIdentityVerificationSession,
  getVerificationSessionStatus,
  handleIdentityWebhook,
  getVerificationReport,
} from "../controllers/StripeIdentityController.js"

const router = express.Router()

// User routes
router.post("/create-session", protect, createIdentityVerificationSession)
router.get("/status", protect, getVerificationSessionStatus)

// Webhook route (no auth required)
router.post("/webhook", express.raw({ type: "application/json" }), handleIdentityWebhook)

// Admin routes
router.get("/report/:sessionId", protect, restrictTo("admin"), getVerificationReport)

export default router
