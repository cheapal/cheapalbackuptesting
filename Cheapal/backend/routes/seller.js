// import express from "express"
// import { protect, restrictTo } from "../middleware/auth.js" // Ensure restrictTo is correctly implemented
// import Order from "../models/Order.js"
// // Listing model might not be needed here if not directly used, but keep if populated fields are extensive
// import Listing from "../models/Listing.js"; // Import Listing model for population
// import mongoose from "mongoose"; // For ObjectId validation

// const router = express.Router()

// // Apply authentication middleware to all routes in this router
// router.use(protect)
// // Apply role restriction. If some routes are for other roles, apply restrictTo individually.
// router.use(restrictTo("seller"));

// // --- Controller Functions ---

// const getAnalyticsData = async (req, res) => {
//   try {
//     const { days = "30" } = req.query; // Default to string "30"
//     const sellerId = req.user._id
//     const daysInt = Number.parseInt(days, 10); // Ensure base 10

//     if (isNaN(daysInt) || daysInt <= 0) {
//         return res.status(400).json({ success: false, message: "Invalid 'days' parameter. Must be a positive integer." });
//     }

//     const endDate = new Date()
//     const startDate = new Date()
//     startDate.setDate(endDate.getDate() - daysInt)
//     startDate.setHours(0, 0, 0, 0); // Start of the day
//     endDate.setHours(23, 59, 59, 999); // End of the day


//     console.log(`[SellerAnalytics] Fetching for seller: ${sellerId}, period: ${daysInt} days`)
//     console.log(`[SellerAnalytics] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)

//     const currentPeriodOrders = await Order.find({
//       "orderItems.seller": sellerId,
//       status: { $in: ["completed", "active", "processing"] }, // Consider relevant statuses for revenue
//       createdAt: { $gte: startDate, $lte: endDate },
//     }).populate("orderItems.listing", "title category price");

//     let revenue = 0
//     let orderItemCount = 0
//     const uniqueOrderIds = new Set();
//     const uniqueCustomers = new Set()
//     const categoryData = {}

//     currentPeriodOrders.forEach((order) => {
//       let sellerInThisOrder = false;
//       order.orderItems.forEach((item) => {
//         if (item.seller && item.seller.toString() === sellerId.toString()) {
//           const itemQuantity = item.quantity || 1;
//           const itemPrice = item.price || 0;
//           revenue += itemPrice * itemQuantity;
//           orderItemCount += itemQuantity;
//           sellerInThisOrder = true;

//           const category = item.listing?.category || item.categorySnapshot || "other";
//           categoryData[category] = (categoryData[category] || 0) + itemQuantity;
//         }
//       });
//       if (sellerInThisOrder) {
//         uniqueOrderIds.add(order._id.toString());
//         uniqueCustomers.add(order.user.toString());
//       }
//     });

//     const distinctOrderCount = uniqueOrderIds.size;
//     const avgOrderValue = distinctOrderCount > 0 ? revenue / distinctOrderCount : 0
//     const uniqueCustomerCount = uniqueCustomers.size

//     const prevEndDate = new Date(startDate)
//     prevEndDate.setDate(prevEndDate.getDate() -1);
//     prevEndDate.setHours(23, 59, 59, 999);
//     const prevStartDate = new Date(prevEndDate)
//     prevStartDate.setDate(prevEndDate.getDate() - daysInt + 1)
//     prevStartDate.setHours(0,0,0,0);


//     console.log(`[SellerAnalytics] Previous period date range: ${prevStartDate.toISOString()} to ${prevEndDate.toISOString()}`)

//     const previousPeriodOrders = await Order.find({
//       "orderItems.seller": sellerId,
//       status: { $in: ["completed", "active", "processing"] },
//       createdAt: { $gte: prevStartDate, $lte: prevEndDate },
//     }).populate("orderItems.listing", "price");

//     let prevRevenue = 0
//     let prevOrderItemCount = 0
//     const prevUniqueOrderIds = new Set();
//     const prevUniqueCustomers = new Set()

