"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { stripeConnectService } from "../services/apiService"

const PayoutOnboarding = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [accountStatus, setAccountStatus] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [bankingStatus, setBankingStatus] = useState(null)
  const [formData, setFormData] = useState({
    country: "",
    businessType: "individual",
  })
  const [bankingData, setBankingData] = useState({
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    country: "",
    currency: "USD",
  })

  // Comprehensive list of countries
  const countries = [
    { code: "US", name: "United States", currency: "USD" },
    { code: "CA", name: "Canada", currency: "CAD" },
    { code: "GB", name: "United Kingdom", currency: "GBP" },
    { code: "AU", name: "Australia", currency: "AUD" },
    { code: "DE", name: "Germany", currency: "EUR" },
    { code: "FR", name: "France", currency: "EUR" },
    { code: "IN", name: "India", currency: "INR" },
    { code: "PK", name: "Pakistan", currency: "PKR" },
    { code: "BD", name: "Bangladesh", currency: "BDT" },
    { code: "LK", name: "Sri Lanka", currency: "LKR" },
    { code: "NL", name: "Netherlands", currency: "EUR" },
    { code: "IT", name: "Italy", currency: "EUR" },
    { code: "ES", name: "Spain", currency: "EUR" },
    { code: "SE", name: "Sweden", currency: "SEK" },
    { code: "NO", name: "Norway", currency: "NOK" },
    { code: "DK", name: "Denmark", currency: "DKK" },
    { code: "FI", name: "Finland", currency: "EUR" },
    { code: "CH", name: "Switzerland", currency: "CHF" },
    { code: "AT", name: "Austria", currency: "EUR" },
    { code: "BE", name: "Belgium", currency: "EUR" },
    { code: "IE", name: "Ireland", currency: "EUR" },
    { code: "PT", name: "Portugal", currency: "EUR" },
    { code: "GR", name: "Greece", currency: "EUR" },
    { code: "PL", name: "Poland", currency: "PLN" },
    { code: "CZ", name: "Czech Republic", currency: "CZK" },
    { code: "HU", name: "Hungary", currency: "HUF" },
    { code: "SK", name: "Slovakia", currency: "EUR" },
    { code: "SI", name: "Slovenia", currency: "EUR" },
    { code: "EE", name: "Estonia", currency: "EUR" },
    { code: "LV", name: "Latvia", currency: "EUR" },
    { code: "LT", name: "Lithuania", currency: "EUR" },
    { code: "RO", name: "Romania", currency: "RON" },
    { code: "BG", name: "Bulgaria", currency: "BGN" },
    { code: "HR", name: "Croatia", currency: "EUR" },
    { code: "MT", name: "Malta", currency: "EUR" },
    { code: "CY", name: "Cyprus", currency: "EUR" },
    { code: "LU", name: "Luxembourg", currency: "EUR" },
    { code: "IS", name: "Iceland", currency: "ISK" },
    { code: "LI", name: "Liechtenstein", currency: "CHF" },
    { code: "MC", name: "Monaco", currency: "EUR" },
    { code: "SM", name: "San Marino", currency: "EUR" },
    { code: "VA", name: "Vatican City", currency: "EUR" },
    { code: "AD", name: "Andorra", currency: "EUR" },
    { code: "JP", name: "Japan", currency: "JPY" },
    { code: "KR", name: "South Korea", currency: "KRW" },
    { code: "SG", name: "Singapore", currency: "SGD" },
    { code: "HK", name: "Hong Kong", currency: "HKD" },
    { code: "TW", name: "Taiwan", currency: "TWD" },
    { code: "MY", name: "Malaysia", currency: "MYR" },
    { code: "TH", name: "Thailand", currency: "THB" },
    { code: "ID", name: "Indonesia", currency: "IDR" },
    { code: "PH", name: "Philippines", currency: "PHP" },
    { code: "VN", name: "Vietnam", currency: "VND" },
    { code: "NZ", name: "New Zealand", currency: "NZD" },
    { code: "ZA", name: "South Africa", currency: "ZAR" },
    { code: "BR", name: "Brazil", currency: "BRL" },
    { code: "MX", name: "Mexico", currency: "MXN" },
    { code: "AR", name: "Argentina", currency: "ARS" },
    { code: "CL", name: "Chile", currency: "CLP" },
    { code: "CO", name: "Colombia", currency: "COP" },
    { code: "PE", name: "Peru", currency: "PEN" },
    { code: "UY", name: "Uruguay", currency: "UYU" },
    { code: "EC", name: "Ecuador", currency: "USD" },
    { code: "BO", name: "Bolivia", currency: "BOB" },
    { code: "PY", name: "Paraguay", currency: "PYG" },
    { code: "VE", name: "Venezuela", currency: "VES" },
    { code: "GY", name: "Guyana", currency: "GYD" },
    { code: "SR", name: "Suriname", currency: "SRD" },
    { code: "FK", name: "Falkland Islands", currency: "FKP" },
    { code: "GF", name: "French Guiana", currency: "EUR" },
    { code: "IL", name: "Israel", currency: "ILS" },
    { code: "AE", name: "United Arab Emirates", currency: "AED" },
    { code: "SA", name: "Saudi Arabia", currency: "SAR" },
    { code: "QA", name: "Qatar", currency: "QAR" },
    { code: "KW", name: "Kuwait", currency: "KWD" },
    { code: "BH", name: "Bahrain", currency: "BHD" },
    { code: "OM", name: "Oman", currency: "OMR" },
    { code: "JO", name: "Jordan", currency: "JOD" },
    { code: "LB", name: "Lebanon", currency: "LBP" },
    { code: "TR", name: "Turkey", currency: "TRY" },
    { code: "EG", name: "Egypt", currency: "EGP" },
    { code: "MA", name: "Morocco", currency: "MAD" },
    { code: "TN", name: "Tunisia", currency: "TND" },
    { code: "DZ", name: "Algeria", currency: "DZD" },
    { code: "LY", name: "Libya", currency: "LYD" },
    { code: "SD", name: "Sudan", currency: "SDG" },
    { code: "ET", name: "Ethiopia", currency: "ETB" },
    { code: "KE", name: "Kenya", currency: "KES" },
    { code: "UG", name: "Uganda", currency: "UGX" },
    { code: "TZ", name: "Tanzania", currency: "TZS" },
    { code: "RW", name: "Rwanda", currency: "RWF" },
    { code: "BI", name: "Burundi", currency: "BIF" },
    { code: "DJ", name: "Djibouti", currency: "DJF" },
    { code: "SO", name: "Somalia", currency: "SOS" },
    { code: "ER", name: "Eritrea", currency: "ERN" },
    { code: "SS", name: "South Sudan", currency: "SSP" },
    { code: "CF", name: "Central African Republic", currency: "XAF" },
    { code: "TD", name: "Chad", currency: "XAF" },
    { code: "CM", name: "Cameroon", currency: "XAF" },
    { code: "GQ", name: "Equatorial Guinea", currency: "XAF" },
    { code: "GA", name: "Gabon", currency: "XAF" },
    { code: "CG", name: "Republic of the Congo", currency: "XAF" },
    { code: "CD", name: "Democratic Republic of the Congo", currency: "CDF" },
    { code: "AO", name: "Angola", currency: "AOA" },
    { code: "ZM", name: "Zambia", currency: "ZMW" },
    { code: "ZW", name: "Zimbabwe", currency: "ZWL" },
    { code: "BW", name: "Botswana", currency: "BWP" },
    { code: "NA", name: "Namibia", currency: "NAD" },
    { code: "SZ", name: "Eswatini", currency: "SZL" },
    { code: "LS", name: "Lesotho", currency: "LSL" },
    { code: "MW", name: "Malawi", currency: "MWK" },
    { code: "MZ", name: "Mozambique", currency: "MZN" },
    { code: "MG", name: "Madagascar", currency: "MGA" },
    { code: "MU", name: "Mauritius", currency: "MUR" },
    { code: "SC", name: "Seychelles", currency: "SCR" },
    { code: "KM", name: "Comoros", currency: "KMF" },
    { code: "CV", name: "Cape Verde", currency: "CVE" },
    { code: "ST", name: "São Tomé and Príncipe", currency: "STN" },
    { code: "GH", name: "Ghana", currency: "GHS" },
    { code: "NG", name: "Nigeria", currency: "NGN" },
    { code: "BJ", name: "Benin", currency: "XOF" },
    { code: "TG", name: "Togo", currency: "XOF" },
    { code: "BF", name: "Burkina Faso", currency: "XOF" },
    { code: "CI", name: "Côte d'Ivoire", currency: "XOF" },
    { code: "LR", name: "Liberia", currency: "LRD" },
    { code: "SL", name: "Sierra Leone", currency: "SLE" },
    { code: "GN", name: "Guinea", currency: "GNF" },
    { code: "GW", name: "Guinea-Bissau", currency: "XOF" },
    { code: "SN", name: "Senegal", currency: "XOF" },
    { code: "GM", name: "Gambia", currency: "GMD" },
    { code: "ML", name: "Mali", currency: "XOF" },
    { code: "NE", name: "Niger", currency: "XOF" },
    { code: "MR", name: "Mauritania", currency: "MRU" },
    { code: "EH", name: "Western Sahara", currency: "MAD" },
  ]

  // Check statuses on component mount
  useEffect(() => {
    checkAllStatuses()
  }, [])

  const checkAllStatuses = async () => {
    try {
      // Check account status
      const accountResponse = await stripeConnectService.getAccountStatus()
      if (accountResponse.success) {
        setAccountStatus(accountResponse.data)
        if (accountResponse.data.hasAccount) {
          setCurrentStep(2)
        }
      }

      // Check Stripe Identity verification status - FIXED API CALL
      try {
        const verificationResponse = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/stripe-identity/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        const verificationData = await verificationResponse.json()
        if (verificationData.success) {
          setVerificationStatus(verificationData.data)
          if (verificationData.data.status === "verified") {
            setCurrentStep(3)
          }
        }
      } catch (error) {
        console.log("[PayoutOnboarding] Verification status check failed:", error)
        // Set default status if API call fails
        setVerificationStatus({ status: "not_started" })
      }

      // Check banking status
      try {
        const bankingResponse = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/verification/banking/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        const bankingData = await bankingResponse.json()
        if (bankingData.success) {
          setBankingStatus(bankingData.data)
        }
      } catch (error) {
        console.log("[PayoutOnboarding] Banking status check failed:", error)
        setBankingStatus({ status: "not_started" })
      }
    } catch (error) {
      console.log("[PayoutOnboarding] Error checking statuses:", error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBankingInputChange = (field, value) => {
    setBankingData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const createConnectAccount = async () => {
    if (!formData.country) {
      toast.error("Please select your country")
      return
    }

    setLoading(true)
    try {
      const response = await stripeConnectService.createConnectAccount(formData)

      if (response.success || response.isFallback) {
        toast.success("Payout account created successfully!")
        setCurrentStep(2)
        await checkAllStatuses()
      } else {
        throw new Error(response.message || "Failed to create account")
      }
    } catch (error) {
      console.error("Error creating account:", error)
      toast.error(error.message || "Failed to create payout account")
    } finally {
      setLoading(false)
    }
  }

  const startLiveVerification = async () => {
    setLoading(true)
    try {
      console.log("[PayoutOnboarding] Starting live identity verification...")

      // FIXED API CALL - Use correct base URL
      const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${apiBaseUrl}/stripe-identity/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/seller-dashboard?tab=payouts&verification=complete`,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[PayoutOnboarding] API Error Response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (result.success && result.data?.url) {
        // Open Stripe Identity verification in new tab
        window.open(result.data.url, "_blank", "width=800,height=600")
        toast.success("Identity verification opened! Complete the process in the new tab.")

        // Start polling for status updates
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`${apiBaseUrl}/stripe-identity/status`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            const statusData = await statusResponse.json()

            if (statusData.success && statusData.data) {
              setVerificationStatus(statusData.data)

              if (statusData.data.status === "verified") {
                clearInterval(pollInterval)
                toast.success("Identity verification completed successfully!")
                setCurrentStep(3)
                await checkAllStatuses()
              } else if (statusData.data.status === "requires_input") {
                clearInterval(pollInterval)
                toast.error("Verification requires additional input. Please try again.")
              } else if (statusData.data.status === "canceled") {
                clearInterval(pollInterval)
                toast.warning("Verification was canceled. You can try again.")
              }
            }
          } catch (error) {
            console.error("Error polling verification status:", error)
          }
        }, 3000) // Poll every 3 seconds

        // Stop polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollInterval)
        }, 600000)
      } else {
        throw new Error(result.message || "Failed to create verification session")
      }
    } catch (error) {
      console.error("Error starting live verification:", error)
      toast.error(error.message || "Failed to start identity verification")
    } finally {
      setLoading(false)
    }
  }

  const submitBankingInfo = async () => {
    if (!bankingData.accountHolderName || !bankingData.accountNumber || !bankingData.bankName) {
      toast.error("Please fill in all required banking information")
      return
    }

    setLoading(true)
    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${apiBaseUrl}/verification/banking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...bankingData,
          country: formData.country,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Banking information submitted successfully!")
        await checkAllStatuses()
        onComplete()
      } else {
        throw new Error(result.message || "Failed to submit banking information")
      }
    } catch (error) {
      console.error("Error submitting banking info:", error)
      toast.error(error.message || "Failed to submit banking information")
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatusDisplay = (status) => {
    switch (status) {
      case "verified":
        return { text: "✓ Verified", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" }
      case "processing":
        return { text: "⏳ Processing", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" }
      case "requires_input":
        return { text: "⚠ Requires Input", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" }
      case "canceled":
        return { text: "✗ Canceled", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }
      case "pending":
        return { text: "⏳ Pending", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" }
      default:
        return { text: "○ Not Started", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" }
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Account Setup</h3>
              <p className="text-gray-400 text-sm">
                Please provide your country and business type to set up your payout account.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country/Region</label>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    handleInputChange("country", e.target.value)
                    const selectedCountry = countries.find((c) => c.code === e.target.value)
                    if (selectedCountry) {
                      setBankingData((prev) => ({
                        ...prev,
                        country: e.target.value,
                        currency: selectedCountry.currency,
                      }))
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="individual">Individual (Personal Account)</option>
                  <option value="company">Business/Company Account</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={createConnectAccount}
                disabled={loading || !formData.country}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        )

      case 2:
        const statusDisplay = getVerificationStatusDisplay(verificationStatus?.status)
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Identity Verification</h3>
              <p className="text-gray-400 text-sm">
                Complete instant identity verification using your ID document and live selfie.
              </p>
            </div>

            <div className={`rounded-lg p-4 border ${statusDisplay.bg}`}>
              <h4 className={`font-medium mb-2 ${statusDisplay.color}`}>{statusDisplay.text}</h4>
              {verificationStatus?.status === "verified" && verificationStatus.verifiedData && (
                <div className="text-sm text-gray-300 space-y-1">
                  <p>✓ Document Type: {verificationStatus.verifiedData.documentType}</p>
                  <p>
                    ✓ Name: {verificationStatus.verifiedData.firstName} {verificationStatus.verifiedData.lastName}
                  </p>
                  <p>✓ Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}</p>
                </div>
              )}
              {verificationStatus?.status === "requires_input" && (
                <div className="text-sm text-gray-300">
                  <p>Additional information required. Please try the verification process again.</p>
                  {verificationStatus.lastError && (
                    <p className="text-red-400 mt-1">Error: {verificationStatus.lastError.reason}</p>
                  )}
                </div>
              )}
              {verificationStatus?.status === "processing" && (
                <div className="text-sm text-gray-300">
                  <p>Your identity verification is being processed. This usually takes a few moments.</p>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">🔒 Secure Live Verification</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Take a photo of your government-issued ID</li>
                <li>• Capture a live selfie for identity matching</li>
                <li>• Instant verification powered by Stripe Identity</li>
                <li>• Your data is encrypted and secure</li>
              </ul>
            </div>

            {(!verificationStatus ||
              verificationStatus.status === "not_started" ||
              verificationStatus.status === "requires_input" ||
              verificationStatus.status === "canceled") && (
              <button
                onClick={startLiveVerification}
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{loading ? "Starting Verification..." : "Start Live Verification"}</span>
              </button>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Close
              </button>
              {verificationStatus?.status === "verified" && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue to Banking
                </button>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Banking Information</h3>
              <p className="text-gray-400 text-sm">Add your banking details to receive payouts.</p>
            </div>

            {bankingStatus?.status === "pending" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-medium mb-2">⏳ Banking Info Under Review</h4>
                <p className="text-sm text-gray-300">
                  Your banking information is being verified. This usually takes 2-3 business days.
                </p>
              </div>
            )}

            {bankingStatus?.status === "approved" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-2">✓ Banking Verified</h4>
                <p className="text-sm text-gray-300">Your banking information has been verified!</p>
              </div>
            )}

            {(!bankingStatus || bankingStatus.status === "not_started") && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    value={bankingData.accountHolderName}
                    onChange={(e) => handleBankingInputChange("accountHolderName", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Full name as it appears on your bank account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Number *</label>
                  <input
                    type="text"
                    value={bankingData.accountNumber}
                    onChange={(e) => handleBankingInputChange("accountNumber", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your bank account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {formData.country === "US" ? "Routing Number" : "Sort Code / SWIFT Code"} *
                  </label>
                  <input
                    type="text"
                    value={bankingData.routingNumber}
                    onChange={(e) => handleBankingInputChange("routingNumber", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={formData.country === "US" ? "9-digit routing number" : "Bank identifier code"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={bankingData.bankName}
                    onChange={(e) => handleBankingInputChange("bankName", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Name of your bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <input
                    type="text"
                    value={bankingData.currency}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Close
              </button>
              {(!bankingStatus || bankingStatus.status === "not_started") && (
                <button
                  onClick={submitBankingInfo}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Submitting..." : "Submit Banking Info"}
                </button>
              )}
              {bankingStatus?.status === "approved" && (
                <button
                  onClick={onComplete}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Seller Verification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              1
            </div>
            <div className={`w-8 h-1 ${currentStep >= 2 ? "bg-purple-600" : "bg-gray-700"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              2
            </div>
            <div className={`w-8 h-1 ${currentStep >= 3 ? "bg-purple-600" : "bg-gray-700"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  )
}

export default PayoutOnboarding
