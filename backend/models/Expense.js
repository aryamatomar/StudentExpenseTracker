/**
 * Expense Model Schema (Mongoose)
 *
 * Prepared for MongoDB Atlas connection.
 * Fields:
 * - title: Name/purpose of the expense (required)
 * - amount: Cost in currency units (required, positive number)
 * - category: Pre-defined student expense category (required)
 * - date: Date of expense (required, defaults to current date)
 * - description: Optional additional notes or details
 * - studentId: Optional Student ID associating expense with a student profile
 */

const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Other'
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [0.01, 'Amount must be greater than zero']
    },
    category: {
      type: String,
      required: [true, 'Please select a valid category'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a supported category'
      }
    },
    date: {
      type: Date,
      required: [true, 'Please provide the expense date'],
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    studentId: {
      type: String,
      trim: true,
      default: null,
      index: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Helpful compound index for sorting by date and filtering by category & student
expenseSchema.index({ date: -1, category: 1, studentId: 1 });

// Export the Mongoose model
const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

module.exports = {
  Expense,
  CATEGORIES
};
