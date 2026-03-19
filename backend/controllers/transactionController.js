const Transaction = require('../models/Transaction');
const Student = require('../models/Student');

// @desc    Create deposit
// @route   POST /api/deposits
// @access  Private (Admin, Dean+Admin)
exports.createDeposit = async (req, res) => {
  try {
    const { studentId, amount, category, notes } = req.body;

    if (!studentId || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student, amount and category'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update balance based on category
    let newBalance;
    if (category === 'canteen') {
      student.canteenBalance += parseFloat(amount);
      newBalance = student.canteenBalance;
    } else if (category === 'short-saving') {
      student.shortSaving += parseFloat(amount);
      newBalance = student.shortSaving;
    } else if (category === 'long-saving') {
      student.longSaving += parseFloat(amount);
      newBalance = student.longSaving;
    }

    await student.save();

    // Create transaction record
    const transaction = await Transaction.create({
      studentId: student._id,
      studentName: student.name,
      studentClass: student.class,
      type: 'deposit',
      category,
      amount: parseFloat(amount),
      balanceAfter: newBalance,
      handledBy: req.user._id,
      handledByName: req.user.name,
      notes: notes || `Deposit to ${category}`
    });

    res.status(201).json({
      success: true,
      transaction,
      student: {
        id: student._id,
        canteenBalance: student.canteenBalance,
        shortSaving: student.shortSaving,
        longSaving: student.longSaving
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create purchase
// @route   POST /api/purchase
// @access  Private (Admin, Dean+Admin, Canteen)
exports.createPurchase = async (req, res) => {
  try {
    const { studentId, amount, notes } = req.body;

    if (!studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student and amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student has enough balance
    if (student.canteenBalance < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient canteen balance',
        currentBalance: student.canteenBalance
      });
    }

    // Deduct from canteen balance
    student.canteenBalance -= parseFloat(amount);
    await student.save();

    // Create transaction record
    const transaction = await Transaction.create({
      studentId: student._id,
      studentName: student.name,
      studentClass: student.class,
      type: 'purchase',
      category: 'canteen',
      amount: parseFloat(amount),
      balanceAfter: student.canteenBalance,
      handledBy: req.user._id,
      handledByName: req.user.name,
      notes: notes || 'Canteen purchase'
    });

    res.status(201).json({
      success: true,
      transaction,
      student: {
        id: student._id,
        canteenBalance: student.canteenBalance,
        shortSaving: student.shortSaving,
        longSaving: student.longSaving
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create withdrawal
// @route   POST /api/withdraw
// @access  Private (Admin, Dean+Admin)
exports.createWithdrawal = async (req, res) => {
  try {
    const { studentId, amount, category, notes } = req.body;

    if (!studentId || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student, amount and category'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check balance based on category
    let currentSaving;
    if (category === 'short-saving') {
      currentSaving = student.shortSaving;
    } else if (category === 'long-saving') {
      currentSaving = student.longSaving;
    }

    if (currentSaving < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient savings balance',
        currentBalance: currentSaving
      });
    }

    // Deduct from savings
    if (category === 'short-saving') {
      student.shortSaving -= parseFloat(amount);
    } else if (category === 'long-saving') {
      student.longSaving -= parseFloat(amount);
    }

    await student.save();

    // Create transaction record
    const transaction = await Transaction.create({
      studentId: student._id,
      studentName: student.name,
      studentClass: student.class,
      type: 'withdrawal',
      category,
      amount: parseFloat(amount),
      balanceAfter: category === 'short-saving' ? student.shortSaving : student.longSaving,
      handledBy: req.user._id,
      handledByName: req.user.name,
      notes: notes || `Withdrawal from ${category}`
    });

    res.status(201).json({
      success: true,
      transaction,
      student: {
        id: student._id,
        canteenBalance: student.canteenBalance,
        shortSaving: student.shortSaving,
        longSaving: student.longSaving
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, studentId, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let query = {};

    // Filter by role
    if (req.user.role === 'canteen') {
      query.handledBy = req.user._id;
    }

    // Additional filters
    if (type) {
      query.type = type;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .populate('studentId', 'studentId name class')
      .populate('handledBy', 'name')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/transactions/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total students
    const totalStudents = await Student.countDocuments();

    // Get total canteen money
    const canteenStats = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalCanteen: { $sum: '$canteenBalance' },
          totalShortSaving: { $sum: '$shortSaving' },
          totalLongSaving: { $sum: '$longSaving' }
        }
      }
    ]);

    // Get today's deposits
    const todayDeposits = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get today's purchases
    const todayPurchases = await Transaction.aggregate([
      {
        $match: {
          type: 'purchase',
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get last 7 days spending for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayData = await Transaction.aggregate([
        {
          $match: {
            type: 'purchase',
            date: { $gte: date, $lt: nextDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        amount: dayData[0]?.total || 0
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCanteen: canteenStats[0]?.totalCanteen || 0,
        totalShortSaving: canteenStats[0]?.totalShortSaving || 0,
        totalLongSaving: canteenStats[0]?.totalLongSaving || 0,
        todayDeposits: todayDeposits[0]?.total || 0,
        todayDepositsCount: todayDeposits[0]?.count || 0,
        todayPurchases: todayPurchases[0]?.total || 0,
        todayPurchasesCount: todayPurchases[0]?.count || 0,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reports
// @route   GET /api/reports/daily
// @route   GET /api/reports/monthly
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Filter by role for canteen staff
    if (req.user.role === 'canteen') {
      query.handledBy = req.user._id;
    }

    const transactions = await Transaction.find(query)
      .populate('studentId', 'studentId name class')
      .populate('handledBy', 'name')
      .sort({ date: -1 });

    // Calculate totals
    const deposits = transactions.filter(t => t.type === 'deposit');
    const purchases = transactions.filter(t => t.type === 'purchase');
    const withdrawals = transactions.filter(t => t.type === 'withdrawal');

    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = purchases.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      report: {
        transactions,
        summary: {
          totalDeposits,
          totalPurchases,
          totalWithdrawals,
          netAmount: totalDeposits - totalPurchases - totalWithdrawals,
          transactionCount: transactions.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
