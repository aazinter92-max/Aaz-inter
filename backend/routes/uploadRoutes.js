const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { secureUpload, verifyFileContent } = require('../middleware/secureUpload');

/**
 * SECURE FILE UPLOAD ROUTE
 * Defense layers:
 * 1. Authentication required (protect)
 * 2. Admin only
 * 3. Rate limiting
 * 4. File validation (secureUpload)
 * 5. Content verification (verifyFileContent)
 */
router.post('/', 
  protect,                              // Must be authenticated
  adminOnly,                            // Must be admin
  uploadLimiter,                        // Rate limit: 10 uploads per 15 min
  secureUpload.single('image'),         // Secure file upload
  verifyFileContent,                    // Verify file content
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: 'No file uploaded' 
        });
      }

      // Return secure URL (don't expose filesystem path)
      const secureUrl = `/uploads/${req.file.filename}`;
      
      // Log upload for audit trail
      console.log(`✅ File uploaded: ${req.file.filename} by admin ${req.admin._id}`);
      
      res.status(200).json({
        message: 'File uploaded successfully',
        image: secureUrl,
        size: req.file.size,
        type: req.file.mimetype
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'File upload failed' 
      });
    }
  }
);

module.exports = router;
