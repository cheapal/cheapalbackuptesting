// import mongoose from "mongoose"
// import bcrypt from "bcryptjs"

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: [100, "Name cannot exceed 100 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["buyer", "seller", "admin", "user"],
//       default: "buyer",
//     },
//     avatar: {
//       type: String,
//       default: null,
//     },
//     bio: {
//       type: String,
//       maxlength: [500, "Bio cannot exceed 500 characters"],
//       default: "",
//     },
//     tagline: {
//       type: String,
//       maxlength: [100, "Tagline cannot exceed 100 characters"],
//       default: "",
//     },
//     badges: [
//       {
//         type: String,
//         enum: ["verified", "top_seller", "new_seller", "premium"],
//       },
//     ],
//     verificationStatus: {
//       type: String,
//       enum: ["unverified", "pending", "verified", "rejected"],
//       default: "unverified",
//     },

//     // Stripe Connect Integration
//     stripeConnectAccountId: {
//       type: String,
//       default: null,
//     },

//     // Enhanced Payout Settings
//     payoutSettings: {
//       country: {
//         type: String,
//         default: null,
//       },
//       businessType: {
//         type: String,
//         enum: ["individual", "company"],
//         default: "individual",
//       },
//       verificationStatus: {
//         type: String,
//         enum: ["not_started", "pending", "in_review", "verified", "rejected"],
//         default: "not_started",
//       },
//       chargesEnabled: {
//         type: Boolean,
//         default: false,
//       },
//       payoutsEnabled: {
//         type: Boolean,
//         default: false,
//       },
//       documentsRequired: [
//         {
//           type: String,
//         },
//       ],
//       bankingRequired: [
//         {
//           type: String,
//         },
//       ],
//       additionalFieldsRequired: [
//         {
//           type: String,
//         },
//       ],
//       identityVerified: {
//         type: Boolean,
//         default: false,
//       },
//       identityVerificationDate: {
//         type: Date,
//         default: null,
//       },
//       identityVerificationStatus: {
//         type: String,
//         enum: ["not_started", "pending", "verified", "requires_input", "failed"],
//         default: "not_started",
//       },
//       lastVerificationAttempt: {
//         type: Date,
//         default: null,
//       },
//       lastUpdated: {
//         type: Date,
//         default: Date.now,
//       },
//       stripeConnectPending: {
//         type: Boolean,
//         default: false,
//       },
//       pendingReason: String,
//     },

//     // NEW: Stripe Identity Verification System
//     identityVerification: {
//       sessionId: {
//         type: String,
//         default: null,
//       },
//       status: {
//         type: String,
//         enum: ["not_started", "pending", "processing", "verified", "requires_input", "canceled"],
//         default: "not_started",
//       },
//       createdAt: {
//         type: Date,
//         default: null,
//       },
//       verifiedAt: {
//         type: Date,
//         default: null,
//       },
//       lastUpdated: {
//         type: Date,
//         default: null,
//       },
//       clientSecret: {
//         type: String,
//         default: null,
//       },
//       requiresInput: {
//         type: Boolean,
//         default: false,
//       },
//       lastError: {
//         code: String,
//         reason: String,
//       },
//       verifiedData: {
//         documentType: String,
//         documentNumber: String,
//         firstName: String,
//         lastName: String,
//         dateOfBirth: String,
//         address: {
//           line1: String,
//           line2: String,
//           city: String,
//           state: String,
//           postal_code: String,
//           country: String,
//         },
//         nationality: String,
//       },
//     },

//     // Manual Verification System (Legacy)
//     verification: {
//       status: {
//         type: String,
//         enum: ["not_started", "pending", "approved", "rejected"],
//         default: "not_started",
//       },
//       documentType: String,
//       country: String,
//       personalInfo: {
//         firstName: String,
//         lastName: String,
//         dateOfBirth: String,
//         address: String,
//         city: String,
//         postalCode: String,
//         phoneNumber: String,
//       },
//       documents: {
//         frontDocument: String,
//         backDocument: String,
//         selfie: String,
//       },
//       submittedAt: Date,
//       reviewedAt: Date,
//       reviewedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       rejectionReason: String,
//       method: {
//         type: String,
//         enum: ["manual", "stripe_identity"],
//         default: "manual",
//       },
//       verifiedData: {
//         documentType: String,
//         documentNumber: String,
//         firstName: String,
//         lastName: String,
//         dateOfBirth: String,
//         address: String,
//         nationality: String,
//       },
//     },

//     // Banking Information
//     bankingInfo: {
//       accountHolderName: String,
//       accountNumber: String, // Store only last 4 digits for security
//       routingNumber: String,
//       bankName: String,
//       country: String,
//       currency: String,
//       status: {
//         type: String,
//         enum: ["not_started", "pending", "approved", "rejected"],
//         default: "not_started",
//       },
//       submittedAt: Date,
//       verifiedAt: Date,
//     },

//     // Seller-specific fields
//     sellerProfile: {
//       businessName: {
//         type: String,
//         default: null,
//       },
//       businessAddress: {
//         street: String,
//         city: String,
//         state: String,
//         postalCode: String,
//         country: String,
//       },
//       taxId: {
//         type: String,
//         default: null,
//       },
//       phoneNumber: {
//         type: String,
//         default: null,
//       },
//       website: {
//         type: String,
//         default: null,
//       },
//       socialMedia: {
//         twitter: String,
//         linkedin: String,
//         facebook: String,
//       },
//     },

//     // Analytics and Performance
//     sellerStats: {
//       totalSales: {
//         type: Number,
//         default: 0,
//       },
//       totalRevenue: {
//         type: Number,
//         default: 0,
//       },
//       averageRating: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       totalReviews: {
//         type: Number,
//         default: 0,
//       },
//       responseTime: {
//         type: Number, // in hours
//         default: 24,
//       },
//       completionRate: {
//         type: Number, // percentage
//         default: 100,
//       },
//     },

//     // Account status
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     emailVerificationToken: {
//       type: String,
//       default: null,
//     },
//     passwordResetToken: {
//       type: String,
//       default: null,
//     },
//     passwordResetExpires: {
//       type: Date,
//       default: null,
//     },

//     // Soft delete
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// )

// // Indexes for better performance
// userSchema.index({ email: 1 })
// userSchema.index({ role: 1 })
// userSchema.index({ stripeConnectAccountId: 1 })
// userSchema.index({ "payoutSettings.verificationStatus": 1 })
// userSchema.index({ "identityVerification.sessionId": 1 }) // NEW
// userSchema.index({ "identityVerification.status": 1 }) // NEW
// userSchema.index({ deletedAt: 1 })

// // Virtual for full name (if needed)
// userSchema.virtual("fullName").get(function () {
//   return this.name
// })

// // Virtual for verified full name from Stripe Identity
// userSchema.virtual("verifiedFullName").get(function () {
//   if (this.identityVerification?.verifiedData) {
//     const { firstName, lastName } = this.identityVerification.verifiedData
//     return firstName && lastName ? `${firstName} ${lastName}` : null
//   }
//   return null
// })

// // Pre-save middleware to hash password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next()

//   try {
//     const salt = await bcrypt.genSalt(12)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

// // Method to compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password)
// }

// // Method to check if user is verified seller
// userSchema.methods.isVerifiedSeller = function () {
//   return (
//     this.role === "seller" &&
//     this.payoutSettings?.verificationStatus === "verified" &&
//     this.payoutSettings?.chargesEnabled === true &&
//     this.payoutSettings?.payoutsEnabled === true
//   )
// }

// // Method to check if user is fully verified (NEW)
// userSchema.methods.isFullyVerified = function () {
//   return (
//     this.identityVerification?.status === "verified" &&
//     this.bankingInfo?.status === "approved" &&
//     this.payoutSettings?.payoutsEnabled === true
//   )
// }

// // Method to get verification progress (UPDATED)
// userSchema.methods.getVerificationProgress = function () {
//   let progress = 0
//   let steps = 0

//   // Step 1: Account created
//   if (this.stripeConnectAccountId) {
//     progress += 25
//   }
//   steps++

//   // Step 2: Identity verified (prioritize Stripe Identity over manual)
//   if (this.identityVerification?.status === "verified" || this.verification?.status === "approved") {
//     progress += 25
//   }
//   steps++

//   // Step 3: Banking info submitted
//   if (this.bankingInfo?.status === "approved") {
//     progress += 25
//   }
//   steps++

//   // Step 4: Payouts enabled
//   if (this.payoutSettings?.payoutsEnabled) {
//     progress += 25
//   }
//   steps++

//   return {
//     progress,
//     steps,
//     completed: progress === 100,
//   }
// }

// // Method to get primary verification method (NEW)
// userSchema.methods.getPrimaryVerificationMethod = function () {
//   if (this.identityVerification?.status === "verified") {
//     return "stripe_identity"
//   } else if (this.verification?.status === "approved") {
//     return "manual"
//   }
//   return "none"
// }

// // Static method to find active users
// userSchema.statics.findActive = function () {
//   return this.find({ deletedAt: null, isActive: true })
// }

// // Static method to find verified sellers
// userSchema.statics.findVerifiedSellers = function () {
//   return this.find({
//     role: "seller",
//     deletedAt: null,
//     isActive: true,
//     "payoutSettings.verificationStatus": "verified",
//   })
// }

// // Static method to find users with pending Stripe Identity verification (NEW)
// userSchema.statics.findPendingIdentityVerification = function () {
//   return this.find({
//     "identityVerification.status": { $in: ["pending", "processing", "requires_input"] },
//     deletedAt: null,
//     isActive: true,
//   })
// }

// export default mongoose.model("User", userSchema)



//from grok


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

console.log("✅ [MODEL FILE START] Loading: backend/models/User.js");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
      required: [true, 'Role is required'],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    tagline: {
      type: String,
      maxlength: [100, 'Tagline cannot exceed 100 characters'],
      default: '',
    },
    badges: [
      {
        id: String,
        name: String,
        icon: String,
        color: String,
        awardedAt: Date,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    stripeConnectAccountId: {
      type: String,
      default: null,
    },
    payoutSettings: {
      country: { type: String, default: null },
      businessType: { type: String, enum: ['individual', 'company'], default: 'individual' },
      verificationStatus: { type: String, enum: ['not_started', 'pending', 'in_review', 'verified', 'rejected'], default: 'not_started' },
      chargesEnabled: { type: Boolean, default: false },
      payoutsEnabled: { type: Boolean, default: false },
      documentsRequired: [{ type: String }],
      bankingRequired: [{ type: String }],
      additionalFieldsRequired: [{ type: String }],
      identityVerified: { type: Boolean, default: false },
      identityVerificationDate: { type: Date, default: null },
      identityVerificationStatus: { type: String, enum: ['not_started', 'pending', 'verified', 'requires_input', 'failed'], default: 'not_started' },
      lastVerificationAttempt: { type: Date, default: null },
      lastUpdated: { type: Date, default: Date.now },
    },
    sellerProfile: {
      businessName: { type: String, default: null },
      businessAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      taxId: { type: String, default: null },
      phoneNumber: { type: String, default: null },
      website: { type: String, default: null },
      socialMedia: {
        twitter: String,
        linkedin: String,
        facebook: String,
      },
      autoReplyMessage: {
        type: String,
        maxlength: [500, 'Auto-reply message cannot exceed 500 characters'],
        default: 'Thank you for your purchase! We’ll process your order soon.',
      },
    },
    sellerStats: {
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      responseTime: { type: Number, default: 24 },
      completionRate: { type: Number, default: 100 },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ stripeConnectAccountId: 1 });
userSchema.index({ 'payoutSettings.verificationStatus': 1 });
userSchema.index({ deletedAt: 1 });

// Virtuals
userSchema.virtual('fullName').get(function () {
  return this.name;
});

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    console.log("[UserModel] Hashing password for user:", this.email);
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("[UserModel] Password hashing error:", error);
    next(error);
  }
});

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("[UserModel] Comparing password for user:", this.email);
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isVerifiedSeller = function () {
  return (
    this.role === 'seller' &&
    this.payoutSettings?.verificationStatus === 'verified' &&
    this.payoutSettings?.chargesEnabled === true &&
    this.payoutSettings?.payoutsEnabled === true
  );
};

userSchema.methods.getVerificationProgress = function () {
  if (!this.payoutSettings) return 0;
  let progress = 0;
  const steps = 5;
  if (this.stripeConnectAccountId) progress += 20;
  if (this.payoutSettings.identityVerified) progress += 30;
  if (this.payoutSettings.chargesEnabled) progress += 25;
  if (this.payoutSettings.payoutsEnabled) progress += 25;
  return Math.min(progress, 100);
};

// Statics
userSchema.statics.findActive = function () {
  return this.find({ deletedAt: null, isActive: true });
};

userSchema.statics.findVerifiedSellers = function () {
  return this.find({
    role: 'seller',
    deletedAt: null,
    isActive: true,
    'payoutSettings.verificationStatus': 'verified',
  });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

console.log("✅ [MODEL FILE END] Exporting User model from backend/models/User.js");

export default User;