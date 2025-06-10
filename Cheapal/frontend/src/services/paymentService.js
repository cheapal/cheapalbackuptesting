// frontend/services/paymentService.js
import { apiRequest } from "./apiService" // Using named import for apiRequest

// Corrected API_URL: Removed the leading '/api' as it's already in API_BASE_URL from apiService.js
const PAYMENT_SERVICE_ENDPOINT_PREFIX = "/payments"

/**
 * Create a Stripe Payment Intent.
 * @param {object} paymentData - Data for creating payment intent.
 * @param {string} paymentData.orderId - The ID of the order.
 * @param {number} paymentData.amount - The total amount of the order (e.g., 29.99).
 * @param {string} [paymentData.currency='usd'] - The currency.
 * @returns {Promise<object>} The payment intent data (clientSecret, paymentIntentId).
 */
const createPaymentIntent = async (paymentData) => {
  try {
    console.log("paymentService: Attempting to create payment intent with data:", paymentData)

    // Construct the full endpoint for the apiRequest function
    const endpoint = `${PAYMENT_SERVICE_ENDPOINT_PREFIX}/create-payment-intent`

    const response = await apiRequest(
      endpoint, // The specific endpoint for this payment action
      {
        // options object
        method: "POST",
        body: JSON.stringify(paymentData),
      },
      // isFormData defaults to false, which is correct here
    )

    console.log("paymentService: Payment intent created successfully:", response)
    return response // handleResponse already parses JSON, so response is the data object.
  } catch (error) {
    console.error("paymentService: Error explicitly caught in createPaymentIntent:", error.message)
    // The error is already logged by apiRequest, but we re-throw to allow
    // the calling component (CheckoutPage) to handle it and display a message.
    throw new Error(error.message || "Failed to create payment intent. Please check console for details.")
  }
}

/**
 * Confirm a payment intent with Stripe
 * @param {string} paymentIntentId - The payment intent ID
 * @param {string} paymentMethodId - The payment method ID
 * @returns {Promise<object>} The confirmation result
 */
const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    console.log("paymentService: Confirming payment intent:", paymentIntentId)

    const endpoint = `${PAYMENT_SERVICE_ENDPOINT_PREFIX}/confirm-payment`

    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    })

    console.log("paymentService: Payment confirmed successfully:", response)
    return response
  } catch (error) {
    console.error("paymentService: Error confirming payment:", error.message)
    throw new Error(error.message || "Failed to confirm payment.")
  }
}

/**
 * Get payment status
 * @param {string} paymentIntentId - The payment intent ID
 * @returns {Promise<object>} The payment status
 */
const getPaymentStatus = async (paymentIntentId) => {
  try {
    const endpoint = `${PAYMENT_SERVICE_ENDPOINT_PREFIX}/status/${paymentIntentId}`
    const response = await apiRequest(endpoint, { method: "GET" })
    return response
  } catch (error) {
    console.error("paymentService: Error getting payment status:", error.message)
    throw new Error(error.message || "Failed to get payment status.")
  }
}

export const paymentService = {
  createPaymentIntent,
  confirmPaymentIntent,
  getPaymentStatus,
}