//     previousPeriodOrders.forEach((order) => {
//       let sellerInThisPrevOrder = false;
//       order.orderItems.forEach((item) => {
//         if (item.seller && item.seller.toString() === sellerId.toString()) {
//           const itemQuantity = item.quantity || 1;
//           const itemPrice = item.price || 0;
//           prevRevenue += itemPrice * itemQuantity;
//           prevOrderItemCount += itemQuantity;
//           sellerInThisPrevOrder = true;
//         }
//       });
//       if(sellerInThisPrevOrder) {
//         prevUniqueOrderIds.add(order._id.toString());
//         prevUniqueCustomers.add(order.user.toString());
//       }
//     });
//     const prevDistinctOrderCount = prevUniqueOrderIds.size;
//     const prevAvgOrderValue = prevDistinctOrderCount > 0 ? prevRevenue / prevDistinctOrderCount : 0
//     const prevUniqueCustomerCount = prevUniqueCustomers.size

//     const revenueChange = prevRevenue > 0 ? parseFloat(((revenue - prevRevenue) / prevRevenue * 100).toFixed(2)) : (revenue > 0 ? 100 : 0);
//     const orderChange = prevDistinctOrderCount > 0 ? parseFloat(((distinctOrderCount - prevDistinctOrderCount) / prevDistinctOrderCount * 100).toFixed(2)) : (distinctOrderCount > 0 ? 100 : 0);
//     const customerChange = prevUniqueCustomerCount > 0 ? parseFloat(((uniqueCustomerCount - prevUniqueCustomerCount) / prevUniqueCustomerCount * 100).toFixed(2)) : (uniqueCustomerCount > 0 ? 100 : 0);
//     const avgOrderValueChange = prevAvgOrderValue > 0 ? parseFloat(((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue * 100).toFixed(2)) : (avgOrderValue > 0 ? 100 : 0);

//     const revenueByMonth = []
//     const monthlyData = {}
//     currentPeriodOrders.forEach((order) => {
//       const month = order.createdAt.toLocaleString('default', { month: 'short' });
//       const year = order.createdAt.getFullYear();
//       const key = `${month} ${year}`;
//       if (!monthlyData[key]) { monthlyData[key] = 0 }
//       order.orderItems.forEach((item) => {
//         if (item.seller && item.seller.toString() === sellerId.toString()) {
//           monthlyData[key] += (item.price || 0) * (item.quantity || 1);
//         }
//       });
//     });
//     Object.entries(monthlyData).forEach(([label, value]) => {
//       revenueByMonth.push({ label, value: parseFloat(value.toFixed(2)) })
//     });

//     const ordersByCategory = Object.entries(categoryData).map(([category, count]) => ({
//       label: category, value: count,
//     }));

//     const customerRetention = [
//       { label: "Returning", value: Math.floor(uniqueCustomerCount * 0.6), color: "#10B981" },
//       { label: "New", value: Math.ceil(uniqueCustomerCount * 0.4), color: "#EF4444" },
//     ];

//     const analyticsData = {
//       revenue: { value: parseFloat(revenue.toFixed(2)), change: revenueChange },
//       orders: { value: distinctOrderCount, change: orderChange },
//       customers: { value: uniqueCustomerCount, change: customerChange },
//       avgOrderValue: { value: parseFloat(avgOrderValue.toFixed(2)), change: avgOrderValueChange },
//       revenueByMonth,
//       ordersByCategory,
//       customerRetention,
//     }
//     console.log(`[SellerAnalytics] Analytics calculated successfully for seller ${sellerId}`);
//     res.status(200).json({ success: true, data: analyticsData })
//   } catch (error) {
//     console.error("[SellerAnalytics] Error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch analytics data",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     })
//   }
// }

// const getMyOrders = async (req, res) => {
//   try {
//     const { status = "all", page = 1, limit = 10 } = req.query
//     const sellerId = req.user._id
//     const pageInt = Number.parseInt(page, 10) || 1;
//     const limitInt = Number.parseInt(limit, 10) || 10;
//     const skip = (pageInt - 1) * limitInt;

//     console.log(`[SellerGetMyOrders] Fetching orders for seller: ${sellerId}, status: ${status}, page: ${pageInt}, limit: ${limitInt}`)

//     const matchCriteria = {
//       "orderItems.seller": sellerId,
//     };

//     if (status !== "all") {
//       matchCriteria.status = status;
//     }

//     const ordersFromDB = await Order.find(matchCriteria)
//       .populate("user", "name avatar") // Populate buyer details - REMOVED email
//       .populate({
//           path: "orderItems.listing",
//           model: "Listing",
//           select: "title category image price duration"
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limitInt)
//       .lean();

