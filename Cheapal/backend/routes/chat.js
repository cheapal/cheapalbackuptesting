// backend/routes/chat.js
import express from 'express';
import { protect } from '../middleware/auth.js';

import { accessChat, getMyChats, getMessages, sendMessage, blockUserInChat, reportChatUser } from '../controllers/chatController.js';
import { body, param, validationResult } from 'express-validator';
import upload from '../middleware/uploadMiddleware.js'; // Import the configured multer instance
import fs from 'fs'; // Import fs for deleting file on validation error

const router = express.Router();

// Middleware for validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const firstError = errors.array({ onlyFirstError: true })[0];
  console.error("❌ [CHAT VALIDATION FAILED] Path:", req.originalUrl, "Error:", firstError);

  if (req.file && req.file.path) {
      console.log(`Validation failed, attempting to delete uploaded file: ${req.file.path}`);
      fs.unlink(req.file.path, (err) => {
          if (err && err.code !== 'ENOENT') { console.error("Error deleting file after validation failure:", err); }
          else if (!err) { console.log("Successfully deleted file after validation failure."); }
      });
  }
  return res.status(422).json({
    success: false,
    message: firstError.msg || 'Validation failed.',
  });
};

// --- Chat Routes ---

router.post('/', protect, [ body('userId').notEmpty().isMongoId() ], validate, accessChat);
router.get('/', protect, getMyChats);
router.get('/:chatId/messages', protect, [ param('chatId').isMongoId() ], validate, getMessages);

// POST /api/chats/:chatId/messages - Send a message
router.post(
    '/:chatId/messages',
    protect,
    upload.single('chatImage'), // Multer middleware first
    [
        param('chatId', 'Invalid Chat ID format').isMongoId(),
        // --- FIX: Remove content validation here ---
        // body('content').optional({ checkFalsy: true }).trim().escape(), // Removed - Controller handles this
        // --- End Fix ---
        body('type').optional().isIn(['text', 'image']).withMessage('Invalid message type'),
    ],
    validate, // Run remaining validation
    sendMessage
);

// Block/Report Routes
router.post('/:chatId/block/:userIdToBlock', protect, [ param('chatId').isMongoId(), param('userIdToBlock').isMongoId() ], validate, blockUserInChat);
router.post('/:chatId/report', protect, [ param('chatId').isMongoId(), body('reportedUserId').isMongoId(), body('reason').trim().notEmpty().escape(), body('messageId').optional().isMongoId() ], validate, reportChatUser);

export default router;
