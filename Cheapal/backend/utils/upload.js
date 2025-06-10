import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Modern ES module import

console.log("✅ [UTILS FILE START] Loading: backend/utils/upload.js");

const UPLOADS_DIR = path.resolve(process.cwd(), 'Uploads');
const AVATARS_SUBDIR = 'avatars';
const LISTINGS_SUBDIR = 'listings';
const AVATARS_DESTINATION = path.join(UPLOADS_DIR, AVATARS_SUBDIR);
const LISTINGS_DESTINATION = path.join(UPLOADS_DIR, LISTINGS_SUBDIR);

// Ensure directories exist
const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (err) {
      console.error(`❌ Error creating directory ${dir}:`, err);
      throw err;
    }
  }
};

ensureDirectory(AVATARS_DESTINATION);
ensureDirectory(LISTINGS_DESTINATION);

// Multer storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATARS_DESTINATION);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer storage for listings
const listingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, LISTINGS_DESTINATION);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
  }
};

// Multer instances
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const listingUpload = multer({
  storage: listingStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload file utility for listingController.js
const uploadFile = async (file, type) => {
  try {
    const destination = type === 'listings' ? LISTINGS_DESTINATION : AVATARS_DESTINATION;
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(destination, filename);

    await fs.promises.writeFile(filePath, file.buffer);
    console.log(`✅ File uploaded: ${filePath}`);
    return path.join(type, filename).replace(/\\/g, '/'); // Return relative path
  } catch (error) {
    console.error(`❌ File upload failed:`, error);
    throw new Error('File upload failed');
  }
};

// Delete file utility for listingController.js
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(UPLOADS_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`✅ File deleted: ${fullPath}`);
    } else {
      console.warn(`[deleteFile] File not found: ${fullPath}`);
    }
  } catch (error) {
    console.error(`❌ File deletion failed: ${filePath}`, error);
    throw new Error('File deletion failed');
  }
};

console.log("✅ [UTILS FILE END] Exporting utilities from backend/utils/upload.js");

export { avatarUpload, listingUpload, uploadFile, deleteFile };