//     const transformedSellerItems = [];
//     ordersFromDB.forEach((order) => {
//       console.log(`[SellerGetMyOrders] Processing order ID: ${order._id}, User object:`, order.user);

//       order.orderItems.forEach((item) => {
//         if (item.seller && item.seller.toString() === sellerId.toString()) {
//           const itemQuantity = item.quantity || 1;
//           const unitPrice = item.price || 0; // This is the snapshotted price at time of order

//           transformedSellerItems.push({
//             _id: order._id, // Main order ID
//             orderIdShort: order._id.toString().slice(-8), // Short ID for display
//             itemId: item._id, // ID of the specific orderItem
//             listingId: item.listing?._id, // ID of the actual listing
//             listingTitle: item.listing?.title || item.title || "Listing Data Missing",
//             category: item.listing?.category || item.categorySnapshot || "N/A",
//             image: item.listing?.image || item.image,
//             buyer: order.user ? {
//                 _id: order.user._id,
//                 name: order.user.name || "N/A",
//                 // email: order.user.email || "N/A", // REMOVED buyerEmail
//                 avatar: order.user.avatar
//             } : { name: "Unknown Buyer", avatar: null }, // Default if order.user is null/undefined
//             unitPrice: unitPrice,
//             quantity: itemQuantity,
//             amount: parseFloat((unitPrice * itemQuantity).toFixed(2)), // RENAMED itemTotalAmount to amount
//             status: order.status, // Overall order status
//             createdAt: order.createdAt,
//             paymentMethod: order.paymentMethod,
//           });
//         }
//       });
//     });

//     const totalMatchingOrders = await Order.countDocuments(matchCriteria);
//     const totalPages = Math.ceil(totalMatchingOrders / limitInt);

//     console.log(`[SellerGetMyOrders] Found ${transformedSellerItems.length} items sold by seller across ${totalMatchingOrders} orders.`);

//     res.status(200).json({
//       success: true,
//       orders: transformedSellerItems,
//       totalPages: totalPages,
//       totalOrders: totalMatchingOrders,
//       currentPage: pageInt,
//       limit: limitInt
//     });
//   } catch (error) {
//     console.error("[SellerGetMyOrders] Error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch seller orders",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     })
//   }
// }

// const getPayoutStatus = async (req, res) => {
//   try {
//     const sellerId = req.user._id
//     console.log("[SellerGetPayoutStatus] Fetching payout status for user:", sellerId)

//     const completedOrders = await Order.find({
//       "orderItems.seller": sellerId,
//       status: "completed",
//     });

//     let availableBalance = 0;
//     completedOrders.forEach((order) => {
//       order.orderItems.forEach((item) => {
//         if (item.seller && item.seller.toString() === sellerId.toString()) {
//           availableBalance += (item.price || 0) * (item.quantity || 1);
//         }
//       });
//     });

//     const payoutData = {
//       status: "active",
//       balance: parseFloat(availableBalance.toFixed(2)),
//       currency: "usd",
//       nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//       accountConnected: true,
//       minimumPayout: 10.00,
//     };

//     res.status(200).json({ success: true, data: payoutData });
//   } catch (error) {
//     console.error("[SellerGetPayoutStatus] Error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch payout status",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     })
//   }
// }

// const getPayoutHistory = async (req, res) => {
//   try {
//     const sellerId = req.user._id
//     console.log("[SellerGetPayoutHistory] Fetching payout history for user:", sellerId)

//     const payoutHistory = [
//       { id: `po_mock_${sellerId}_1`, amount: 100.00, currency: "usd", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "paid", method: "bank_transfer", arrival_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
//       { id: `po_mock_${sellerId}_2`, amount: 50.00, currency: "usd", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: "pending", method: "bank_transfer", arrival_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
//     ];

//     res.status(200).json({ success: true, data: payoutHistory });
//   } catch (error) {
//     console.error("[SellerGetPayoutHistory] Error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch payout history",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     })
//   }
// }

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const sellerId = req.user._id;

//     console.log(`[SellerUpdateOrderStatus] Updating order ${orderId} to status ${status} for seller ${sellerId}`);

//     const validStatuses = ["pending", "processing", "completed", "cancelled", "shipped"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
//       });
//     }

