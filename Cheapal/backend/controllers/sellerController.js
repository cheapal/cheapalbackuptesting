import Order from "../models/Order.js"
import mongoose from "mongoose"
import asyncHandler from 'express-async-handler';
import Listing from '../models/Listing.js';
import { validateListing } from '../utils/validators.js';

export const createListing = asyncHandler(async (req, res) => {
  const { title, description, price, category, duration, autoReply } = req.body;

  const errors = validateListing({ title, description, price, category, duration });
  if (Object.keys(errors).length) {
    res.status(400);
    throw new Error(JSON.stringify(errors));
  }

  const listing = new Listing({
    title: title.trim(),
    description: description.trim(),
    price: parseFloat(price),
    category: category.trim(),
    duration: duration.trim(),
    autoReply: autoReply ? autoReply.trim() : null,
    sellerId: req.user._id,
    image: req.files?.[0]?.filename || null,
    status: 'pending',
  });

  await listing.save();

  const io = req.app.get('io');
  io.to('admin_room').emit('new_listing', {
    listingId: listing._id,
    title: listing.title,
    sellerId: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Listing created, awaiting approval', data: listing });
});

export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, duration, autoReply } = req.body;

  const errors = validateListing({ title, description, price, category, duration });
  if (Object.keys(errors).length) {
    res.status(400);
    throw new Error(JSON.stringify(errors));
  }

  const listing = await Listing.findOne({ _id: id, sellerId: req.user._id });
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found or unauthorized');
  }

  listing.title = title.trim();
  listing.description = description.trim();
  listing.price = parseFloat(price);
  listing.category = category.trim();
  listing.duration = duration.trim();
  listing.autoReply = autoReply ? autoReply.trim() : null;
  if (req.files?.[0]?.filename) {
    listing.image = req.files[0].filename;
  }
  listing.status = 'pending'; // Reset to pending for re-approval

  await listing.save();

  const io = req.app.get('io');
  io.to('admin_room').emit('listing_updated', {
    listingId: listing._id,
    title: listing.title,
    sellerId: req.user._id,
  });

  res.status(200).json({ success: true, message: 'Listing updated, awaiting approval', data: listing });
});

// ... other controller methods (unchanged)

