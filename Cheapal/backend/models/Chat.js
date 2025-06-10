// // backend/models/Chat.js
// import mongoose from 'mongoose';

// const chatSchema = new mongoose.Schema(
//   {
//     // Optional: for group chats later
//     // chatName: { type: String, trim: true },
//     isGroupChat: {
//         type: Boolean,
//         default: false
//     },
//     // Array of users participating in the chat
//     participants: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User', // Reference to the User model
//             required: true,
//         }
//     ],
//     // Reference to the latest message for quick display in chat lists
//     latestMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Message', // Reference to the Message model
//     },
//     // Optional: Admin user who might manage or oversee the chat (for group chats)
//     // groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt automatically
//   }
// );

// // Index participants for faster querying of user's chats
// chatSchema.index({ participants: 1 });
// // Index for sorting by update time (when latestMessage is updated)
// chatSchema.index({ updatedAt: -1 });


// const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

// export default Chat;


//from grok

// backend/models/Chat.js
import mongoose from "mongoose"

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isGroupChat: { type: Boolean, default: false },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    firstSellerResponseAt: { type: Date, default: null }, // New: Track seller's first response
    expiresAt: { type: Date, default: null }, // New: Expiration date
    isExpired: { type: Boolean, default: false }, // New: Expiration status
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // ADD THIS FIELD
  },
  { timestamps: true },
)

chatSchema.index({ expiresAt: 1 })

export default mongoose.model("Chat", chatSchema)
