// import mongoose from 'mongoose';

// const orderItemSchema = new mongoose.Schema({
//   listing: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Listing',
//     required: true,
//   },
//   seller: { // The seller who owns the listing(s)
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true, // Ensure seller is always provided
//   },
//   title: { // Store title at time of order
//     type: String,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//     default: 1,
//   },
//   price: { // Store price at time of order
//     type: Number,
//     required: true,
//   },
//   duration: { // Store duration at time of order
//     type: String,
//     required: true,
//   },
//   image: { // Store image path at time of order
//     type: String
//   }
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: { // The user who placed the order
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },
//     orderItems: [orderItemSchema],
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     status: { // Order status
//       type: String,
//       required: true,
//       enum: ['pending_payment', 'processing', 'completed', 'failed', 'cancelled', 'requires_action'],
//       default: 'pending_payment', // Changed to reflect order creation state
//       index: true,
//     },
//     paymentMethod: { 
//       type: String,
//       trim: true,
//     },
//     paymentIntentId: { // Stripe Payment Intent ID
//       type: String,
//       index: true,
//     },
//     paymentResult: { // Result from payment gateway
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//     },
//     paidAt: {
//       type: Date,
//     },
//     deliveredAt: { // When the subscription access/details were delivered
//       type: Date,
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// export default Order;

//from grok

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending_payment', 'processing', 'completed', 'failed', 'cancelled', 'requires_action'],
      default: 'pending_payment',
      index: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      index: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    sellerMessage: {
      message: {
        type: String,
        maxlength: [1000, "Seller message cannot exceed 1000 characters"],
      },
      loginDetails: {
        username: { type: String },
        password: { type: String },
        accessLink: { type: String }
      }
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;