import Stripe from "stripe"
import User from "../models/User.js"

// Initialize Stripe only if secret key is available
let stripe = null
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  console.log("✅ Stripe initialized with secret key")
} else {
  console.warn("⚠️  STRIPE_SECRET_KEY not found. Stripe Connect features will be mocked.")
}

// Country-specific requirements for identity verification
const COUNTRY_REQUIREMENTS = {
  PK: {
    documents: ["passport", "national_id"],
    bankingInfo: ["iban", "swift_code"],
    supported: true,
    name: "Pakistan",
    currency: "PKR",
    bankAccountTypes: ["iban"],
    requiredFields: {
      individual: [
        "first_name",
        "last_name",
        "email",
        "phone",
        "address.line1",
        "address.city",
        "address.postal_code",
        "address.state",
        "address.country",
        "dob.day",
        "dob.month",
        "dob.year",
        "id_number",
      ],
      company: [
        "business_name",
        "business_email",
        "business_phone",
        "business_tax_id",
        "business_registration_number",
        "business_address.line1",
        "business_address.city",
        "business_address.postal_code",
        "business_address.state",
        "business_address.country",
      ],
    },
    additionalFields: ["tax_id"],
    supportedCurrencies: ["USD", "PKR"],
  },
  US: {
    documents: ["passport", "drivers_license", "state_id"],
    bankingInfo: ["account_number", "routing_number"],
    additionalFields: ["ssn_last_4"],
    supportedCurrencies: ["USD"],
    supported: true,
    name: "United States",
    currency: "USD",
  },
  GB: {
    documents: ["passport", "drivers_license"],
    bankingInfo: ["account_number", "sort_code"],
    additionalFields: ["vat_number"],
    supportedCurrencies: ["USD", "GBP"],
    supported: true,
    name: "United Kingdom",
    currency: "GBP",
  },
  CA: {
    documents: ["passport", "drivers_license"],
    bankingInfo: ["account_number", "institution_number", "transit_number"],
    additionalFields: ["business_number"],
    supportedCurrencies: ["USD", "CAD"],
    supported: true,
    name: "Canada",
    currency: "CAD",
  },
  AU: {
    documents: ["passport", "drivers_license"],
    bankingInfo: ["account_number", "bsb_number"],
    additionalFields: ["abn"],
    supportedCurrencies: ["USD", "AUD"],
    supported: true,
    name: "Australia",
    currency: "AUD",
  },
  IN: {
    documents: ["passport", "aadhaar", "pan_card"],
    bankingInfo: ["account_number", "ifsc_code"],
    additionalFields: ["pan_number", "gstin"],
    supportedCurrencies: ["USD", "INR"],
    supported: true,
    name: "India",
    currency: "INR",
  },
  BD: {
    documents: ["passport", "national_id"],
    bankingInfo: ["account_number", "routing_number"],
    additionalFields: ["tax_id"],
    supportedCurrencies: ["USD", "BDT"],
    supported: true,
    name: "Bangladesh",
    currency: "BDT",
  },
  LK: {
    documents: ["passport", "national_id"],
    bankingInfo: ["account_number", "swift_code"],
    additionalFields: ["tax_id"],
    supportedCurrencies: ["USD", "LKR"],
    supported: true,
    name: "Sri Lanka",
    currency: "LKR",
  },
}

