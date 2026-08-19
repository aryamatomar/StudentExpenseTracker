/**
 * Profile Controller
 *
 * Handles student profile creation, retrieval, updates, and deletion.
 * Seamlessly stores permanently in MongoDB when connected,
 * or the active In-Memory store during offline/local testing.
 */

const mongoose = require('mongoose');
const { Profile } = require('../models/Profile');
const inMemoryStore = require('../data/inMemoryStore');

// Helper to check MongoDB connection status
const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Helper to generate unique student ID: STU-YYYY-XXXX
const generateStudentId = () => {
  const year = new Date().getFullYear();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return `STU-${year}-${randomCode}`;
};

/**
 * @desc   Get active student profile or profile by studentId
 * @route  GET /api/profile or GET /api/profile/:studentId
 * @access Public
 */
const getProfile = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (isMongoConnected()) {
      let profile;
      if (studentId) {
        profile = await Profile.findOne({ studentId: studentId.toUpperCase() });
      } else {
        // Return latest active profile
        profile = await Profile.findOne().sort({ updatedAt: -1 });
      }

      if (!profile) {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'No profile found. Please create a student profile.'
        });
      }

      return res.status(200).json({
        success: true,
        data: profile
      });
    } else {
      const profile = inMemoryStore.getProfile(studentId ? studentId.toUpperCase() : undefined);
      return res.status(200).json({
        success: true,
        data: profile
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create or initialize student profile
 * @route  POST /api/profile
 * @access Public
 */
const createProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      course,
      semester,
      monthlyBudget,
      profilePicture,
      currency
    } = req.body;

    // Validate Required Fields
    const errors = [];
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Full Name is required.');
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      errors.push('Email address is required.');
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('Please provide a valid email address.');
      }
    }
    if (!college || typeof college !== 'string' || !college.trim()) {
      errors.push('College/University name is required.');
    }
    if (!course || typeof course !== 'string' || !course.trim()) {
      errors.push('Course/Major is required.');
    }
    if (monthlyBudget !== undefined && (isNaN(Number(monthlyBudget)) || Number(monthlyBudget) < 0)) {
      errors.push('Monthly budget must be a positive number.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Auto-generate formatted student ID: STU-YYYY-XXXX
    const generatedId = generateStudentId();
    const parsedBudget = monthlyBudget !== undefined ? Math.max(0, parseFloat(Number(monthlyBudget).toFixed(2))) : 500;

    if (isMongoConnected()) {
      const newProfile = await Profile.create({
        studentId: generatedId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        college: college.trim(),
        course: course.trim(),
        semester: semester ? semester.trim() : 'Semester 1',
        monthlyBudget: parsedBudget,
        profilePicture: profilePicture || '',
        currency: currency || 'USD'
      });

      return res.status(201).json({
        success: true,
        message: 'Student profile created successfully! 🎓',
        data: newProfile
      });
    } else {
      const newProfile = inMemoryStore.createProfile({
        studentId: generatedId,
        name,
        email,
        phone,
        college,
        course,
        semester,
        monthlyBudget: parsedBudget,
        profilePicture,
        currency
      });

      return res.status(201).json({
        success: true,
        message: 'Student profile created successfully! 🎓',
        data: newProfile
      });
    }
  } catch (error) {
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A profile with this student ID or email already exists.'
      });
    }
    next(error);
  }
};

/**
 * @desc   Update existing student profile
 * @route  PUT /api/profile/:studentId
 * @access Public
 */
const updateProfile = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const {
      name,
      email,
      phone,
      college,
      course,
      semester,
      monthlyBudget,
      profilePicture,
      currency
    } = req.body;

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (email !== undefined) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }
      updatePayload.email = email.trim().toLowerCase();
    }
    if (phone !== undefined) updatePayload.phone = phone.trim();
    if (college !== undefined) updatePayload.college = college.trim();
    if (course !== undefined) updatePayload.course = course.trim();
    if (semester !== undefined) updatePayload.semester = semester.trim();
    if (monthlyBudget !== undefined) {
      const num = Number(monthlyBudget);
      if (isNaN(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: 'Monthly budget must be a positive number.'
        });
      }
      updatePayload.monthlyBudget = parseFloat(num.toFixed(2));
    }
    if (profilePicture !== undefined) updatePayload.profilePicture = profilePicture;
    if (currency !== undefined) updatePayload.currency = currency;

    if (isMongoConnected()) {
      const updated = await Profile.findOneAndUpdate(
        { studentId: studentId.toUpperCase() },
        updatePayload,
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Student profile not found with ID ${studentId}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully! ✨',
        data: updated
      });
    } else {
      const updated = inMemoryStore.updateProfile(studentId.toUpperCase(), updatePayload);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Student profile not found with ID ${studentId}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully! ✨',
        data: updated
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete student profile
 * @route  DELETE /api/profile/:studentId
 * @access Public
 */
const deleteProfile = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (isMongoConnected()) {
      const deleted = await Profile.findOneAndDelete({ studentId: studentId.toUpperCase() });
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Profile not found with ID ${studentId}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student profile removed successfully',
        data: deleted
      });
    } else {
      const deleted = inMemoryStore.deleteProfile(studentId.toUpperCase());
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Profile not found with ID ${studentId}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student profile removed successfully',
        data: deleted
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
};
