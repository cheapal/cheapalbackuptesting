import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

console.log("✅ Loading: backend/middleware/auth.js");

export const protect = asyncHandler(async (req, res, next) => {
  console.log(`🛡️ [PROTECT MIDDLEWARE] triggered for: ${req.method} ${req.originalUrl}`);
  console.log("   [PROTECT] Checking for token...");

  let token;
  console.log("   [PROTECT] req.cookies:", req.cookies);
  console.log("   [PROTECT] req.headers.authorization:", req.headers.authorization);

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("   [PROTECT] ✅ Token found in cookies.");
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("   [PROTECT] ✅ Token found in Authorization header.");
  }

  if (!token) {
    console.log("   [PROTECT] ❌ No token found in cookies or headers.");
    return res.status(401).json({ success: false, message: 'Not authenticated: No token provided.' });
  }

  console.log("   [PROTECT] 🔍 Verifying token...");
  if (!process.env.JWT_SECRET) {
    console.error("❌ FATAL: JWT_SECRET environment variable is not set!");
    return res.status(500).json({ success: false, message: "Internal server error: Authentication configuration missing." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("   [PROTECT] ✅ Token verified. Decoded payload:", decoded);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('   [PROTECT] ❌ Authentication error: Invalid token.', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized: Invalid token.' });
    } else if (error.name === 'TokenExpiredError') {
      console.error('   [PROTECT] ❌ Authentication error: Token expired.', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized: Token expired.' });
    }
    console.error('   [PROTECT] ❌ Authentication error (Other):', error);
    return res.status(401).json({ success: false, message: 'Not authorized.' });
  }

  console.log(`   [PROTECT] 🔍 Finding user with ID: ${decoded.id}`);
  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    console.log(`   [PROTECT] ❌ User not found for token ID: ${decoded.id}`);
    return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
  }

  if (!currentUser.role) {
    console.warn(`   [PROTECT] ⚠️ User ${currentUser.email} has no role assigned. Defaulting to 'user'.`);
    currentUser.role = 'user';
  }

  console.log(`   [PROTECT] ✅ User found: ${currentUser.email}, Role: ${currentUser.role}. Proceeding...`);
  req.user = currentUser;
  next();
});

export const restrictTo = (roles) => {
  return asyncHandler((req, res, next) => {
    if (!req.user || !req.user.role) {
      console.error("❌ [RESTRICTTO] Error: req.user or req.user.role is missing. 'protect' middleware might have failed.");
      return res.status(500).json({ success: false, message: "Internal Server Error: User context missing." });
    }

    // Validate roles parameter
    if (!Array.isArray(roles)) {
      console.error(`❌ [RESTRICTTO] Error: Invalid roles parameter. Expected array, got ${typeof roles}:`, roles, new Error().stack);
      return res.status(500).json({ success: false, message: "Internal Server Error: Invalid role configuration." });
    }

    const rolesString = roles.length ? roles.join(', ') : 'none';
    console.log(`🛡️ [RESTRICTTO] Checking role: User is '${req.user.role}', Required: [${rolesString}] for ${req.originalUrl}`);
    if (!roles.includes(req.user.role)) {
      console.log(`   [RESTRICTTO] ❌ Forbidden: User role '${req.user.role}' does not match required roles [${rolesString}].`);
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to perform this action.' });
    }

    console.log(`   [RESTRICTTO] ✅ Authorized: Role '${req.user.role}' is allowed. Proceeding...`);
    next();
  });
};