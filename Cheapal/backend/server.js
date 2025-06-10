// import "dotenv/config"
// import express from "express"
// import helmet from "helmet"
// import cors from "cors"
// import morgan from "morgan"
// import rateLimit from "express-rate-limit"
// import { createServer } from "http"
// import { Server as SocketIOServer } from "socket.io"
// import mongoose from "mongoose"
// import path from "path"
// import { fileURLToPath } from "url"
// import cookieParser from "cookie-parser"
// import compression from "compression"

// // --- Database & Models ---
// import connectDB from "./database.js"
// import User from "./models/User.js"
// import Listing from "./models/Listing.js"

// // --- Routes ---
// import authRoutes from "./routes/auth.js"
// import userRoutes from "./routes/users.js"
// import subscriptionRoutes from "./routes/subscriptions.js"
// import adminRoutes from "./routes/admin.js"
// import notificationRoutes from "./routes/notification.js"
// import sellerRoutes from "./routes/seller.js"
// import orderRoutes from "./routes/orders.js"
// import chatRoutes from "./routes/chat.js"
// import paymentRoutes from "./routes/payments.js"
// import blogRoutes from "./routes/blogs.js"
// import stripeConnectRoutes from "./routes/stripeConnect.js"
// import stripeIdentityRoutes from "./routes/stripeIdentity.js" // NEW: Stripe Identity routes
// import verificationRoutes from "./routes/verification.js" // Manual verification routes

// // --- Middleware ---
// import { errorHandler } from "./middleware/errorHandler.js"

// // --- Setup __dirname for ES Modules ---
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// // --- App Initialization ---
// const app = express()
// const httpServerInstance = createServer(app)

// // --- Socket.io Setup ---
// const io = new SocketIOServer(httpServerInstance, {
//   cors: {
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         process.env.FRONTEND_URL || "http://localhost:3000",
//         "http://localhost:3000",
//         "http://localhost:3001",
//         "https://localhost:3000",
//       ]
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         console.warn(`Socket.IO CORS blocked origin: ${origin}`)
//         callback(new Error("Not allowed by Socket.IO CORS"))
//       }
//     },
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   pingTimeout: 60000,
//   pingInterval: 25000,
// })

// // Middleware to attach Socket.IO instance to each request object
// app.use((req, res, next) => {
//   req.io = io
//   next()
// })

// // --- Trust proxy for production ---
// app.set("trust proxy", 1)

// // --- Security Middleware ---
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'", "https:", "fonts.googleapis.com"],
//         scriptSrc: ["'self'", "https://js.stripe.com"],
//         imgSrc: ["'self'", "data:", "https:", "blob:"],
//         connectSrc: [
//           "'self'",
//           "https://api.stripe.com",
//           process.env.FRONTEND_URL || "http://localhost:3000",
//           "ws://localhost:5000",
//           "wss://localhost:5000",
//         ],
//         fontSrc: ["'self'", "fonts.gstatic.com"],
//         frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
//       },
//     },
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// )

// // --- CORS Configuration ---
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       process.env.FRONTEND_URL || "http://localhost:3000",
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://localhost:3000",
//     ]

//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       console.warn(`CORS blocked origin: ${origin}`)
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   exposedHeaders: ["set-cookie"],
// }

// app.use(cors(corsOptions))

// // --- Compression ---
// app.use(compression())

// // --- Body Parsing Middleware ---
// // Special handling for Stripe webhooks (raw body) - place before general json parser
// app.use("/api/stripe-connect/webhook", express.raw({ type: "application/json" }))
// app.use("/api/stripe-identity/webhook", express.raw({ type: "application/json" })) // NEW: Stripe Identity webhook
// app.use("/api/payments/webhook", express.raw({ type: "application/json" }))

// // Regular JSON parsing for other routes
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))
// app.use(cookieParser())

// // --- Logging ---
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"))
// } else {
//   app.use(morgan("combined"))
// }

// // --- Rate Limiting ---
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === "production" ? 100 : 1000,
//   message: {
//     error: "Too many requests from this IP, please try again after 15 minutes",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === "production" ? 10 : 20,
//   message: {
//     error: "Too many authentication attempts, please try again after 15 minutes",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })

// app.use("/api", limiter)
// app.use("/api/auth", authLimiter)

// // --- Static File Serving ---
// const uploadsPath = path.join(__dirname, "uploads")
// console.log(`📁 Serving static files from: ${uploadsPath}`)

