const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date,
    default: null
  },
  checkOut: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-day', 'Leave'],
    default: 'Present'
  },
  workingHours: {
    type: Number,
    default: 0,
    min: 0
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Calculate working hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const hours = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.workingHours = Math.round(hours * 100) / 100; // Round to 2 decimal places
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
