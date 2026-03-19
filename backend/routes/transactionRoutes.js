const express = require('express');
const router = express.Router();
const {
  createDeposit,
  createPurchase,
  createWithdrawal,
  getTransactions,
  getDashboardStats,
  getReports
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Dashboard stats - all authenticated users
router.get('/dashboard', getDashboardStats);

// Reports - all authenticated users
router.get('/reports', getReports);

// Transactions list - all authenticated users (filtered by role)
router.get('/', getTransactions);

// Deposit - Admin and Dean+Admin
router.post('/deposits', authorize('superadmin', 'dean-admin'), createDeposit);

// Purchase - all roles (Super Admin, Dean+Admin, Canteen)
router.post('/purchase', authorize('superadmin', 'dean-admin', 'canteen'), createPurchase);

// Withdrawal - Admin and Dean+Admin
router.post('/withdraw', authorize('superadmin', 'dean-admin'), createWithdrawal);

module.exports = router;
