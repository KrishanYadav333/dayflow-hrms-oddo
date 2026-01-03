const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

// @route   GET /api/employee/profile
// @desc    Get current user's profile
// @access  Protected
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: 'User does not exist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
      data: null,
      error: error.message
    });
  }
});

// @route   PUT /api/employee/profile
// @desc    Update current user's profile
// @access  Protected
router.put('/profile', protect, [
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('profilePicture').optional().trim()
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

    const { phone, address, profilePicture } = req.body;

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/employee/all
// @desc    Get all employees
// @access  Protected (Admin only)
router.get('/all', protect, authorize('HR'), async (req, res) => {
  try {
    const employees = await User.find().select('-password').lean();

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employees,
      error: null
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      data: null,
      error: error.message
    });
  }
});

// @route   GET /api/employee/:id
// @desc    Get employee by ID
// @access  Protected
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password').lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
        data: null,
        error: 'Employee does not exist'
      });
    }

    // Check if user is viewing their own profile or is HR
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'HR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile',
        data: null,
        error: 'Unauthorized access'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
      error: null
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving employee',
      data: null,
      error: error.message
    });
  }
});

// @route   PUT /api/employee/:id
// @desc    Update employee by ID
// @access  Protected (Admin only)
router.put('/:id', protect, authorize('HR'), [
  body('firstName').optional().isLength({ min: 2 }).trim(),
  body('lastName').optional().isLength({ min: 2 }).trim(),
  body('department').optional().trim(),
  body('position').optional().trim(),
  body('baseSalary').optional().isNumeric(),
  body('allowances').optional().isNumeric()
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

    const { firstName, lastName, department, position, baseSalary, allowances } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (department) updateData.department = department;
    if (position) updateData.position = position;
    if (baseSalary !== undefined) updateData.baseSalary = baseSalary;
    if (allowances !== undefined) updateData.allowances = allowances;

    const employee = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
        data: null,
        error: 'Employee does not exist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
      error: null
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      data: null,
      error: error.message
    });
  }
});

module.exports = router;
