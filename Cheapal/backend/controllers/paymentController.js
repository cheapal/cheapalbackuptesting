// backend/controllers/paymentController.js
import Stripe from 'stripe';
import Order from '../models/Order.js'; // Ensure this path is correct

// Log the Stripe secret key being used (for debugging purposes ONLY, remove or secure this log in production)
const stripeSecretKeyFromEnv = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKeyFromEnv) {
    console.error('🔴 CRITICAL: STRIPE_SECRET_KEY environment variable is NOT SET.');
} else {
    // Log only a portion of the key for verification in logs, not the whole key for security.
    console.log(`🔵 paymentController: Initializing Stripe with key ending in: ...${stripeSecretKeyFromEnv.slice(-4)}`);
}

// Initialize Stripe with your secret key
// IMPORTANT: Use an environment variable for your secret key in production!
const stripe = new Stripe(stripeSecretKeyFromEnv || 'sk_test_YOUR_FALLBACK_INVALID_KEY'); // Fallback to an obviously invalid key if not set

/**
 * @controller createPaymentIntent
 * @desc Create or update a Stripe PaymentIntent for an order.
 * @route POST /api/payments/create-payment-intent
 * @access Private (requires user authentication via 'protect' middleware)
 */
export const createPaymentIntent = async (req, res) => {
    console.log('--- Backend: createPaymentIntent ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request User (from protect middleware):', req.user?._id); // Log user ID if available
    console.log('Request Body (orderId, amount, currency):', req.body);

    if (!stripeSecretKeyFromEnv) {
        console.error('Stripe functionality disabled: STRIPE_SECRET_KEY is not set.');
        return res.status(500).json({ success: false, message: 'Payment processing is currently unavailable. Administrator has been notified.' });
    }

    const { orderId, amount, currency = 'usd' } = req.body;

    // Validate required fields
    if (!orderId) {
        console.error('Validation Error: Order ID is missing.');
        return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }
    if (amount === undefined || amount === null) {
        console.error('Validation Error: Amount is missing.');
        return res.status(400).json({ success: false, message: 'Amount is required.' });
    }
     if (isNaN(parseFloat(amount))) {
        console.error('Validation Error: Amount is not a valid number.');
        return res.status(400).json({ success: false, message: 'Amount must be a valid number.' });
    }

    try {
        console.log(`Fetching order with ID: ${orderId}`);
        const order = await Order.findById(orderId);
        if (!order) {
            console.error(`Order not found for ID: ${orderId}`);
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        console.log(`Order found: User ID on order is ${order.user}`);

        // Authorization check: Ensure the order belongs to the authenticated user
        if (!req.user || !req.user._id) {
            console.error('Authorization Error: User not authenticated or user ID missing in token.');
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }
        
        if (order.user.toString() !== req.user._id.toString()) {
            console.error(`Authorization Error: Order user ${order.user} does not match authenticated user ${req.user._id}`);
            return res.status(403).json({ success: false, message: 'Not authorized to pay for this order.' });
        }
        
        // Convert amount to the smallest currency unit (e.g., cents for USD)
        const amountInCents = Math.round(parseFloat(amount) * 100);
        console.log(`Calculated amount in cents: ${amountInCents}`);

        // Stripe has minimum charge amounts (e.g., $0.50 USD, €0.50 EUR)
        if (amountInCents < 50) { 
             console.error(`Validation Error: Amount ${amountInCents} cents is less than Stripe minimum (50 cents).`);
             return res.status(400).json({ success: false, message: 'Amount must be at least $0.50.' });
        }

        // Prepare PaymentIntent parameters
        const paymentIntentParams = {
            amount: amountInCents,
            currency: currency,
            metadata: { 
                orderId: orderId.toString(), // Store your internal order ID
                userId: req.user._id.toString(), // Store your internal user ID
            },
        };
        console.log('Stripe PaymentIntent parameters:', paymentIntentParams);

        let paymentIntent;

        if (order.paymentIntentId) {
            console.log(`Existing PaymentIntent ID found for order: ${order.paymentIntentId}. Attempting to update.`);
            try {
                paymentIntent = await stripe.paymentIntents.update(
                    order.paymentIntentId,
                    { 
                        amount: amountInCents, 
                        metadata: paymentIntentParams.metadata,
                    }
                );
                console.log(`Stripe PaymentIntent updated: ${paymentIntent.id}`);
            } catch (updateError) {
                console.warn(`Failed to update PaymentIntent ${order.paymentIntentId}, creating new one. Error:`, updateError.message);
                paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
                order.paymentIntentId = paymentIntent.id; 
                console.log(`New Stripe PaymentIntent created after update failed: ${paymentIntent.id}`);
            }
        } else {
            console.log('No existing PaymentIntent ID found. Creating new PaymentIntent.');
            paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
            order.paymentIntentId = paymentIntent.id;
            console.log(`New Stripe PaymentIntent created: ${paymentIntent.id}`);
        }
        
        console.log(`Saving order ${orderId} with PaymentIntent ID: ${order.paymentIntentId}`);
        await order.save();
        console.log('Order saved successfully.');

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error) {
        console.error('Stripe PaymentIntent Controller Error:', error.type, error.message, error.stack);
        // Check if it's a Stripe API error
        if (error.type && error.type.startsWith('Stripe')) {
             return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'A Stripe API error occurred.',
                error: error.type,
                stripeErrorCode: error.code, // e.g., 'api_key_invalid'
            });
        }
        // Generic server error
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create payment intent due to a server error.',
            error: 'Server Error',
        });
    }
};

