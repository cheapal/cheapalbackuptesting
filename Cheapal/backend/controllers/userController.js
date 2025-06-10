// // backend/controllers/userController.js
// import User from '../models/User.js'; // Ensure this path is correct for your User model
// import mongoose from 'mongoose'; // For ObjectId validation
// import stripe from 'stripe'; // Uncomment if needed, appears used in upgradeToSeller
// // const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY); // Define if used globally

// // --- GET CURRENT USER'S PROFILE ---
// export const getMyProfile = async (req, res, next) => {
//     try {
//         // req.user.id should be populated by your 'protect' authentication middleware
//         const user = await User.findById(req.user.id).select('-password'); // Exclude password from selection
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         next(error); // Pass error to the global error handler
//     }
// };

// // --- UPDATE CURRENT USER'S PROFILE ---
// export const updateMyProfile = async (req, res, next) => {
//     try {
//         // Destructure text fields from req.body. The avatar comes from req.file.
//         const { name, email, bio, password, tagline } = req.body; // Added tagline
//         const userId = req.user.id; // From 'protect' middleware

//         const fieldsToSelect = password ? '+password' : '';
//         const user = await User.findById(userId).select(fieldsToSelect);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Update basic fields if provided
//         if (name) user.name = name;
//         if (typeof bio === 'string') user.bio = bio;
//         if (typeof tagline === 'string') user.tagline = tagline; // Added tagline update

//         if (email && email.toLowerCase() !== user.email.toLowerCase()) {
//             const existingUser = await User.findOne({ email: email.toLowerCase() });
//             if (existingUser && existingUser._id.toString() !== userId) {
//                 return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
//             }
//             user.email = email.toLowerCase();
//         }

//         if (password) {
//             if (password.length < 8) {
//                 return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
//             }
//             user.password = password; // The pre-save hook in User model will hash this
//         }

//         if (req.file) {
//             const avatarPath = `avatars/${req.file.filename}`; // Assuming multer saves to uploads/avatars/
//             user.avatar = avatarPath;
//             console.log(`User ${userId} new avatar path set to: ${avatarPath}`);
//         }
//         // Add bannerUrl update logic if applicable, similar to avatar
//         // if (req.files && req.files.banner) { user.bannerUrl = `banners/${req.files.banner[0].filename}`; }


//         const updatedUser = await user.save();
//         const userToReturn = updatedUser.toObject();
//         delete userToReturn.password;

//         res.status(200).json({
//             success: true,
//             message: 'Profile updated successfully!',
//             user: userToReturn,
//         });

//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//             return res.status(400).json({ success: false, message: 'Email already in use.' });
//         }
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ success: false, message: error.message });
//         }
//         next(error);
//     }
// };

// // --- UPLOAD CURRENT USER'S AVATAR (Dedicated Route Handler) ---
// export const uploadMyAvatar = async (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No avatar file uploaded or file type was not permitted.' });
//         }
//         const relativeAvatarPath = `avatars/${req.file.filename}`; // Assuming multer saves to uploads/avatars/
//         user.avatar = relativeAvatarPath;
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: 'Avatar uploaded successfully',
//             avatarPath: relativeAvatarPath,
//         });
//     } catch (error) {
//         console.error('Error in uploadMyAvatar controller:', error);
//         next(error);
//     }
// };

// // --- DELETE CURRENT USER'S ACCOUNT ---
// export const deleteMyAccount = async (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         // Consider soft delete or more complex cleanup (e.g., anonymizing data)
//         await User.findByIdAndDelete(userId);

//         res.status(200).json({ success: true, message: 'Account deleted successfully. You have been logged out.' });
//     } catch (error) {
//         console.error('Error deleting account:', error);
//         next(error);
//     }
// };


// // --- Seller-specific functions ---
// export const upgradeToSeller = async (req, res, next) => {
//     try {
//         const { businessName, taxId, phone } = req.body;
//         const userId = req.user.id;

//         if (!businessName || !phone) {
//             return res.status(400).json({ success: false, message: 'Business name and phone are required for seller upgrade.' });
//         }
        
//         const currentUser = await User.findById(userId);
//         if (!currentUser) {
//              return res.status(404).json({ success: false, message: 'User not found.' });
//         }
//         if (currentUser.role === 'seller' && currentUser.sellerProfile?.stripeAccountId) {
//             return res.status(400).json({ success: false, message: 'Account is already a seller.' });
//         }

//         // Ensure STRIPE_SECRET_KEY is loaded from .env
//         if (!process.env.STRIPE_SECRET_KEY) {
//             console.error("STRIPE_SECRET_KEY is not set in environment variables.");
//             return res.status(500).json({ success: false, message: "Payment provider configuration error." });
//         }
//         const stripeInstanceForOp = stripe(process.env.STRIPE_SECRET_KEY);