//     const order = await Order.findOne({ _id: orderId, "orderItems.seller": sellerId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found or you do not have permission to update it.",
//       });
//     }

//     order.status = status;
//     order.updatedAt = Date.now();
//     await order.save();

//     console.log(`[SellerUpdateOrderStatus] Order ${orderId} status updated to ${status}`);

//     if (req.io && order.user) {
//         const buyerRoom = `user_${order.user.toString()}`;
//         req.io.to(buyerRoom).emit('order_status_updated', {
//             orderId: order._id,
//             status: order.status,
//             message: `The status of your order #${order._id.toString().slice(-8)} has been updated to ${status}.`
//         });
//         console.log(`[SellerUpdateOrderStatus] Emitted order_status_updated to buyer room: ${buyerRoom}`);
//     }

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: { _id: orderId, status: order.status },
//     });
//   } catch (error) {
//     console.error("[SellerUpdateOrderStatus] Error:", error);
//     if (error.name === 'CastError') {
//         return res.status(400).json({ success: false, message: "Invalid Order ID format." });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Failed to update order status",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// const setupPayouts = async (req, res) => {
//   try {
//     const { country, currency, email } = req.body
//     const sellerId = req.user._id

//     console.log(`[SellerSetupPayouts] Initiating for seller ${sellerId}:`, { country, currency, email })

//     if (!country || !currency || !email) {
//       return res.status(400).json({ success: false, message: "Country, currency, and email are required." });
//     }

//     const onboardingUrl = `https://connect.stripe.com/setup/s/test_onboarding_${sellerId}?user_email=${encodeURIComponent(email)}&country=${country}&currency=${currency}`;
//     console.log(`[SellerSetupPayouts] Mock onboarding URL: ${onboardingUrl}`);
//     res.status(200).json({ success: true, message: "Payout setup initiated.", onboardingUrl });
//   } catch (error) {
//     console.error("[SellerSetupPayouts] Error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to setup payouts",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     })
//   }
// }

// const requestPayout = async (req, res) => {
//   try {
//     const { amount, method = "bank_transfer", currency = "usd" } = req.body;
//     const sellerId = req.user._id;
//     console.log(`[SellerRequestPayout] Request from ${sellerId}:`, { amount, method, currency });

//     const numericAmount = parseFloat(amount);
//     if (isNaN(numericAmount) || numericAmount < 10) {
//       return res.status(400).json({ success: false, message: "Invalid amount. Minimum payout is $10.00." });
//     }
//     const mockPayoutId = `payout_mock_${sellerId}_${Date.now()}`;
//     console.log(`[SellerRequestPayout] Mock payout created: ${mockPayoutId}`);
//     res.status(200).json({
//       success: true,
//       message: "Payout requested successfully.",
//       data: { payoutId: mockPayoutId, status: "pending", amount: numericAmount, method, currency, estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
//     });
//   } catch (error) {
//     console.error("[SellerRequestPayout] Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to request payout",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// const getTopSellers = async (req, res) => {
//   try {
//     const { period = "all", limit = 10 } = req.query;
//     console.log("[getTopSellersPublic] Fetching top sellers for period:", period, "limit:", limit);

//     let dateFilter = {};
//     const now = new Date();
//     if (period === "7days") { dateFilter = { createdAt: { $gte: new Date(new Date().setDate(now.getDate() - 7)) } }; }
//     else if (period === "30days") { dateFilter = { createdAt: { $gte: new Date(new Date().setMonth(now.getMonth() - 1)) } }; }

//     const topSellersData = await Order.aggregate([
//       { $match: { status: "completed", ...dateFilter } },
//       { $unwind: "$orderItems" },
//       {
//         $group: {
//           _id: "$orderItems.seller",
//           totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
//           totalSales: { $sum: "$orderItems.quantity" },
//           distinctOrders: { $addToSet: "$_id" }
//         }
//       },
//       { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "sellerDetails" } },
//       { $unwind: "$sellerDetails" },
//       {
//         $project: {
//           _id: 1, name: "$sellerDetails.name", avatar: "$sellerDetails.avatar",
//           handle: "$sellerDetails.handle", totalRevenue: 1, totalSales: 1,
//           distinctOrderCount: { $size: "$distinctOrders" }
//         }
//       },
//       { $sort: { totalRevenue: -1 } },
//       { $limit: parseInt(limit, 10) }
//     ]);

