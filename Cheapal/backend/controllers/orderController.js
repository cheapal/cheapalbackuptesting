// // backend/controllers/orderController.js
// import Order from '../models/Order.js';
// import Listing from '../models/Listing.js';
// import mongoose from 'mongoose';

// /**
//  * @controller createOrder
//  * @desc Create a new order from cart items.
//  * @route POST /api/orders
//  * @access Private (User)
//  */
// export const createOrder = async (req, res) => {
//     const { orderItems, paymentMethod } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//         return res.status(400).json({ success: false, message: 'No order items provided.' });
//     }

//     try {
//         let calculatedTotalPrice = 0;
//         const itemsToSave = [];

//         for (const item of orderItems) {
//             if (!item.listing || !mongoose.Types.ObjectId.isValid(item.listing) || !item.quantity || item.quantity < 1) {
//                 return res.status(400).json({ success: false, message: `Invalid data for an item in your order.` });
//             }
//             const dbListing = await Listing.findById(item.listing).select('price title duration image status sellerId');
//             if (!dbListing || dbListing.status !== 'approved') {
//                 return res.status(400).json({ success: false, message: `Listing "${item.title || item.listing}" is not available.` });
//             }

//             calculatedTotalPrice += dbListing.price * item.quantity;
//             itemsToSave.push({
//                 listing: dbListing._id,
//                 seller: dbListing.sellerId,
//                 title: dbListing.title,
//                 quantity: item.quantity,
//                 price: dbListing.price,
//                 duration: dbListing.duration,
//                 image: dbListing.image,
//             });
//         }

//         const order = new Order({
//             user: req.user._id,
//             orderItems: itemsToSave,
//             totalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
//             paymentMethod: paymentMethod || 'Not Specified',
//             status: 'completed',
//         });

//         const createdOrder = await order.save();
//         console.log(`[orderController] Order ${createdOrder._id} created for user ${req.user._id} with status ${createdOrder.status}`);

//         const populatedOrder = await Order.findById(createdOrder._id)
//             .populate({
//                 path: 'orderItems.listing',
//                 select: 'title category image sellerId duration',
//                 populate: {
//                     path: 'sellerId',
//                     select: 'name avatar'
//                 }
//             });

//         res.status(201).json({
//             success: true,
//             message: 'Order created successfully. Proceed to payment.',
//             data: populatedOrder,
//         });
//     } catch (error) {
//         console.error('[orderController] Error creating order:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating order.',
//             error: error.message,
//         });
//     }
// };

// /**
//  * @controller getMyOrders
//  * @desc Get orders for the logged-in user (buyer).
//  * @route GET /api/orders/my
//  * @access Private (User)
//  */
// export const getMyOrders = async (req, res) => {
//     console.log(`[orderController] getMyOrders called by user: ${req.user._id}`);
//     try {
//         const orders = await Order.find({ user: req.user._id }) // Filter by user (buyer)
//             .populate({
//                 path: 'orderItems.listing',
//                 select: 'title category image sellerId duration',
//                 populate: {
//                     path: 'sellerId',
//                     select: 'name avatar'
//                 }
//             })
//             .sort({ createdAt: -1 });

//         console.log(`[orderController] Found ${orders.length} orders for user ${req.user._id}. First order status (if any): ${orders[0]?.status || 'none'}`);

//         res.status(200).json({
//             success: true,
//             message: 'Fetched your orders successfully.',
//             data: orders,
//         });
//     } catch (error) {
//         console.error('[orderController] Error fetching user orders:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching your orders.',
//             error: error.message,
//         });
//     }
// };

// /**
//  * @controller getOrderById
//  * @desc Get a single order by its ID, ensuring it belongs to the logged-in user or an admin.
//  * @route GET /api/orders/:id
//  * @access Private (User who owns order, or Admin)
//  */
// export const getOrderById = async (req, res) => {
//     console.log(`[orderController] getOrderById called for ID: ${req.params.id} by user: ${req.user._id}`);
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ success: false, message: 'Invalid Order ID format.' });
//         }

//         const order = await Order.findById(req.params.id)
//             .populate('user', 'name email')
//             .populate({
//                 path: 'orderItems.listing',
//                 select: 'title category image sellerId duration',
//                 populate: {
//                     path: 'sellerId',
//                     select: 'name avatar'
//                 }
//             });

//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found.' });
//         }

//         if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//             return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Order fetched successfully.',
//             data: order,
//         });
//     } catch (error) {
//         console.error(`[orderController] Error fetching order by ID ${req.params.id}:`, error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching order details.',
//             error: error.message,
//         });
//     }
// };

//from grok

