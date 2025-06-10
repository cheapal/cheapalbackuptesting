// backend/controllers/chatController.js
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Order from '../models/Order.js'; // Needed to verify buyer/seller relationship
import Listing from '../models/Listing.js'; // Needed to link orders to sellers
import mongoose from 'mongoose';
import fs from 'fs'; // Import fs for potential file deletion on error
import path from 'path'; // Import path for resolving file paths
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- Helper ---
const getIo = (req) => req.app?.locals?.io || req.io || null;

// --- Admin User ID (Ensure this is correctly set) ---
const ADMIN_USER_ID = '681a1c1c80f6185bd9b9c000'; // Use the actual ID you found
// -----------------------------------------------------------------------------

// Helper function to get relative image path
const getImagePath = (file) => {
    if (!file) return undefined;
    try {
        // Assumes 'uploads' directory is at the root of your backend project,
        // and chatController.js is in 'backend/controllers/'
        // So, '../uploads' from here would point to 'backend/uploads'
        const uploadsDir = path.resolve(__dirname, '../uploads');
        const relativePath = path.relative(uploadsDir, file.path);
        return relativePath.replace(/\\/g, '/'); // Normalize slashes
    } catch (error) {
        console.error("Error in getImagePath for chat:", error);
        return undefined;
    }
};


/**
 * @desc     Get or Create a chat between the logged-in user and another user.
 * Handles authorization rules.
 * @route    POST /api/chats
 * @access   Private
 */
export const accessChat = async (req, res) => {
    const { userId: targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) { return res.status(400).json({ success: false, message: 'Valid target User ID is required.' }); }
    if (currentUserId.equals(targetUserId)) { return res.status(400).json({ success: false, message: 'Cannot create chat with yourself.' }); }
    if (!mongoose.Types.ObjectId.isValid(ADMIN_USER_ID)) {
        console.error("FATAL: ADMIN_USER_ID in chatController.js is not a valid MongoDB ObjectId:", ADMIN_USER_ID);
        return res.status(500).json({ success: false, message: 'Chat system configuration error (Admin ID invalid).' });
    }

    console.log(`accessChat: User ${currentUserId} trying to access/create chat with ${targetUserId}`);
    try {
        const currentUser = req.user;
        const targetUser = await User.findById(targetUserId).select('role');
        if (!targetUser) { return res.status(404).json({ success: false, message: 'Target user not found.' }); }

        let canChat = false;
        const isAdminInitiating = currentUser.role === 'admin';
        const isTargetAdmin = targetUserId === ADMIN_USER_ID || targetUser.role === 'admin';
        const isSellerInitiating = currentUser.role === 'seller';
        const isBuyerInitiating = currentUser.role === 'buyer';
        const isTargetSeller = targetUser.role === 'seller';
        const isTargetBuyer = targetUser.role === 'buyer';

        // Authorization Rules
        if (isAdminInitiating || isTargetAdmin) { canChat = true; }
        else if (isSellerInitiating && isTargetBuyer) {
            const sellerListingIds = await Listing.find({ sellerId: currentUserId }).distinct('_id');
            const orderExists = await Order.findOne({ user: targetUserId, status: { $in: ['processing', 'completed'] }, 'orderItems.listing': { $in: sellerListingIds } });
            if (orderExists) { canChat = true; } else { console.log(`accessChat: Denied (Seller ${currentUserId} to Buyer ${targetUserId} - No relevant order found)`); }
        } else if (isBuyerInitiating && isTargetSeller) {
            const targetSellerListingIds = await Listing.find({ sellerId: targetUserId }).distinct('_id');
            const orderExists = await Order.findOne({ user: currentUserId, status: { $in: ['processing', 'completed'] }, 'orderItems.listing': { $in: targetSellerListingIds } });
            if (orderExists) { canChat = true; } else { console.log(`accessChat: Denied (Buyer ${currentUserId} to Seller ${targetUserId} - No relevant order found)`); }
        }

        if (!canChat) { return res.status(403).json({ success: false, message: 'You are not authorized to initiate a chat with this user.' }); }

        // Find or Create Chat
        let chat = await Chat.findOne({ isGroupChat: false, participants: { $all: [currentUserId, targetUserId], $size: 2 } })
            .populate('participants', 'name avatar email role')
            .populate({ path: 'latestMessage', populate: { path: 'sender', select: 'name avatar email role' } });

        if (chat) {
            console.log(`accessChat: Found existing chat ${chat._id}`);
            res.status(200).json({ success: true, data: chat });
        } else {
            console.log(`accessChat: Creating new chat between ${currentUserId} and ${targetUserId}`);
            const newChatData = { isGroupChat: false, participants: [currentUserId, targetUserId] };
            const createdChat = await Chat.create(newChatData);
            const fullChat = await Chat.findById(createdChat._id).populate('participants', 'name avatar email role');
            console.log(`accessChat: New chat ${fullChat._id} created`);

            const io = getIo(req);
            if(io && fullChat?.participants) {
                fullChat.participants.forEach(participant => {
                    // Emit to the other participant's user-specific room
                    if (!participant._id.equals(currentUserId)) {
                        const targetUserRoom = `user_${participant._id.toString()}`;
                        io.to(targetUserRoom).emit('newChat', fullChat); // Send the newly created chat object
                        console.log(`Emitted newChat ${fullChat._id} to room ${targetUserRoom}`);
                    }
                });
            }
            res.status(201).json({ success: true, data: fullChat });
        }
    } catch (error) {
        console.error('Error accessing/creating chat:', error);
        res.status(500).json({ success: false, message: 'Server error accessing chat.', error: error.message });
    }
};