//     console.log(`[getTopSellersPublic] Found ${topSellersData.length} top sellers`);
//     res.status(200).json({
//       success: true, data: topSellersData,
//       message: topSellersData.length ? "Top sellers fetched successfully" : "No seller data for period.",
//     });
//   } catch (error) {
//     console.error("[getTopSellersPublic] Error:", error);
//     res.status(500).json({
//       success: false, message: "Failed to fetch top sellers",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // --- Route Definitions ---
// router.get("/analytics", getAnalyticsData);
// router.get("/orders", getMyOrders);
// router.put("/orders/:orderId/status", updateOrderStatus);
// router.get("/payout-status", getPayoutStatus);
// router.get("/payout-history", getPayoutHistory);
// router.post("/setup-payouts", setupPayouts);
// router.post("/request-payout", requestPayout);
// router.get("/top-sellers", getTopSellers);

// export default router;


import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, restrictTo } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import mongoose from 'mongoose';
import { body, query, validationResult } from 'express-validator';

console.log("✅ [ROUTE FILE START] Loading: backend/routes/seller.js");

const router = express.Router();
console.log("✅ Router initialized in seller.js");

// Middleware to log query parameters for debugging
const logQueryParams = (req, res, next) => {
  console.log(`[seller.js] ${req.method} ${req.originalUrl} - Query parameters:`, req.query);
  next();
};

// Validation middleware for query parameters
const validateQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("❌ [VALIDATION FAILED] Path:", req.originalUrl, "Errors:", errors.array());
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// Apply authentication middleware to all routes
router.use(protect);
router.use(restrictTo(['seller']));

// --- Controller Functions ---

