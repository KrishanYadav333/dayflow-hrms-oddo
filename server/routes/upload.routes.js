const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and documents only
  if (file.mimetype.startsWith('image/') || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents (PDF, DOC, DOCX) are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @route   POST /api/upload/profile-picture
// @desc    Upload profile picture
// @access  Protected
router.post('/profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null,
        error: 'File required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: 'User does not exist'
      });
    }

    // Update profile picture URL
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: user.profilePicture
      },
      error: null
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      data: null,
      error: error.message
    });
  }
});

// @route   POST /api/upload/document
// @desc    Upload document
// @access  Protected
router.post('/document', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null,
        error: 'File required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: 'User does not exist'
      });
    }

    // Add document to user's documents array
    user.documents.push({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documents: user.documents
      },
      error: null
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      data: null,
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/document/:documentId
// @desc    Delete a document
// @access  Protected
router.delete('/document/:documentId', protect, async (req, res) => {
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

    // Remove document from array
    user.documents = user.documents.filter(
      doc => doc._id.toString() !== req.params.documentId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        documents: user.documents
      },
      error: null
    });
  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      data: null,
      error: error.message
    });
  }
});

module.exports = router;
