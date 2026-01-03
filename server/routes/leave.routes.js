const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth.middleware');
const Leave = require('../models/Leave.model');
const User = require('../models/User.model');
const { sendEmail, emailTemplates } = require('../services/emailService');

// @route   POST /api/leave/apply
// @desc    Apply for leave
// @access  Protected
router.post('/apply', protect, [
  body('leaveType').isIn(['Paid', 'Sick', 'Unpaid']).withMessage('Leave type must be Paid, Sick, or Unpaid'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').isLength({ min: 10 }).trim().withMessage('Reason must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        error: errors.array()
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past',
        data: null,
        error: 'Invalid date'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
        data: null,
        error: 'Invalid date range'
      });
    }

    // Create leave request
    const leave = await Leave.create({
      employeeId: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    });

    // Send notification to HR
    try {
      const hrUsers = await User.find({ role: 'HR' });
      const employeeName = `${req.user.firstName} ${req.user.lastName}`;
      
      for (const hr of hrUsers) {
        await sendEmail(
          hr.email,
          'New Leave Request',
          emailTemplates.leaveRequest(
            employeeName,
            leaveType,
            startDate,
            endDate,
            reason
          )
        );
      }
    } catch (emailError) {
      console.error('Leave notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
      error: null
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for leave',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/leave/my
// @desc    Get own leave requests
// @access  Protected
router.get('/my', protect, async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user._id })
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      message: 'Leave requests retrieved successfully',
      data: leaves,
      error: null
    });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving leave requests',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/leave/all
// @desc    Get all leave requests
// @access  Protected (Admin only)
router.get('/all', protect, authorize('HR'), async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    const query = status ? { status } : {};

    const leaves = await Leave.find(query)
      .populate('employeeId', 'firstName lastName employeeId profilePicture')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      message: 'All leave requests retrieved successfully',
      data: leaves,
      error: null
    });
  } catch (error) {
    console.error('Get all leave requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving leave requests',
      data: null,
      error: error.message
    });
  }
});

// @route   PUT /api/leave/:id/status
// @desc    Approve or reject leave request
// @access  Protected (Admin only)
router.put('/:id/status', protect, authorize('HR'), [
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
  body('comments').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        error: errors.array()
      });
    }

    const { status, comments } = req.body;

    const leave = await Leave.findById(req.params.id)
      .populate('employeeId', 'firstName lastName employeeId');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
        data: null,
        error: 'Leave does not exist'
      });
    }

    // Update leave status
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvalComments = comments;
    leave.approvalDate = new Date();

    await leave.save();

    // Send approval/rejection email to employee
    try {
      const employee = await User.findById(leave.employeeId._id);
      if (employee) {
        await sendEmail(
          employee.email,
          `Leave Request ${status}`,
          emailTemplates.leaveApproval(
            employee.firstName,
            leave.leaveType,
            leave.startDate.toDateString(),
            leave.endDate.toDateString(),
            status,
            comments
          )
        );
      }
    } catch (emailError) {
      console.error('Leave approval email failed:', emailError);
    }

    // Update leave balance if approved
    if (status === 'Approved') {
      const employee = await User.findById(leave.employeeId);
      if (employee) {
        const leaveType = leave.leaveType.toLowerCase();
        if (leaveType === 'paid' && employee.leaveBalance.paid >= leave.days) {
          employee.leaveBalance.paid -= leave.days;
        } else if (leaveType === 'sick' && employee.leaveBalance.sick >= leave.days) {
          employee.leaveBalance.sick -= leave.days;
        }
        await employee.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave,
      error: null
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating leave status',
      data: null,
      error: error.message
    });
  }
});

// @route   PUT /api/leave/bulk-approve
// @desc    Bulk approve/reject leave requests
// @access  Protected (Admin only)
router.put('/bulk-approve', protect, authorize('HR'), [
  body('leaveIds').isArray().withMessage('Leave IDs must be an array'),
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
  body('comments').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        error: errors.array()
      });
    }

    const { leaveIds, status, comments } = req.body;
    
    const results = {
      success: [],
      failed: []
    };

    for (const leaveId of leaveIds) {
      try {
        const leave = await Leave.findById(leaveId).populate('employeeId');
        
        if (!leave) {
          results.failed.push({ leaveId, reason: 'Leave not found' });
          continue;
        }

        leave.status = status;
        leave.approvedBy = req.user._id;
        leave.approvalComments = comments;
        leave.approvalDate = new Date();
        await leave.save();

        // Update leave balance if approved
        if (status === 'Approved' && leave.employeeId) {
          const employee = await User.findById(leave.employeeId._id);
          if (employee) {
            const leaveType = leave.leaveType.toLowerCase();
            if (leaveType === 'paid' && employee.leaveBalance.paid >= leave.days) {
              employee.leaveBalance.paid -= leave.days;
            } else if (leaveType === 'sick' && employee.leaveBalance.sick >= leave.days) {
              employee.leaveBalance.sick -= leave.days;
            }
            await employee.save();
          }
        }

        results.success.push(leaveId);
      } catch (err) {
        results.failed.push({ leaveId, reason: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk operation completed. Success: ${results.success.length}, Failed: ${results.failed.length}`,
      data: results,
      error: null
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation',
      data: null,
      error: error.message
    });
  }
});

module.exports = router;
