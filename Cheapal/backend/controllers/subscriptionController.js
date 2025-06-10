import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Helper function to delete image file safely
const deleteImageFile = (imagePath) => {
  const basePath = process.cwd();
  const fullPath = path.resolve(basePath, 'public', imagePath);

  console.log(`Attempting to delete image at: ${fullPath}`);

  if (imagePath && fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Successfully deleted image: ${fullPath}`);
    } catch (unlinkError) {
      console.error(`Error deleting image ${fullPath}:`, unlinkError);
    }
  } else if (imagePath) {
    console.warn(`Image file not found for deletion: ${fullPath}`);
  }
};

// --- Controller Functions ---

export const createSubscription = async (req, res, next) => {
  console.log('[Controller createSubscription] Entered. User:', req.user?.id);
  console.log('[Controller createSubscription] Request body:', req.body);
  console.log('[Controller createSubscription] Request file:', req.file ? { filename: req.file.filename, path: req.file.path } : 'No file received by controller');

  try {
    const { title, description, price, category } = req.body;

    const errors = [];
    if (!title) errors.push('Title is required');
    if (!description) errors.push('Description is required');
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) errors.push('Valid price is required');

    if (errors.length > 0) {
      console.log('[Controller createSubscription] Validation failed:', errors);
      if (req.file) {
        console.log('[Controller createSubscription] Deleting uploaded image due to validation errors.');
        deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    const subscriptionData = {
      user: req.user.id,
      title,
      description,
      price: parseFloat(price),
      category: category || 'streaming',
      status: 'pending'
    };

    if (req.file) {
      const relativeImagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      subscriptionData.image = relativeImagePath;
      console.log('[Controller createSubscription] Saving image path as:', relativeImagePath);
    } else {
      console.log('[Controller createSubscription] No image file provided, proceeding without image.');
    }

    console.log('[Controller createSubscription] Attempting to create subscription with data:', subscriptionData);
    const subscription = await Subscription.create(subscriptionData);
    console.log('[Controller createSubscription] Subscription created successfully:', subscription._id);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('[Controller createSubscription] Error occurred:', error);
    if (req.file) {
      console.log('[Controller createSubscription] Deleting uploaded image due to error during creation.');
      deleteImageFile(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Subscription creation failed',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

export const getSellerSubscriptions = async (req, res, next) => {
  console.log('[Controller getSellerSubscriptions] Fetching subscriptions for user:', req.user?.id);
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    console.error('[Controller getSellerSubscriptions] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller subscriptions'
    });
  }
};

export const getApprovedSubscriptions = async (req, res, next) => {
  console.log('[Controller getApprovedSubscriptions] Fetching approved subscriptions. Query:', req.query);
  try {
    const queryFilter = { status: 'approved' };
    if (req.query.category) {
      queryFilter.category = req.query.category;
    }
    console.log('[Controller getApprovedSubscriptions] Applying filter:', queryFilter);

    const subscriptions = await Subscription.find(queryFilter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    console.error('[Controller getApprovedSubscriptions] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved subscriptions'
    });
  }
};

export const getSubscriptionById = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Controller getSubscriptionById] Fetching subscription with ID: ${id}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`[Controller getSubscriptionById] Invalid ID format: ${id}`);
      return res.status(400).json({ success: false, message: 'Invalid subscription ID format' });
    }

    const subscription = await Subscription.findById(id)
      .populate('user', 'name avatar');

    if (!subscription) {
      console.log(`[Controller getSubscriptionById] Subscription not found with ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    console.log(`[Controller getSubscriptionById] Found subscription: ${subscription._id}`);
    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error(`[Controller getSubscriptionById] Error fetching subscription ID ${id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription details',
      error: error.message
    });
  }
};

export const updateSubscription = async (req, res, next) => {
  console.log('[Controller updateSubscription] Entered. User:', req.user?.id, 'Params ID:', req.params.id);
  console.log('[Controller updateSubscription] Request body:', req.body);
  console.log('[Controller updateSubscription] Request file:', req.file ? { filename: req.file.filename, path: req.file.path } : 'No file received');

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      if (req.file) deleteImageFile(req.file.path);
      return res.status(400).json({ success: false, message: 'Invalid subscription ID format' });
    }

    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      console.log('[Controller updateSubscription] Subscription not found or user not authorized.');
      if (req.file) deleteImageFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Subscription not found or not authorized'
      });
    }

    const oldImageRelativePath = subscription.image;
    const updates = { ...req.body };

    if (req.file) {
      const relativeImagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      updates.image = relativeImagePath;
      console.log('[Controller updateSubscription] New image uploaded, path:', relativeImagePath);
    } else {
      delete updates.image;
    }

    if (updates.price) {
      updates.price = parseFloat(updates.price);
      if (isNaN(updates.price) || updates.price <= 0) {
        if (req.file) deleteImageFile(req.file.path);
        return res.status(400).json({ success: false, message: 'Invalid price provided' });
      }
    }
    delete updates.status;
    delete updates.user;

    console.log('[Controller updateSubscription] Applying updates:', updates);
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (req.file && oldImageRelativePath && updates.image !== oldImageRelativePath) {
      console.log('[Controller updateSubscription] Deleting old image:', oldImageRelativePath);
      deleteImageFile(oldImageRelativePath);
    }

    console.log('[Controller updateSubscription] Subscription updated successfully:', updatedSubscription._id);
    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription
    });
  } catch (error) {
    console.error('[Controller updateSubscription] Error occurred:', error);
    if (req.file) {
      console.log('[Controller updateSubscription] Deleting uploaded image due to error during update.');
      deleteImageFile(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update subscription',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

export const deleteSubscription = async (req, res, next) => {
  console.log('[Controller deleteSubscription] Entered. User:', req.user?.id, 'Params ID:', req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription ID format' });
    }

    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      console.log('[Controller deleteSubscription] Subscription not found or user not authorized.');
      return res.status(404).json({
        success: false,
        message: 'Subscription not found or not authorized'
      });
    }

    if (subscription.image) {
      console.log('[Controller deleteSubscription] Deleting associated image:', subscription.image);
      deleteImageFile(subscription.image);
    }

    console.log('[Controller deleteSubscription] Subscription deleted successfully:', req.params.id);
    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('[Controller deleteSubscription] Error occurred:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete subscription',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

export const getFeatured = async (req, res, next) => {
  console.log('[Controller getFeatured] Fetching featured subscriptions');
  try {
    // Validate query parameters if any
    const query = { isFeatured: true };
    if (req.query.listingId && !mongoose.Types.ObjectId.isValid(req.query.listingId)) {
      console.log(`[Controller getFeatured] Invalid listing ID in query: ${req.query.listingId}`);
      return res.status(400).json({ success: false, message: 'Invalid listing ID format' });
    }

    const subscriptions = await Subscription.find(query)
      .populate('user', 'name avatar')
      .sort({ 'featuredConfig.rank': 1 })
      .lean();

    // Filter out invalid subscriptions
    const validSubscriptions = subscriptions.filter(subscription => {
      if (!mongoose.Types.ObjectId.isValid(subscription._id)) {
        console.error(`[Controller getFeatured] Invalid subscription ID: ${subscription._id}`);
        return false;
      }
      return true;
    });

    console.log(`[Controller getFeatured] Retrieved ${validSubscriptions.length} featured subscriptions`);
    res.status(200).json({
      success: true,
      count: validSubscriptions.length,
      data: validSubscriptions
    });
  } catch (error) {
    console.error('[Controller getFeatured] Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured subscriptions',
      error: error.message
    });
  }
};