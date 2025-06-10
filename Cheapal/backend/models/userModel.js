import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Password will not be returned by default in queries
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  avatar: { // Added avatar as it's selected in server.js public profile route
    type: String 
  },
  bio: { // Added bio as it's selected in server.js public profile route
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  tagline: { // Added tagline as it's selected in server.js public profile route
    type: String,
    maxlength: [150, 'Tagline cannot exceed 150 characters']
  },
  totalSales: { // Added totalSales as it's selected in server.js public profile route
    type: Number,
    default: 0
  },
  averageRating: { // Added averageRating as it's selected in server.js public profile route
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: { // Added totalReviews as it's selected in server.js public profile route
    type: Number,
    default: 0
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordChangedAt: Date
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; // Ensure password is not sent in JSON responses
      delete ret.__v;
      return ret;
    }
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash the password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set passwordChangedAt if this is not a new document (i.e., password is being updated)
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token generated after this time
    }
    
    next();
  } catch (err) {
    console.error('Password hashing error:', err);
    next(err); // Pass error to the next middleware or save operation
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  // this.password is not available here if `select: false` is used and document wasn't queried with .select('+password')
  // For comparePassword to work, you need to ensure the hashed password is on the document instance.
  // If you always need to compare, consider removing select:false or explicitly selecting it when needed.
  // For now, assuming it will be selected when login occurs.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Password change tracking method
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // True if password was changed after the token was issued
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed after the token was issued
  return false;
};

// Optimized indexes
userSchema.index(
  { emailVerificationToken: 1 },
  { 
    name: 'email_verification_token_idx', // Optional: naming the index
    background: true, // Build index in the background
    partialFilterExpression: { emailVerificationToken: { $exists: true } } // Index only documents where this field exists
  }
);

userSchema.index(
  { resetPasswordToken: 1 },
  { 
    name: 'reset_password_token_idx', // Optional: naming the index
    background: true,
    partialFilterExpression: { resetPasswordToken: { $exists: true } }
  }
);

// Ensure email index for uniqueness and case-insensitivity (if needed, though lowercase:true helps)
// The unique:true in the schema definition already creates an index on email.
// If you need specific collation for case-insensitivity beyond what lowercase:true provides:
// userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });


// Corrected model export to prevent OverwriteModelError
export default mongoose.models.User || mongoose.model('User', userSchema);
