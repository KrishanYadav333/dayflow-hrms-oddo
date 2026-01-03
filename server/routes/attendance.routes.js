const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Attendance = require('../models/Attendance.model');

// @route   POST /api/attendance/checkin
// @desc    Check in for the day
// @access  Protected
router.post('/checkin', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: req.user._id,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
        data: null,
        error: 'Duplicate check-in'
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      employeeId: req.user._id,
      date: today,
      checkIn: new Date(),
      status: 'Present'
    });

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: attendance,
      error: null
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking in',
      data: null,
      error: error.message
    });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out for the day
// @access  Protected
router.post('/checkout', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'No check-in found for today',
        data: null,
        error: 'Check-in required before checkout'
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today',
        data: null,
        error: 'Duplicate check-out'
      });
    }

    // Update attendance with checkout time
    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Check-out successful',
      data: attendance,
      error: null
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/attendance/my
// @desc    Get own attendance records
// @access  Protected
router.get('/my', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { employeeId: req.user._id };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: attendance,
      error: null
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/attendance/all
// @desc    Get all attendance records
// @access  Protected (Admin only)
router.get('/all', protect, authorize('HR'), async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = {};
    
    // If date is provided, filter by that specific date
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }
    
    const attendance = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'All attendance records retrieved successfully',
      data: attendance,
      error: null
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/attendance/export
// @desc    Export attendance records as CSV
// @access  Protected (Admin only)
router.get('/export', protect, authorize('HR'), async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const records = await Attendance.find(query)
      .populate('employeeId', 'employeeId firstName lastName department')
      .sort({ date: -1 });

    // Generate CSV
    let csv = 'Employee ID,Name,Department,Date,Check In,Check Out,Working Hours,Status\n';
    records.forEach(record => {
      const employee = record.employeeId;
      csv += `${employee.employeeId},`;
      csv += `${employee.firstName} ${employee.lastName},`;
      csv += `${employee.department || 'N/A'},`;
      csv += `${new Date(record.date).toLocaleDateString()},`;
      csv += `${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'},`;
      csv += `${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'},`;
      csv += `${record.workingHours},`;
      csv += `${record.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Export attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting attendance records',
      data: null,
      error: error.message
    });
  }
});

module.exports = router;
