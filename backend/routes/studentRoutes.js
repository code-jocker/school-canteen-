const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentByStudentId,
  createStudent,
  updateStudent,
  deleteStudent,
  getClasses
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Public route for canteen lookup (can be accessed by authenticated users)
router.get('/by-id/:studentId', protect, getStudentByStudentId);

// All authenticated users can view students (for canteen search)
router.get('/', protect, getStudents);

// Admin and Dean+Admin routes for CRUD operations
router.use(protect);
router.use(authorize('superadmin', 'dean-admin'));

router.post('/', createStudent);
router.get('/classes', getClasses);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
