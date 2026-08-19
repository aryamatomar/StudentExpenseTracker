/**
 * Student Profile Model Schema (Mongoose)
 *
 * Prepared for MongoDB Atlas connection.
 * Fields:
 * - studentId: Unique generated Student ID (e.g. STU-2026-0001)
 * - name: Full Name (required)
 * - email: Student Email (required, format validated)
 * - phone: Optional contact number
 * - college: University/College Name (required)
 * - course: Major/Degree Course (required)
 * - semester: Current Semester / Year
 * - monthlyBudget: Target monthly spending limit in currency units (INR ₹)
 * - profilePicture: Optional image URL or avatar preset identifier
 * - currency: Preferred currency symbol/code (default: INR)
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    college: {
      type: String,
      required: [true, 'Please provide your College or University name'],
      trim: true,
      maxlength: [150, 'College name cannot exceed 150 characters']
    },
    course: {
      type: String,
      required: [true, 'Please provide your Course or Major'],
      trim: true,
      maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    semester: {
      type: String,
      trim: true,
      default: 'Semester 1'
    },
    monthlyBudget: {
      type: Number,
      required: [true, 'Please set a monthly budget'],
      min: [0, 'Monthly budget cannot be negative'],
      default: 15000
    },
    profilePicture: {
      type: String,
      trim: true,
      default: ''
    },
    currency: {
      type: String,
      trim: true,
      default: 'INR'
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

module.exports = {
  Profile
};
