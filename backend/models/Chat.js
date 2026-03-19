const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['superadmin', 'dean-admin', 'canteen'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxLength: 1000
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null means broadcast to all
  },
  recipientName: {
    type: String,
    default: 'All'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model('Chat', chatMessageSchema);
