const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentClass: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'purchase', 'withdrawal'],
    required: true
  },
  category: {
    type: String,
    enum: ['canteen', 'short-saving', 'long-saving'],
    default: 'canteen'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  handledByName: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
transactionSchema.index({ date: -1 });
transactionSchema.index({ studentId: 1, date: -1 });
transactionSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
