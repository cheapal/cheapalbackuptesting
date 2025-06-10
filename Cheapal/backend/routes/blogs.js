import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { getBlogs, createBlog, updateBlog, deleteBlog, getPublicBlogs } from '../controllers/blogController.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'Uploads', 'blogs'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Admin routes
router
  .route('/')
  .get(protect, restrictTo('admin'), getBlogs)
  .post(protect, restrictTo('admin'), upload.single('image'), createBlog);

router
  .route('/:id')
  .put(protect, restrictTo('admin'), upload.single('image'), updateBlog)
  .delete(protect, restrictTo('admin'), deleteBlog);

// Public route
router.get('/public', getPublicBlogs);

export default router;