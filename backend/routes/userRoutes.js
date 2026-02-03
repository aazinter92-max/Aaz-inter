const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUsers);

router.route('/:id')
  .delete(protect, deleteUser);

module.exports = router;
