const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics
// @access  Protected
router.get('/dashboard', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'HR';
    const stats = {};

    if (isAdmin) {
      // Admin dashboard stats
      const totalEmployees = await User.countDocuments({ role: 'Employee', isActive: true });
      const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
      
      // Today's attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAttendance = await Attendance.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: 'Present'
      });

      const todayAbsent = await Attendance.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: 'Absent'
      });

      // This month's leaves
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const monthlyLeaves = await Leave.countDocuments({
        startDate: { $gte: monthStart, $lte: monthEnd },
        status: 'Approved'
      });

      stats.totalEmployees = totalEmployees;
      stats.pendingLeaves = pendingLeaves;
      stats.todayPresent = todayAttendance;
      stats.todayAbsent = todayAbsent;
      stats.monthlyLeaves = monthlyLeaves;
      
      // Recent activity
      const recentLeaves = await Leave.find()
        .populate('employeeId', 'firstName lastName employeeId')
        .sort({ createdAt: -1 })
        .limit(5);
      
      stats.recentActivity = recentLeaves;

    } else {
      // Employee dashboard stats
      const employee = req.user;
      
      // Attendance this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthAttendance = await Attendance.countDocuments({
        employeeId: employee._id,
        date: { $gte: monthStart },
        status: 'Present'
      });

      // Leave balance
      const leaveBalance = {
        paid: employee.leaveBalance.paid,
        sick: employee.leaveBalance.sick
      };

      // Pending leave requests
      const pendingLeaves = await Leave.countDocuments({
        employeeId: employee._id,
        status: 'Pending'
      });

      // Recent attendance
      const recentAttendance = await Attendance.find({
        employeeId: employee._id
      }).sort({ date: -1 }).limit(7);

      stats.monthAttendance = monthAttendance;
      stats.leaveBalance = leaveBalance;
      stats.pendingLeaves = pendingLeaves;
      stats.recentAttendance = recentAttendance;
    }

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
      error: null
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/stats/attendance-summary
// @desc    Get attendance summary for payroll calculation
// @access  Protected (Admin only)
router.get('/attendance-summary', protect, authorize('HR'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
        data: null,
        error: 'Missing parameters'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all employees
    const employees = await User.find({ role: 'Employee', isActive: true });
    
    const summaryData = await Promise.all(employees.map(async (employee) => {
      // Count attendance records by status
      const presentDays = await Attendance.countDocuments({
        employeeId: employee._id,
        date: { $gte: start, $lte: end },
        status: 'Present'
      });

      const halfDays = await Attendance.countDocuments({
        employeeId: employee._id,
        date: { $gte: start, $lte: end },
        status: 'Half-day'
      });

      const absentDays = await Attendance.countDocuments({
        employeeId: employee._id,
        date: { $gte: start, $lte: end },
        status: 'Absent'
      });

      // Count approved leaves by type
      const paidLeaves = await Leave.aggregate([
        {
          $match: {
            employeeId: employee._id,
            status: 'Approved',
            leaveType: 'Paid',
            startDate: { $lte: end },
            endDate: { $gte: start }
          }
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: '$days' }
          }
        }
      ]);

      const sickLeaves = await Leave.aggregate([
        {
          $match: {
            employeeId: employee._id,
            status: 'Approved',
            leaveType: 'Sick',
            startDate: { $lte: end },
            endDate: { $gte: start }
          }
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: '$days' }
          }
        }
      ]);

      const unpaidLeaves = await Leave.aggregate([
        {
          $match: {
            employeeId: employee._id,
            status: 'Approved',
            leaveType: 'Unpaid',
            startDate: { $lte: end },
            endDate: { $gte: start }
          }
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: '$days' }
          }
        }
      ]);

      return {
        employeeId: employee._id,
        employeeCode: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        presentDays,
        halfDays,
        absentDays,
        paidLeaveDays: paidLeaves[0]?.totalDays || 0,
        sickLeaveDays: sickLeaves[0]?.totalDays || 0,
        unpaidLeaveDays: unpaidLeaves[0]?.totalDays || 0
      };
    }));

    res.status(200).json({
      success: true,
      message: 'Attendance summary retrieved successfully',
      data: summaryData,
      error: null
    });
  } catch (error) {
    console.error('Attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance summary',
      data: null,
      error: error.message
    });
  }
});

module.exports = router;