// // Ensure uploads directory exists
// import fs from "fs"
// if (!fs.existsSync(uploadsPath)) {
//   fs.mkdirSync(uploadsPath, { recursive: true })
//   console.log(`✅ Created uploads directory: ${uploadsPath}`)
// }

// app.use("/uploads", express.static(uploadsPath))
// app.use("/Uploads", express.static(uploadsPath)) // Legacy support

// // --- Health Check ---
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     uptime: process.uptime(),
//   })
// })

// // --- API Routes Mounting ---
// console.log("🔗 Mounting API routes...")
// app.use("/api/auth", authRoutes)
// console.log("✅ Mounted /api/auth")
// app.use("/api/users", userRoutes)
// console.log("✅ Mounted /api/users")
// app.use("/api/subscriptions", subscriptionRoutes)
// console.log("✅ Mounted /api/subscriptions")
// app.use("/api/orders", orderRoutes)
// console.log("✅ Mounted /api/orders")
// app.use("/api/payments", paymentRoutes)
// console.log("✅ Mounted /api/payments")
// app.use("/api/stripe-connect", stripeConnectRoutes)
// console.log("✅ Mounted /api/stripe-connect")
// app.use("/api/stripe-identity", stripeIdentityRoutes) // NEW: Stripe Identity routes
// console.log("✅ Mounted /api/stripe-identity")
// app.use("/api/verification", verificationRoutes) // Manual verification routes
// console.log("✅ Mounted /api/verification")
// app.use("/api/chats", chatRoutes)
// console.log("✅ Mounted /api/chats")
// app.use("/api/notifications", notificationRoutes)
// console.log("✅ Mounted /api/notifications")
// app.use("/api/seller", sellerRoutes)
// console.log("✅ Mounted /api/seller")
// app.use("/api/admin", adminRoutes)
// console.log("✅ Mounted /api/admin")
// app.use("/api/blogs", blogRoutes)
// console.log("✅ Mounted /api/blogs")

// // Search functionality
// app.get("/api/search", async (req, res, next) => {
//   try {
//     const { q, type = "all", period = "all" } = req.query
//     console.log(`[Search API] Query: q='${q}', type='${type}', period='${period}'`)
//     if (!q || q.trim() === "") {
//       return res.json({ success: true, data: { subscriptions: [], sellers: [] } })
//     }
//     const searchQueryRegex = { $regex: q.trim(), $options: "i" }
//     const dateFilter = {}
//     if (period !== "all") {
//       const now = new Date()
//       let startDate
//       switch (period) {
//         case "7d":
//           startDate = new Date(now.setDate(now.getDate() - 7))
//           break
//         case "30d":
//           startDate = new Date(now.setMonth(now.getMonth() - 1))
//           break
//         case "90d":
//           startDate = new Date(now.setMonth(now.getMonth() - 3))
//           break
//         case "1y":
//           startDate = new Date(now.setFullYear(now.getFullYear() - 1))
//           break
//       }
//       if (startDate) {
//         dateFilter.createdAt = { $gte: startDate }
//       }
//     }
//     let subscriptions = []
//     let sellers = []
//     if (type === "all" || type === "subscriptions") {
//       const listingQuery = {
//         $and: [
//           { status: "approved" },
//           { $or: [{ title: searchQueryRegex }, { description: searchQueryRegex }, { category: searchQueryRegex }] },
//           ...(Object.keys(dateFilter).length > 0 ? [dateFilter] : []),
//         ],
//       }
//       subscriptions = await Listing.find(listingQuery).populate("sellerId", "name avatar").limit(20).lean()
//       subscriptions = subscriptions.map((listing) => ({
//         ...listing,
//         _id: listing._id.toString(),
//         name: listing.title,
//         imageUrl: listing.image,
//         renewalType: listing.duration,
//         seller: listing.sellerId
//           ? {
//               _id: listing.sellerId._id.toString(),
//               name: listing.sellerId.name,
//               avatar: listing.sellerId.avatar,
//             }
//           : null,
//       }))
//     }
//     if (type === "all" || type === "sellers") {
//       const sellerQuery = {
//         $and: [{ role: "seller" }, { name: searchQueryRegex }],
//         ...(Object.keys(dateFilter).length > 0 ? [dateFilter] : []),
//       }
//       const rawSellers = await User.find(sellerQuery).select("name avatar _id").limit(10).lean()
//       sellers = await Promise.all(
//         rawSellers.map(async (seller) => {
//           const sellerListings = await Listing.find({ sellerId: seller._id, status: "approved" })
//             .limit(3)
//             .select("title description category price image duration _id")
//             .lean()
//           return {
//             ...seller,
//             _id: seller._id.toString(),
//             listings: sellerListings.map((listing) => ({
//               ...listing,
//               _id: listing._id.toString(),
//               name: listing.title,
//               imageUrl: listing.image,
//               renewalType: listing.duration,
//             })),
//           }
//         }),
//       )
//     }
//     res.json({ success: true, data: { subscriptions, sellers } })
//   } catch (error) {
//     console.error("[Search API] Error:", error)
//     next(error)
//   }
// })
// console.log("✅ Mounted /api/search")