/**
 * @desc     Fetch all chats for the logged-in user
 */
export const getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate('participants', 'name avatar email role')
            .populate({ path: 'latestMessage', populate: { path: 'sender', select: 'name avatar email role' } })
            .sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ success: false, message: 'Server error fetching chats.', error: error.message });
    }
};

/**
 * @desc     Fetch all messages for a specific chat
 */
export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(chatId)) { return res.status(400).json({ success: false, message: 'Invalid Chat ID format.' }); }
    try {
        const chat = await Chat.findOne({ _id: chatId, participants: { $elemMatch: { $eq: req.user._id } } })
                         .populate('participants', 'name avatar email role'); // Also populate participants for the chat object itself
        if (!chat) { return res.status(403).json({ success: false, message: 'Forbidden: You are not part of this chat.' }); }

        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'name avatar email role')
            .sort({ createdAt: 1 });

        // Return both messages and the chat object (which now includes populated participants)
        res.status(200).json({ success: true, data: { messages, chat } });
    } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        res.status(500).json({ success: false, message: 'Server error fetching messages.', error: error.message });
    }
};


/**
 * @desc     Send a new message (handles text and image uploads)
 */
export const sendMessage = async (req, res) => {
    const { content: textContent, type, tempIdUsedBySender } = req.body; // Get type and tempIdUsedBySender from body
    const { chatId } = req.params;
    const senderId = req.user._id;
    const senderRole = req.user.role;
    const file = req.file; // Get file from multer middleware

    console.log(`sendMessage: User ${senderId} to chat ${chatId}. File: ${!!file}. Type: ${type}. TempID: ${tempIdUsedBySender}`);

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        if (file && file.path) { try { fs.unlinkSync(file.path); console.log("Deleted file due to invalid chat ID:", file.path); } catch(e){ console.error("Error deleting file:", e);} }
        return res.status(400).json({ success: false, message: 'Invalid Chat ID format.' });
    }

    try {
        const chat = await Chat.findOne({ _id: chatId, participants: { $elemMatch: { $eq: senderId } } });
        if (!chat) {
            if (file && file.path) { try { fs.unlinkSync(file.path); console.log("Deleted file due to unauthorized chat access:", file.path); } catch(e){ console.error("Error deleting file:", e);} }
            return res.status(403).json({ success: false, message: 'Forbidden: You cannot send messages in this chat.' });
        }

        let messageType = type || 'text'; // Default to text if type not provided
        let messageContent = textContent ? textContent.trim() : '';

        // Determine message type and content based on file presence
        if (file) {
            messageType = 'image'; // Override type if file exists
            const imagePath = getImagePath(file); // This should return 'avatars/filename.ext' or 'chatImages/filename.ext'
            if (!imagePath) {
                if (file && file.path) { try { fs.unlinkSync(file.path); console.log("Deleted file due to image path processing error:", file.path); } catch(e){ console.error("Error deleting file:", e);} }
                throw new Error("Could not process uploaded image path.");
            }
            messageContent = imagePath; // Store the relative path like 'avatars/uuid.jpg' or 'chatImages/uuid.jpg'
            console.log(`sendMessage: Type 'image', content path: ${messageContent}`);
        } else if (messageType === 'text' && !messageContent) {
            return res.status(400).json({ success: false, message: 'Message content cannot be empty for text messages.' });
        } else if (messageType === 'image' && !file) {
            return res.status(400).json({ success: false, message: 'Image file is required for image messages.' });
        } else {
            console.log(`sendMessage: Type 'text', content: "${messageContent.substring(0, 30)}..."`);
        }

        // Backend Content Filtering
        if (messageType === 'text' && senderRole !== 'admin') {
            const isTargetAdmin = chat.participants.some(p => p.toString() === ADMIN_USER_ID && p.toString() !== senderId.toString());
            if (!isTargetAdmin) { // Only apply filter if not chatting with Admin
                const sensitiveInfoRegex = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}|[\w.-]+@[\w-]+\.[\w.-]+|\b(bank|account|iban|swift|bic|card number|credit card|cvv|pin)\b/i;
                const isSensitive = sensitiveInfoRegex.test(messageContent);
                if (isSensitive) {
                    console.warn(`Sensitive info detected from user ${senderId} in chat ${chatId}.`);
                    const io = getIo(req);
                    if (io) {
                        const adminNotificationRoom = `user_${ADMIN_USER_ID}`; // Specific room for admin user
                        const notification = {
                            title: 'Potential Policy Violation',
                            message: `User ${req.user.name} (${senderId}) may have shared sensitive info in chat ${chatId}. Message: "${messageContent.substring(0, 100)}..."`,
                            type: 'warning',
                            link: `/chat/${chatId}`, // Link for admin to check the chat
                            chatId: chatId,
                            offendingUserId: senderId,
                        };
                        io.to(adminNotificationRoom).emit('adminNotification', notification);
                        console.log(`Emitted adminNotification regarding sensitive content to ${adminNotificationRoom}`);
                    }
                }
            }
        }

        const newMessageData = { sender: senderId, content: messageContent, chat: chatId, messageType: messageType };
        let createdMessage = await Message.create(newMessageData);
        createdMessage = await createdMessage.populate('sender', 'name avatar role _id'); // Populate sender for the response
        
        // Update the chat's latestMessage and get populated participants for emission
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { latestMessage: createdMessage._id },
            { new: true }
        )
        .populate('participants', '_id name avatar role') // Populate participants for the chat object
        .populate({ // Populate latestMessage and its sender for the chat object
            path: 'latestMessage',
            populate: { path: 'sender', select: 'name avatar role _id' }
        });

        const io = getIo(req);
        if (io && updatedChat?.participants) {
            const messageForEmit = {
                _id: createdMessage._id,
                sender: {
                    _id: createdMessage.sender._id,
                    name: createdMessage.sender.name,
                    avatar: createdMessage.sender.avatar,
                    role: createdMessage.sender.role
                },
                content: createdMessage.content, // For images, this is 'avatars/filename.ext' or 'chatImages/filename.ext'
                messageType: createdMessage.messageType,
                chat: { // Client expects chat._id or chat (being the ID)
                    _id: chatId,
                    participants: updatedChat.participants.map(p => p._id) // Send participant IDs
                },
                createdAt: createdMessage.createdAt,
                updatedAt: createdMessage.updatedAt,
                tempIdUsedBySender: tempIdUsedBySender || null, // Echo back the tempId for optimistic UI
            };

            // 1. Emit to the specific chat room for active ChatPage instances
            const targetChatRoom = `chat_${chatId}`;
            io.to(targetChatRoom).emit('messageReceived', messageForEmit);
            console.log(`Emitted message ${createdMessage._id} to CHAT room ${targetChatRoom}`);

            // 2. Emit to each participant's user-specific room for ChatsListPage updates
            //    and other general notifications (like unread counts or new message indicators).
            updatedChat.participants.forEach(participant => {
                const userSpecificRoom = `user_${participant._id.toString()}`;
                // Send a slightly different payload if needed for chat list updates, or the same one
                // For simplicity, sending the same message object.
                // The client (ChatsListPage) will use this to update its state.
                io.to(userSpecificRoom).emit('messageReceived', { ...messageForEmit, chat: updatedChat }); // Send full updatedChat for list page
                console.log(`Emitted message (for list/notification) ${createdMessage._id} to USER room ${userSpecificRoom}`);
            });

        } else {
            console.warn(`Socket.IO instance not found or chat details missing for message ${createdMessage._id}. Cannot emit.`);
        }

        // Respond with the fully populated message
        res.status(201).json({ success: true, data: createdMessage });
    } catch (error) {
        console.error(`Error sending message to chat ${chatId}:`, error);
        if (file && file.path) { try { fs.unlinkSync(file.path); console.log("Deleted uploaded file due to error in sendMessage:", file.path); } catch (unlinkErr) { console.error("Error deleting uploaded file after error:", unlinkErr); } }
        res.status(500).json({ success: false, message: 'Server error sending message.', error: error.message });
    }
};


