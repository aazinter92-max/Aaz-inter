const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");

/**
 * PAYMENT PROOF UPLOAD SECURITY
 * Secure file upload for payment screenshots
 */

const uploadDir = path.resolve(__dirname, "../uploads/payment-proofs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types for payment proofs
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Allowed extensions
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Maximum file size (3MB - payment screenshots should be small)
const MAX_FILE_SIZE = 3 * 1024 * 1024;

/**
 * Generate secure filename
 */
const generateSecureFilename = (orderId) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  return `payment_${orderId}_${timestamp}_${randomString}.jpg`;
};

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Use resolved path to prevent traversal
    cb(null, path.resolve(uploadDir));
  },
  filename(req, file, cb) {
    const orderId = req.params.orderId;
    const secureFilename = generateSecureFilename(orderId);
    cb(null, secureFilename);
  },
});

/**
 * File validation
 */
function validatePaymentProof(file, cb) {
  const errors = [];

  // 1. Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    errors.push(
      `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`,
    );
  }

  // 2. Check extension (sanitize path)
  const ext = path.extname(path.basename(file.originalname)).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push(`Invalid file extension: ${ext}`);
  }

  // 3. Check filename for malicious characters
  if (
    file.originalname.includes("..") ||
    file.originalname.includes("/") ||
    file.originalname.includes("\\")
  ) {
    errors.push("Invalid filename: path traversal detected");
  }

  if (errors.length > 0) {
    console.warn(
      `⚠️ SECURITY: Payment proof upload blocked - ${errors.join(", ")}`,
    );
    return cb(new Error(errors.join("; ")));
  }

  cb(null, true);
}

/**
 * Multer upload configuration
 */
const uploadPaymentProof = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 5,
  },
  fileFilter: function (req, file, cb) {
    validatePaymentProof(file, cb);
  },
});

/**
 * Verify file content (magic bytes)
 */
const verifyPaymentProofContent = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filePath = path.resolve(req.file.path);
    // Ensure file is within upload directory
    if (!filePath.startsWith(path.resolve(uploadDir))) {
      throw new Error("Path traversal detected");
    }

    const buffer = fs.readFileSync(filePath, { encoding: null, flag: "r" });

    // Check magic bytes
    const isValid = isValidImageFile(buffer);

    if (!isValid) {
      // Delete malicious file (secure path)
      const secureFilePath = path.resolve(filePath);
      if (secureFilePath.startsWith(path.resolve(uploadDir))) {
        fs.unlinkSync(secureFilePath);
      }

      console.warn(`⚠️ SECURITY: Payment proof content verification failed`);
      return res.status(400).json({
        error: "File content validation failed. Please upload a valid image.",
      });
    }

    next();
  } catch (error) {
    console.error("Payment proof verification error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      const secureFilePath = path.resolve(req.file.path);
      if (secureFilePath.startsWith(path.resolve(uploadDir))) {
        fs.unlinkSync(secureFilePath);
      }
    }

    res.status(500).json({ error: "File upload failed" });
  }
};

/**
 * Check if file is valid image (magic bytes)
 */
function isValidImageFile(buffer) {
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // WebP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46
  ) {
    if (
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return true;
    }
  }

  return false;
}

module.exports = {
  paymentProofUpload: uploadPaymentProof,
  uploadPaymentProof,
  verifyPaymentProofContent,
};
