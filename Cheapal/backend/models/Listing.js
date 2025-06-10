// import mongoose from 'mongoose';

// console.log("✅ [MODEL FILE START] Loading: backend/models/Listing.js");

// const listingSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Title is required'],
//       trim: true,
//       maxlength: [100, 'Title cannot exceed 100 characters'],
//     },
//     description: {
//       type: String,
//       required: [true, 'Description is required'],
//       trim: true,
//       maxlength: [1000, 'Description cannot exceed 1000 characters'],
//     },
//     price: {
//       type: Number,
//       required: [true, 'Price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//     category: {
//       type: String,
//       required: [true, 'Category is required'],
//       trim: true,
//     },
//     duration: {
//       type: String,
//       required: [true, 'Duration is required'],
//       trim: true,
//       maxlength: [50, 'Duration cannot exceed 50 characters'],
//     },
//     autoReply: {
//       type: String,
//       trim: true,
//       maxlength: [500, 'Auto-reply cannot exceed 500 characters'],
//       default: '',
//     },
//     image: {
//       type: String,
//       default: '',
//     },
//     sellerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: [true, 'Seller ID is required'],
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending',
//     },
//     rejectionReason: {
//       type: String,
//       trim: true,
//       default: '',
//     },
//     isPremium: {
//       type: Boolean,
//       default: false,
//     },
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     featuredConfig: {
//       icon: { type: String, default: null },
//       gradient: { type: String, default: null },
//       rank: { type: Number, default: null },
//     },
//     isHomepageFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     homepageFeaturedConfig: {
//       rank: { type: Number, min: 1, max: 8 },
//       gradient: { type: String }, // e.g., "from-blue-600 via-purple-700 to-purple-800"
//       border: { type: String },  // e.g., "border-purple-500/30"
//     },
//     searchCount: {
//       type: Number,
//       default: 0,
//       min: [0, 'Search count cannot be negative'],
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// // Indexes for performance
// listingSchema.index({ isFeatured: 1, 'featuredConfig.rank': 1 });
// listingSchema.index({ isHomepageFeatured: 1, 'homepageFeaturedConfig.rank': 1 });
// listingSchema.index({ searchCount: -1 });

// const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

// console.log("✅ [MODEL FILE END] Exporting Listing model from backend/models/Listing.js");

// export default Listing;


//from grok

import mongoose from 'mongoose';

console.log("✅ [MODEL FILE START] Loading: backend/models/Listing.js");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      maxlength: [50, 'Duration cannot exceed 50 characters'],
    },
    autoReply: {
      type: String,
      trim: true,
      maxlength: [500, 'Auto-reply cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredConfig: {
      icon: { type: String, default: null },
      gradient: { type: String, default: null },
      rank: { type: Number, default: null },
    },
    isHomepageFeatured: {
      type: Boolean,
      default: false,
    },
    homepageFeaturedConfig: {
      rank: { type: Number, min: [1, 'Rank must be at least 1'] },
      gradient: { type: String },
      border: { type: String },
    },
    mainRank: {
      type: Number,
      min: [1, 'Main rank must be at least 1'],
      default: null,
      sparse: true,
    },
    searchCount: {
      type: Number,
      default: 0,
      min: [0, 'Search count cannot be negative'],
    },
    mainRankBid: { type: Number, default: 0 },
homepageFeaturedBid: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Validate homepageFeaturedConfig when isHomepageFeatured is true
listingSchema.pre('save', function (next) {
  if (this.isHomepageFeatured) {
    if (!this.homepageFeaturedConfig.rank || this.homepageFeaturedConfig.rank < 1) {
      return next(new Error('Rank is required and must be at least 1 for homepage featured listings'));
    }
    if (!this.homepageFeaturedConfig.gradient || typeof this.homepageFeaturedConfig.gradient !== 'string' || this.homepageFeaturedConfig.gradient.trim() === '') {
      return next(new Error('Gradient is required for homepage featured listings'));
    }
    if (!this.homepageFeaturedConfig.border || typeof this.homepageFeaturedConfig.border !== 'string' || this.homepageFeaturedConfig.border.trim() === '') {
      return next(new Error('Border is required for homepage featured listings'));
    }
  }
  next();
});

// Indexes for performance
listingSchema.index({ isFeatured: 1, 'featuredConfig.rank': 1 });
listingSchema.index({ isHomepageFeatured: 1, 'homepageFeaturedConfig.rank': 1 });
listingSchema.index({ mainRank: 1 });
listingSchema.index({ searchCount: -1 });

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

console.log("✅ [MODEL FILE END] Exporting Listing model from backend/models/Listing.js");

export default Listing;