import express from 'express';
import Listing from '../models/Listing.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/my', protect, async (req, res) => {
  try {
    const sellerId = req.user._id;
    const listings = await Listing.find({ sellerId });

    const listingIds = listings.map(l => l._id);
    const sales = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $match: {
          'orderItems.listing': { $in: listingIds },
          status: { $in: ['completed', 'active'] }
        }
      },
      {
        $group: {
          _id: '$orderItems.listing',
          salesCount: { $sum: 1 },
          totalRevenue: { $sum: '$orderItems.price' }
        }
      }
    ]);

    const listingsWithSales = listings.map(listing => {
      const saleData = sales.find(s => s._id.toString() === listing._id.toString());
      return {
        ...listing.toObject(),
        salesCount: saleData ? saleData.salesCount : 0,
        totalRevenue: saleData ? saleData.totalRevenue : 0
      };
    });

    res.json({ success: true, listings: listingsWithSales });
  } catch (error) {
    console.error('[getMyListings] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
});

export default router;