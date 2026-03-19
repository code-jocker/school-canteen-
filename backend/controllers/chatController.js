const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private (All authenticated users)
exports.sendMessage = async (req, res) => {
  try {
    const { message, recipientId, recipientName } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chatMessage = await Chat.create({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message,
      recipient: recipientId || null,
      recipientName: recipientName || 'All'
    });

    res.status(201).json({
      success: true,
      message: chatMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get messages
// @route   GET /api/chat
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    let query = {
      $or: [
        { recipient: null }, // Broadcast messages
        { recipient: req.user._id }, // Direct messages to user
        { sender: req.user._id } // Messages sent by user
      ]
    };

    const messages = await Chat.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Chat.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get users for chat
// @route   GET /api/chat/users
// @access  Private
exports.getChatUsers = async (req, res) => {
  try {
    const users = await User.find().select('name role');
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/chat/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Chat.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unread count
// @route   GET /api/chat/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
