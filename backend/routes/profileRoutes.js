/**
 * Profile Routes
 *
 * Base Route: /api/profile
 */

const express = require('express');
const router = express.Router();

const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/profileController');

// Active/Default Profile Routes
router
  .route('/')
  .get(getProfile)
  .post(createProfile);

// Specific Student Profile Routes by ID
router
  .route('/:studentId')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
