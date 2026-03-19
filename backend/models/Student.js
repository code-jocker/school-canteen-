const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    default: () => new Date().getFullYear()
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  canteenBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  shortSaving: {
    type: Number,
    default: 0,
    min: 0
  },
  longSaving: {
    type: Number,
    default: 0,
    min: 0
  },
  qrCode: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate student ID before saving
studentSchema.pre('save', async function(next) {
  // Only generate if studentId is not provided
  if (this.studentId) {
    this.updatedAt = Date.now();
    return next();
  }

  const year = this.year || new Date().getFullYear();
  const classCode = this.class ? this.class.toUpperCase().replace(/\s/g, '') : 'S1';

  // Find the last student with this year and class
  const lastStudent = await this.constructor.findOne({
    year: year,
    class: { $regex: new RegExp(`^${classCode}$`, 'i') }
  }).sort({ studentId: -1 });

  let sequence = 1;
  if (lastStudent && lastStudent.studentId) {
    // Extract the sequence number from the last student ID
    const parts = lastStudent.studentId.split('-');
    if (parts.length >= 3) {
      sequence = parseInt(parts[2], 10) + 1;
    }
  }

  // Format: YEAR-CLASS-XXXX (e.g., 2024-S1-0001)
  this.studentId = `${year}-${classCode}-${sequence.toString().padStart(4, '0')}`;
  this.updatedAt = Date.now();
  next();
});

// Update timestamp on save
studentSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
