import User from "../models/User.js"
import multer from "multer"
import path from "path"
import fs from "fs"

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/verification"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, `${req.user._id}-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Only image files and PDFs are allowed"), false)
  }
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

// Submit identity verification
export const submitIdentityVerification = async (req, res) => {
  try {
    const userId = req.user._id
    const { documentType, country, personalInfo } = req.body

    console.log(`[submitIdentityVerification] Processing verification for user ${userId}`)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Parse personal info if it's a string
    let parsedPersonalInfo = personalInfo
    if (typeof personalInfo === "string") {
      try {
        parsedPersonalInfo = JSON.parse(personalInfo)
      } catch (e) {
        console.error("Failed to parse personal info:", e)
        parsedPersonalInfo = {}
      }
    }

    // Handle uploaded files
    const uploadedFiles = {}
    if (req.files) {
      Object.keys(req.files).forEach((fieldName) => {
        uploadedFiles[fieldName] = req.files[fieldName][0].filename
      })
    }

    // Update user verification data
    user.verification = {
      status: "pending",
      documentType: documentType,
      country: country,
      personalInfo: parsedPersonalInfo,
      documents: uploadedFiles,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    }

    await user.save()

    console.log(`[submitIdentityVerification] Verification submitted for user ${userId}`)

    res.json({
      success: true,
      message: "Identity verification submitted successfully",
      data: {
        status: "pending",
        submittedAt: new Date(),
        documentsUploaded: Object.keys(uploadedFiles),
      },
    })
  } catch (error) {
    console.error("Submit Identity Verification Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit identity verification",
    })
  }
}

// Get verification status
export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const verification = user.verification || {
      status: "not_started",
      documentType: null,
      country: null,
      personalInfo: {},
      documents: {},
      submittedAt: null,
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    }

    res.json({
      success: true,
      message: "Verification status retrieved",
      data: verification,
    })
  } catch (error) {
    console.error("Get Verification Status Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get verification status",
    })
  }
}

// Submit banking information
export const submitBankingInfo = async (req, res) => {
  try {
    const userId = req.user._id
    const { accountHolderName, accountNumber, routingNumber, bankName, country, currency } = req.body

    console.log(`[submitBankingInfo] Processing banking info for user ${userId}`)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user banking information
    user.bankingInfo = {
      accountHolderName: accountHolderName,
      accountNumber: accountNumber.slice(-4), // Store only last 4 digits for security
      routingNumber: routingNumber,
      bankName: bankName,
      country: country,
      currency: currency,
      status: "pending",
      submittedAt: new Date(),
      verifiedAt: null,
    }

    // Update payout settings
    user.payoutSettings = {
      ...user.payoutSettings,
      bankingInfoSubmitted: true,
      bankingStatus: "pending",
    }

    await user.save()

    console.log(`[submitBankingInfo] Banking info submitted for user ${userId}`)

    res.json({
      success: true,
      message: "Banking information submitted successfully",
      data: {
        status: "pending",
        submittedAt: new Date(),
        accountNumber: `****${accountNumber.slice(-4)}`,
        bankName: bankName,
      },
    })
  } catch (error) {
    console.error("Submit Banking Info Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit banking information",
    })
  }
}

// Get banking status
export const getBankingStatus = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const bankingInfo = user.bankingInfo || {
      status: "not_started",
      submittedAt: null,
      verifiedAt: null,
    }

    // Don't send sensitive banking details
    const safeBankingInfo = {
      status: bankingInfo.status,
      submittedAt: bankingInfo.submittedAt,
      verifiedAt: bankingInfo.verifiedAt,
      bankName: bankingInfo.bankName,
      accountNumber: bankingInfo.accountNumber ? `****${bankingInfo.accountNumber}` : null,
      country: bankingInfo.country,
      currency: bankingInfo.currency,
    }

    res.json({
      success: true,
      message: "Banking status retrieved",
      data: safeBankingInfo,
    })
  } catch (error) {
    console.error("Get Banking Status Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get banking status",
    })
  }
}

// Admin: Get pending verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const users = await User.find({
      "verification.status": "pending",
    })
      .select("name email verification createdAt")
      .sort({ "verification.submittedAt": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments({
      "verification.status": "pending",
    })

    res.json({
      success: true,
      message: "Pending verifications retrieved",
      data: users,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number.parseInt(limit),
      },
    })
  } catch (error) {
    console.error("Get Pending Verifications Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get pending verifications",
    })
  }
}

// Admin: Approve verification
export const approveVerification = async (req, res) => {
  try {
    const { userId } = req.params
    const adminId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update verification status
    user.verification = {
      ...user.verification,
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: adminId,
    }

    // Update payout settings
    user.payoutSettings = {
      ...user.payoutSettings,
      verificationStatus: "verified",
      chargesEnabled: true,
      payoutsEnabled: user.bankingInfo?.status === "approved",
    }

    await user.save()

    console.log(`[approveVerification] Verification approved for user ${userId} by admin ${adminId}`)

    res.json({
      success: true,
      message: "Verification approved successfully",
      data: {
        userId: userId,
        status: "approved",
        reviewedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Approve Verification Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve verification",
    })
  }
}

// Admin: Reject verification
export const rejectVerification = async (req, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body
    const adminId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update verification status
    user.verification = {
      ...user.verification,
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: adminId,
      rejectionReason: reason,
    }

    await user.save()

    console.log(`[rejectVerification] Verification rejected for user ${userId} by admin ${adminId}`)

    res.json({
      success: true,
      message: "Verification rejected",
      data: {
        userId: userId,
        status: "rejected",
        reviewedAt: new Date(),
        reason: reason,
      },
    })
  } catch (error) {
    console.error("Reject Verification Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject verification",
    })
  }
}

// Admin: Approve banking info
export const approveBankingInfo = async (req, res) => {
  try {
    const { userId } = req.params
    const adminId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update banking status
    user.bankingInfo = {
      ...user.bankingInfo,
      status: "approved",
      verifiedAt: new Date(),
    }

    // Update payout settings
    user.payoutSettings = {
      ...user.payoutSettings,
      bankingStatus: "approved",
      payoutsEnabled: user.verification?.status === "approved",
    }

    await user.save()

    console.log(`[approveBankingInfo] Banking info approved for user ${userId} by admin ${adminId}`)

    res.json({
      success: true,
      message: "Banking information approved successfully",
      data: {
        userId: userId,
        status: "approved",
        verifiedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Approve Banking Info Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve banking information",
    })
  }
}
