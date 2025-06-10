// backend/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Type of the message (e.g., text, image, video)
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'file'], // Added 'file' as a possibility
      default: 'text'
    },
    // Content of the message
    content: {
        type: String,
        trim: true,
        required: true
    },
    // Reference to the chat this message belongs to
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true, // Index for faster message retrieval per chat
    },
    // Optional: Track if recipients have read the message
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // Optional: For optimistic UI updates on client-side before server confirmation
    tempIdUsedBySender: {
        type: String,
        index: true, // Index if you plan to query by this, though usually not needed long-term
        sparse: true // If not all messages will have this
    }
  },
  {
    timestamps: true, // Adds createdAt (timestamp) and updatedAt
  }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