// // --- Socket.io Connection Logic ---
// const userSockets = new Map()

// io.on("connection", (socket) => {
//   const { userId: queryUserId, chatId: queryChatId } = socket.handshake.query

//   console.log(`🔌 Socket connected: ${socket.id}, User from query: ${queryUserId}, Chat from query: ${queryChatId}`)

//   // Join user-specific room from handshake query
//   if (queryUserId && mongoose.Types.ObjectId.isValid(queryUserId)) {
//     const userRoom = `user_${queryUserId}`
//     socket.join(userRoom)
//     userSockets.set(socket.id, queryUserId)
//     console.log(`✅ Socket ${socket.id} joined user room from handshake: ${userRoom}`)
//   }

//   // Join chat-specific room from handshake query
//   if (queryChatId && mongoose.Types.ObjectId.isValid(queryChatId)) {
//     const chatRoom = `chat_${queryChatId}`
//     socket.join(chatRoom)
//     console.log(`✅ Socket ${socket.id} joined chat room from handshake: ${chatRoom}`)
//   }

//   // Handle explicit subscription event from client
//   socket.on("subscribe", (userIdFromEvent) => {
//     if (userIdFromEvent && mongoose.Types.ObjectId.isValid(userIdFromEvent)) {
//       const roomName = `user_${userIdFromEvent}`
//       socket.join(roomName)
//       userSockets.set(socket.id, userIdFromEvent)
//       console.log(`✅ Socket ${socket.id} explicitly subscribed to room: ${roomName}`)
//     } else {
//       console.warn(`[Socket] Invalid userIdFromEvent for subscribe: ${userIdFromEvent}`)
//     }
//   })

//   // Handle admin room joining
//   socket.on("join_admin_room", () => {
//     socket.join("admin_room")
//     console.log(`✅ Socket ${socket.id} joined admin_room`)
//   })

//   // Handle message sending
//   socket.on("sendMessage", (messageData) => {
//     try {
//       const chatId = messageData?.chat?._id || messageData?.chatId || messageData?.chat
//       const senderId = messageData?.sender?._id || messageData?.sender
//       const participants = messageData?.chat?.participants

//       if (!chatId || !senderId || !participants || !Array.isArray(participants)) {
//         console.error("[Socket] Invalid message data for sendMessage:", messageData)
//         return
//       }

//       console.log(`[Socket] Relaying message for chat ${chatId} from sender ${senderId}`)

//       // Emit to the specific chat room
//       const chatRoom = `chat_${chatId}`
//       io.to(chatRoom).emit("messageReceived", messageData)
//       console.log(`[Socket] Emitted 'messageReceived' to chat room: ${chatRoom}`)

//       // Also emit to individual user rooms of participants (excluding sender if desired)
//       participants.forEach((participant) => {
//         const participantId = participant?._id?.toString() || participant?.toString()
//         if (participantId && participantId !== senderId.toString()) {
//           const userRoom = `user_${participantId}`
//           io.to(userRoom).emit("newMessageNotification", {
//             chatId: chatId,
//             senderName: messageData?.sender?.name || "Someone",
//             messagePreview:
//               messageData?.content?.substring(0, 30) + (messageData?.content?.length > 30 ? "..." : "") ||
//               "New message",
//           })
//           console.log(`[Socket] Emitted 'newMessageNotification' to user room: ${userRoom}`)
//         }
//       })
//     } catch (error) {
//       console.error("[Socket] Error handling sendMessage:", error)
//     }
//   })

