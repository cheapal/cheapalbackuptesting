"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import PayoutOnboarding from "./PayoutOnboarding"
import { stripeConnectService } from "../services/apiService"

const PayoutDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [accountStatus, setAccountStatus] = useState(null)
  const [balance, setBalance] = useState(null)
  const [payoutHistory, setPayoutHistory] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetchAccountData()
  }, [])

  const fetchAccountData = async () => {
    setLoading(true)
    try {
      console.log("[PayoutDashboard] Fetching account data...")

      // First get account status
      const statusRes = await stripeConnectService.getAccountStatus()

      // Handle account status
      if (statusRes?.success) {
        console.log("[PayoutDashboard] Account status:", statusRes.data)
        setAccountStatus(statusRes.data)

        // Only fetch balance and history if account exists and is set up
        if (statusRes.data?.hasAccount) {
          try {
            const [balanceRes, historyRes] = await Promise.allSettled([
              stripeConnectService.getBalance(),
              stripeConnectService.getPayoutHistory(),
            ])

            // Handle balance
            if (balanceRes.status === "fulfilled" && balanceRes.value?.success) {
              console.log("[PayoutDashboard] Balance:", balanceRes.value.data)
              setBalance(balanceRes.value.data)
            } else {
              console.warn(
                "[PayoutDashboard] Failed to get balance:",
                balanceRes.reason?.message || balanceRes.value?.message,
              )
              setBalance(null)
            }

            // Handle payout history
            if (historyRes.status === "fulfilled" && historyRes.value?.success) {
              console.log("[PayoutDashboard] Payout history:", historyRes.value.data)
              setPayoutHistory(historyRes.value.data || [])
            } else {
              console.warn(
                "[PayoutDashboard] Failed to get payout history:",
                historyRes.reason?.message || historyRes.value?.message,
              )
              setPayoutHistory([])
            }
          } catch (balanceError) {
            console.error("Error fetching balance and history:", balanceError)
            setBalance(null)
            setPayoutHistory([])
          }
        } else {
          // No account exists, set empty states
          setBalance(null)
          setPayoutHistory([])
        }
      } else {
        console.warn("[PayoutDashboard] Failed to get account status:", statusRes?.message)
        setAccountStatus({ hasAccount: false, verificationStatus: "not_started", requirements: null })
        setBalance(null)
        setPayoutHistory([])
      }
    } catch (error) {
      console.error("Error fetching account data:", error)
      toast.error("Failed to load payout data")
      setAccountStatus({ hasAccount: false, verificationStatus: "not_started", requirements: null })
      setBalance(null)
      setPayoutHistory([])
    } finally {
      setLoading(false)
    }
  }

  const getVerificationProgress = () => {
    if (!accountStatus) return 0

    let progress = 0
    if (accountStatus.hasAccount) progress += 25
    if (accountStatus.chargesEnabled) progress += 25
    if (accountStatus.payoutsEnabled) progress += 25
    if (accountStatus.verificationStatus === "verified") progress += 25

    return progress
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-green-400 bg-green-400/10"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10"
      case "in_review":
        return "text-blue-400 bg-blue-400/10"
      case "not_started":
        return "text-gray-400 bg-gray-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!accountStatus?.hasAccount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Set Up Payouts</h3>
        <p className="text-gray-400 mb-6">Create your payout account to start receiving payments from your sales.</p>
        <button
          onClick={() => setShowOnboarding(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Get Started
        </button>

        {showOnboarding && (
          <PayoutOnboarding
            onComplete={() => {
              setShowOnboarding(false)
              fetchAccountData()
            }}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Status Overview */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Account Status</h3>
            <p className="text-gray-400 text-sm">Your payout account verification progress</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(accountStatus.verificationStatus)}`}
          >
            {accountStatus.verificationStatus?.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Verification Progress</span>
            <span>{getVerificationProgress()}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getVerificationProgress()}%` }}
            />
          </div>
        </div>

        {/* Status Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${accountStatus.hasAccount ? "bg-green-400" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-300">Account Created</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${accountStatus.chargesEnabled ? "bg-green-400" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-300">Charges Enabled</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${accountStatus.payoutsEnabled ? "bg-green-400" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-300">Payouts Enabled</span>
          </div>
        </div>

        {/* Pending Requirements */}
        {accountStatus.pendingRequirements?.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-yellow-400 font-medium mb-2">Action Required</h4>
            <p className="text-sm text-gray-300 mb-3">Complete the following requirements to enable payouts:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              {accountStatus.pendingRequirements.map((req, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  <span>{req.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Complete Requirements
            </button>
          </div>
        )}
      </div>

      {/* Balance Overview - Only show if account exists */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Available Balance</h3>
            <div className="space-y-3">
              {balance.available?.map((bal, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{bal.currency.toUpperCase()}</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(bal.amount / 100, bal.currency)}</span>
                </div>
              ))}
              {balance.available?.length === 0 && (
                <p className="text-gray-400 text-center py-4">No available balance</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Balance</h3>
            <div className="space-y-3">
              {balance.pending?.map((bal, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{bal.currency.toUpperCase()}</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {formatCurrency(bal.amount / 100, bal.currency)}
                  </span>
                </div>
              ))}
              {balance.pending?.length === 0 && <p className="text-gray-400 text-center py-4">No pending balance</p>}
            </div>
          </div>
        </div>
      )}

      {/* Payout History */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payout History</h3>

        {payoutHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Arrival</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-300">{formatDate(payout.createdAt)}</td>
                    <td className="py-3 px-4 text-white font-medium">
                      {formatCurrency(payout.amount, payout.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          payout.status === "paid"
                            ? "bg-green-400/10 text-green-400"
                            : payout.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 capitalize">{payout.method?.replace("_", " ")}</td>
                    <td className="py-3 px-4 text-gray-300">{formatDate(payout.arrivalDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-400">No payouts yet</p>
            <p className="text-sm text-gray-500 mt-1">Payouts will appear here once you start making sales</p>
          </div>
        )}
      </div>

      {showOnboarding && (
        <PayoutOnboarding
          onComplete={() => {
            setShowOnboarding(false)
            fetchAccountData()
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  )
}

export default PayoutDashboard
