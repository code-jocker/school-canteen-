const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStats
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('superadmin', 'dean-admin'));

router.route('/')
  .get(getClasses)
  .post(createClass);

router.route('/stats')
  .get(getClassStats);

router.route('/:id')
  .put(updateClass)
  .delete(authorize('superadmin'), deleteClass);

module.exports = router;
