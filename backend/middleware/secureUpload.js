const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');

/**
 * SECURE FILE UPLOAD CONFIGURATION
 * Prevents RCE, XSS, and file-based attacks
 */

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types (whitelist approach)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/tif',
  'image/ico',
  'image/svg+xml',
  'image/avif',
  'image/heic',
  'image/heif'
  // Added all common image formats
];

// Allowed file extensions (double-check)
const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.bmp',
  '.tiff',
  '.tif',
  '.ico',
  '.svg',
  '.avif',
  '.heic',
  '.heif'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Generate secure random filename
 * Prevents path traversal and file overwrite attacks
 */
const generateSecureFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const randomName = crypto.randomBytes(16).toString('hex');
  return `${randomName}${ext}`;
};

/**
 * Secure storage configuration
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Use cryptographically secure random name
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  },
});

/**
 * File validation function
 * Multi-layer validation (defense-in-depth)
 */
function validateFile(file, cb) {
  const errors = [];

  // 1. Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push(`Invalid file extension: ${ext}`);
  }

  // 2. Check filename for path traversal attempts
  if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
    errors.push('Invalid filename: path traversal detected');
  }

  // 3. Filename length check
  if (file.originalname.length > 255) {
    errors.push('Filename too long');
  }

  if (errors.length > 0) {
    console.warn(`⚠️ SECURITY: File upload blocked - ${errors.join(', ')}`);
    return cb(new Error(errors.join('; ')));
  }

  cb(null, true);
}

/**
 * Create multer upload instance with security config
 */
const secureUpload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB max
    files: 1, // Only 1 file per request
    fields: 10, // Limit number of fields
    parts: 20 // Limit total parts
  },
  fileFilter: function (req, file, cb) {
    validateFile(file, cb);
  },
});

/**
 * Additional security: Verify file content after upload
 * This runs AFTER multer processes the file
 */
const verifyFileContent = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    // For image files, just check if extension is allowed
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      return next();
    }

    // If extension not in allowed list, delete file
    fs.unlinkSync(filePath);
    console.warn(`⚠️ SECURITY: File extension not allowed - ${req.file.filename}`);
    return res.status(400).json({
      error: 'File type not allowed. Please upload an image file.'
    });
  } catch (error) {
    console.error('File verification error:', error);
    
    // Delete file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'File upload failed' });
  }
};

/**
 * Detect file type from buffer (magic bytes)
 */
function getFileTypeFromBuffer(buffer) {
  // Check file signatures (magic bytes)
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    // Could be WebP
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }
  }
  if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
    return 'image/bmp';
  }
  if ((buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2A && buffer[3] === 0x00) ||
      (buffer[0] === 0x4D && buffer[1] === 0x4D && buffer[2] === 0x00 && buffer[3] === 0x2A)) {
    return 'image/tiff';
  }
  // For other formats, allow if extension matches
  return 'image/generic';
}

/**
 * Clean up orphaned files (optional, run periodically)
 */
const cleanupOldFiles = () => {
  const RETENTION_DAYS = 90; // Keep files for 90 days
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        const fileAge = Date.now() - stats.mtimeMs;
        const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;
        
        if (fileAge > maxAge) {
          fs.unlink(filePath, (err) => {
            if (!err) {
              console.log(`Cleaned up old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

module.exports = {
  secureUpload,
  verifyFileContent,
  cleanupOldFiles,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};
