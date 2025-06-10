import Stripe from "stripe"
import User from "../models/User.js"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create identity verification session
export const createIdentityVerificationSession = async (req, res) => {
  try {
    const userId = req.user._id
    const { returnUrl } = req.body

    console.log(`[createIdentityVerificationSession] Creating session for user ${userId}`)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: {
        userId: userId.toString(),
        userEmail: user.email,
        userName: user.name,
      },
      options: {
        document: {
          allowed_types: ["passport", "driving_license", "id_card"],
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
      return_url: returnUrl || `${process.env.FRONTEND_URL}/seller-dashboard?tab=payouts&verification=complete`,
    })

    // Store verification session in user record
    user.identityVerification = {
      sessionId: verificationSession.id,
      status: "pending",
      createdAt: new Date(),
      clientSecret: verificationSession.client_secret,
    }

    await user.save()

    console.log(`[createIdentityVerificationSession] Session created: ${verificationSession.id}`)

    res.json({
      success: true,
      message: "Identity verification session created",
      data: {
        sessionId: verificationSession.id,
        clientSecret: verificationSession.client_secret,
        url: verificationSession.url,
        status: verificationSession.status,
      },
    })
  } catch (error) {
    console.error("Create Identity Verification Session Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create identity verification session",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get verification session status
export const getVerificationSessionStatus = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user || !user.identityVerification?.sessionId) {
      return res.json({
        success: true,
        message: "No verification session found",
        data: {
          status: "not_started",
          sessionId: null,
        },
      })
    }

    // Get latest status from Stripe
    const verificationSession = await stripe.identity.verificationSessions.retrieve(
      user.identityVerification.sessionId,
    )

    // Update user record with latest status
    user.identityVerification.status = verificationSession.status
    user.identityVerification.lastUpdated = new Date()

    // If verified, update user verification status
    if (verificationSession.status === "verified") {
      user.identityVerification.verifiedAt = new Date()
      user.identityVerification.verifiedData = {
        documentType: verificationSession.verified_outputs?.document?.type,
        documentNumber: verificationSession.verified_outputs?.document?.number,
        firstName: verificationSession.verified_outputs?.document?.first_name,
        lastName: verificationSession.verified_outputs?.document?.last_name,
        dateOfBirth: verificationSession.verified_outputs?.document?.dob,
        address: verificationSession.verified_outputs?.document?.address,
      }

      // Update main verification status
      user.verification = {
        ...user.verification,
        status: "approved",
        verifiedAt: new Date(),
        method: "stripe_identity",
        documentType: verificationSession.verified_outputs?.document?.type,
      }

      // Update payout settings
      user.payoutSettings = {
        ...user.payoutSettings,
        verificationStatus: "verified",
        identityVerified: true,
        chargesEnabled: true,
        payoutsEnabled: user.bankingInfo?.status === "approved",
      }
    } else if (verificationSession.status === "requires_input") {
      user.identityVerification.requiresInput = true
      user.identityVerification.lastError = verificationSession.last_error
    }

    await user.save()

    console.log(`[getVerificationSessionStatus] Status for user ${userId}: ${verificationSession.status}`)

    res.json({
      success: true,
      message: "Verification status retrieved",
      data: {
        sessionId: verificationSession.id,
        status: verificationSession.status,
        verifiedAt: user.identityVerification.verifiedAt,
        verifiedData: user.identityVerification.verifiedData,
        lastError: verificationSession.last_error,
        url: verificationSession.url,
        clientSecret: verificationSession.client_secret,
      },
    })
  } catch (error) {
    console.error("Get Verification Session Status Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get verification status",
    })
  }
}

// Handle Stripe Identity webhooks
export const handleIdentityWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  console.log("[handleIdentityWebhook] Received webhook")

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_IDENTITY_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case "identity.verification_session.verified":
        await handleVerificationVerified(event.data.object)
        break

      case "identity.verification_session.requires_input":
        await handleVerificationRequiresInput(event.data.object)
        break

      case "identity.verification_session.canceled":
        await handleVerificationCanceled(event.data.object)
        break

      case "identity.verification_session.processing":
        await handleVerificationProcessing(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    res.status(500).json({ error: "Webhook handler failed" })
  }
}

// Webhook handlers
const handleVerificationVerified = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) {
      console.error("No userId in verification session metadata")
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      console.error(`User not found: ${userId}`)
      return
    }

    console.log(`[handleVerificationVerified] Processing verification for user ${userId}`)

    // Update identity verification
    user.identityVerification = {
      ...user.identityVerification,
      status: "verified",
      verifiedAt: new Date(),
      verifiedData: {
        documentType: session.verified_outputs?.document?.type,
        documentNumber: session.verified_outputs?.document?.number,
        firstName: session.verified_outputs?.document?.first_name,
        lastName: session.verified_outputs?.document?.last_name,
        dateOfBirth: session.verified_outputs?.document?.dob,
        address: session.verified_outputs?.document?.address,
        nationality: session.verified_outputs?.document?.issuing_country,
      },
    }

    // Update main verification status
    user.verification = {
      status: "approved",
      verifiedAt: new Date(),
      method: "stripe_identity",
      documentType: session.verified_outputs?.document?.type,
      verifiedData: user.identityVerification.verifiedData,
    }

    // Update payout settings
    user.payoutSettings = {
      ...user.payoutSettings,
      verificationStatus: "verified",
      identityVerified: true,
      chargesEnabled: true,
      payoutsEnabled: user.bankingInfo?.status === "approved",
    }

    await user.save()

    console.log(`[handleVerificationVerified] User ${userId} verification completed successfully`)
  } catch (error) {
    console.error("Handle verification verified error:", error)
  }
}

const handleVerificationRequiresInput = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) return

    const user = await User.findById(userId)
    if (!user) return

    console.log(`[handleVerificationRequiresInput] User ${userId} verification requires input`)

    user.identityVerification = {
      ...user.identityVerification,
      status: "requires_input",
      lastError: session.last_error,
      requiresInput: true,
      lastUpdated: new Date(),
    }

    await user.save()
  } catch (error) {
    console.error("Handle verification requires input error:", error)
  }
}

const handleVerificationCanceled = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) return

    const user = await User.findById(userId)
    if (!user) return

    console.log(`[handleVerificationCanceled] User ${userId} verification canceled`)

    user.identityVerification = {
      ...user.identityVerification,
      status: "canceled",
      canceledAt: new Date(),
    }

    await user.save()
  } catch (error) {
    console.error("Handle verification canceled error:", error)
  }
}

const handleVerificationProcessing = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) return

    const user = await User.findById(userId)
    if (!user) return

    console.log(`[handleVerificationProcessing] User ${userId} verification processing`)

    user.identityVerification = {
      ...user.identityVerification,
      status: "processing",
      lastUpdated: new Date(),
    }

    await user.save()
  } catch (error) {
    console.error("Handle verification processing error:", error)
  }
}

// Get verification report (for admin/debugging)
export const getVerificationReport = async (req, res) => {
  try {
    const { sessionId } = req.params

    const verificationSession = await stripe.identity.verificationSessions.retrieve(sessionId, {
      expand: ["verified_outputs"],
    })

    res.json({
      success: true,
      message: "Verification report retrieved",
      data: {
        id: verificationSession.id,
        status: verificationSession.status,
        type: verificationSession.type,
        created: verificationSession.created,
        verified_outputs: verificationSession.verified_outputs,
        last_error: verificationSession.last_error,
        metadata: verificationSession.metadata,
      },
    })
  } catch (error) {
    console.error("Get Verification Report Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get verification report",
    })
  }
}
