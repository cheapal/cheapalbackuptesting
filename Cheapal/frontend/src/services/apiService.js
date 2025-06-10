// import { toast } from "react-toastify"
// import NewCustomToast from "../components/NewCustomToast" // Ensure this path is correct

// // Fix the API base URL to point to the backend server
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// const handleResponse = async (response) => {
//   const contentType = response.headers.get("content-type")
//   let data

//   if (contentType && contentType.includes("application/json")) {
//     data = await response.json()
//   } else {
//     const textData = await response.text() // Get text data first
//     if (!response.ok) {
//       // Try to parse as JSON even if content-type is wrong, backend might send JSON error anyway
//       try {
//         const errorJson = JSON.parse(textData); // Try to parse the textData
//         const error = new Error(errorJson?.message || textData || `HTTP error! status: ${response.status}`);
//         error.responsePayload = errorJson; // Attach parsed JSON error payload
//         error.status = response.status;
//         throw error;
//       } catch (e) {
//         // If parsing textData as JSON fails, use textData as the message
//         const error = new Error(textData || `HTTP error! status: ${response.status}`);
//         error.status = response.status;
//         throw error;
//       }
//     }
//     // If response.ok but not JSON, return the text data (e.g., for plain text success responses)
//     return textData;
//   }

//   if (!response.ok) {
//     const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`
//     console.error("[apiService] API Error Response (JSON):", data)
//     const error = new Error(errorMessage)
//     error.responsePayload = data // Attach the parsed JSON payload
//     error.status = response.status // Attach status code
//     throw error
//   }
//   return data
// }

// const apiRequest = async (endpoint, options = {}, isFormData = false) => {
//   const token = localStorage.getItem("token")
//   const headers = {
//     ...(isFormData ? {} : { "Content-Type": "application/json" }),
//     ...(token &&
//       typeof token === "string" &&
//       token !== "undefined" && // Check for string "undefined"
//       token !== "null" && { Authorization: `Bearer ${token}` }), // Check for string "null"
//     ...options.headers,
//   }
//   const config = {
//     ...options,
//     headers,
//     // Ensure body is not included for GET or HEAD requests
//     body: (options.method === 'GET' || options.method === 'HEAD') ? undefined : options.body,
//   }

//   try {
//     console.log(`[apiService] Sending request: ${options.method || "GET"} ${API_BASE_URL}${endpoint}`, {
//         headers: config.headers,
//         method: config.method
//         // Omit body from this specific log if it can be very large (like FormData)
//     });
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
//     return await handleResponse(response)
//   } catch (error) {
//     console.error(
//       `[apiService] API request failed: ${options.method || "GET"} ${API_BASE_URL}${endpoint}`,
//       error, // The error object itself
//       error.stack, // Stack trace
//     )
//     const toastMessage =
//       error.responsePayload?.message || // Message from parsed JSON error
//       error.message || // Original error message (e.g., network error)
//       "An unexpected error occurred. Please check your connection or try again later."

//     // Check if NewCustomToast is defined before using it
//     if (typeof NewCustomToast === 'function') {
//         toast(({ closeToast }) => (
//           <NewCustomToast type="error" headline="API Request Error" text={toastMessage} closeToast={closeToast} />
//         ));
//     } else {
//         toast.error(`API Request Error: ${toastMessage}`); // Fallback to default toast
//     }
//     throw error // Re-throw the error so it can be caught by the calling function
//   }
// }

// // Authentication Service
// export const authService = {
//   login: async (credentials) => {
//     if (!credentials?.email || !credentials?.password) {
//       throw new Error("Email and password are required.")
//     }
//     return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) })
//   },
//   register: async (userData) => {
//     if (!userData?.email || !userData?.password || !userData?.name) {
//       throw new Error("Name, email, and password are required.")
//     }
//     return apiRequest("/auth/register", { method: "POST", body: JSON.stringify(userData) })
//   },
//   logout: async () => apiRequest("/auth/logout", { method: "POST" }),
//   getCurrentUser: async () => apiRequest("/auth/me", { method: "GET" }),
//   checkEmail: async (email) => {
//     if (!email) throw new Error("Email is required.");
//     return apiRequest(`/auth/check-email?email=${encodeURIComponent(email)}`, { method: "GET" });
//   },
// }

// // User Service
// export const userService = {
//   getUser: async (userId) => {
//     if (!userId) throw new Error("User ID is required.")
//     return apiRequest(`/users/${userId}?_=${new Date().getTime()}`, { method: "GET" })
//   },
//   getPublicProfileById: async (sellerId) => {
//     if (!sellerId) throw new Error("Seller ID is required.")
//     return apiRequest(`/users/public-profile/${sellerId}?_=${new Date().getTime()}`, { method: "GET" })
//   },
//   updateUser: async (userId, userData) => {
//     if (!userId) throw new Error("User ID is required.")
//     const isFormData = userData instanceof FormData
//     return apiRequest(
//       `/users/${userId}`,
//       {
//         method: "PUT",
//         body: isFormData ? userData : JSON.stringify(userData),
//       },
//       isFormData,
//     )
//   },
//   deleteUser: async (userId) => {
//     if (!userId) throw new Error("User ID is required.")
//     return apiRequest(`/users/${userId}`, { method: "DELETE" })
//   },
// }

