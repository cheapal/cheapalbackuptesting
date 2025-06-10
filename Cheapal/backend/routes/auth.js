import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import { register, login, getMe } from '../controllers/authController.js';

console.log("✅ [ROUTE FILE START] Loading: backend/routes/auth.js");

const router = express.Router();
console.log("✅ Router initialized in auth.js");

// Middleware to log query parameters for debugging
const logQueryParams = (req, res, next) => {
  console.log(`[auth.js] ${req.method} ${req.originalUrl} - Query parameters:`, req.query);
  next();
};

// Validation rules for registration and login
const authValidationRules = () => {
  return [
    body('email', 'Valid email is required')
      .isEmail()
      .normalizeEmail()
      .trim(),
    body('password', 'Password must be at least 6 characters')
      .isLength({ min: 6 })
      .trim(),
  ];
};

const registerValidationRules = () => {
  return [
    ...authValidationRules(),
    body('name', 'Name is required')
      .notEmpty()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('role', 'Valid role is required')
      .optional()
      .isIn(['user', 'seller', 'admin'])
      .withMessage('Role must be one of: user, seller, admin'),
  ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg,
  }));
  console.error("❌ [VALIDATION FAILED] Path:", req.originalUrl, "Errors:", extractedErrors);
  return res.status(422).json({
    success: false,
    message: 'Validation Error',
    errors: extractedErrors,
  });
};

// --- Route Definitions ---

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  logQueryParams,
  registerValidationRules(),
  validate,
  asyncHandler(register)
);

// POST /api/auth/login - Login a user
router.post(
  '/login',
  logQueryParams,
  authValidationRules(),
  validate,
  asyncHandler(login)
);

// GET /api/auth/me - Get current user (protected)
router.get(
  '/me',
  logQueryParams,
  protect,
  asyncHandler(getMe)
);

// POST /api/auth/logout - Logout (clear token, if needed)
router.post(
  '/logout',
  logQueryParams,
  (req, res) => {
    console.log("[auth.js] User logged out");
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);

// GET /api/auth/check-email - Check if email is available
router.get(
  '/check-email',
  logQueryParams,
  [
    body('email', 'Valid email is required')
      .isEmail()
      .normalizeEmail()
      .trim(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    console.log("[auth.js] Checking email:", req.query.email);
    const user = await User.findOne({ email: req.query.email.toLowerCase() });
    res.status(200).json({
      success: true,
      available: !user,
    });
  })
);

console.log("✅ [ROUTE FILE END] Exporting router from backend/routes/auth.js");

export default router;