//         const account = await stripeInstanceForOp.accounts.create({
//             type: 'express',
//             country: 'US', // Or your user's country, ensure this is compliant
//             email: currentUser.email,
//             capabilities: {
//                 card_payments: { requested: true },
//                 transfers: { requested: true },
//             },
//             business_type: 'individual',
//             individual: {
//                 first_name: currentUser.name.split(' ')[0],
//                 last_name: currentUser.name.split(' ').slice(1).join(' ') || currentUser.name.split(' ')[0],
//                 email: currentUser.email,
//                 phone: phone,
//             },
//             business_profile: {
//                 name: businessName,
//                 mcc: '5734', // Example MCC, choose an appropriate one
//                 url: process.env.FRONTEND_URL,
//                 product_description: 'Services and subscriptions sold on the platform',
//             },
//             settings: {
//                 payouts: {
//                     schedule: {
//                         interval: 'daily',
//                     },
//                 },
//             },
//         });

//         currentUser.role = 'seller';
//         currentUser.sellerProfile = { // Assuming sellerProfile is part of your User schema or you handle it
//             businessName,
//             taxId: taxId || '',
//             phone,
//             stripeAccountId: account.id,
//             isVerified: false, // Stripe onboarding will verify
//         };
        
//         const updatedUser = await currentUser.save();

//         const accountLink = await stripeInstanceForOp.accountLinks.create({
//             account: account.id,
//             refresh_url: `${process.env.FRONTEND_URL}/seller/onboarding/refresh`,
//             return_url: `${process.env.FRONTEND_URL}/seller/dashboard?onboarding_complete=true`,
//             type: 'account_onboarding',
//         });

//         const userToReturn = updatedUser.toObject();
//         delete userToReturn.password;

//         res.status(200).json({ 
//             success: true, 
//             message: 'Stripe account created. Please complete onboarding.',
//             user: userToReturn, 
//             onboardingUrl: accountLink.url 
//         });
//     } catch (error) {
//         console.error('Upgrade to seller error:', error);
//         if (error.type === 'StripeCardError' || error.type === 'StripeInvalidRequestError') { // Catch more Stripe errors
//              return res.status(400).json({ success: false, message: `Stripe Error: ${error.message}` });
//         }
//         next(error);
//     }
// };

// // --- GET PUBLIC USER PROFILE BY ID (FOR SELLER PROFILE PAGE) ---
// export const getPublicUserProfile = async (req, res, next) => {
//     try {
//         const { sellerId } = req.params; 

//         console.log(`[UserController/getPublicUserProfile] Attempting to fetch profile for sellerId: ${sellerId}`);

//         if (!sellerId) {
//             console.log("[UserController/getPublicUserProfile] Error: Seller ID is missing from request params.");
//             return res.status(400).json({ success: false, message: 'Seller ID is required in the URL.' });
//         }
//         if (!mongoose.Types.ObjectId.isValid(sellerId)) {
//             console.log(`[UserController/getPublicUserProfile] Error: Invalid Seller ID format: ${sellerId}`);
//             return res.status(400).json({ success: false, message: 'Invalid Seller ID format.' });
//         }

//         // Define fields to select. Ensure 'role' is included.
//         // Add 'username' and 'bannerUrl' if they exist on your User model.
//         // Fields like totalSalesCount, averageRating, totalReviews are not on the base User model
//         // and would need to be populated from elsewhere or handled if missing by the frontend.
//         const selectedFields = 'name email avatar role bio tagline createdAt username bannerUrl';
//         console.log(`[UserController/getPublicUserProfile] Fetching user with fields: ${selectedFields}`);

//         const userFromDB = await User.findById(sellerId).select(selectedFields).lean(); 

//         if (!userFromDB) {
//             console.log(`[UserController/getPublicUserProfile] User not found for ID: ${sellerId}`);
//             return res.status(404).json({ success: false, message: 'User profile not found.' });
//         }

//         console.log(`[UserController/getPublicUserProfile] User data fetched from DB for ID ${sellerId}:`, JSON.stringify(userFromDB, null, 2));
//         console.log(`[UserController/getPublicUserProfile] Role for user ${sellerId} from DB: ${userFromDB.role}`);

//         res.status(200).json({ success: true, data: userFromDB });