// // Listings (Subscriptions) Service
// export const listingService = {
//   create: async (formData) => {
//     if (!(formData instanceof FormData)) {
//       throw new Error("FormData is required for creating a listing.")
//     }
//     return apiRequest("/subscriptions", { method: "POST", body: formData }, true)
//   },
//   getMyListings: async () => {
//     try {
//       const res = await apiRequest(`/subscriptions/my?_=${new Date().getTime()}`, { method: "GET" })
//       console.log("[apiService] listingService.getMyListings: Response:", JSON.stringify(res, null, 2))
//       if (res?.success && Array.isArray(res.data)) {
//         return res.data
//       }
//       if (Array.isArray(res)) {
//         console.log("[apiService] listingService.getMyListings: Fallback to direct array response")
//         return res
//       }
//       if (res?.listings && Array.isArray(res.listings)) {
//          console.log("[apiService] listingService.getMyListings: Fallback to res.listings")
//         return res.listings
//       }
//       console.warn("[apiService] listingService.getMyListings: Unexpected response structure. Response:", res)
//       if (typeof NewCustomToast === 'function') {
//         toast(({ closeToast }) => (
//           <NewCustomToast type="warning" headline="Listings Info" text={res?.message || "No listings found or unexpected data format."} closeToast={closeToast} />
//         ));
//       } else {
//         toast.warn(res?.message || "No listings found or unexpected data format.");
//       }
//       return []
//     } catch (error) {
//       console.error("[apiService] listingService.getMyListings: Error:", error.message, "Response Payload:", error.responsePayload)
//       return []
//     }
//   },
//   update: async (id, formData) => {
//     if (!id || !(formData instanceof FormData)) {
//       throw new Error("Listing ID and FormData are required for updating a listing.")
//     }
//     return apiRequest(`/subscriptions/${id}`, { method: "PUT", body: formData }, true)
//   },
//   delete: async (id) => {
//     if (!id) throw new Error("Listing ID is required.")
//     return apiRequest(`/subscriptions/${id}`, { method: "DELETE" })
//   },
//   getApproved: async () => {
//     console.log("[apiService] listingService.getApproved: Fetching approved listings...")
//     try {
//       const responseData = await apiRequest(`/subscriptions?_=${new Date().getTime()}`, { method: "GET" })
//       console.log("[apiService] listingService.getApproved: Raw response from apiRequest:", responseData)
//       if (responseData && responseData.success && Array.isArray(responseData.data)) {
//         return responseData.data
//       }
//       if (Array.isArray(responseData)) return responseData
//       if (responseData?.listings && Array.isArray(responseData.listings)) return responseData.listings
//       if (responseData?.subscriptions && Array.isArray(responseData.subscriptions)) return responseData.subscriptions
//       console.warn("[apiService] listingService.getApproved: Received unexpected data type or structure. Returning empty array. Response:", responseData)
//       return []
//     } catch (error) {
//       console.error("[apiService] listingService.getApproved: Error:", error)
//       return []
//     }
//   },
//   getById: async (id) => {
//     if (!id) throw new Error("Listing ID is required.")
//     const res = await apiRequest(`/subscriptions/${id}?_=${new Date().getTime()}`, { method: "GET" })
//     return res?.success ? res.data : null
//   },
//   getBySeller: async (sellerId) => {
//     if (!sellerId) throw new Error("Seller ID is required.")
//     const res = await apiRequest(`/subscriptions/seller/${sellerId}?_=${new Date().getTime()}`, { method: "GET" })
//     return res?.success && Array.isArray(res.data) ? res.data : []
//   },
//   getByCategory: async (categoryName) => {
//     if (!categoryName) throw new Error("Category name is required.")
//     const enc = encodeURIComponent(categoryName)
//     const cacheBustParam = `_=${new Date().getTime()}`
//     const res = await apiRequest(`/subscriptions/category/${enc}?${cacheBustParam}`, { method: "GET" })
//     console.log(`[apiService] listingService.getByCategory ('${categoryName}') response:`, res)
//     if (res?.success && Array.isArray(res.data)) return res.data
//     if (Array.isArray(res)) return res
//     console.warn(`[apiService] listingService.getByCategory ('${categoryName}') did not return expected structure. Returning empty array.`)
//     return []
//   },
// }

// // Admin Service
// export const adminService = {
//   getPendingListings: async () => {
//     const res = await apiRequest(`/admin/listings/pending?_=${new Date().getTime()}`, { method: "GET" })
//     return res?.success && Array.isArray(res.data) ? res.data : []
//   },
//   approveListing: async (id) => {
//     if (!id) throw new Error("Listing ID is required.")
//     return apiRequest(`/admin/listings/${id}/approve`, { method: "PUT" })
//   },
//   rejectListing: async (id, reason = "") => {
//     if (!id) throw new Error("Listing ID is required.")
//     return apiRequest(`/admin/listings/${id}/reject`, { method: "PUT", body: JSON.stringify({ reason }) })
//   },
//   getAllListings: async (params = {}) => {
//     const q = new URLSearchParams(params).toString();
//     const res = await apiRequest(`/admin/listings?${q}&_=${new Date().getTime()}`, { method: "GET" });
//     return res?.success ? res : { data: [], pagination: {} };
//   },
//   getAllUsers: async (params = {}) => {
//     const q = new URLSearchParams(params).toString();
//     const res = await apiRequest(`/admin/users?${q}&_=${new Date().getTime()}`, { method: "GET" });
//     return res?.success ? res : { data: [], pagination: {} };
//   },
//   getUserById: async (userId) => {
//     if (!userId) throw new Error("User ID is required.");
//     const res = await apiRequest(`/admin/users/${userId}?_=${new Date().getTime()}`, { method: "GET" });
//     return res?.success ? res.data : null;
//   },
//   toggleUserBlock: async (userId) => {
//     if (!userId) throw new Error("User ID is required.");
//     return apiRequest(`/admin/users/${userId}/toggle-block`, { method: "PUT" });
//   },
//   toggleUserVerification: async (userId, status, reason = "") => {
//     if (!userId || typeof status !== 'boolean') throw new Error("User ID and verification status (boolean) are required.");
//     console.log(`[apiService] adminService.toggleUserVerification: Toggling verification for user ${userId} to status ${status}`);
//     try {
//         const response = await apiRequest(`/admin/users/${userId}/verification`, {
//             method: "PUT",
//             body: JSON.stringify({ isVerified: status, verificationReason: reason }),
//         });
//         console.log(`[apiService] adminService.toggleUserVerification: Success for user ${userId}`, response);
//         return response;
//     } catch (error) {
//         console.error(`[apiService] adminService.toggleUserVerification: Failed for user ${userId}`, error);
//         throw error;
//     }
//   },
//   getBlogs: async (params = {}) => {
//     const q = new URLSearchParams(params).toString();
//     try {
//         const res = await apiRequest(`/admin/blogs?${q}&_=${new Date().getTime()}`, { method: "GET" });
//         return res?.success ? res : { data: [], pagination: {} };
//     } catch (error) {
//         console.error("[apiService] adminService.getBlogs: Error:", error.message, "Response Payload:", error.responsePayload);
//         return { data: [], pagination: {} };
//     }
//   },
//   createBlog: async (formData) => {
//     if (!(formData instanceof FormData)) {
//         throw new Error("FormData is required for creating a blog.");
//     }
//     try {
//         const res = await apiRequest("/admin/blogs", { method: "POST", body: formData }, true);
//         return res;
//     } catch (error) {
//         console.error("[apiService] adminService.createBlog: Error:", error.message, "Response Payload:", error.responsePayload);
//         throw error;
//     }
//   },
//   updateBlog: async (id, formData) => {
//     if (!id || !(formData instanceof FormData)) {
//         throw new Error("Blog ID and FormData are required for updating a blog.");
//     }
//     try {
//         const res = await apiRequest(`/admin/blogs/${id}`, { method: "PUT", body: formData }, true);
//         return res;
//     } catch (error) {
//         console.error("[apiService] adminService.updateBlog: Error:", error.message, "Response Payload:", error.responsePayload);
//         throw error;
//     }
//   },
//   deleteBlog: async (id) => {
//     if (!id) throw new Error("Blog ID is required.");
//     try {
//         const res = await apiRequest(`/admin/blogs/${id}`, { method: "DELETE" });
//         return res;
//     } catch (error) {
//         console.error("[apiService] adminService.deleteBlog: Error:", error.message, "Response Payload:", error.responsePayload);
//         throw error;
//     }
//   },
//   getPublicBlogs: async (params = {}) => {
//     const q = new URLSearchParams({ ...params, status: "published" }).toString();
//     try {
//         const res = await apiRequest(`/blogs/public?${q}&_=${new Date().getTime()}`, { method: "GET" });
//         console.log("[apiService] adminService.getPublicBlogs: Response:", res);
//         return res?.success ? res : { data: [], pagination: {} };
//     } catch (error) {
//         console.error("[apiService] adminService.getPublicBlogs: Error:", error.message, "Response Payload:", error.responsePayload);
//         return { data: [], pagination: {} };
//     }
//   },
// }


