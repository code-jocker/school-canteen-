const Class = require('../models/Class');
const Student = require('../models/Student');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Dean+Admin)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ level: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin, Dean+Admin)
exports.createClass = async (req, res) => {
  try {
    const { name, level, stream } = req.body;

    const classExists = await Class.findOne({ name });
    if (classExists) {
      return res.status(400).json({
        success: false,
        message: 'Class already exists'
      });
    }

    const classObj = await Class.create({
      name,
      level: level || 'S1',
      stream: stream || ''
    });

    res.status(201).json({
      success: true,
      class: classObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin, Dean+Admin)
exports.updateClass = async (req, res) => {
  try {
    const { name, level, stream } = req.body;

    const classObj = await Class.findByIdAndUpdate(
      req.params.id,
      { name, level, stream },
      { new: true, runValidators: true }
    );

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      class: classObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin only)
exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if class has students
    const studentCount = await Student.countDocuments({ class: classObj.name });
    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete class. It has ${studentCount} students assigned.`
      });
    }

    await classObj.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get class statistics
// @route   GET /api/classes/stats
// @access  Private (Admin, Dean+Admin)
exports.getClassStats = async (req, res) => {
  try {
    const classes = await Class.find().sort({ level: 1, name: 1 });
    
    const classStats = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await Student.countDocuments({ class: cls.name });
        const students = await Student.find({ class: cls.name });
        
        const totalCanteen = students.reduce((sum, s) => sum + s.canteenBalance, 0);
        const totalShortSaving = students.reduce((sum, s) => sum + s.shortSaving, 0);
        const totalLongSaving = students.reduce((sum, s) => sum + s.longSaving, 0);
        
        return {
          _id: cls._id,
          name: cls.name,
          level: cls.level,
          stream: cls.stream,
          studentCount,
          totalCanteen,
          totalShortSaving,
          totalLongSaving,
          totalMoney: totalCanteen + totalShortSaving + totalLongSaving
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: classStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