export const blockUserInChat = async (req, res) => {
    const { chatId, userIdToBlock } = req.params;
    const currentUserId = req.user._id;
    console.log(`User ${currentUserId} attempting to block ${userIdToBlock} in chat ${chatId}`);
    // TODO: Implement blocking logic
    // 1. Verify current user is part of the chat.
    // 2. Verify target user is part of the chat.
    // 3. Update a 'blockedUsers' array in the Chat model or a separate Block model.
    // 4. Prevent blocked users from sending/receiving messages in this specific chat.
    // 5. Emit an event to relevant clients if needed.
    res.status(501).json({ success: false, message: 'Block feature not implemented yet.' });
};

export const reportChatUser = async (req, res) => {
    const { chatId } = req.params;
    const { reportedUserId, reason, messageId } = req.body;
    const reporterUserId = req.user._id;
    console.log(`User ${reporterUserId} reporting user ${reportedUserId} in chat ${chatId}. Reason: ${reason}. Message ID: ${messageId || 'N/A'}`);
    // TODO: Implement reporting logic
    // 1. Verify reporter is part of the chat.
    // 2. Create a report record in the database (e.g., a 'reports' collection).
    // 3. Include details like reporter, reported user, chat ID, reason, optional message ID, timestamp.
    // 4. Notify admins (e.g., via Socket.IO event to admin's user_room or a dedicated notification system).
    const io = getIo(req);
    if (io) {
        const adminNotificationRoom = `user_${ADMIN_USER_ID}`;
        const reportNotification = {
            title: 'User Reported in Chat',
            message: `User ${req.user.name} (${reporterUserId}) reported user ${reportedUserId} in chat ${chatId}. Reason: ${reason}.`,
            type: 'warning',
            link: `/admin/reports/chat/${chatId}`, // Example link for admin panel
            chatId: chatId,
            reporterId: reporterUserId,
            reportedId: reportedUserId,
            reason: reason,
            messageId: messageId || null,
        };
        io.to(adminNotificationRoom).emit('adminNotification', reportNotification);
        console.log(`Emitted adminNotification for user report to ${adminNotificationRoom}`);
    }
    res.status(200).json({ success: true, message: 'Report submitted. Admins will review it.' }); // User-facing success
};
