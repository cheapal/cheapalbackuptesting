import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

console.log("✅ [CONTROLLER FILE START] Loading: backend/controllers/authController.js");

const signToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = asyncHandler(async (req, res) => {
  console.log("[authController] register - Request body:", req.body);
  const { name, email, password, role = 'user' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const validRoles = ['user', 'seller', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });

  const token = signToken(user._id, user.role);
  console.log("[authController] register - User registered:", user.email, "Role:", user.role);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  console.log("[authController] login - Request body:", { email: req.body.email, password: '[REDACTED]' });
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Incorrect email or password');
  }

  const token = signToken(user._id, user.role);
  console.log("[authController] login - User logged in:", user.email, "Role:", user.role);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  console.log("[authController] getMe - User ID:", req.user._id);
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

console.log("✅ [CONTROLLER FILE END] Exporting controllers from backend/controllers/authController.js");

export { register, login, getMe };