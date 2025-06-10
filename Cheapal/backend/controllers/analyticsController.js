import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';

export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    // Get time frame (default: last 30 days)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get data in parallel
    const [subscriptions, orders, earnings] = await Promise.all([
      // Subscription stats
      Subscription.aggregate([
        { $match: { user: sellerId } },
        { 
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { 
              $sum: { 
                $cond: [{ $eq: ["$status", "approved"] }, 1, 0] 
              } 
            },
            pending: { 
              $sum: { 
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0] 
              } 
            }
          }
        }
      ]),
      
      // Order stats
      Order.aggregate([
        { 
          $match: { 
            seller: sellerId,
            createdAt: { $gte: startDate }
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalRevenue: { $sum: "$amount" },
            totalFees: { $sum: "$fee" }
          }
        }
      ]),
      
      // Daily earnings for chart
      Order.aggregate([
        { 
          $match: { 
            seller: sellerId,
            createdAt: { $gte: startDate }
          } 
        },
        {
          $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$createdAt" 
              } 
            },
            earnings: { $sum: { $subtract: ["$amount", "$fee"] } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        subscriptions: subscriptions[0] || { total: 0, active: 0, pending: 0 },
        orders: orders[0] || { total: 0, totalRevenue: 0, totalFees: 0 },
        earningsChart: earnings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};