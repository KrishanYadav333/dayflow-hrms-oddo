const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['Employee', 'HR'],
    default: 'Employee'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  // Company Information
  company: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  manager: {
    type: String,
    trim: true
  },
  // Personal Information
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  nationality: {
    type: String,
    trim: true
  },
  personalEmail: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed', ''],
    default: ''
  },
  residingAddress: {
    type: String,
    trim: true
  },
  // Date fields
  dateOfJoining: {
    type: Date,
    default: null
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  baseSalary: {
    type: Number,
    default: 0,
    min: 0
  },
  allowances: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  // Salary Structure Configuration
  salaryStructure: {
    monthlyWage: {
      type: Number,
      default: 50000,
      min: 0
    },
    yearlyWage: {
      type: Number,
      default: 600000,
      min: 0
    },
    workingHoursPerWeek: {
      type: Number,
      default: 40,
      min: 0
    },
    breakTime: {
      type: Number,
      default: 1, // hours per day
      min: 0
    },
    // Salary Components (percentages or fixed amounts)
    components: {
      basic: {
        type: Number,
        default: 50, // 50% of wage
        min: 0
      },
      hra: {
        type: Number,
        default: 50, // 50% of basic
        min: 0
      },
      standardAllowance: {
        type: Number,
        default: 8.33, // 8.33% of wage
        min: 0
      },
      performanceBonus: {
        type: Number,
        default: 8.33, // 8.33% of wage
        min: 0
      },
      leaveTravelAllowance: {
        type: Number,
        default: 4.167, // 4.167% of wage
        min: 0
      },
      fixedAllowance: {
        type: Number,
        default: 2000, // Fixed amount
        min: 0
      }
    },
    // Tax Deductions
    deductionConfig: {
      pfRate: {
        type: Number,
        default: 12, // 12% of basic
        min: 0
      },
      professionalTax: {
        type: Number,
        default: 200, // Fixed amount per month
        min: 0
      },
      incomeTax: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  // Resume/Profile fields
  about: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  workExperience: {
    type: String,
    default: ''
  },
  interests: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: null
  },
  // Bank Details
  bankDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true
    },
    panNo: {
      type: String,
      trim: true
    },
    uanNo: {
      type: String,
      trim: true
    },
    empCode: {
      type: String,
      trim: true
    }
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  leaveBalance: {
    paid: {
      type: Number,
      default: 20
    },
    sick: {
      type: Number,
      default: 10
    },
    unpaid: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Add indexes for better query performance (some are already unique in schema)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