// // Seller Service
// export const sellerService = {
//   getAnalytics: async (daysParam) => {
//     const days = typeof daysParam === "number" ? daysParam : 30;
//     return apiRequest(`/seller/analytics?days=${days}&_=${new Date().getTime()}`, { method: "GET" });
//   },
//   getPayoutStatus: async () => apiRequest(`/seller/payout-status?_=${new Date().getTime()}`, { method: "GET" }),
//   getPayoutHistory: async () => apiRequest(`/seller/payout-history?_=${new Date().getTime()}`, { method: "GET" }),
//   setupPayouts: async (payoutData) => {
//     if (!payoutData) throw new Error("Payout data is required.");
//     return apiRequest("/seller/setup-payouts", { method: "POST", body: JSON.stringify(payoutData) });
//   },
//   getOrders: async (filter, page) => { // Updated to match backend response
//     try {
//         const res = await apiRequest(`/seller/orders?status=${filter}&page=${page}&_=${new Date().getTime()}`, { method: "GET" });
//         console.log("[apiService] sellerService.getOrders: Raw response:", JSON.stringify(res, null, 2));
//         if (res?.success && Array.isArray(res.orders)) { // Check res.orders as per backend update
//             console.log("[apiService] sellerService.getOrders: Orders:", res.orders);
//             return {
//                 orders: res.orders,
//                 totalPages: res.totalPages || 1,
//                 totalOrders: res.totalOrders || 0,
//                 // Add currentPage and limit if your component uses them
//                 currentPage: res.currentPage || page,
//                 limit: res.limit || 10,
//             };
//         }
//         console.warn("[apiService] sellerService.getOrders: Unexpected response structure. Response:", res);
//         return { orders: [], totalPages: 1, totalOrders: 0, currentPage: page, limit: 10 };
//     } catch (error) {
//         console.error("[apiService] sellerService.getOrders: Error:", error.message, "Response Payload:", error.responsePayload);
//         return { orders: [], totalPages: 1, totalOrders: 0, currentPage: page, limit: 10 };
//     }
//   },
//   updateOrderStatus: async (orderId, status) => {
//     if (!orderId || !status) throw new Error("Order ID and status are required.")
//     return apiRequest(`/seller/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status }) })
//   },
//   getPayoutLink: async () => {
//     try {
//         const res = await apiRequest(`/seller/payout-link?_=${new Date().getTime()}`, { method: "GET" });
//         console.log("[apiService] sellerService.getPayoutLink: Response:", res);
//         if (res?.success && res.url) {
//             return res;
//         }
//         console.warn("[apiService] sellerService.getPayoutLink: No valid link found in response:", res);
//         return { success: false, message: res?.message || "No payout link available." };
//     } catch (error) {
//         console.error("[apiService] sellerService.getPayoutLink: Error:", error);
//         return { success: false, message: error.message || "Failed to retrieve payout link." };
//     }
//   },
//   getTopSellers: async (params = {}) => {
//     try {
//         const q = new URLSearchParams(params).toString();
//         const res = await apiRequest(`/seller/top-sellers?${q}&_=${new Date().getTime()}`, { method: "GET" });
//         console.log("[apiService] sellerService.getTopSellers: Raw response:", JSON.stringify(res, null, 2));
//         if (res?.success && Array.isArray(res.data)) {
//             console.log("[apiService] sellerService.getTopSellers: Sellers:", res.data);
//             return res;
//         }
//         console.warn("[apiService] sellerService.getTopSellers: Unexpected response structure. Response:", res);
//         return { success: false, data: [], message: "No top sellers found or unexpected data format." };
//     } catch (error) {
//         console.error("[apiService] sellerService.getTopSellers: Error:", error.message, "Response Payload:", error.responsePayload);
//         throw error;
//     }
//   },
// }


// // Order Service
// export const orderService = {
//   create: async (orderData) => {
//     if (!orderData?.orderItems || !Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
//       throw new Error("Order items must be a non-empty array.")
//     }
//     for (const item of orderData.orderItems) {
//       if (!item.listing || !/^[0-9a-fA-F]{24}$/.test(item.listing)) {
//         throw new Error(`Invalid listing ID: ${item.listing}. Must be a 24-character MongoDB ObjectId.`)
//       }
//       if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
//         throw new Error(`Invalid quantity for listing ${item.listing}. Must be a positive integer.`)
//       }
//     }
//     console.log("[apiService] orderService.create: Sending order data:", JSON.stringify(orderData, null, 2))
//     try {
//       const res = await apiRequest("/orders", { method: "POST", body: JSON.stringify(orderData) })
//       console.log("[apiService] orderService.create: Response:", res)
//       return res
//     } catch (error) {
//       console.error("[apiService] orderService.create: Error:", error.message, "Response Payload:", error.responsePayload, "Stack:", error.stack)
//       throw error
//     }
//   },
//   getMyOrders: async () => {
//     try {
//       const res = await apiRequest(`/orders/my?_=${new Date().getTime()}`, { method: "GET" })
//       console.log("[apiService] orderService.getMyOrders: Response:", res)
//       if (res?.success && Array.isArray(res.data)) {
//         return res;
//       }
//       console.warn("[apiService] orderService.getMyOrders: Unexpected response structure. Response:", res)
//       return { success: false, data: [], message: res?.message || "No orders found or unexpected data format." };
//     } catch (error) {
//       console.error("[apiService] orderService.getMyOrders: Error:", error.message, "Response Payload:", error.responsePayload)
//       return { success: false, data: [], message: error.responsePayload?.message || error.message || "Failed to fetch orders." }
//     }
//   },
//   getOrderById: async (orderId) => {
//     if (!orderId) throw new Error("Order ID is required to fetch details.")
//     return apiRequest(`/orders/${orderId}?_=${new Date().getTime()}`, { method: "GET" })
//   },
// }

