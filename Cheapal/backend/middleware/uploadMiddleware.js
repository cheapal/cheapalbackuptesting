import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import the Node.js file system module
import { fileURLToPath } from 'url'; // Import url module helper

// --- Get current directory path in ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Get the full path to the current file
const __dirname = path.dirname(__filename); // Get the directory name of the current file

// --- Define the destination directory ---
// Use path.resolve to get the absolute path relative to the current file's directory
// Go up one level from 'middleware' to the backend root, then into uploads/subscriptions
const destinationDir = path.resolve(__dirname, '../uploads/subscriptions');

// --- Ensure the destination directory exists ---
// Use synchronous mkdir with recursive option to create parent directories if needed.
// This runs once when the module loads.
try {
    fs.mkdirSync(destinationDir, { recursive: true });
    console.log(`✅ Ensured upload directory exists: ${destinationDir}`);
} catch (error) {
    // Log an error if directory creation fails, as this will break uploads
    console.error(`❌ Critical Error: Could not create upload directory: ${destinationDir}`, error);
    // Optionally, you might want to prevent the server from starting if uploads are critical
    // process.exit(1);
}


// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pass the ensured directory path to multer
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Keep the original file extension
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// --- Multer File Filter Configuration ---
const fileFilter = (req, file, cb) => {
  // Define allowed image MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Added webp
  if (allowedTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with a specific error message
    // This error can be caught by the global error handler
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'), false);
  }
};

// --- Multer Upload Instance ---
const upload = multer({
  storage: storage,       // Use the configured disk storage
  fileFilter: fileFilter, // Use the configured file filter
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// --- Export the configured Multer instance ---
export default upload;