//     } catch (error) {
//         console.error(`[UserController/getPublicUserProfile] Error fetching public user profile for ID ${req.params.sellerId}:`, error);
//         if (error.name === 'CastError' && error.path === '_id') {
//              console.log(`[UserController/getPublicUserProfile] CastError for ID: ${req.params.sellerId}`);
//             return res.status(400).json({ success: false, message: 'Invalid Seller ID format (CastError).' });
//         }
//         next(error); 
//     }
// };





//from gemini

// backend/controllers/userController.js
import User from '../models/User.js'; // Ensure this path is correct for your User model
import Listing from '../models/Listing.js'; // For fetching seller's listings
import Order from '../models/Order.js'; // For fetching user's order history
import Notification from '../models/Notification.js'; // For sending notifications
import mongoose from 'mongoose';
import stripePackage from 'stripe'; // Renamed to avoid conflict with local 'stripe' variable if any

// Initialize Stripe with your secret key
const stripeSecretKeyFromEnv = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKeyFromEnv) {
    console.error('🔴 CRITICAL: STRIPE_SECRET_KEY environment variable is NOT SET in userController.');
}
const stripe = new stripePackage(stripeSecretKeyFromEnv || 'sk_test_YOUR_FALLBACK_INVALID_KEY_USER');

const getIo = (req) => {
    return req.app?.locals?.io || req.io || null;
};

// --- GET CURRENT USER'S PROFILE ---
export const getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user || user.deletedAt) { // Check for soft deletion
            return res.status(404).json({ success: false, message: 'User not found or account deactivated.' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        next(error);
    }
};

// --- UPDATE CURRENT USER'S PROFILE ---
export const updateMyProfile = async (req, res, next) => {
    try {
        const { name, email, bio, password, tagline } = req.body;
        const userId = req.user.id;

        // Select password field only if a new password is being provided to check against the old one if needed
        // Or, if just updating, the pre-save hook will handle hashing if 'password' field is modified.
        const user = await User.findById(userId); // No need to .select('+password') unless comparing old pass

        if (!user || user.deletedAt) {
            return res.status(404).json({ success: false, message: 'User not found or account deactivated.' });
        }

        if (name) user.name = name.trim();
        if (typeof bio === 'string') user.bio = bio.trim();
        if (typeof tagline === 'string') user.tagline = tagline.trim();

        if (email && email.toLowerCase().trim() !== user.email.toLowerCase()) {
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: userId }, deletedAt: null });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use by another active account.' });
            }
            user.email = normalizedEmail;
        }

        if (password) {
            if (password.length < 8) { // Basic validation
                return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
            }
            user.password = password; // Hashing is handled by pre-save hook in User model
        }

        if (req.file) { // Assuming 'avatarUpload' middleware added 'file' to 'req'
            const avatarPath = `avatars/${req.file.filename}`;
            user.avatar = avatarPath;
            console.log(`User ${userId} new avatar path set to: ${avatarPath}`);
        }
        // Add bannerUrl update logic if you have a separate upload field for banners
        // e.g., if (req.files && req.files.banner) user.bannerUrl = `banners/${req.files.banner[0].filename}`;

        const updatedUser = await user.save();
        const userToReturn = updatedUser.toObject();
        delete userToReturn.password; // Ensure password is not sent back

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: userToReturn,
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ success: false, message: 'Email already in use.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

// --- UPLOAD CURRENT USER'S AVATAR (Dedicated Route Handler if using separate endpoint) ---
export const uploadMyAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.deletedAt) {
            return res.status(404).json({ success: false, message: 'User not found or account deactivated.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No avatar file uploaded or file type was not permitted.' });
        }
        const relativeAvatarPath = `avatars/${req.file.filename}`;
        user.avatar = relativeAvatarPath;
        await user.save();

        const userToReturn = user.toObject();
        delete userToReturn.password;


        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatarPath: relativeAvatarPath,
            user: userToReturn // Send back updated user object
        });
    } catch (error) {
        console.error('Error in uploadMyAvatar controller:', error);
        next(error);
    }
};


// --- DELETE CURRENT USER'S ACCOUNT (Soft Delete) ---
export const deleteMyAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.deletedAt) {
            return res.status(404).json({ success: false, message: 'User not found or account already deactivated.' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admin accounts cannot be deleted through this interface.' });
        }

        user.deletedAt = new Date();
        user.isBlocked = true; // Block account upon deletion
        user.email = `${user.email}_deleted_${Date.now()}`; // Anonymize email slightly
        // Consider other fields to clear or anonymize

        // TODO: Handle user's listings - e.g., mark as archived or unpublish
        // await Listing.updateMany({ sellerId: userId }, { status: 'archived' });

        await user.save();

        // Clear the JWT cookie
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.status(200).json({ success: true, message: 'Account deactivated successfully. You have been logged out.' });
    } catch (error) {
        console.error('Error deactivating account:', error);
        next(error);
    }
};


