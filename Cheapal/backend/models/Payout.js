import mongoose from "mongoose"

const PayoutSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stripePayoutId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "in_transit", "paid", "failed", "canceled"],
      default: "pending",
      index: true,
    },
    method: {
      type: String,
      enum: ["standard", "instant"],
      default: "standard",
    },
    arrivalDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    failureCode: {
      type: String,
    },
    failureMessage: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
PayoutSchema.index({ seller: 1, createdAt: -1 })
PayoutSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model("Payout", PayoutSchema)
