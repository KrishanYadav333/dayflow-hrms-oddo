const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Paid', 'Sick', 'Unpaid'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters long']
  },
  attachment: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvalComments: {
    type: String,
    trim: true
  },
  approvalDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
leaveSchema.index({ employeeId: 1, status: 1 });
leaveSchema.index({ status: 1, startDate: -1 });
leaveSchema.index({ employeeId: 1, startDate: -1 });
leaveSchema.index({ createdAt: -1 });

// Calculate number of days before saving
leaveSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    this.days = daysDiff;
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