import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import mongoose from 'mongoose';

/**
 * @controller createOrder
 * @desc Create a new order from cart items.
 * @route POST /api/orders
 * @access Private (User)
 */
export const createOrder = async (req, res) => {
    const { orderItems, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ success: false, message: 'No order items provided.' });
    }

    try {
        let calculatedTotalPrice = 0;
        const itemsToSave = [];

        const listingIds = orderItems.map(item => item.listing);
        const listings = await Listing.find({ _id: { $in: listingIds }, status: 'approved' })
            .select('price title duration image status sellerId')
            .populate('sellerId', 'sellerProfile.autoReplyMessage');

        for (const item of orderItems) {
            if (!item.listing || !mongoose.Types.ObjectId.isValid(item.listing) || !item.quantity || item.quantity < 1) {
                return res.status(400).json({ success: false, message: `Invalid data for an item in your order.` });
            }
            const dbListing = listings.find(l => l._id.toString() === item.listing.toString());
            if (!dbListing || dbListing.status !== 'approved') {
                return res.status(400).json({ success: false, message: `Listing "${item.title || item.listing}" is not available.` });
            }

            calculatedTotalPrice += dbListing.price * item.quantity;
            itemsToSave.push({
                listing: dbListing._id,
                seller: dbListing.sellerId._id,
                title: dbListing.title,
                quantity: item.quantity,
                price: dbListing.price,
                duration: dbListing.duration,
                image: dbListing.image,
            });
        }

        // Aggregate seller messages
        const sellerIds = [...new Set(itemsToSave.map(item => item.seller.toString()))];
        const sellerMessages = await Promise.all(
            sellerIds.map(async (sellerId) => {
                const seller = listings.find(l => l.sellerId._id.toString() === sellerId)?.sellerId;
                return seller?.sellerProfile?.autoReplyMessage || 'Thank you for your order!';
            })
        );
        const aggregatedMessage = sellerMessages.join(' ');

        const order = new Order({
            user: req.user._id,
            orderItems: itemsToSave,
            totalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),
            paymentMethod: paymentMethod || 'Not Specified',
            status: 'completed',
            sellerMessage: {
                message: aggregatedMessage,
                loginDetails: {} // Placeholder
            }
        });

        const createdOrder = await order.save();
        console.log(`[orderController] Order ${createdOrder._id} created for user ${req.user._id} with status ${createdOrder.status}`);

        const populatedOrder = await Order.findById(createdOrder._id)
            .populate({
                path: 'orderItems.listing',
                select: 'title category image sellerId duration',
                populate: {
                    path: 'sellerId',
                    select: 'name avatar sellerProfile.autoReplyMessage'
                }
            });

        res.status(201).json({
            success: true,
            message: 'Order created successfully. Proceed to payment.',
            data: populatedOrder,
        });
    } catch (error) {
        console.error('[orderController] Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order.',
            error: error.message,
        });
    }
};

/**
 * @controller getMyOrders
 * @desc Get orders for the logged-in user (buyer).
 * @route GET /api/orders/my
 * @access Private (User)
 */
export const getMyOrders = async (req, res) => {
    console.log(`[orderController] getMyOrders called by user: ${req.user._id}`);
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'orderItems.listing',
                select: 'title category image sellerId duration',
                populate: {
                    path: 'sellerId',
                    select: 'name avatar sellerProfile.autoReplyMessage'
                }
            })
            .sort({ createdAt: -1 });

        console.log(`[orderController] Found ${orders.length} orders for user ${req.user._id}. First order status (if any): ${orders[0]?.status || 'none'}`);

        res.status(200).json({
            success: true,
            message: 'Fetched your orders successfully.',
            data: orders,
        });
    } catch (error) {
        console.error('[orderController] Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your orders.',
            error: error.message,
        });
    }
};

/**
 * @controller getOrderById
 * @desc Get a single order by its ID, ensuring it belongs to the logged-in user or an admin.
 * @route GET /api/orders/:id
 * @access Private (User who owns order, or Admin)
 */
export const getOrderById = async (req, res) => {
    console.log(`[orderController] getOrderById called for ID: ${req.params.id} by user: ${req.user._id}`);
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid Order ID format.' });
        }

        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'orderItems.listing',
                select: 'title category image sellerId duration',
                populate: {
                    path: 'sellerId',
                    select: 'name avatar sellerProfile.autoReplyMessage'
                }
            });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
        }

        res.status(200).json({
            success: true,
            message: 'Order fetched successfully.',
            data: order,
        });
    } catch (error) {
        console.error(`[orderController] Error fetching order by ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details.',
            error: error.message,
        });
    }
};