const getAnalyticsData = asyncHandler(async (req, res) => {
  const { days = "30" } = req.query;
  const sellerId = req.user._id;
  const daysInt = Number.parseInt(days, 10);

  if (isNaN(daysInt) || daysInt <= 0) {
    return res.status(400).json({ success: false, message: "Invalid 'days' parameter. Must be a positive integer." });
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysInt);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  console.log(`[SellerAnalytics] Fetching for seller: ${sellerId}, period: ${daysInt} days`);
  console.log(`[SellerAnalytics] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  const currentPeriodOrders = await Order.find({
    "orderItems.seller": sellerId,
    status: { $in: ["completed", "active", "processing"] },
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate("orderItems.listing", "title category price");

  let revenue = 0;
  let orderItemCount = 0;
  const uniqueOrderIds = new Set();
  const uniqueCustomers = new Set();
  const categoryData = {};

  currentPeriodOrders.forEach((order) => {
    let sellerInThisOrder = false;
    order.orderItems.forEach((item) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        const itemQuantity = item.quantity || 1;
        const itemPrice = item.price || 0;
        revenue += itemPrice * itemQuantity;
        orderItemCount += itemQuantity;
        sellerInThisOrder = true;

        const category = item.listing?.category || item.categorySnapshot || "other";
        categoryData[category] = (categoryData[category] || 0) + itemQuantity;
      }
    });
    if (sellerInThisOrder) {
      uniqueOrderIds.add(order._id.toString());
      uniqueCustomers.add(order.user.toString());
    }
  });

  const distinctOrderCount = uniqueOrderIds.size;
  const avgOrderValue = distinctOrderCount > 0 ? revenue / distinctOrderCount : 0;
  const uniqueCustomerCount = uniqueCustomers.size;

  const prevEndDate = new Date(startDate);
  prevEndDate.setDate(prevEndDate.getDate() - 1);
  prevEndDate.setHours(23, 59, 59, 999);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevEndDate.getDate() - daysInt + 1);
  prevStartDate.setHours(0, 0, 0, 0);

  console.log(`[SellerAnalytics] Previous period date range: ${prevStartDate.toISOString()} to ${prevEndDate.toISOString()}`);

  const previousPeriodOrders = await Order.find({
    "orderItems.seller": sellerId,
    status: { $in: ["completed", "active", "processing"] },
    createdAt: { $gte: prevStartDate, $lte: prevEndDate },
  }).populate("orderItems.listing", "price");

  let prevRevenue = 0;
  let prevOrderItemCount = 0;
  const prevUniqueOrderIds = new Set();
  const prevUniqueCustomers = new Set();

  previousPeriodOrders.forEach((order) => {
    let sellerInThisPrevOrder = false;
    order.orderItems.forEach((item) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        const itemQuantity = item.quantity || 1;
        const itemPrice = item.price || 0;
        prevRevenue += itemPrice * itemQuantity;
        prevOrderItemCount += itemQuantity;
        sellerInThisPrevOrder = true;
      }
    });
    if (sellerInThisPrevOrder) {
      prevUniqueOrderIds.add(order._id.toString());
      prevUniqueCustomers.add(order.user.toString());
    }
  });

  const prevDistinctOrderCount = prevUniqueOrderIds.size;
  const prevAvgOrderValue = prevDistinctOrderCount > 0 ? prevRevenue / prevDistinctOrderCount : 0;
  const prevUniqueCustomerCount = prevUniqueCustomers.size;

  const revenueChange = prevRevenue > 0 ? parseFloat(((revenue - prevRevenue) / prevRevenue * 100).toFixed(2)) : (revenue > 0 ? 100 : 0);
  const orderChange = prevDistinctOrderCount > 0 ? parseFloat(((distinctOrderCount - prevDistinctOrderCount) / prevDistinctOrderCount * 100).toFixed(2)) : (distinctOrderCount > 0 ? 100 : 0);
  const customerChange = prevUniqueCustomerCount > 0 ? parseFloat(((uniqueCustomerCount - prevUniqueCustomerCount) / prevUniqueCustomerCount * 100).toFixed(2)) : (uniqueCustomerCount > 0 ? 100 : 0);
  const avgOrderValueChange = prevAvgOrderValue > 0 ? parseFloat(((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue * 100).toFixed(2)) : (avgOrderValue > 0 ? 100 : null);

  const revenueByMonth = [];
  const monthlyData = {};
  currentPeriodOrders.forEach((order) => {
    const month = order.createdAt.toLocaleString('default', { month: 'short' });
    const year = order.createdAt.getFullYear();
    const key = `${month} ${year}`;
    if (!monthlyData[key]) { monthlyData[key] = 0; }
    order.orderItems.forEach((item) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        monthlyData[key] += (item.price || 0) * (item.quantity || 1);
      }
    });
  });
  Object.entries(monthlyData).forEach(([label, value]) => {
    revenueByMonth.push({ label, value: parseFloat(value.toFixed(2)) });
  });

  const ordersByCategory = Object.entries(categoryData).map(([category, value]) => ({
    label: category,
    value,
  }));

  const customerRetention = [
    { label: "Returning", value: Math.floor(uniqueCustomerCount * 0.6), color: "rgb(16, 185, 129)" },
    { label: "New", value: Math.ceil(uniqueCustomerCount * 0.4), color: "rgb(239, 68, 68)" },
  ];

  const analyticsData = {
    revenue: { value: parseFloat(revenue.toFixed(2)), change: revenueChange },
    orders: { value: distinctOrderCount, change: orderChange },
    customers: { value: uniqueCustomerCount, change: customerChange },
    avgOrderValue: { value: parseFloat(avgOrderValue.toFixed(2)), change: avgOrderValueChange },
    revenueByMonth,
    ordersByCategory,
    customerRetention,
  };

  console.log(`[sellerAnalytics] Analytics calculated successfully for seller ${sellerId}`);
  res.status(200).json({ success: true, data: analyticsData });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { status = 'all', page = 1, limit = 10 } = req.query;
  const sellerId = req.user._id;
  const pageInt = Number.parseInt(page, 10) || 1;
  const limitInt = Number.parseInt(limit, 10) || 10;
  const skip = (pageInt - 1) * limitInt;

  console.log(`[sellerGetOrders] Fetching for seller: ${sellerId}, status: ${status}, page: ${pageInt}, limit: ${limitInt}`);

  const matchCriteria = { "orderItems.seller": sellerId };
  if (status !== 'all') {
    matchCriteria.status = status;
  }

  const ordersFromDB = await Order.find(matchCriteria)
    .populate('user', 'name avatar')
    .populate({
      path: 'orderItems.listing',
      model: 'Listing',
      select: 'title category image price',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitInt)
    .lean();

  const transformedSellerItems = [];
  ordersFromDB.forEach((order) => {
    console.log(`[sellerGetOrders] Processing order: ${order._id}, User:`, order.user);
    order.orderItems.forEach((item) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        const itemQuantity = item.quantity || 1;
        const unitPrice = item.price || 0;

        transformedSellerItems.push({
          _id: order._id,
          orderIdShort: order._id.toString().slice(-8),
          itemId: item._id,
          listingId: item.listing?._id,
          listingTitle: item.listing?.title || item.title || 'Listing Data Missing',
          category: item.listing?.category || item.categorySnapshot || 'N/A',
          image: item.listing?.image || item.image,
          buyer: order.user ? {
            _id: order.user._id,
            name: order.user.name || 'N/A',
            avatar: order.user.avatar,
          } : { name: 'Unknown Buyer', avatar: null },
          unitPrice: unitPrice,
          quantity: itemQuantity,
          amount: parseFloat((unitPrice * itemQuantity).toFixed(2)),
          status: order.status,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
        });
      }
    });
  });

  const totalMatchingOrders = await Order.countDocuments(matchCriteria);
  const totalPages = Math.ceil(totalMatchingOrders / limitInt);

  console.log(`[sellerGetOrders] Found ${transformedSellerItems.length} items sold by seller across ${totalMatchingOrders} orders.`);

  res.status(200).json({
    success: true,
    orders: transformedSellerItems,
    totalPages,
    totalOrders: totalMatchingOrders,
    currentPage: pageInt,
    limit: limitInt,
  });
});

const getPayoutStatus = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  console.log(`[sellerGetPayoutStatus] Fetching for user: ${sellerId}`);

  const completedOrders = await Order.find({
    "orderItems.seller": sellerId,
    status: 'completed',
  });

  let availableBalance = 0;
  completedOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        availableBalance += (item.price || 0) * (item.quantity || 1);
      }
    });
  });

  const payoutData = {
    status: 'active',
    balance: parseFloat(availableBalance.toFixed(2)),
    currency: 'usd',
    nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    accountConnected: true,
    minimumPayout: 10.00,
  };

  res.status(200).json({ success: true, data: payoutData });
});

const getPayoutHistory = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  console.log(`[sellerGetPayoutHistory] Fetching for user: ${sellerId}`);

  // Mock data; replace with actual payout model query
  const payoutHistory = [
    {
      id: `po_mock_${sellerId}_1`,
      amount: 100.00,
      currency: 'usd',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paid',
      method: 'bank_transfer',
      arrival_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: `po_mock_${sellerId}_2`,
      amount: 50.00,
      currency: 'usd',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      method: 'bank_transfer',
      arrival_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  res.status(200).json({ success: true, data: payoutHistory });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const sellerId = req.user._id;

  console.log(`[sellerUpdateOrderStatus] Updating order ${orderId} to status ${status} for seller ${sellerId}`);

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'shipped'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const order = await Order.findOne({ _id: orderId, 'orderItems.seller': sellerId });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or you do not have permission to update it.',
    });
  }

  order.status = status;
  order.updatedAt = Date.now();
  await order.save();

  console.log(`[sellerUpdateOrderStatus] Order ${orderId} status updated to ${status}`);

  if (req.io && order.user) {
    const buyerRoom = `user_${order.user.toString()}`;
    req.io.to(buyerRoom).emit('order_status_updated', {
      orderId: order._id,
      status: order.status,
      message: `The status of your order #${order._id.toString().slice(-8)} has been updated to ${status}.`,
    });
    console.log(`[sellerUpdateOrderStatus] Emitted order_status_updated to buyer room: ${buyerRoom}`);
  }

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: { _id: orderId, status: order.status },
  });
});

