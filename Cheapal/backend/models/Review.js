import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: { validator: Number.isInteger, message: 'Rating must be an integer' },
  },
  comment: { type: String, trim: true, maxlength: 1000 },
  sellerResponse: { type: String, trim: true, maxlength: 1000, default: null },
}, { timestamps: true });

reviewSchema.index({ seller: 1, createdAt: -1 });
reviewSchema.index({ buyer: 1 });

export default mongoose.model('Review', reviewSchema);