import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get public profile by ID
router.get('/public-profile/:sellerId', asyncHandler(async (req, res) => {
    const { sellerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        res.status(400);
        throw new Error('Invalid seller ID format.');
    }
    const user = await User.findById(sellerId).select('name email avatar bio tagline badges verificationStatus role');
    if (!user || user.deletedAt) {
        res.status(404);
        throw new Error('User not found.');
    }
    if (user.role !== 'seller') {
        res.status(400);
        throw new Error(`User is not a seller. Their role is: ${user.role || 'undefined'}.`);
    }
    res.json({ success: true, data: user });
}));

// Get private user profile
router.get('/:userId', protect, asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400);
        throw new Error('Invalid user ID format.');
    }
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to access this profile.');
    }
    const user = await User.findById(userId).select('-password');
    if (!user || user.deletedAt) {
        res.status(404);
        throw new Error('User not found.');
    }
    res.json({ success: true, data: user });
}));

// Update user profile
router.put('/:userId', protect, asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, email, bio, tagline } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400);
        throw new Error('Invalid user ID format.');
    }
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this profile.');
    }
    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
        res.status(404);
        throw new Error('User not found.');
    }
    if (name) user.name = name.trim();
    if (email) {
        const normalizedEmail = email.toLowerCase().trim();
        if (normalizedEmail !== user.email) {
            const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
            if (existingUser) {
                res.status(400);
                throw new Error('Email already in use.');
            }
            user.email = normalizedEmail;
        }
    }
    if (bio) user.bio = bio.trim();
    if (tagline) user.tagline = tagline.trim();
    const updatedUser = await user.save();
    res.json({ success: true, data: updatedUser });
}));

export default router;