//   // Handle disconnection
//   socket.on("disconnect", (reason) => {
//     const userId = userSockets.get(socket.id)
//     console.log(`🔌 Socket disconnected: ${socket.id}, User: ${userId}, Reason: ${reason}`)
//     userSockets.delete(socket.id)
//   })

//   // Handle connection errors
//   socket.on("connect_error", (err) => {
//     console.error(`[Socket] Connection error for ${socket.id}:`, err.message)
//   })
// })

// // --- Frontend Serving (Production) ---
// if (process.env.NODE_ENV === "production") {
//   const frontendBuildPath = path.join(__dirname, "../frontend/build")
//   app.use(express.static(frontendBuildPath))

//   // Catch-all handler for SPA
//   app.get("*", (req, res, next) => {
//     if (req.originalUrl.startsWith("/api/")) {
//       return next()
//     }
//     res.sendFile(path.resolve(frontendBuildPath, "index.html"))
//   })
// }

// // --- API 404 Handler ---
// app.use("/api/*", (req, res) => {
//   console.warn(`🔴 API route not found: ${req.method} ${req.originalUrl}`)
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.method} ${req.originalUrl} not found on the server.`,
//   })
// })

// // --- Global Error Handler ---
// app.use(errorHandler)

// // --- Server Startup ---
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB()

//     // Start server
//     const port = process.env.PORT || 5000
//     httpServerInstance.listen(port, () => {
//       console.log(`\n🚀 Server running on port ${port}`)
//       console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
//       console.log(`🔗 API Base URL: http://localhost:${port}/api`)
//       console.log(`💳 Stripe Connect: http://localhost:${port}/api/stripe-connect`)
//       console.log(`🆔 Stripe Identity: http://localhost:${port}/api/stripe-identity`) // NEW
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)

//       if (process.env.STRIPE_SECRET_KEY) {
//         console.log(`✅ Stripe configured`)
//       } else {
//         console.log(`⚠️  Stripe not configured - some payment features might use mock responses or fail.`)
//       }

//       // Log available API routes
//       console.log("\n📋 Available API Routes:")
//       console.log("   • /api/auth - Authentication")
//       console.log("   • /api/users - User management")
//       console.log("   • /api/subscriptions - Listings/Subscriptions")
//       console.log("   • /api/orders - Order management")
//       console.log("   • /api/payments - Payment processing")
//       console.log("   • /api/stripe-connect - Stripe Connect payouts")
//       console.log("   • /api/stripe-identity - Live ID verification") // NEW
//       console.log("   • /api/verification - Manual verification")
//       console.log("   • /api/chats - Chat system")
//       console.log("   • /api/notifications - Notifications")
//       console.log("   • /api/seller - Seller dashboard")
//       console.log("   • /api/admin - Admin operations")
//       console.log("   • /api/blogs - Blog management")
//       console.log("   • /api/search - Search functionality")
//       console.log("   • /health - Health check\n")
//     })
//   } catch (error) {
//     console.error("❌ Server startup failed:", error)
//     process.exit(1)
//   }
// }

// // --- Graceful Shutdown ---
// const gracefulShutdown = (signal) => {
//   console.log(`\n${signal} received. Shutting down gracefully...`)

//   httpServerInstance.close(async () => {
//     console.log("✅ HTTP server closed")
//     io.close(() => {
//       console.log("✅ Socket.IO connections closed")
//     })

//     try {
//       await mongoose.connection.close()
//       console.log("✅ MongoDB connection closed")
//       process.exit(0)
//     } catch (error) {
//       console.error("❌ Error closing MongoDB connection:", error)
//       process.exit(1)
//     }
//   })

//   // Force close after 10 seconds
//   setTimeout(() => {
//     console.error("❌ Could not close connections in time, forcing shutdown")
//     process.exit(1)
//   }, 10000)
// }

// // --- Process Event Handlers ---
// process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
// process.on("SIGINT", () => gracefulShutdown("SIGINT"))

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("🚨 UNHANDLED REJECTION:", reason)
//   console.error("Promise:", promise)
// })

// process.on("uncaughtException", (error) => {
//   console.error("🚨 UNCAUGHT EXCEPTION:", error)
//   gracefulShutdown("Uncaught Exception")
// })

// // Start the server
// startServer()

// export default app



// from grok


import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import compression from "compression";
import fs from "fs";
import stripe from "stripe";

