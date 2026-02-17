const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, adminOnly: admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createComplaint)
  .get(protect, admin, getComplaints);

router.route('/:id')
  .put(protect, admin, updateComplaintStatus)
  .delete(protect, admin, deleteComplaint);

module.exports = router;
