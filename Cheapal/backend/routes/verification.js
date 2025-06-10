import express from "express"
import { protect, restrictTo } from "../middleware/auth.js"
import {
  upload,
  submitIdentityVerification,
  getVerificationStatus,
  submitBankingInfo,
  getBankingStatus,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  approveBankingInfo,
} from "../controllers/VerificationController.js"

const router = express.Router()

// User routes
router.post(
  "/identity",
  protect,
  upload.fields([
    { name: "frontDocument", maxCount: 1 },
    { name: "backDocument", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  submitIdentityVerification,
)

router.get("/status", protect, getVerificationStatus)
router.post("/banking", protect, submitBankingInfo)
router.get("/banking/status", protect, getBankingStatus)

// Admin routes
router.get("/admin/pending", protect, restrictTo("admin"), getPendingVerifications)
router.put("/admin/:userId/approve", protect, restrictTo("admin"), approveVerification)
router.put("/admin/:userId/reject", protect, restrictTo("admin"), rejectVerification)
router.put("/admin/:userId/banking/approve", protect, restrictTo("admin"), approveBankingInfo)

export default router