// --- Database & Models ---
import connectDB from "./database.js";
import User from "./models/User.js";
import Listing from "./models/Listing.js";
import Review from "./models/Review.js";

// --- Routes ---
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/notification.js";
import sellerRoutes from "./routes/seller.js";
import orderRoutes from "./routes/orders.js";
import chatRoutes from "./routes/chat.js";
import paymentRoutes from "./routes/payments.js";
import blogRoutes from "./routes/blogs.js";
import stripeConnectRoutes from "./routes/stripeConnect.js";
import stripeIdentityRoutes from "./routes/stripeIdentity.js";
import verificationRoutes from "./routes/verification.js";

// --- Middleware ---
import { errorHandler } from "./middleware/errorHandler.js";

// --- Setup __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize Stripe ---
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// --- App Initialization ---
const app = express();
const httpServerInstance = createServer(app);

// --- Socket.io Setup ---
const io = new SocketIOServer(httpServerInstance, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Socket.IO CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by Socket.IO CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware to attach Socket.IO instance to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- Trust proxy for production ---
app.set("trust proxy", 1);

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "fonts.googleapis.com"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          process.env.FRONTEND_URL || "http://localhost:3000",
          "ws://localhost:5000",
          "wss://localhost:5000",
        ],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// --- CORS Configuration ---
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3000",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// --- Compression ---
app.use(compression());

// --- Body Parsing Middleware ---
app.use("/api/stripe-connect/webhook", express.raw({ type: "application/json" }));
app.use("/api/stripe-identity/webhook", express.raw({ type: "application/json" }));
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- Logging ---
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 10 : 20,
  message: { error: "Too many authentication attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// --- Static File Serving ---
const uploadsPath = path.join(__dirname, "Uploads");
console.log(`📁 Serving static files from: ${uploadsPath}`);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`✅ Created uploads directory: ${uploadsPath}`);
}

app.use("/Uploads", express.static(uploadsPath));
app.use("/uploads", express.static(uploadsPath));

// --- Health Check ---
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

// --- Payment Intent Creation Route ---
app.post("/api/payments/create-payment-intent", async (req, res) => {
  try {
    const { orderId, amount, currency = "usd", metadata } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: "Order ID, amount, and currency are required.",
      });
    }

    const amountInCents = Math.round(amount * 100);
    if (amountInCents < 50) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least $0.50.",
      });
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: { orderId, ...metadata },
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("[Stripe Payment Intent Error]", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment intent.",
    });
  }
});

// --- Review Routes ---
app.post("/api/reviews", async (req, res, next) => {
  try {
    const { orderId, rating, comment, sellerId } = req.body;
    if (!orderId || !rating || !sellerId) {
      return res.status(400).json({ success: false, message: "Order ID, rating, and seller ID are required." });
    }

    const review = new Review({
      orderId,
      rating,
      comment,
      buyer: req.user?._id,
      seller: sellerId,
    });

    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("[Review POST Error]", error);
    next(error);
  }
});

app.put("/api/reviews/:reviewId/respond", async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    if (!response) {
      return res.status(400).json({ success: false, message: "Response is required." });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.seller.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to respond to this review." });
    }

    review.sellerResponse = response;
    await review.save();
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("[Review Response Error]", error);
    next(error);
  }
});

app.get("/api/reviews/seller/:sellerId", async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const reviews = await Review.find({ seller: sellerId }).populate("buyer", "name avatar").lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("[Review GET Error]", error);
    next(error);
  }
});

// --- API Routes Mounting ---
console.log("🔗 Mounting API routes...");
app.use("/api/auth", authRoutes);
console.log("✅ Mounted /api/auth");
app.use("/api/users", userRoutes);
console.log("✅ Mounted /api/users");
app.use("/api/subscriptions", subscriptionRoutes);
console.log("✅ Mounted /api/subscriptions");
app.use("/api/orders", orderRoutes);
console.log("✅ Mounted /api/orders");
app.use("/api/payments", paymentRoutes);
console.log("✅ Mounted /api/payments");
app.use("/api/stripe-connect", stripeConnectRoutes);
console.log("✅ Mounted /api/stripe-connect");
app.use("/api/stripe-identity", stripeIdentityRoutes);
console.log("✅ Mounted /api/stripe-identity");
app.use("/api/verification", verificationRoutes);
console.log("✅ Mounted /api/verification");
app.use("/api/chats", chatRoutes);
console.log("✅ Mounted /api/chats");
app.use("/api/notifications", notificationRoutes);
console.log("✅ Mounted /api/notifications");
app.use("/api/seller", sellerRoutes);
console.log("✅ Mounted /api/seller");
app.use("/api/admin", adminRoutes);
console.log("✅ Mounted /api/admin");
app.use("/api/blogs", blogRoutes);
console.log("✅ Mounted /api/blogs");