// Helper function to get valid business URL
const getValidBusinessUrl = () => {
  // First, try to get from environment variable
  const businessUrl = process.env.BUSINESS_URL || process.env.FRONTEND_URL || "http://localhost:3000"

  // For development with localhost, use the actual domain even if not hosted yet
  if (businessUrl.includes("localhost") || businessUrl.includes("127.0.0.1")) {
    // Use your actual domain for Stripe, even if not hosted yet
    return "https://www.cheapal.com"
  }

  // If the business URL is your domain, ensure it has https
  if (businessUrl.includes("cheapal.com")) {
    if (!businessUrl.startsWith("https://")) {
      return businessUrl.startsWith("http://") ? businessUrl.replace("http://", "https://") : `https://${businessUrl}`
    }
    return businessUrl
  }

  // Ensure the URL has https for production
  if (!businessUrl.startsWith("https://") && !businessUrl.startsWith("http://")) {
    return `https://${businessUrl}`
  }

  // For production, ensure it's https
  if (businessUrl.startsWith("http://") && !businessUrl.includes("localhost")) {
    return businessUrl.replace("http://", "https://")
  }

  return businessUrl
}

// Create Stripe Connect account
export const createConnectAccount = async (req, res) => {
  try {
    const { country, businessType = "individual" } = req.body
    const userId = req.user._id

    console.log(
      `[createConnectAccount] Creating account for user ${userId}, country: ${country}, type: ${businessType}`,
    )

    // Validate country
    if (!COUNTRY_REQUIREMENTS[country] || !COUNTRY_REQUIREMENTS[country].supported) {
      return res.status(400).json({
        success: false,
        message: `Country ${country} is not supported for payouts. Please contact support for more information.`,
      })
    }

    // Check if user already has a Stripe account
    const user = await User.findById(userId)
    if (user.stripeConnectAccountId) {
      console.log(`[createConnectAccount] User ${userId} already has account: ${user.stripeConnectAccountId}`)
      return res.status(400).json({
        success: false,
        message: "Stripe Connect account already exists",
        data: {
          accountId: user.stripeConnectAccountId,
          verificationStatus: user.payoutSettings?.verificationStatus || "pending",
        },
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      console.log("[createConnectAccount] Stripe not configured, returning mock response")

      const mockAccountId = `acct_mock_${userId}_${Date.now()}`

      // Update user with mock account ID
      user.stripeConnectAccountId = mockAccountId
      user.payoutSettings = {
        country: country,
        businessType: businessType,
        verificationStatus: "pending",
        documentsRequired: COUNTRY_REQUIREMENTS[country].documents,
        bankingRequired: COUNTRY_REQUIREMENTS[country].bankingInfo,
        additionalFieldsRequired: COUNTRY_REQUIREMENTS[country].additionalFields,
        createdAt: new Date(),
      }
      await user.save()

      return res.json({
        success: true,
        message: "Mock Stripe Connect account created successfully",
        data: {
          accountId: mockAccountId,
          requirements: COUNTRY_REQUIREMENTS[country],
          verificationStatus: "pending",
          country: country,
          businessType: businessType,
        },
      })
    }

    // Get a valid business URL for Stripe
    const businessUrl = getValidBusinessUrl()
    console.log(`[createConnectAccount] Using business URL: ${businessUrl}`)

    // Create Stripe Connect account
    const accountData = {
      type: "standard",
      country: country,
      email: user.email,
      business_type: businessType,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        userId: userId.toString(),
        platform: "marketplace",
        userEmail: user.email,
        userName: user.name,
      },
      tos_acceptance: {
        service_agreement: "service_agreement",
        date: Math.floor(Date.now() / 1000),
        ip: req.ip || req.connection.remoteAddress || "127.0.0.1",
      },
      business_profile: {
        mcc: "5734", // Computer software stores
        product_description: "Digital marketplace for software and services",
        name: user.name || "Marketplace Seller",
        support_email: user.email,
        // Only include URL if we have a valid one
        ...(businessUrl && businessUrl !== "https://example.com" && { url: businessUrl }),
      },
    }

    // Add individual information if it's an individual account
    if (businessType === "individual") {
      accountData.individual = {
        first_name: user.name.split(" ")[0] || user.name,
        last_name: user.name.split(" ").slice(1).join(" ") || "User",
        email: user.email,
        address: {
          line1: "",
          city: "",
          postal_code: "",
          state: "",
          country: country,
        },
        dob: {
          day: 1,
          month: 1,
          year: 1990,
        },
      }
    }

    console.log(`[createConnectAccount] Creating Stripe account for ${country}`)

    const account = await stripe.accounts.create(accountData)

    // Update user with Stripe account ID
    user.stripeConnectAccountId = account.id
    user.payoutSettings = {
      country: country,
      businessType: businessType,
      verificationStatus: "pending",
      documentsRequired: COUNTRY_REQUIREMENTS[country].documents,
      bankingRequired: COUNTRY_REQUIREMENTS[country].bankingInfo,
      additionalFieldsRequired: COUNTRY_REQUIREMENTS[country].additionalFields,
      createdAt: new Date(),
    }
    await user.save()

    console.log(`[createConnectAccount] Account created successfully: ${account.id}`)

    res.json({
      success: true,
      message: "Stripe Connect account created successfully",
      data: {
        accountId: account.id,
        requirements: COUNTRY_REQUIREMENTS[country],
        verificationStatus: "pending",
        country: country,
        businessType: businessType,
      },
    })
  } catch (error) {
    console.error("Create Connect Account Error:", error)

    // Handle specific Stripe errors with detailed guidance
    let errorMessage = "Failed to create Stripe Connect account"
    let helpfulMessage = ""

    if (error.type === "StripeInvalidRequestError") {
      if (error.message?.includes("signed up for Connect")) {
        errorMessage = "Stripe Connect is not fully activated on your account"
        helpfulMessage = `
          To fix this issue:
          1. Go to your Stripe Dashboard (https://dashboard.stripe.com)
          2. Navigate to Connect in the left sidebar
          3. Complete ALL onboarding steps including business verification
          4. Make sure Connect is enabled for both test and live modes
          5. Check for any pending verification requirements
          
          If you've already done this, please wait a few minutes and try again as activation can take some time.
        `
      } else if (error.code === "url_invalid") {
        errorMessage = "Invalid business URL provided. Please check your configuration."
      } else if (error.param) {
        errorMessage = `Invalid parameter: ${error.param}. ${error.message}`
      } else {
        errorMessage = error.message
      }
    } else if (error.code === "account_invalid") {
      errorMessage = "Stripe Connect is not enabled on your account. Please enable it in your Stripe Dashboard."
    }

    // For Connect activation issues, provide a temporary workaround
    if (error.message?.includes("signed up for Connect")) {
      console.log("[createConnectAccount] Connect not activated, providing mock account as fallback")

      try {
        const user = await User.findById(req.user._id)
        const mockAccountId = `acct_pending_${req.user._id}_${Date.now()}`

        user.payoutSettings = {
          country: req.body.country,
          businessType: req.body.businessType || "individual",
          verificationStatus: "pending", // Changed from "connect_pending" to "pending"
          documentsRequired: COUNTRY_REQUIREMENTS[req.body.country]?.documents || [],
          bankingRequired: COUNTRY_REQUIREMENTS[req.body.country]?.bankingInfo || [],
          additionalFieldsRequired: COUNTRY_REQUIREMENTS[req.body.country]?.additionalFields || [],
          createdAt: new Date(),
          stripeConnectPending: true,
          pendingReason: "Stripe Connect activation required",
        }
        await user.save()

        return res.status(202).json({
          success: false,
          message: errorMessage,
          helpfulMessage: helpfulMessage.trim(),
          data: {
            accountId: mockAccountId,
            verificationStatus: "pending", // Changed from "connect_pending" to "pending"
            country: req.body.country,
            businessType: req.body.businessType || "individual",
            isPending: true,
            nextSteps: [
              "Complete Stripe Connect activation in your Stripe Dashboard",
              "Verify your business information",
              "Complete identity verification",
              "Return here to retry account creation",
            ],
          },
          retryAfter: "Please complete Stripe Connect setup and try again",
        })
      } catch (fallbackError) {
        console.error("Fallback account creation failed:", fallbackError)
      }
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      helpfulMessage: helpfulMessage.trim(),
      error:
        process.env.NODE_ENV === "development"
          ? {
              type: error.type,
              code: error.code,
              param: error.param,
              message: error.message,
              requestId: error.requestId,
            }
          : undefined,
    })
  }
}