// // Chat Service
// export const chatService = {
//   accessChat: async (userId) => {
//     if (!userId) throw new Error("User ID is required to access chat.")
//     return apiRequest("/chats", { method: "POST", body: JSON.stringify({ userId }) })
//   },
//   getMyChats: async () => {
//     const res = await apiRequest(`/chats?_=${new Date().getTime()}`, { method: "GET" })
//     return res?.success && Array.isArray(res.data) ? res.data : []
//   },
//   getMessages: async (chatId) => {
//     if (!chatId) throw new Error("Chat ID is required to fetch messages.")
//     const backendResponse = await apiRequest(`/chats/${chatId}/messages?_=${new Date().getTime()}`, { method: "GET" })
//     if (backendResponse && typeof backendResponse.success === "boolean") {
//         if (backendResponse.success === false) {
//             console.warn(`[apiService] getMessages for chat ${chatId} received { success: false } from backend:`, backendResponse.message);
//         }
//         return backendResponse;
//     } else {
//         console.error(`[apiService] getMessages for chat ${chatId} received an unexpected structure from apiRequest:`, backendResponse);
//         return { success: false, data: [], message: "Unexpected data structure received from server." };
//     }
//   },
//   sendMessage: async (chatId, payload) => {
//     if (!chatId || !payload) throw new Error("Chat ID and message payload are required.")
//     const options = { method: "POST" }
//     let isFormData = false
//     if (payload instanceof FormData) {
//       options.body = payload
//       isFormData = true
//     } else if (typeof payload === "object") {
//       options.body = JSON.stringify(payload)
//     } else {
//       options.body = JSON.stringify({ content: String(payload), type: "text" })
//     }
//     return apiRequest(`/chats/${chatId}/messages`, options, isFormData)
//   },
//   blockUser: async (chatId, userIdToBlock) => {
//     if (!chatId || !userIdToBlock) throw new Error("Chat ID and user ID to block are required.")
//     console.warn(`API call for blocking user ${userIdToBlock} in chat ${chatId} not fully implemented.`)
//     return Promise.resolve({ success: true, message: "User block simulation successful." });
//   },
//   reportUser: async (chatId, reportData) => {
//     if (!chatId || !reportData) throw new Error("Chat ID and report data are required.")
//     console.warn(`API call for reporting user in chat ${chatId} not fully implemented.`, reportData);
//     return Promise.resolve({ success: true, message: "Report submitted simulation successful." });
//   },
//   uploadChatImage: async (imageFile) => {
//     if (!imageFile) throw new Error("Image file is required.");
//     const formData = new FormData();
//     formData.append("chatImage", imageFile);
//     return apiRequest("/upload/chat", { method: "POST", body: formData }, true);
//   },
// }

// // Notification Service
// export const notificationService = {
//   getNotifications: async () => {
//     const res = await apiRequest(`/notifications?_=${new Date().getTime()}`, { method: "GET" });
//     return res?.success ? res : { success: false, notifications: [], unreadCount: 0, message: res?.message || "Failed to fetch notifications." };
//   },
//   markAsRead: async (notificationId) => {
//     if (!notificationId) throw new Error("Notification ID is required.");
//     return apiRequest(`/notifications/${notificationId}/read`, { method: "PUT" });
//   },
// };

// // Review Service
// export const reviewService = {
//     getReviewsForSeller: async (sellerId) => {
//         if (!sellerId) throw new Error("Seller ID is required.");
//         const res = await apiRequest(`/reviews/seller/${sellerId}?_=${new Date().getTime()}`, { method: "GET" });
//         return res?.success && Array.isArray(res.data) ? res.data : [];
//     },
// };

// // Search Service
// export const searchService = {
//     searchGlobal: async (query, type = "all", period = "all") => {
//         if (!query) throw new Error("Search query is required.");
//         const params = new URLSearchParams({ q: query, type, period });
//         return apiRequest(`/search?${params.toString()}&_=${new Date().getTime()}`, { method: "GET" });
//     },
// };

// // Payment Service
// export const paymentService = {
//     createPaymentIntent: async (paymentData) => {
//         if (!paymentData?.orderId || typeof paymentData?.amount !== 'number' || !paymentData?.currency) {
//             throw new Error("Order ID, amount (number), and currency are required for payment intent.");
//         }
//         console.log("[apiService] paymentService.createPaymentIntent: Sending payment data:", JSON.stringify(paymentData, null, 2));
//         try {
//             const res = await apiRequest("/payments/create-payment-intent", {
//                 method: "POST",
//                 body: JSON.stringify(paymentData),
//             });
//             console.log("[apiService] paymentService.createPaymentIntent: Response:", res);
//             return res;
//         } catch (error) {
//             console.error("[apiService] paymentService.createPaymentIntent: Error:", error.message, "Response Payload:", error.responsePayload);
//             throw error;
//         }
//     },
//     // ADDED FUNCTION for verification checkout session
//     createVerificationCheckoutSession: async (data) => {
//         // data would typically include { userId, email }
//         // Backend creates a Stripe Checkout session for a $10 verification product.
//         console.log("[apiService] paymentService.createVerificationCheckoutSession: Sending data:", JSON.stringify(data, null, 2));
//         try {
//             // Ensure your backend has this endpoint: /api/stripe/create-verification-checkout-session
//             const res = await apiRequest("/stripe/create-verification-checkout-session", {
//                 method: "POST",
//                 body: JSON.stringify(data),
//             });
//             console.log("[apiService] paymentService.createVerificationCheckoutSession: Response:", res);
//             return res; // Expects { success: true, sessionId: 'STRIPE_SESSION_ID' }
//         } catch (error) {
//             console.error("[apiService] paymentService.createVerificationCheckoutSession: Error:", error.message, "Response Payload:", error.responsePayload);
//             // apiRequest already handles toasting the error
//             throw error;
//         }
//     },
// };


// // Stripe Connect Service for Payouts
// export const stripeConnectService = {
//     createConnectAccount: async (accountData) => {
//         if (!accountData) throw new Error("Account data is required.");
//         console.log("[stripeConnectService] Creating connect account:", accountData);
//         return apiRequest("/stripe-connect/account/create", {
//             method: "POST",
//             body: JSON.stringify(accountData),
//         });
//     },
//     getAccountStatus: async () => {
//         console.log("[stripeConnectService] Getting account status");
//         return apiRequest("/stripe-connect/account/status", { method: "GET" });
//     },
//     getOnboardingLink: async () => {
//         console.log("[stripeConnectService] Getting onboarding link");
//         return apiRequest("/stripe-connect/account/onboarding-link", { method: "GET" });
//     },
//     getPayoutHistory: async (params = {}) => {
//         console.log("[stripeConnectService] Getting payout history");
//         const queryString = new URLSearchParams(params).toString();
//         const endpoint = `/stripe-connect/payouts${queryString ? `?${queryString}` : ""}`;
//         return apiRequest(endpoint, { method: "GET" });
//     },
//     createPayout: async (amount, currency = "usd") => {
//         if (typeof amount !== 'number' || amount <= 0) throw new Error("Valid amount (number) is required.");
//         return apiRequest("/stripe-connect/create-payout", {
//             method: "POST",
//             body: JSON.stringify({ amount, currency }),
//         });
//     },
//     getBalance: async () => {
//         return apiRequest("/stripe-connect/balance", { method: "GET" });
//     },
//     uploadDocument: async (documentType, file, purpose = "identity_document") => {
//         if (!documentType || !file) throw new Error("Document type and file are required.");
//         const formData = new FormData();
//         formData.append("document", file);
//         formData.append("documentType", documentType);
//         formData.append("purpose", purpose);
//         return apiRequest("/stripe-connect/upload-document", { method: "POST", body: formData }, true);
//     },
//     // Removed createIdentityVerification as it's usually part of onboarding
//     // Removed createAccountLink as getOnboardingLink serves a similar purpose for new accounts
// };