// --- Search Functionality ---
app.get("/api/search", async (req, res, next) => {
  try {
    const { q, type = "all", period = "all" } = req.query;
    console.log(`[Search API] Query: q='${q}', type='${type}', period='${period}'`);
    if (!q || q.trim() === "") {
      return res.json({ success: true, data: { subscriptions: [], sellers: [] } });
    }
    const searchQueryRegex = { $regex: q.trim(), $options: "i" };
    const dateFilter = {};
    if (period !== "all") {
      const now = new Date();
      let startDate;
      switch (period) {
        case "7d":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "30d":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "90d":
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case "1y":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      if (startDate) {
        dateFilter.createdAt = { $gte: startDate };
      }
    }
    let subscriptions = [];
    let sellers = [];
    if (type === "all" || type === "subscriptions") {
      const listingQuery = {
        $and: [
          { status: "approved" },
          { $or: [{ title: searchQueryRegex }, { description: searchQueryRegex }, { category: searchQueryRegex }] },
          ...(Object.keys(dateFilter).length > 0 ? [dateFilter] : []),
        ],
      };
      subscriptions = await Listing.find(listingQuery).populate("sellerId", "name avatar").limit(20).lean();
      subscriptions = subscriptions.map((listing) => ({
        ...listing,
        _id: listing._id.toString(),
        name: listing.title,
        imageUrl: listing.image,
        renewalType: listing.duration,
        seller: listing.sellerId
          ? {
              _id: listing.sellerId._id.toString(),
              name: listing.sellerId.name,
              avatar: listing.sellerId.avatar,
            }
          : null,
      }));
    }
    if (type === "all" || type === "sellers") {
      const sellerQuery = {
        $and: [{ role: "seller" }, { name: searchQueryRegex }],
        ...(Object.keys(dateFilter).length > 0 ? [dateFilter] : []),
      };
      const rawSellers = await User.find(sellerQuery).select("name avatar _id").limit(10).lean();
      sellers = await Promise.all(
        rawSellers.map(async (seller) => {
          const sellerListings = await Listing.find({ sellerId: seller._id, status: "approved" })
            .limit(3)
            .select("title description category price image duration _id")
            .lean();
          return {
            ...seller,
            _id: seller._id.toString(),
            listings: sellerListings.map((listing) => ({
              ...listing,
              _id: listing._id.toString(),
              name: listing.title,
              imageUrl: listing.image,
              renewalType: listing.duration,
            })),
          };
        }),
      );
    }
    res.json({ success: true, data: { subscriptions, sellers } });
  } catch (error) {
    console.error("[Search API] Error:", error);
    next(error);
  }
});
console.log("✅ Mounted /api/search");

// --- Socket.io Connection Logic ---
const userSockets = new Map();

io.on("connection", (socket) => {
  const { userId: queryUserId, chatId: queryChatId } = socket.handshake.query;

  console.log(`🔌 Socket connected: ${socket.id}, User: ${queryUserId}, Chat: ${queryChatId}`);

  if (queryUserId && mongoose.Types.ObjectId.isValid(queryUserId)) {
    const userRoom = `user_${queryUserId}`;
    socket.join(userRoom);
    userSockets.set(socket.id, queryUserId);
    console.log(`✅ Socket ${socket.id} joined user room: ${userRoom}`);
  }

  if (queryChatId && mongoose.Types.ObjectId.isValid(queryChatId)) {
    const chatRoom = `chat_${queryChatId}`;
    socket.join(chatRoom);
    console.log(`✅ Socket ${socket.id} joined chat room: ${chatRoom}`);
  }

  socket.on("subscribe", (userIdFromEvent) => {
    if (userIdFromEvent && mongoose.Types.ObjectId.isValid(userIdFromEvent)) {
      const roomName = `user_${userIdFromEvent}`;
      socket.join(roomName);
      userSockets.set(socket.id, userIdFromEvent);
      console.log(`✅ Socket ${socket.id} subscribed to room: ${roomName}`);
    } else {
      console.warn(`[Socket] Invalid userId for subscribe: ${userIdFromEvent}`);
    }
  });

  socket.on("join_admin_room", () => {
    socket.join("admin_room");
    console.log(`✅ Socket ${socket.id} joined admin_room`);
  });

  socket.on("sendMessage", (messageData) => {
    try {
      const chatId = messageData?.chat?._id || messageData?.chatId || messageData?.chat;
      const senderId = messageData?.sender?._id || messageData?.sender;
      const participants = messageData?.chat?.participants;

      if (!chatId || !senderId || !participants || !Array.isArray(participants)) {
        console.error("[Socket] Invalid message data:", messageData);
        return;
      }

      console.log(`[Socket] Relaying message for chat ${chatId} from sender ${senderId}`);

      const chatRoom = `chat_${chatId}`;
      io.to(chatRoom).emit("messageReceived", messageData);

      participants.forEach((participant) => {
        const participantId = participant?._id?.toString() || participant?.toString();
        if (participantId && participantId !== senderId.toString()) {
          const userRoom = `user_${participantId}`;
          io.to(userRoom).emit("newMessageNotification", {
            chatId,
            senderName: messageData?.sender?.name || "Someone",
            messagePreview:
              messageData?.content?.substring(0, 30) + (messageData?.content?.length > 30 ? "..." : "") ||
              "New message",
          });
          console.log(`[Socket] Notified user room: ${userRoom}`);
        }
      });
    } catch (error) {
      console.error("[Socket] Error handling sendMessage:", error);
    }
  });

  socket.on("disconnect", (reason) => {
    const userId = userSockets.get(socket.id);
    console.log(`🔌 Socket disconnected: ${socket.id}, User: ${userId}, Reason: ${reason}`);
    userSockets.delete(socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error(`[Socket] Connection error for ${socket.id}:`, err.message);
  });
});

// --- Frontend Serving (Production) ---
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.resolve(frontendBuildPath, "index.html"));
  });
}