// Get account onboarding link
export const getOnboardingLink = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    console.log(`[getOnboardingLink] Getting onboarding link for user ${userId}`)

    if (!user.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        message: "No Stripe Connect account found. Please create one first.",
      })
    }

    // Check if this is a pending Connect activation
    if (user.payoutSettings?.stripeConnectPending) {
      return res.status(400).json({
        success: false,
        message: "Please complete Stripe Connect activation in your Stripe Dashboard first",
        helpfulMessage: `
          1. Go to https://dashboard.stripe.com
          2. Navigate to Connect
          3. Complete all verification steps
          4. Return here to create your payout account
        `,
        dashboardUrl: "https://dashboard.stripe.com/connect",
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      const mockUrl = `${process.env.FRONTEND_URL}/seller-dashboard?tab=payouts&mock=onboarding&account=${user.stripeConnectAccountId}`

      return res.json({
        success: true,
        message: "Mock onboarding link created",
        data: {
          url: mockUrl,
          expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        },
      })
    }

    // Use the frontend URL for return/refresh URLs, but handle localhost properly
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeConnectAccountId,
      refresh_url: `${frontendUrl}/seller-dashboard?tab=payouts&refresh=true`,
      return_url: `${frontendUrl}/seller-dashboard?tab=payouts&success=true`,
      type: "account_onboarding",
    })

    console.log(`[getOnboardingLink] Onboarding link created successfully`)

    res.json({
      success: true,
      message: "Onboarding link created successfully",
      data: {
        url: accountLink.url,
        expiresAt: accountLink.expires_at,
      },
    })
  } catch (error) {
    console.error("Get Onboarding Link Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create onboarding link",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Create identity verification session - FIXED MISSING FUNCTION
export const createIdentityVerification = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    console.log(`[createIdentityVerification] Creating identity verification for user ${userId}`)

    if (!user.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        message: "No Stripe Connect account found",
      })
    }

    // Check if this is a pending Connect activation
    if (user.payoutSettings?.stripeConnectPending) {
      return res.status(400).json({
        success: false,
        message: "Please complete Stripe Connect activation first",
        helpfulMessage: "Complete Stripe Connect setup in your dashboard before proceeding with identity verification",
        dashboardUrl: "https://dashboard.stripe.com/connect",
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      const mockSessionId = `vs_mock_${userId}_${Date.now()}`
      const mockUrl = `${process.env.FRONTEND_URL}/seller-dashboard?tab=payouts&mock=identity&session=${mockSessionId}`

      return res.json({
        success: true,
        message: "Mock identity verification session created",
        data: {
          sessionId: mockSessionId,
          clientSecret: `${mockSessionId}_secret`,
          url: mockUrl,
        },
      })
    }

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: {
        userId: userId.toString(),
        accountId: user.stripeConnectAccountId,
      },
      options: {
        document: {
          allowed_types: ["passport", "driving_license", "id_card"],
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
    })

    console.log(`[createIdentityVerification] Identity verification session created: ${verificationSession.id}`)

    res.json({
      success: true,
      message: "Identity verification session created successfully",
      data: {
        sessionId: verificationSession.id,
        clientSecret: verificationSession.client_secret,
        url: verificationSession.url,
      },
    })
  } catch (error) {
    console.error("Create Identity Verification Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create identity verification session",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get account status and requirements
export const getAccountStatus = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    console.log(`[getAccountStatus] Getting account status for user ${userId}`)

    if (!user.stripeConnectAccountId) {
      console.log(`[getAccountStatus] No Stripe account found for user ${userId}`)
      return res.json({
        success: true,
        message: "No Stripe Connect account found",
        data: {
          hasAccount: false,
          verificationStatus: "not_started",
          requirements: null,
        },
      })
    }

    // Check if this is a pending Connect activation
    if (user.payoutSettings?.stripeConnectPending) {
      return res.json({
        success: true,
        message: "Stripe Connect activation pending",
        data: {
          hasAccount: false,
          verificationStatus: "pending", // Changed from "connect_pending" to "pending"
          requirements: null,
          isPending: true,
          pendingReason: user.payoutSettings.pendingReason,
          helpfulMessage: "Please complete Stripe Connect activation in your Stripe Dashboard",
          dashboardUrl: "https://dashboard.stripe.com/connect",
        },
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      console.log(`[getAccountStatus] Returning mock status for user ${userId}`)
      return res.json({
        success: true,
        message: "Mock account status retrieved",
        data: {
          hasAccount: true,
          accountId: user.stripeConnectAccountId,
          verificationStatus: "pending",
          chargesEnabled: false,
          payoutsEnabled: false,
          pendingRequirements: ["external_account", "individual.verification.document"],
          eventuallyDue: [],
          country: user.payoutSettings?.country || "US",
          businessType: user.payoutSettings?.businessType || "individual",
          requirements: user.payoutSettings?.country ? COUNTRY_REQUIREMENTS[user.payoutSettings.country] : null,
        },
      })
    }

    const account = await stripe.accounts.retrieve(user.stripeConnectAccountId)

    // Check if charges are enabled (account is fully verified)
    const isVerified = account.charges_enabled && account.payouts_enabled

    // Get pending requirements
    const pendingRequirements = account.requirements?.currently_due || []
    const eventuallyDue = account.requirements?.eventually_due || []

    // Update user verification status
    const verificationStatus = isVerified ? "verified" : pendingRequirements.length > 0 ? "pending" : "in_review"

    user.payoutSettings = {
      ...user.payoutSettings,
      verificationStatus: verificationStatus,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      lastUpdated: new Date(),
      stripeConnectPending: false, // Clear pending flag if account is accessible
    }
    await user.save()

    console.log(`[getAccountStatus] Account status retrieved: ${verificationStatus}`)

    res.json({
      success: true,
      message: "Account status retrieved successfully",
      data: {
        hasAccount: true,
        accountId: account.id,
        verificationStatus: verificationStatus,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        pendingRequirements: pendingRequirements,
        eventuallyDue: eventuallyDue,
        country: account.country,
        businessType: account.business_type,
        requirements: user.payoutSettings?.country ? COUNTRY_REQUIREMENTS[user.payoutSettings.country] : null,
      },
    })
  } catch (error) {
    console.error("Get Account Status Error:", error)

    // If account is not accessible, it might be a Connect activation issue
    if (error.code === "account_invalid" || error.message?.includes("No such account")) {
      const user = await User.findById(req.user._id)
      if (user) {
        user.payoutSettings = {
          ...user.payoutSettings,
          stripeConnectPending: true,
          pendingReason: "Account not accessible - Connect activation may be required",
        }
        await user.save()
      }

      return res.json({
        success: true,
        message: "Account requires Connect activation",
        data: {
          hasAccount: false,
          verificationStatus: "connect_pending",
          requirements: null,
          isPending: true,
          helpfulMessage: "Please complete Stripe Connect activation in your dashboard",
          dashboardUrl: "https://dashboard.stripe.com/connect",
        },
      })
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get account status",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get payout balance
export const getPayoutBalance = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    console.log(`[getPayoutBalance] Getting payout balance for user ${userId}`)

    if (!user.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        message: "No Stripe Connect account found",
      })
    }

    // Check if this is a pending Connect activation
    if (user.payoutSettings?.stripeConnectPending) {
      return res.status(400).json({
        success: false,
        message: "Stripe Connect activation required",
        helpfulMessage: "Complete Stripe Connect setup before accessing balance information",
        dashboardUrl: "https://dashboard.stripe.com/connect",
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      return res.json({
        success: true,
        message: "Mock balance retrieved",
        data: {
          available: [{ amount: 50000, currency: "usd" }], // $500.00 in cents
          pending: [{ amount: 15000, currency: "usd" }], // $150.00 in cents
          connectReserved: [],
        },
      })
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripeConnectAccountId,
    })

    console.log(`[getPayoutBalance] Balance retrieved successfully`)

    res.json({
      success: true,
      message: "Balance retrieved successfully",
      data: {
        available: balance.available,
        pending: balance.pending,
        connectReserved: balance.connect_reserved || [],
      },
    })
  } catch (error) {
    console.error("Get Payout Balance Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payout balance",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get payout history
export const getPayoutHistory = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    const { limit = 10, starting_after } = req.query

    console.log(`[getPayoutHistory] Getting payout history for user ${userId}`)

    if (!user.stripeConnectAccountId) {
      return res.json({
        success: true,
        message: "No Stripe Connect account found",
        data: [],
      })
    }

    // Check if this is a pending Connect activation
    if (user.payoutSettings?.stripeConnectPending) {
      return res.json({
        success: true,
        message: "Stripe Connect activation required",
        data: [],
        helpfulMessage: "Complete Stripe Connect setup to view payout history",
      })
    }

    if (!stripe) {
      // Mock response when Stripe is not configured
      const mockPayouts = [
        {
          id: `po_mock_${userId}_1`,
          amount: 500, // $5.00
          currency: "usd",
          status: "paid",
          arrivalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          method: "standard",
          description: "Marketplace payout",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: `po_mock_${userId}_2`,
          amount: 300, // $3.00
          currency: "usd",
          status: "pending",
          arrivalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          method: "standard",
          description: "Marketplace payout",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ]

      return res.json({
        success: true,
        message: "Mock payout history retrieved",
        data: mockPayouts,
        hasMore: false,
      })
    }

    const payouts = await stripe.payouts.list(
      {
        limit: Number.parseInt(limit),
        starting_after: starting_after,
      },
      {
        stripeAccount: user.stripeConnectAccountId,
      },
    )

    const formattedPayouts = payouts.data.map((payout) => ({
      id: payout.id,
      amount: payout.amount / 100, // Convert from cents
      currency: payout.currency,
      status: payout.status,
      arrivalDate: new Date(payout.arrival_date * 1000),
      method: payout.method,
      description: payout.description,
      createdAt: new Date(payout.created * 1000),
    }))

    console.log(`[getPayoutHistory] Found ${formattedPayouts.length} payouts`)

    res.json({
      success: true,
      message: "Payout history retrieved successfully",
      data: formattedPayouts,
      hasMore: payouts.has_more,
    })
  } catch (error) {
    console.error("Get Payout History Error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payout history",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Handle Stripe Connect webhooks
export const handleConnectWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  console.log("[handleConnectWebhook] Received webhook")

  if (!stripe || !process.env.STRIPE_CONNECT_WEBHOOK_SECRET) {
    console.log("[handleConnectWebhook] Stripe not configured, ignoring webhook")
    return res.json({ received: true })
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_CONNECT_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event.data.object)
        break

      case "identity.verification_session.verified":
        await handleIdentityVerified(event.data.object)
        break

      case "identity.verification_session.requires_input":
        await handleIdentityRequiresInput(event.data.object)
        break

      case "payout.paid":
        await handlePayoutPaid(event.data.object)
        break

      case "payout.failed":
        await handlePayoutFailed(event.data.object)
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
export const handleAccountUpdated = async (account) => {
  try {
    const user = await User.findOne({ stripeConnectAccountId: account.id })
    if (!user) return

    const isVerified = account.charges_enabled && account.payouts_enabled
    const verificationStatus = isVerified
      ? "verified"
      : account.requirements?.currently_due?.length > 0
        ? "pending"
        : "in_review"

    user.payoutSettings = {
      ...user.payoutSettings,
      verificationStatus: verificationStatus,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      lastUpdated: new Date(),
      stripeConnectPending: false, // Clear pending flag when account is updated
    }

    await user.save()
    console.log(`Updated verification status for user ${user._id}: ${verificationStatus}`)
  } catch (error) {
    console.error("Handle account updated error:", error)
  }
}

export const handleIdentityVerified = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) return

    const user = await User.findById(userId)
    if (!user) return

    user.payoutSettings = {
      ...user.payoutSettings,
      identityVerified: true,
      identityVerificationDate: new Date(),
    }

    await user.save()
    console.log(`Identity verified for user ${userId}`)
  } catch (error) {
    console.error("Handle identity verified error:", error)
  }
}

export const handleIdentityRequiresInput = async (session) => {
  try {
    const userId = session.metadata?.userId
    if (!userId) return

    const user = await User.findById(userId)
    if (!user) return

    user.payoutSettings = {
      ...user.payoutSettings,
      identityVerificationStatus: "requires_input",
      lastVerificationAttempt: new Date(),
    }

    await user.save()
    console.log(`Identity verification requires input for user ${userId}`)
  } catch (error) {
    console.error("Handle identity requires input error:", error)
  }
}

export const handlePayoutPaid = async (payout) => {
  console.log(`Payout paid: ${payout.id} for ${payout.amount / 100} ${payout.currency}`)
}

export const handlePayoutFailed = async (payout) => {
  console.log(`Payout failed: ${payout.id} - ${payout.failure_message}`)
}

// Diagnostic function to check Stripe Connect setup
export const checkConnectSetup = async (req, res) => {
  try {
    console.log("[checkConnectSetup] Checking Stripe Connect configuration")

    if (!stripe) {
      return res.json({
        success: true,
        message: "Stripe not configured - using mock mode",
        data: {
          stripeConfigured: false,
          connectEnabled: false,
          canCreateAccounts: false,
          mode: "mock",
        },
      })
    }

    // Try to list accounts to test Connect access
    try {
      const accounts = await stripe.accounts.list({ limit: 1 })

      return res.json({
        success: true,
        message: "Stripe Connect is properly configured",
        data: {
          stripeConfigured: true,
          connectEnabled: true,
          canCreateAccounts: true,
          accountsAccessible: true,
          mode: process.env.NODE_ENV === "production" ? "live" : "test",
        },
      })
    } catch (connectError) {
      console.error("[checkConnectSetup] Connect access error:", connectError)

      let diagnosis = "Unknown Connect issue"
      let solution = "Check your Stripe Connect setup"

      if (connectError.message?.includes("signed up for Connect")) {
        diagnosis = "Connect not enabled on main Stripe account"
        solution = "Enable Connect in your main Stripe Dashboard → Settings → Business settings"
      } else if (connectError.code === "api_key_invalid") {
        diagnosis = "Invalid API key"
        solution = "Check your STRIPE_SECRET_KEY environment variable"
      } else if (connectError.code === "permission_denied") {
        diagnosis = "Insufficient permissions for Connect"
        solution = "Ensure your API key has Connect permissions"
      }

      return res.json({
        success: false,
        message: "Stripe Connect configuration issue detected",
        data: {
          stripeConfigured: true,
          connectEnabled: false,
          canCreateAccounts: false,
          error: connectError.message,
          diagnosis: diagnosis,
          solution: solution,
          mode: process.env.NODE_ENV === "production" ? "live" : "test",
        },
      })
    }
  } catch (error) {
    console.error("[checkConnectSetup] Diagnostic error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to check Connect setup",
      error: error.message,
    })
  }
}
