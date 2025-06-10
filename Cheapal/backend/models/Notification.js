import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'subscription_approved',
      'subscription_rejected',
      'new_sale',
      'payment_received',
      'admin_message',
      'promotion_bid' // Added for promotion bidding notifications
    ]
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedEntityType' // Dynamic reference based on relatedEntityType
  },
  relatedEntityType: {
    type: String,
    enum: ['Subscription', 'Order', 'Payment', 'Listing'], // Added 'Listing' for promotion bids
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the bot or user sending the notification
    required: false // Optional, as some notifications may not have a specific sender
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Flexible to store promotion details
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 }); // Added for filtering by notification type

export default mongoose.model('Notification', notificationSchema);