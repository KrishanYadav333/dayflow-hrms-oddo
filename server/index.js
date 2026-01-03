const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const uploadRoutes = require('./routes/upload.routes');
const statsRoutes = require('./routes/stats.routes');

// Initialize Express app
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dayflow-hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('[MongoDB] Connected successfully'))
.catch((err) => console.error('[MongoDB] Connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dayflow HRMS API is running',
    version: '1.0.0'
  });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  const { Resend } = require('resend');
  
  try {
    const resend = new Resend('re_Xpddby9t_8op5mdn5cKwJTccBewmdmhcX');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kryshan753@gmail.com',
      subject: 'Dayflow HRMS - Test Email',
      html: '<h2>Hello from Dayflow HRMS!</h2><p>Your email service is <strong>working perfectly</strong>!</p>'
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Email failed',
        error: error
      });
    }
    
    res.json({
      success: true,
      message: 'Email sent to kryshan753@gmail.com',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null,
    error: null
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Email] Resend API Key: ${process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`[Email] From Email: ${process.env.FROM_EMAIL || 'Not set'}`);
});

module.exports = app;
