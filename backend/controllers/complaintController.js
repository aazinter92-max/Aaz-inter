const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, userId } = req.body;

    const complaint = await Complaint.create({
      name,
      email,
      phone,
      subject,
      message,
      userId: userId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = req.body.status || complaint.status;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404);
      throw new Error('Complaint not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      await complaint.deleteOne();
      res.json({ message: 'Complaint removed' });
    } else {
      res.status(404);
      throw new Error('Complaint not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
};
