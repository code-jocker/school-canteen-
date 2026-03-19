const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Dean+Admin)
exports.getStudents = async (req, res) => {
  try {
    const { search, class: classFilter } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (classFilter) {
      query.class = classFilter;
    }

    const students = await Student.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (Admin, Dean+Admin, Canteen)
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student by studentId
// @route   GET /api/students/by-id/:studentId
// @access  Private (Admin, Dean+Admin, Canteen)
exports.getStudentByStudentId = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin, Dean+Admin)
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, class: studentClass, year, canteenBalance, shortSaving, longSaving } = req.body;

    // If studentId is provided, check if it already exists
    if (studentId) {
      const existingStudent = await Student.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Student with this ID already exists'
        });
      }
    }

    const student = await Student.create({
      studentId: studentId || undefined, // Let the model auto-generate if not provided
      name,
      class: studentClass,
      year: year || new Date().getFullYear(),
      canteenBalance: canteenBalance || 0,
      shortSaving: shortSaving || 0,
      longSaving: longSaving || 0
    });

    res.status(201).json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin, Dean+Admin)
exports.updateStudent = async (req, res) => {
  try {
    const { name, class: studentClass, canteenBalance, shortSaving, longSaving } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, class: studentClass, canteenBalance, shortSaving, longSaving },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all classes
// @route   GET /api/students/classes
// @access  Private (Admin, Dean+Admin)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Student.distinct('class');
    
    res.status(200).json({
      success: true,
      classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