// export { apiRequest }


//from grok

import { toast } from "react-toastify";
import NewCustomToast from "../components/NewCustomToast";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const textData = await response.text();
    if (!response.ok) {
      try {
        const errorJson = JSON.parse(textData);
        const error = new Error(errorJson?.message || textData || `HTTP error! status: ${response.status}`);
        error.responsePayload = errorJson;
        error.status = response.status;
        throw error;
      } catch (e) {
        const error = new Error(textData || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
    }
    return textData;
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
    console.error("[apiService] API Error Response (JSON):", data);
    const error = new Error(errorMessage);
    error.responsePayload = data;
    error.status = response.status;
    throw error;
  }
  return data;
};

const apiRequest = async (endpoint, options = {}, isFormData = false) => {
  const token = localStorage.getItem("token");
  console.log(`[apiService] Token retrieved from localStorage: ${token ? 'Present' : 'Missing'}`);
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token &&
      typeof token === "string" &&
      token !== "undefined" &&
      token !== "null" && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const config = {
    ...options,
    headers,
    body: (options.method === 'GET' || options.method === 'HEAD') ? undefined : options.body,
  };

  try {
    console.log(`[apiService] Sending request: ${options.method || "GET"} ${API_BASE_URL}${endpoint}`, {
      headers: config.headers,
      method: config.method,
      body: isFormData && config.body instanceof FormData ? Object.fromEntries(config.body) : config.body,
    });
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `[apiService] API request failed: ${options.method || "GET"} ${API_BASE_URL}${endpoint}`,
      error.message,
      error.stack,
    );
    const toastMessage =
      error.responsePayload?.message ||
      error.message ||
      "An unexpected error occurred. Please check your connection or try again later.";

    if (typeof NewCustomToast === 'function') {
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="API Request Error" text={toastMessage} closeToast={closeToast} />
      ));
    } else {
      toast.error(`API Request Error: ${toastMessage}`);
    }
    throw error;
  }
};

// Authentication Service
export const authService = {
  login: async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Email and password are required.");
    }
    return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
  },
  register: async (userData) => {
    if (!userData?.email || !userData?.password || !userData?.name) {
      throw new Error("Name, email, and password are required.");
    }
    return apiRequest("/auth/register", { method: "POST", body: JSON.stringify(userData) });
  },
  logout: async () => apiRequest("/auth/logout", { method: "POST" }),
  getCurrentUser: async () => apiRequest("/auth/me", { method: "GET" }),
  checkEmail: async (email) => {
    if (!email) throw new Error("Email is required.");
    return apiRequest(`/auth/check-email?email=${encodeURIComponent(email)}`, { method: "GET" });
  },
};

// User Service
export const userService = {
  getUser: async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    return apiRequest(`/users/${userId}`, { method: "GET" });
  },
  getPublicProfileById: async (sellerId) => {
    if (!sellerId) throw new Error("Seller ID is required.");
    return apiRequest(`/users/public-profile/${sellerId}`, { method: "GET" });
  },
  updateUser: async (userId, userData) => {
    if (!userId) throw new Error("User ID is required.");
    const isFormData = userData instanceof FormData;
    return apiRequest(
      `/users/${userId}`,
      {
        method: "PUT",
        body: isFormData ? userData : JSON.stringify(userData),
      },
      isFormData,
    );
  },
  deleteUser: async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    return apiRequest(`/users/${userId}`, { method: "DELETE" });
  },
};