// --- Seller-specific functions ---
export const upgradeToSeller = async (req, res, next) => {
    try {
        const { businessName, taxId, phone, country = 'US' } = req.body; // Default country, make dynamic if needed
        const userId = req.user.id;

        if (!businessName || !phone) {
            return res.status(400).json({ success: false, message: 'Business name and phone are required for seller upgrade.' });
        }
        
        const currentUser = await User.findById(userId);
        if (!currentUser || currentUser.deletedAt) {
            return res.status(404).json({ success: false, message: 'User not found or account deactivated.' });
        }
        if (currentUser.role === 'seller' && currentUser.sellerProfile?.stripeAccountId && currentUser.sellerProfile?.stripeOnboardingComplete) {
            return res.status(400).json({ success: false, message: 'Account is already a fully onboarded seller.' });
        }
        if (currentUser.role === 'admin') {
             return res.status(403).json({ success: false, message: 'Admin accounts cannot be upgraded to sellers.' });
        }


        if (!stripe || stripeSecretKeyFromEnv === 'sk_test_YOUR_FALLBACK_INVALID_KEY_USER') {
            console.error("Stripe functionality disabled in upgradeToSeller: STRIPE_SECRET_KEY is not set or is a placeholder.");
            return res.status(500).json({ success: false, message: "Payment provider configuration error. Cannot setup seller account." });
        }

        let stripeAccountId = currentUser.sellerProfile?.stripeAccountId;

        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: country,
                email: currentUser.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: 'individual', // Or 'company' based on more detailed form
                individual: { // Basic individual details
                    first_name: currentUser.name.split(' ')[0],
                    last_name: currentUser.name.split(' ').slice(1).join(' ') || currentUser.name.split(' ')[0], // Handle single name
                    email: currentUser.email,
                    phone: phone,
                },
                business_profile: {
                    name: businessName,
                    mcc: '5734', // Example MCC: Computer Software Stores. Choose an appropriate one.
                    url: process.env.FRONTEND_URL, // Your platform's URL
                    product_description: `Digital goods and subscriptions sold on ${process.env.APP_NAME || 'the platform'}.`,
                },
                settings: {
                    payouts: {
                        schedule: {
                            interval: 'daily', // Or 'weekly', 'manual'
                        },
                    },
                },
            });
            stripeAccountId = account.id;
        }


        currentUser.role = 'seller'; // Tentatively set role
        currentUser.sellerProfile = {
            ...(currentUser.sellerProfile || {}), // Preserve existing sellerProfile fields if any
            businessName,
            taxId: taxId || '',
            phone,
            stripeAccountId: stripeAccountId,
            stripeOnboardingComplete: currentUser.sellerProfile?.stripeOnboardingComplete || false, // Keep existing if true
            // isVerified will be based on Stripe's verification status eventually
        };
        
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${process.env.FRONTEND_URL}/seller/onboarding/refresh?acc=${stripeAccountId}`, // Add account ID for context
            return_url: `${process.env.FRONTEND_URL}/seller/onboarding/return?acc=${stripeAccountId}`,   // Add account ID for context
            type: 'account_onboarding',
        });
        
        // Mark onboarding as initiated but not yet complete
        // The actual completion will be handled by a webhook or the return URL handler
        currentUser.sellerProfile.stripeOnboardingComplete = false; // Explicitly false until Stripe confirms
        const updatedUser = await currentUser.save();


        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;

        res.status(200).json({
            success: true,
            message: 'Stripe account setup initiated. Please complete onboarding.',
            user: userToReturn,
            onboardingUrl: accountLink.url
        });
    } catch (error) {
        console.error('Upgrade to seller error:', error);
        if (error.type && error.type.startsWith('Stripe')) {
            return res.status(error.statusCode || 400).json({ success: false, message: `Stripe Error: ${error.message}` });
        }
        next(error);
    }
};

// --- HANDLE STRIPE ONBOARDING RETURN ---
export const handleStripeOnboardingReturn = async (req, res, next) => {
    const stripeAccountId = req.query.acc; // Get account ID from query params
    const userId = req.user.id; // Assuming user is logged in

    if (!stripeAccountId) {
        console.error("Stripe onboarding return: Missing Stripe Account ID in query.");
        // Redirect to a generic error page or dashboard with an error message
        return res.redirect(`${process.env.FRONTEND_URL}/seller/dashboard?onboarding_status=error&message=InvalidRequest`);
    }

    try {
        const user = await User.findById(userId);
        if (!user || !user.sellerProfile || user.sellerProfile.stripeAccountId !== stripeAccountId) {
            console.error(`Stripe onboarding return: User ${userId} does not match Stripe account ${stripeAccountId} or not a seller.`);
            return res.redirect(`${process.env.FRONTEND_URL}/seller/dashboard?onboarding_status=error&message=AuthMismatch`);
        }

        const account = await stripe.accounts.retrieve(stripeAccountId);

        if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
            user.sellerProfile.stripeOnboardingComplete = true;
            user.sellerProfile.isVerified = true; // Mark as verified by Stripe
            user.role = 'seller'; // Confirm role
            await user.save();
            console.log(`Stripe onboarding completed for user ${userId}, account ${stripeAccountId}.`);
            // Redirect to seller dashboard with success message
            return res.redirect(`${process.env.FRONTEND_URL}/seller/dashboard?onboarding_status=success`);
        } else {
            console.warn(`Stripe onboarding incomplete for user ${userId}, account ${stripeAccountId}. Details submitted: ${account.details_submitted}, Charges: ${account.charges_enabled}, Payouts: ${account.payouts_enabled}`);
            // Redirect to seller dashboard with pending/error message, or back to onboarding
            // Forcing re-onboarding might be an option if details_submitted is false
            if (!account.details_submitted) {
                 const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: `${process.env.FRONTEND_URL}/seller/onboarding/refresh?acc=${stripeAccountId}`,
                    return_url: `${process.env.FRONTEND_URL}/seller/onboarding/return?acc=${stripeAccountId}`,
                    type: 'account_onboarding',
                });
                return res.redirect(accountLink.url); // Send back to Stripe to complete details
            }
            return res.redirect(`${process.env.FRONTEND_URL}/seller/dashboard?onboarding_status=pending`);
        }
    } catch (error) {
        console.error("Error handling Stripe onboarding return:", error);
        next(error); // This might show JSON error, better to redirect with error query param
        // return res.redirect(`${process.env.FRONTEND_URL}/seller/dashboard?onboarding_status=error&message=ServerError`);
    }
};


// --- GET PUBLIC USER PROFILE BY ID (FOR SELLER PROFILE PAGE) ---
export const getPublicUserProfile = async (req, res, next) => {
    try {
        const { sellerId } = req.params;

        console.log(`[UserController/getPublicUserProfile] Attempting to fetch profile for sellerId: ${sellerId}`);

        if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
            console.log(`[UserController/getPublicUserProfile] Error: Invalid or missing Seller ID: ${sellerId}`);
            return res.status(400).json({ success: false, message: 'Valid Seller ID is required.' });
        }

        // Select fields appropriate for a public profile. Exclude sensitive info.
        const selectedFields = 'name email avatar role bio tagline createdAt username bannerUrl sellerProfile badges isVerified'; // Added badges, isVerified
        const userFromDB = await User.findById(sellerId).select(selectedFields).lean();

        if (!userFromDB || userFromDB.deletedAt) { // Also check for soft-deleted users
            console.log(`[UserController/getPublicUserProfile] User not found or deactivated for ID: ${sellerId}`);
            return res.status(404).json({ success: false, message: 'User profile not found or deactivated.' });
        }
        // Optionally, only return profiles for users with 'seller' role if this is strictly for seller profiles
        // if (userFromDB.role !== 'seller') {
        //     return res.status(404).json({ success: false, message: 'This user is not a seller.' });
        // }


        // Aggregate listing count for the seller
        const listingCount = await Listing.countDocuments({ sellerId: sellerId, status: 'approved' });
        // Aggregate order count (as seller) - this is more complex as orders are linked to listings
        // For simplicity, we might skip this or do a more involved aggregation if needed.
        // Example: const salesCount = await Order.countDocuments({ 'orderItems.sellerId': sellerId, status: 'completed' });

        const publicProfileData = {
            ...userFromDB,
            listingCount: listingCount,
            // salesCount: salesCount, // If calculated
            // averageRating, totalReviews would typically come from a separate reviews system or denormalized on User
        };


        console.log(`[UserController/getPublicUserProfile] User data fetched for ID ${sellerId}. Role: ${userFromDB.role}`);
        res.status(200).json({ success: true, data: publicProfileData });

    } catch (error) {
        console.error(`[UserController/getPublicUserProfile] Error fetching public user profile for ID ${req.params.sellerId}:`, error);
        if (error.name === 'CastError' && error.path === '_id') {
            console.log(`[UserController/getPublicUserProfile] CastError for ID: ${req.params.sellerId}`);
            return res.status(400).json({ success: false, message: 'Invalid Seller ID format (CastError).' });
        }
        next(error);
    }
};