const setupPayouts = asyncHandler(async (req, res) => {
  const { country, currency, email } = req.body;
  const sellerId = req.user._id;

  console.log(`[sellerSetupPayouts] Initiating for seller ${sellerId}:`, { country, currency, email });

  if (!country || !currency || !email) {
    return res.status(400).json({ success: false, message: 'Country, currency, and email are required.' });
  }

  // Mock response; replace with actual Stripe Connect logic
  const onboardingUrl = `https://connect.stripe.com/setup/s/test_onboarding_${sellerId}?user_email=${encodeURIComponent(email)}&country=${country}&currency=${currency}`;
  console.log(`[sellerSetupPayouts] Mock onboarding URL: ${onboardingUrl}`);
  res.status(200).json({ success: true, message: 'Payout setup initiated.', onboardingUrl });
});

const requestPayout = asyncHandler(async (req, res) => {
  const { amount, method = 'bank_transfer', currency = 'usd' } = req.body;
  const sellerId = req.user._id;
  console.log(`[sellerRequestPayout] Request from ${sellerId}:`, { amount, method, currency });

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount < 10) {
    return res.status(400).json({ success: false, message: 'Invalid amount. Minimum payout is $10.00.' });
  }

  // Mock response; replace with actual payout logic
  const mockPayoutId = `payout_mock_${sellerId}_${Date.now()}`;
  console.log(`[sellerRequestPayout] Mock payout created: ${mockPayoutId}`);
  res.status(200).json({
    success: true,
    message: 'Payout requested successfully.',
    data: {
      payoutId: mockPayoutId,
      status: 'pending',
      amount: numericAmount,
      method,
      currency,
      estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
});

const getTopSellers = asyncHandler(async (req, res) => {
  const { period = 'all', limit = 10 } = req.query;
  console.log(`[sellerGetTopSellers] Fetching top sellers for period: ${period}, limit: ${limit}`);

  let dateFilter = {};
  const now = new Date();
  if (period === '7days') {
    dateFilter = { createdAt: { $gte: new Date(new Date().setDate(now.getDate() - 7)) } };
  } else if (period === '30days') {
    dateFilter = { createdAt: { $gte: new Date(new Date().setMonth(now.getMonth() - 1)) } };
  }

  const topSellersData = await Order.aggregate([
    { $match: { status: 'completed', ...dateFilter } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.seller',
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        totalSales: { $sum: '$orderItems.quantity' },
        distinctOrders: { $addToSet: '$_id' },
      },
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'sellerDetails' } },
    { $unwind: '$sellerDetails' },
    {
      $project: {
        _id: 1,
        name: '$sellerDetails.name',
        avatar: '$sellerDetails.avatar',
        handle: '$sellerDetails.handle',
        totalRevenue: 1,
        totalSales: 1,
        distinctOrderCount: { $size: '$distinctOrders' },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit, 10) },
  ]);

  console.log(`[sellerGetTopSellers] Found ${topSellersData.length} top sellers`);
  res.status(200).json({
    success: true,
    data: topSellersData,
    message: topSellersData.length ? 'Top sellers fetched successfully' : 'No seller data for period.',
  });
});