/**
 * @controller stripeWebhook
 * @desc Handle webhook events from Stripe to update order status, etc.
 * @route POST /api/payments/webhook
 * @access Public (Webhook requests come from Stripe servers)
 */
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_STRIPE_WEBHOOK_SECRET'; // Replace with actual webhook secret
    let event;

    console.log('--- Backend: Stripe Webhook Received ---');
    console.log('Timestamp:', new Date().toISOString());

    if (!stripeSecretKeyFromEnv) { // Check if Stripe is configured before processing webhooks
        console.error('Stripe webhook processing skipped: STRIPE_SECRET_KEY is not set.');
        return res.status(500).send('Webhook processing unavailable.');
    }
    if (!endpointSecret || endpointSecret === 'whsec_YOUR_STRIPE_WEBHOOK_SECRET') {
        console.error('Stripe webhook processing skipped: STRIPE_WEBHOOK_SECRET is not set or is using placeholder.');
        return res.status(500).send('Webhook processing misconfigured.');
    }


    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('Webhook event constructed successfully:', event.id, event.type);
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log('✅ payment_intent.succeeded:', paymentIntentSucceeded.id, 'Order ID from metadata:', paymentIntentSucceeded.metadata.orderId);
            
            try {
                const order = await Order.findOne({ paymentIntentId: paymentIntentSucceeded.id });
                if (order) {
                    if (order.status !== 'completed') { 
                        order.status = 'completed';
                        order.paidAt = new Date(paymentIntentSucceeded.created * 1000); 
                        order.paymentResult = {
                            id: paymentIntentSucceeded.id,
                            status: paymentIntentSucceeded.status,
                            update_time: new Date().toISOString(), 
                        };
                        await order.save();
                        console.log(`Order ${order._id} marked as completed via webhook.`);
                        // TODO: Implement your fulfillment logic here
                    } else {
                        console.log(`Order ${order._id} already completed. Webhook for ${paymentIntentSucceeded.id} skipped additional processing.`);
                    }
                } else {
                    console.warn(`Webhook received for succeeded PaymentIntent ${paymentIntentSucceeded.id}, but no matching order found in DB.`);
                }
            } catch (dbError) {
                console.error('Error updating order from payment_intent.succeeded webhook:', dbError);
            }
            break;

        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log('❌ payment_intent.payment_failed:', paymentIntentFailed.id, 'Error:', paymentIntentFailed.last_payment_error?.message);
            
            try {
                const order = await Order.findOne({ paymentIntentId: paymentIntentFailed.id });
                if (order && order.status !== 'completed') { 
                    order.status = 'failed';
                    order.paymentResult = {
                        id: paymentIntentFailed.id,
                        status: paymentIntentFailed.status,
                        update_time: new Date().toISOString(),
                        error_message: paymentIntentFailed.last_payment_error?.message,
                    };
                    await order.save();
                    console.log(`Order ${order._id} marked as failed via webhook.`);
                }
            } catch (dbError) {
                 console.error('Error updating order to failed from payment_intent.payment_failed webhook:', dbError);
            }
            break;
        
        case 'payment_intent.requires_action':
            const paymentIntentRequiresAction = event.data.object;
            console.log('🔶 payment_intent.requires_action:', paymentIntentRequiresAction.id);
            try {
                const order = await Order.findOne({ paymentIntentId: paymentIntentRequiresAction.id });
                if (order && order.status !== 'completed' && order.status !== 'failed') {
                    order.status = 'requires_action'; 
                    await order.save();
                    console.log(`Order ${order._id} status set to requires_action via webhook.`);
                }
            } catch (dbError) {
                console.error('Error updating order to requires_action from webhook:', dbError);
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send({ received: true });
};


// --- Seller Order Management Functions ---
export const getSellerOrders = async (req, res) => {
    // ... (implementation as before)
    console.log('--- Backend: getSellerOrders ---');
    console.log('Request User (Seller ID):', req.user?._id);
    console.log('Query Params:', req.query);
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const query = { /* TODO: Define how to identify orders belonging to the seller (req.user.id) */ };
         if (status) query.status = status;
        
        console.log('Executing seller orders query:', query);
        const [orders, total] = await Promise.all([
        Order.find(query)
            .populate('user', 'name email') 
            .populate('orderItems.listing', 'title price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit, 10)),
        Order.countDocuments(query)
        ]);
        
        console.log(`Found ${orders.length} orders for seller, total ${total}.`);
        res.json({
        success: true,
        data: orders,
        pagination: {
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / parseInt(limit, 10)),
            limit: parseInt(limit, 10)
        }
        });
    } catch (error) {
        console.error("Error fetching seller orders:", error.message, error.stack);
        res.status(500).json({
        success: false,
        message: 'Failed to fetch orders for seller.'
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    // ... (implementation as before)
    console.log('--- Backend: updateOrderStatus (by Seller) ---');
    console.log('Request User (Seller ID):', req.user?._id);
    console.log('Order ID to update:', req.params.id);
    console.log('New Status from body:', req.body.status);
    try {
        const { status } = req.body;
        const validStatuses = ['pending_payment', 'processing', 'completed', 'failed', 'cancelled', 'requires_action']; 
        
        if (!validStatuses.includes(status)) {
            console.error('Invalid status for update:', status);
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided for order update.'
            });
        }
        
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: req.params.id /* AND SELLER AUTHORIZATION CONDITION */ }, 
            { status },
            { new: true } 
        ).populate('user', 'name email'); 
        
        if (!updatedOrder) {
            console.error('Order not found or seller not authorized to update for ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Order not found or seller not authorized to update this order.'
            });
        }
        
        console.log(`Order ${updatedOrder._id} status updated to ${status} by seller ${req.user._id}`);
        
        res.json({
        success: true,
        data: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order status by seller:", error.message, error.stack);
        res.status(500).json({
        success: false,
        message: 'Failed to update order status.'
        });
    }
};