// Listings (Subscriptions) Service
export const listingService = {
  create: async (formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("FormData is required for creating a listing.");
    }
    return apiRequest("/subscriptions", { method: "POST", body: formData }, true);
  },
  getMyListings: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/subscriptions/my${query ? `?${query}` : ''}`;
      const res = await apiRequest(endpoint, { method: "GET" });
      console.log("[apiService] listingService.getMyListings: Response:", JSON.stringify(res, null, 2));
      if (res?.success && Array.isArray(res.data)) {
        return res;
      }
      if (Array.isArray(res)) {
        console.log("[apiService] listingService.getMyListings: Fallback to direct array response");
        return { success: true, data: res, pagination: {} };
      }
      if (res?.listings && Array.isArray(res.listings)) {
        console.log("[apiService] listingService.getMyListings: Fallback to res.listings");
        return { success: true, data: res.listings, pagination: res.pagination || {} };
      }
      console.warn("[apiService] listingService.getMyListings: Unexpected response structure. Response:", res);
      toast(({ closeToast }) => (
        <NewCustomToast type="warning" headline="Listings Info" text={res?.message || "No listings found or unexpected data format."} closeToast={closeToast} />
      ));
      return { success: true, data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] listingService.getMyListings: Error:", error.message, "Response Payload:", error.responsePayload);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Listings Error" text={error.responsePayload?.message || error.message || "Failed to fetch listings."} closeToast={closeToast} />
      ));
      return { success: false, data: [], pagination: {} };
    }
  },
  update: async (id, formData) => {
    if (!id || !(formData instanceof FormData)) {
      throw new Error("Listing ID and FormData are required for updating a listing.");
    }
    return apiRequest(`/subscriptions/${id}`, { method: "PUT", body: formData }, true);
  },
  delete: async (id) => {
    if (!id) throw new Error("Listing ID is required.");
    return apiRequest(`/subscriptions/${id}`, { method: "DELETE" });
  },
  getApproved: async () => {
    console.log("[apiService] listingService.getApproved: Fetching approved listings...");
    try {
      const responseData = await apiRequest("/subscriptions?status=approved", { method: "GET" });
      console.log("[apiService] listingService.getApproved: Raw response:", responseData);
      if (responseData && responseData.success && Array.isArray(responseData.data)) {
        return responseData;
      }
      if (Array.isArray(responseData)) {
        return { success: true, data: responseData };
      }
      if (responseData?.listings && Array.isArray(responseData.listings)) {
        return { success: true, data: responseData.listings };
      }
      console.warn("[apiService] listingService.getApproved: Received unexpected data type or structure. Returning empty array. Response:", responseData);
      return { success: true, data: [] };
    } catch (error) {
      console.error("[apiService] listingService.getApproved: Error:", error);
      return { success: false, data: [] };
    }
  },
  getById: async (id) => {
    if (!id) throw new Error("Listing ID is required.");
    const res = await apiRequest(`/subscriptions/${id}`, { method: "GET" });
    return res?.success ? res.data : null;
  },
  getBySeller: async (sellerId) => {
    if (!sellerId) throw new Error("Seller ID is required.");
    const res = await apiRequest(`/subscriptions/seller/${sellerId}`, { method: "GET" });
    return res?.success && Array.isArray(res.data) ? res.data : [];
  },
  getByCategory: async (categoryName) => {
    if (!categoryName) throw new Error("Category name is required.");
    const enc = encodeURIComponent(categoryName);
    const res = await apiRequest(`/subscriptions/category/${enc}`, { method: "GET" });
    console.log(`[apiService] listingService.getByCategory ('${categoryName}') response:`, res);
    if (res?.success && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    console.warn(`[apiService] listingService.getByCategory ('${categoryName}') did not return expected structure. Returning empty array.`);
    return [];
  },
  getHomepageFeatured: async () => {
    console.log("[apiService] listingService.getHomepageFeatured: Fetching homepage featured listings...");
    try {
      const responseData = await apiRequest("/subscriptions/homepage-featured", { method: "GET" });
      console.log("[apiService] listingService.getHomepageFeatured: Raw response:", responseData);
      if (responseData && responseData.success && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) return responseData;
      console.warn("[apiService] listingService.getHomepageFeatured: Unexpected response structure:", responseData);
      return [];
    } catch (error) {
      console.error("[apiService] listingService.getHomepageFeatured: Error:", error);
      return [];
    }
  },
};

// Admin Service
export const adminService = {
  getPendingListings: async () => {
    const res = await apiRequest("/admin/listings/pending", { method: "GET" });
    return res?.success && Array.isArray(res.data) ? res.data : [];
  },
  approveListing: async (id) => {
    if (!id) throw new Error("Listing ID is required.");
    return apiRequest(`/admin/listings/${id}/approve`, { method: "PUT" });
  },
  rejectListing: async (id, reason = "") => {
    if (!id) throw new Error("Listing ID is required.");
    return apiRequest(`/admin/listings/${id}/reject`, { method: "PUT", body: JSON.stringify({ reason }) });
  },
  getAllListings: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await apiRequest(`/admin/listings?${q}`, { method: "GET" });
    return res?.success ? res : { data: [], pagination: {} };
  },
  getFeaturedSubscriptions: async () => {
    try {
      const res = await apiRequest("/subscriptions/featured", { method: "GET" });
      return res?.success ? res : { data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] adminService.getFeaturedSubscriptions: Error:", error.message, "Response Payload:", error.responsePayload);
      return { data: [], pagination: {} };
    }
  },
  addFeaturedSubscription: async (formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("FormData is required for adding a featured subscription.");
    }
    console.log("[apiService] adminService.addFeaturedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest("/admin/featured-subscriptions", { method: "POST", body: formData }, true);
  },
  updateFeaturedSubscription: async (id, formData) => {
    if (!id || !(formData instanceof FormData)) {
      throw new Error("Valid listing ID and FormData are required for updating a featured subscription.");
    }
    console.log("[apiService] adminService.updateFeaturedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest(`/admin/featured-subscriptions/${id}`, { method: "PUT", body: formData }, true);
  },
  removeFeaturedSubscription: async (id) => {
    if (!id) throw new Error("Valid listing ID is required.");
    return apiRequest(`/admin/featured-subscriptions/${id}`, { method: "DELETE" });
  },
  getHomepageFeaturedSubscriptions: async () => {
    try {
      const res = await apiRequest("/subscriptions/homepage-featured", { method: "GET" });
      console.log("[apiService] adminService.getHomepageFeaturedSubscriptions: Response:", res);
      return res?.success ? res : { data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] adminService.getHomepageFeaturedSubscriptions: Error:", error.message, "Response Payload:", error.responsePayload);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Homepage Featured Error" text={error.responsePayload?.message || error.message || "Failed to fetch homepage featured subscriptions."} closeToast={closeToast} />
      ));
      return { data: [], pagination: {} };
    }
  },
  addHomepageFeaturedSubscription: async (listingId, rank, gradient, border) => {
    if (!listingId || !rank || !gradient || !border) {
      throw new Error("Listing ID, rank, gradient, and border are required.");
    }
    const formData = new FormData();
    formData.append('listingId', listingId);
    formData.append('rank', rank);
    formData.append('gradient', gradient);
    formData.append('border', border);
    console.log("[apiService] adminService.addHomepageFeaturedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest("/admin/homepage-featured", { method: "POST", body: formData }, true);
  },
  updateHomepageFeaturedSubscription: async (id, rank, gradient, border) => {
    if (!id || !rank || !gradient || !border) {
      throw new Error("Listing ID, rank, gradient, and border are required.");
    }
    const formData = new FormData();
    formData.append('rank', rank);
    formData.append('gradient', gradient);
    formData.append('border', border);
    console.log("[apiService] adminService.updateHomepageFeaturedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest(`/admin/homepage-featured/${id}`, { method: "PUT", body: formData }, true);
  },
  removeHomepageFeaturedSubscription: async (id) => {
    if (!id) throw new Error("Valid listing ID is required.");
    return apiRequest(`/admin/homepage-featured/${id}`, { method: "DELETE" });
  },
  getMainRankedSubscriptions: async () => {
    try {
      const res = await apiRequest("/subscriptions?status=approved", { method: "GET" });
      console.log("[apiService] adminService.getMainRankedSubscriptions: Response:", res);
      return res?.success ? res : { data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] adminService.getMainRankedSubscriptions: Error:", error.message, "Response Payload:", error.responsePayload);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Main Ranked Error" text={error.responsePayload?.message || error.message || "Failed to fetch main ranked subscriptions."} closeToast={closeToast} />
      ));
      return { data: [], pagination: {} };
    }
  },
  addMainRankedSubscription: async (listingId, mainRank) => {
    if (!listingId || !mainRank) {
      throw new Error("Listing ID and main rank are required.");
    }
    const formData = new FormData();
    formData.append('listingId', listingId);
    formData.append('mainRank', mainRank);
    console.log("[apiService] adminService.addMainRankedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest("/admin/main-ranked", { method: "POST", body: formData }, true);
  },
  updateMainRankedSubscription: async (id, mainRank) => {
    if (!id || !mainRank) {
      throw new Error("Listing ID and main rank are required.");
    }
    const formData = new FormData();
    formData.append('mainRank', mainRank);
    console.log("[apiService] adminService.updateMainRankedSubscription: FormData:", Object.fromEntries(formData));
    return apiRequest(`/admin/main-ranked/${id}`, { method: "PUT", body: formData }, true);
  },
  removeMainRankedSubscription: async (id) => {
    if (!id) {
      throw new Error("Valid listing ID is required.");
    }
    return apiRequest(`/admin/main-ranked/${id}`, { method: "DELETE" });
  },
  getAllUsers: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await apiRequest(`/admin/users?${q}`, { method: "GET" });
    return res?.success ? res : { data: [], pagination: {} };
  },
  getUserById: async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    const res = await apiRequest(`/admin/users/${userId}`, { method: "GET" });
    return res?.success ? res.data : null;
  },
  toggleUserBlock: async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    return apiRequest(`/admin/users/${userId}/toggle-block`, { method: "PUT" });
  },
  toggleUserVerification: async (userId, status, reason = "") => {
    if (!userId || typeof status !== 'boolean') throw new Error("User ID and verification status (boolean) are required.");
    console.log(`[apiService] adminService.toggleUserVerification: Toggling verification for user ${userId} to status ${status}`);
    try {
      const response = await apiRequest(`/admin/users/${userId}/verification`, {
        method: "PUT",
        body: JSON.stringify({ isVerified: status, verificationReason: reason }),
      });
      console.log(`[apiService] adminService.toggleUserVerification: Success for user ${userId}`, response);
      return response;
    } catch (error) {
      console.error(`[apiService] adminService.toggleUserVerification: Failed for user ${userId}`, error);
      throw error;
    }
  },
  getBlogs: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    try {
      const res = await apiRequest(`/admin/blogs?${q}`, { method: "GET" });
      return res?.success ? res : { data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] adminService.getBlogs: Error:", error.message, "Response Payload:", error.responsePayload);
      return { data: [], pagination: {} };
    }
  },
  createBlog: async (formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("FormData is required for creating a blog.");
    }
    try {
      const res = await apiRequest("/admin/blogs", { method: "POST", body: formData }, true);
      return res;
    } catch (error) {
      console.error("[apiService] adminService.createBlog: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
  updateBlog: async (id, formData) => {
    if (!id || !(formData instanceof FormData)) {
      throw new Error("Blog ID and FormData are required for updating a blog.");
    }
    try {
      const res = await apiRequest(`/admin/blogs/${id}`, { method: "PUT", body: formData }, true);
      return res;
    } catch (error) {
      console.error("[apiService] adminService.updateBlog: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
  deleteBlog: async (id) => {
    if (!id) throw new Error("Blog ID is required.");
    try {
      const res = await apiRequest(`/admin/blogs/${id}`, { method: "DELETE" });
      return res;
    } catch (error) {
      console.error("[apiService] adminService.deleteBlog: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
  getPublicBlogs: async (params = {}) => {
    const q = new URLSearchParams({ ...params, status: "published" }).toString();
    try {
      const res = await apiRequest(`/blogs/public?${q}`, { method: "GET" });
      console.log("[apiService] adminService.getPublicBlogs: Response:", res);
      return res?.success ? res : { data: [], pagination: {} };
    } catch (error) {
      console.error("[apiService] adminService.getPublicBlogs: Error:", error.message, "Response Payload:", error.responsePayload);
      return { data: [], pagination: {} };
    }
  },
};

// Seller Service
export const sellerService = {
  getAnalytics: async (daysParam) => {
    const days = typeof daysParam === "number" ? daysParam : 30;
    return apiRequest(`/seller/analytics?days=${days}`, { method: "GET" });
  },
  getPayoutStatus: async () => apiRequest("/seller/payout-status", { method: "GET" }),
  getPayoutHistory: async () => apiRequest("/seller/payout-history", { method: "GET" }),
  setupPayouts: async (payoutData) => {
    if (!payoutData) throw new Error("Payout data is required.");
    return apiRequest("/seller/setup-payouts", { method: "POST", body: JSON.stringify(payoutData) });
  },
  getOrders: async (filter, page) => {
    try {
      const res = await apiRequest(`/seller/orders?status=${filter}&page=${page}`, { method: "GET" });
      console.log("[apiService] sellerService.getOrders: Raw response:", JSON.stringify(res, null, 2));
      if (res?.success && Array.isArray(res.orders)) {
        console.log("[apiService] sellerService.getOrders: Orders:", res.orders);
        return {
          orders: res.orders,
          totalPages: res.totalPages || 1,
          totalOrders: res.totalOrders || 0,
          currentPage: res.currentPage || page,
          limit: res.limit || 10,
        };
      }
      console.warn("[apiService] sellerService.getOrders: Unexpected response structure. Response:", res);
      return { orders: [], totalPages: 1, totalOrders: 0, currentPage: page, limit: 10 };
    } catch (error) {
      console.error("[apiService] sellerService.getOrders: Error:", error.message, "Response Payload:", error.responsePayload);
      return { orders: [], totalPages: 1, totalOrders: 0, currentPage: page, limit: 10 };
    }
  },
  updateOrderStatus: async (orderId, status) => {
    if (!orderId || !status) throw new Error("Order ID and status are required.");
    return apiRequest(`/seller/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status }) });
  },
  getPayoutLink: async () => {
    try {
      const res = await apiRequest("/seller/payout-link", { method: "GET" });
      console.log("[apiService] sellerService.getPayoutLink: Response:", res);
      if (res?.success && res.url) {
        return res;
      }
      console.warn("[apiService] sellerService.getPayoutLink: No valid link found in response:", res);
      return { success: false, message: res?.message || "No payout link available." };
    } catch (error) {
      console.error("[apiService] sellerService.getPayoutLink: Error:", error);
      return { success: false, message: error.message || "Failed to retrieve payout link." };
    }
  },
  getTopSellers: async (params = {}) => {
    try {
      const q = new URLSearchParams(params).toString();
      const res = await apiRequest(`/seller/top-sellers?${q}`, { method: "GET" });
      console.log("[apiService] sellerService.getTopSellers: Raw response:", JSON.stringify(res, null, 2));
      if (res?.success && Array.isArray(res.data)) {
        console.log("[apiService] sellerService.getTopSellers: Sellers:", res.data);
        return res;
      }
      console.warn("[apiService] sellerService.getTopSellers: Unexpected response structure. Response:", res);
      return { success: false, data: [], message: "No top sellers found or unexpected data format." };
    } catch (error) {
      console.error("[apiService] sellerService.getTopSellers: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
};

// Order Service
export const orderService = {
  create: async (orderData) => {
    if (!orderData?.orderItems || !Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
      throw new Error("Order items must be a non-empty array.");
    }
    for (const item of orderData.orderItems) {
      if (!item.listing) {
        throw new Error(`Invalid listing ID: ${item.listing}. Must be provided.`);
      }
      if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error(`Invalid quantity for listing ${item.listing}. Must be a positive integer.`);
      }
    }
    console.log("[apiService] orderService.create: Sending order data:", JSON.stringify(orderData, null, 2));
    try {
      const res = await apiRequest("/orders", { method: "POST", body: JSON.stringify(orderData) });
      console.log("[apiService] orderService.create: Response:", res);
      return res;
    } catch (error) {
      console.error("[apiService] orderService.create: Error:", error.message, "Response Payload:", error.responsePayload, "Stack:", error.stack);
      throw error;
    }
  },
  getMyOrders: async () => {
    try {
      const res = await apiRequest("/orders/my", { method: "GET" });
      console.log("[apiService] orderService.getMyOrders: Response:", res);
      if (res?.success && Array.isArray(res.data)) {
        return res;
      }
      console.warn("[apiService] orderService.getMyOrders: Unexpected response structure. Response:", res);
      return { success: false, data: [], message: res?.message || "No orders found or unexpected data format." };
    } catch (error) {
      console.error("[apiService] orderService.getMyOrders: Error:", error.message, "Response Payload:", error.responsePayload);
      return { success: false, data: [], message: error.responsePayload?.message || error.message || "Failed to fetch orders." };
    }
  },
  getOrderById: async (orderId) => {
    if (!orderId) throw new Error("Order ID is required to fetch details.");
    return apiRequest(`/orders/${orderId}`, { method: "GET" });
  },
};

// Chat Service
export const chatService = {
  accessChat: async (userId) => {
    if (!userId) throw new Error("User ID is required to access chat.");
    return apiRequest("/chats", { method: "POST", body: JSON.stringify({ userId }) });
  },
  getMyChats: async () => {
    const res = await apiRequest("/chats", { method: "GET" });
    return res?.success && Array.isArray(res.data) ? res.data : [];
  },
  getMessages: async (chatId) => {
    if (!chatId) throw new Error("Chat ID is required to fetch messages.");
    const backendResponse = await apiRequest(`/chats/${chatId}/messages`, { method: "GET" });
    if (backendResponse && typeof backendResponse.success === "boolean") {
      if (backendResponse.success === false) {
        console.warn(`[apiService] getMessages for chat ${chatId} received { success: false } from backend:`, backendResponse.message);
      }
      return backendResponse;
    } else {
      console.error(`[apiService] getMessages for chat ${chatId} received an unexpected structure from apiRequest:`, backendResponse);
      return { success: false, data: [], message: "Unexpected data structure received from server." };
    }
  },
  sendMessage: async (chatId, payload) => {
    if (!chatId || !payload) throw new Error("Chat ID and message payload are required.");
    const options = { method: "POST" };
    let isFormData = false;
    if (payload instanceof FormData) {
      options.body = payload;
      isFormData = true;
    } else if (typeof payload === "object") {
      options.body = JSON.stringify(payload);
    } else {
      options.body = JSON.stringify({ content: String(payload), type: "text" });
    }
    return apiRequest(`/chats/${chatId}/messages`, options, isFormData);
  },
  blockUser: async (chatId, userIdToBlock) => {
    if (!chatId || !userIdToBlock) throw new Error("Chat ID and user ID to block are required.");
    console.warn(`API call for blocking user ${userIdToBlock} in chat ${chatId} not fully implemented.`);
    return Promise.resolve({ success: true, message: "User block simulation successful." });
  },
  reportUser: async (chatId, reportData) => {
    if (!chatId || !reportData) throw new Error("Chat ID and report data are required.");
    console.warn(`API call for reporting user in chat ${chatId} not fully implemented.`, reportData);
    return Promise.resolve({ success: true, message: "Report submitted simulation successful." });
  },
  uploadChatImage: async (imageFile) => {
    if (!imageFile) throw new Error("Image file is required.");
    const formData = new FormData();
    formData.append("chatImage", imageFile);
    return apiRequest("/upload/chat", { method: "POST", body: formData }, true);
  },
};

// Notification Service
export const notificationService = {
  getNotifications: async () => {
    const res = await apiRequest("/notifications", { method: "GET" });
    return res?.success ? res : { success: false, notifications: [], unreadCount: 0, message: res?.message || "Failed to fetch notifications." };
  },
  markAsRead: async (notificationId) => {
    if (!notificationId) throw new Error("Notification ID is required.");
    return apiRequest(`/notifications/${notificationId}/read`, { method: "PUT" });
  },
};

// Review Service
export const reviewService = {
  getReviewsForSeller: async (sellerId) => {
    if (!sellerId) throw new Error("Seller ID is required.");
    const res = await apiRequest(`/reviews/seller/${sellerId}`, { method: "GET" });
    return res?.success && Array.isArray(res.data) ? res.data : [];
  },
};

// Search Service
export const searchService = {
  searchGlobal: async (query, type = "all", period = "all") => {
    if (!query) throw new Error("Search query is required.");
    const params = new URLSearchParams({ q: query, type, period });
    return apiRequest(`/search?${params.toString()}`, { method: "GET" });
  },
};

// Payment Service
export const paymentService = {
  createPaymentIntent: async (paymentData) => {
    if (!paymentData?.orderId || typeof paymentData?.amount !== 'number' || !paymentData?.currency) {
      throw new Error("Order ID, amount (number), and currency are required for payment intent.");
    }
    console.log("[apiService] paymentService.createPaymentIntent: Sending payment data:", JSON.stringify(paymentData, null, 2));
    try {
      const res = await apiRequest("/payments/create-payment-intent", {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
      console.log("[apiService] paymentService.createPaymentIntent: Response:", res);
      return res;
    } catch (error) {
      console.error("[apiService] paymentService.createPaymentIntent: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
  createVerificationCheckoutSession: async (data) => {
    console.log("[apiService] paymentService.createVerificationCheckoutSession: Sending data:", JSON.stringify(data, null, 2));
    try {
      const res = await apiRequest("/stripe/create-verification-checkout-session", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("[apiService] paymentService.createVerificationCheckoutSession: Response:", res);
      return res;
    } catch (error) {
      console.error("[apiService] paymentService.createVerificationCheckoutSession: Error:", error.message, "Response Payload:", error.responsePayload);
      throw error;
    }
  },
};

// Stripe Connect Service for Payouts
export const stripeConnectService = {
  createConnectAccount: async (accountData) => {
    if (!accountData) throw new Error("Account data is required.");
    console.log("[stripeConnectService] Creating connect account:", accountData);
    return apiRequest("/stripe-connect/account/create", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  },
  getAccountStatus: async () => {
    console.log("[stripeConnectService] Getting account status");
    return apiRequest("/stripe-connect/account/status", { method: "GET" });
  },
  getOnboardingLink: async () => {
    console.log("[stripeConnectService] Getting onboarding link");
    return apiRequest("/stripe-connect/account/onboarding-link", { method: "GET" });
  },
  getPayoutHistory: async (params = {}) => {
    console.log("[stripeConnectService] Getting payout history");
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/stripe-connect/payouts${queryString ? `?${queryString}` : ""}`;
    return apiRequest(endpoint, { method: "GET" });
  },
  createPayout: async (amount, currency = "usd") => {
    if (typeof amount !== 'number' || amount <= 0) throw new Error("Valid amount (number) is required.");
    return apiRequest("/stripe-connect/create-payout", {
      method: "POST",
      body: JSON.stringify({ amount, currency }),
    });
  },
  getBalance: async () => {
    return apiRequest("/stripe-connect/balance", { method: "GET" });
  },
  uploadDocument: async (documentType, file, purpose = "identity_document") => {
    if (!documentType || !file) throw new Error("Document type and file are required.");
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);
    formData.append("purpose", purpose);
    return apiRequest("/stripe-connect/upload-document", { method: "POST", body: formData }, true);
  },
  submitMainRankedBid: async (data) => {
    return apiRequest("/subscriptions/promote/main-ranked", { method: "POST", body: JSON.stringify(data) });
  },
  submitHomepageFeaturedBid: async (data) => {
    return apiRequest("/subscriptions/promote/homepage-featured", { method: "POST", body: JSON.stringify(data) });
  },
};

export { apiRequest };