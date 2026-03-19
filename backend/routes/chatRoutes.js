const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getChatUsers,
  markAsRead,
  getUnreadCount
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMessages)
  .post(sendMessage);

router.get('/users', getChatUsers);
router.get('/unread', getUnreadCount);
router.put('/:id/read', markAsRead);

module.exports = router;