// --- Route Definitions ---

router.get(
  '/analytics',
  logQueryParams,
  [query('days').optional().isInt({ min: 1 }).toInt()],
  validateQuery,
  getAnalyticsData
);

router.get(
  '/orders',
  logQueryParams,
  [
    query('status').optional().isIn(['all', 'pending', 'processing', 'completed', 'cancelled', 'shipped']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  validateQuery,
  getMyOrders
);

router.put(
  '/orders/:orderId/status',
  logQueryParams,
  [
    body('status').isIn(['pending', 'processing', 'completed', 'cancelled', 'shipped']).withMessage('Invalid status'),
  ],
  validateQuery,
  updateOrderStatus
);

router.get('/payout-status', logQueryParams, getPayoutStatus);
router.get('/payout-history', logQueryParams, getPayoutHistory);

router.post(
  '/setup-payouts',
  logQueryParams,
  [
    body('country').notEmpty().withMessage('Country is required'),
    body('currency').notEmpty().withMessage('Currency is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  validateQuery,
  setupPayouts
);

router.post(
  '/request-payout',
  logQueryParams,
  [
    body('amount').isFloat({ min: 10 }).withMessage('Amount must be at least $10.00'),
    body('method').optional().isIn(['bank_transfer', 'paypal']).withMessage('Invalid payment method'),
    body('currency').optional().isIn(['usd', 'eur']).withMessage('Invalid currency'),
  ],
  validateQuery,
  requestPayout
);

router.get(
  '/top-sellers',
  logQueryParams,
  [
    query('period').optional().isIn(['all', '7days', '30days']).withMessage('Invalid period'),
    query('limit').optional().isInt({ min: 1 }).toInt().withMessage('Limit must be a positive integer'),
  ],
  validateQuery,
  getTopSellers
);

console.log("✅ [ROUTE FILE END] Exporting router from backend/routes/seller.js");

export default router;