// --- API 404 Handler ---
app.use("/api/*", (req, res) => {
  console.warn(`🔴 API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// --- Global Error Handler ---
app.use(errorHandler);

// --- Server Startup ---
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Models loaded: User, Listing, Review");

    const port = process.env.PORT || 5000;
    httpServerInstance.listen(port, () => {
      console.log(`\n🚀 Server running on port ${port}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
      console.log(`🔗 API Base URL: http://localhost:${port}/api`);
      console.log(`💳 Stripe Connect: http://localhost:${port}/api/stripe-connect`);
      console.log(`🆔 Stripe Identity: http://localhost:${port}/api/stripe-identity`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

      if (process.env.STRIPE_SECRET_KEY) {
        console.log(`✅ Stripe configured`);
      } else {
        console.log(`⚠️ Stripe not configured - payment features may fail.`);
      }

      console.log("\n📋 Available API Routes:");
      console.log("   • /api/auth - Authentication");
      console.log("   • /api/users - User management");
      console.log("   • /api/subscriptions - Listings/Subscriptions");
      console.log("   • /api/orders - Order management");
      console.log("   • /api/payments - Payment processing");
      console.log("   • /api/stripe-connect - Stripe Connect payouts");
      console.log("   • /api/stripe-identity - Live ID verification");
      console.log("   • /api/verification - Manual verification");
      console.log("   • /api/chats - Chat system");
      console.log("   • /api/notifications - Notifications");
      console.log("   • /api/seller - Seller dashboard");
      console.log("   • /api/admin - Admin operations");
      console.log("   • /api/blogs - Blog management");
      console.log("   • /api/reviews - Review system");
      console.log("   • /api/search - Search functionality");
      console.log("   • /health - Health check\n");
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

// --- Graceful Shutdown ---
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  httpServerInstance.close(async () => {
    console.log("✅ HTTP server closed");
    io.close(() => {
      console.log("✅ Socket.IO connections closed");
    });

    try {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("❌ Could not close connections in time, forcing shutdown");
    process.exit(1);
  }, 10000);
};

// --- Process Event Handlers ---
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 UNHANDLED REJECTION:", reason);
  console.error("Promise:", promise);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 UNCAUGHT EXCEPTION:", error);
  gracefulShutdown("Uncaught Exception");
});

// Start the server
startServer();

export default app;