// Get seller analytics
export const getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id
    const days = Number.parseInt(req.query.days) || 30

    console.log(`[getAnalyticsData] Fetching analytics for seller: ${sellerId}, days: ${days}`)

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    console.log(`[getAnalyticsData] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)

    // Get basic metrics
    const [totalOrders, totalRevenue, totalCustomers] = await Promise.all([
      // Total orders
      Order.countDocuments({
        sellerId: new mongoose.Types.ObjectId(sellerId),
        createdAt: { $gte: startDate, $lte: endDate },
      }),

      // Total revenue
      Order.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            createdAt: { $gte: startDate, $lte: endDate },
            status: { $in: ["completed", "processing"] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // Unique customers
      Order.distinct("buyerId", {
        sellerId: new mongoose.Types.ObjectId(sellerId),
        createdAt: { $gte: startDate, $lte: endDate },
      }),
    ])

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - days)
    const prevEndDate = new Date(startDate)

    const [prevTotalOrders, prevTotalRevenue, prevTotalCustomers] = await Promise.all([
      Order.countDocuments({
        sellerId: new mongoose.Types.ObjectId(sellerId),
        createdAt: { $gte: prevStartDate, $lte: prevEndDate },
      }),

      Order.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            createdAt: { $gte: prevStartDate, $lte: prevEndDate },
            status: { $in: ["completed", "processing"] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      Order.distinct("buyerId", {
        sellerId: new mongoose.Types.ObjectId(sellerId),
        createdAt: { $gte: prevStartDate, $lte: prevEndDate },
      }),
    ])

    // Calculate metrics
    const currentRevenue = totalRevenue[0]?.total || 0
    const previousRevenue = prevTotalRevenue[0]?.total || 0
    const currentCustomers = totalCustomers.length
    const previousCustomers = prevTotalCustomers.length

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const ordersChange = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0
    const customersChange =
      previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0

    const avgOrderValue = totalOrders > 0 ? currentRevenue / totalOrders : 0
    const prevAvgOrderValue = prevTotalOrders > 0 ? previousRevenue / prevTotalOrders : 0
    const avgOrderValueChange =
      prevAvgOrderValue > 0 ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100 : 0

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ["completed", "processing"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          value: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.month", 10] },
                  then: { $concat: ["0", { $toString: "$_id.month" }] },
                  else: { $toString: "$_id.month" },
                },
              },
            ],
          },
          value: 1,
        },
      },
    ])

    // Get orders by category
    const ordersByCategory = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "listingId",
          foreignField: "_id",
          as: "listing",
        },
      },
      {
        $unwind: "$listing",
      },
      {
        $group: {
          _id: "$listing.category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$_id",
          digital: { $cond: { if: { $eq: ["$_id", "streaming"] }, then: "$count", else: 0 } },
          software: { $cond: { if: { $eq: ["$_id", "software"] }, then: "$count", else: 0 } },
          services: { $cond: { if: { $eq: ["$_id", "services"] }, then: "$count", else: 0 } },
          other: {
            $cond: { if: { $not: { $in: ["$_id", ["streaming", "software", "services"]] } }, then: "$count", else: 0 },
          },
        },
      },
    ])

    // Customer retention (simplified)
    const customerRetention = [
      { label: "New Customers", value: Math.max(0, currentCustomers - previousCustomers) },
      { label: "Returning Customers", value: Math.min(currentCustomers, previousCustomers) },
    ]

    const analyticsData = {
      revenue: {
        value: Math.round(currentRevenue * 100) / 100,
        change: Math.round(revenueChange * 100) / 100,
      },
      orders: {
        value: totalOrders,
        change: Math.round(ordersChange * 100) / 100,
      },
      customers: {
        value: currentCustomers,
        change: Math.round(customersChange * 100) / 100,
      },
      avgOrderValue: {
        value: Math.round(avgOrderValue * 100) / 100,
        change: Math.round(avgOrderValueChange * 100) / 100,
      },
      revenueByMonth: revenueByMonth || [],
      ordersByCategory: ordersByCategory || [],
      customerRetention: customerRetention || [],
    }

    console.log(`[getAnalyticsData] Analytics data:`, JSON.stringify(analyticsData, null, 2))

    res.json({
      success: true,
      data: analyticsData,
    })
  } catch (error) {
    console.error("[getAnalyticsData] Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Get seller orders
export const getOrders = async (req, res) => {
  try {
    const sellerId = req.user._id
    const { status = "all", page = 1, limit = 10 } = req.query

    console.log(`[getOrders] Fetching orders for seller: ${sellerId}, status: ${status}, page: ${page}`)

    const query = { sellerId: new mongoose.Types.ObjectId(sellerId) }
    if (status !== "all") {
      query.status = status
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("buyerId", "name email")
        .populate("listingId", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number.parseInt(limit))
        .lean(),
      Order.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalOrders / Number.parseInt(limit))

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,
      buyer: order.buyerId
        ? {
            name: order.buyerId.name,
            email: order.buyerId.email,
          }
        : null,
      listing: order.listingId
        ? {
            title: order.listingId.title,
          }
        : null,
    }))

    console.log(`[getOrders] Found ${orders.length} orders`)

    res.json({
      success: true,
      orders: formattedOrders,
      totalOrders,
      totalPages,
      currentPage: Number.parseInt(page),
    })
  } catch (error) {
    console.error("[getOrders] Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const sellerId = req.user._id

    console.log(`[updateOrderStatus] Updating order ${orderId} to status: ${status}`)

    const validStatuses = ["pending", "processing", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      })
    }

    const order = await Order.findOne({
      _id: orderId,
      sellerId: new mongoose.Types.ObjectId(sellerId),
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    order.status = status
    await order.save()

    console.log(`[updateOrderStatus] Order ${orderId} updated successfully`)

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
      },
    })
  } catch (error) {
    console.error("[updateOrderStatus] Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Get top sellers
export const getTopSellers = async (req, res) => {
  try {
    const { period = "30days", limit = 10 } = req.query

    console.log(`[getTopSellers] Fetching top sellers for period: ${period}`)

    // Calculate date range based on period
    const startDate = new Date()
    switch (period) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30days":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90days":
        startDate.setDate(startDate.getDate() - 90)
        break
      case "1year":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    const topSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["completed", "processing"] },
        },
      },
      {
        $group: {
          _id: "$sellerId",
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: "$seller",
      },
      {
        $project: {
          _id: 1,
          name: "$seller.name",
          avatar: "$seller.avatar",
          totalRevenue: 1,
          totalOrders: 1,
          avgOrderValue: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    console.log(`[getTopSellers] Found ${topSellers.length} top sellers`)

    res.json({
      success: true,
      data: topSellers,
    })
  } catch (error) {
    console.error("[getTopSellers] Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch top sellers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export default {
  getAnalytics,
  getOrders,
  updateOrderStatus,
  getTopSellers,
}
