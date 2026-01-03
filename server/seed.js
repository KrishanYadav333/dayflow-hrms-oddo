const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User.model');
const Attendance = require('./models/Attendance.model');
const Leave = require('./models/Leave.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dayflow-hrms', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random time for check-in (8 AM - 10 AM)
const randomCheckIn = (date) => {
  const checkIn = new Date(date);
  checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
  return checkIn;
};

// Generate check-out time (5 PM - 7 PM)
const randomCheckOut = (checkIn) => {
  const checkOut = new Date(checkIn);
  checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
  return checkOut;
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    console.log('Existing data cleared!');

    // Create HR Admin
    console.log('\nCreating HR Admin...');
    const hrPassword = await bcrypt.hash('admin123', 10);
    const hrAdmin = await User.create({
      employeeId: 'HR001',
      email: 'admin@dayflow.com',
      password: hrPassword,
      role: 'HR',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567890',
      address: '123 Admin Street, NY 10001',
      department: 'Human Resources',
      position: 'HR Manager',
      joinDate: new Date('2023-01-15'),
      baseSalary: 85000,
      allowances: 5000,
      deductions: 2000
    });
    console.log(`✓ Created HR Admin: ${hrAdmin.firstName} ${hrAdmin.lastName} (${hrAdmin.employeeId})`);

    // Create Employees
    console.log('\nCreating Employees...');
    const employeesData = [
      {
        employeeId: 'EMP001',
        email: 'john.doe@dayflow.com',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        baseSalary: 75000,
        allowances: 3000,
        deductions: 1500,
        joinDate: new Date('2023-03-01')
      },
      {
        employeeId: 'EMP002',
        email: 'jane.smith@dayflow.com',
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Marketing',
        position: 'Marketing Manager',
        baseSalary: 68000,
        allowances: 2500,
        deductions: 1200,
        joinDate: new Date('2023-04-15')
      },
      {
        employeeId: 'EMP003',
        email: 'mike.wilson@dayflow.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        department: 'Engineering',
        position: 'Frontend Developer',
        baseSalary: 62000,
        allowances: 2000,
        deductions: 1000,
        joinDate: new Date('2023-06-01')
      },
      {
        employeeId: 'EMP004',
        email: 'emily.brown@dayflow.com',
        firstName: 'Emily',
        lastName: 'Brown',
        department: 'Sales',
        position: 'Sales Executive',
        baseSalary: 55000,
        allowances: 4000,
        deductions: 1100,
        joinDate: new Date('2023-07-10')
      },
      {
        employeeId: 'EMP005',
        email: 'david.lee@dayflow.com',
        firstName: 'David',
        lastName: 'Lee',
        department: 'Engineering',
        position: 'Backend Developer',
        baseSalary: 70000,
        allowances: 2800,
        deductions: 1300,
        joinDate: new Date('2023-05-20')
      },
      {
        employeeId: 'EMP006',
        email: 'sarah.davis@dayflow.com',
        firstName: 'Sarah',
        lastName: 'Davis',
        department: 'Design',
        position: 'UI/UX Designer',
        baseSalary: 58000,
        allowances: 2200,
        deductions: 900,
        joinDate: new Date('2023-08-01')
      },
      {
        employeeId: 'EMP007',
        email: 'robert.taylor@dayflow.com',
        firstName: 'Robert',
        lastName: 'Taylor',
        department: 'Finance',
        position: 'Financial Analyst',
        baseSalary: 65000,
        allowances: 2500,
        deductions: 1400,
        joinDate: new Date('2023-09-15')
      },
      {
        employeeId: 'EMP008',
        email: 'lisa.anderson@dayflow.com',
        firstName: 'Lisa',
        lastName: 'Anderson',
        department: 'Operations',
        position: 'Operations Manager',
        baseSalary: 72000,
        allowances: 3500,
        deductions: 1600,
        joinDate: new Date('2023-02-28')
      }
    ];

    const employeePassword = await bcrypt.hash('employee123', 10);
    const employees = [];

    for (const empData of employeesData) {
      const employee = await User.create({
        ...empData,
        password: employeePassword,
        role: 'Employee',
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `${Math.floor(Math.random() * 999) + 1} Street, City ${Math.floor(Math.random() * 90000) + 10000}`,
        leaveBalance: {
          paid: 20,
          sick: 10,
          unpaid: 0
        }
      });
      employees.push(employee);
      console.log(`✓ Created Employee: ${employee.firstName} ${employee.lastName} (${employee.employeeId}) - ${employee.department}`);
    }

    // Create Attendance Records (Last 30 days)
    console.log('\n\nCreating Attendance Records...');
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let attendanceCount = 0;
    for (const employee of employees) {
      for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        // 95% attendance rate
        if (Math.random() > 0.05) {
          const checkIn = randomCheckIn(new Date(d));
          const checkOut = randomCheckOut(checkIn);

          await Attendance.create({
            employeeId: employee._id,
            date: new Date(d),
            checkIn: checkIn,
            checkOut: checkOut,
            status: 'Present'
          });
          attendanceCount++;
        }
      }
    }
    console.log(`✓ Created ${attendanceCount} attendance records`);

    // Create Leave Requests
    console.log('\nCreating Leave Requests...');
    const leaveTypes = ['Paid', 'Sick', 'Unpaid'];
    const leaveStatuses = ['Pending', 'Approved', 'Rejected'];
    const leaveReasons = [
      'Family emergency - need to travel out of town',
      'Medical appointment and recovery period needed',
      'Personal vacation - planned family trip',
      'Feeling unwell - need rest and recovery',
      'Wedding ceremony of close family member',
      'Home renovation work requiring presence',
      'Child care - school event and activities',
      'Medical procedure scheduled - doctor advised rest'
    ];

    let leaveCount = 0;
    for (const employee of employees) {
      // Create 2-4 leave requests per employee
      const numLeaves = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < numLeaves; i++) {
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        const status = leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];
        const days = Math.floor(Math.random() * 5) + 1;
        
        const startDate = randomDate(thirtyDaysAgo, today);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days - 1);

        const leave = await Leave.create({
          employeeId: employee._id,
          leaveType: leaveType,
          startDate: startDate,
          endDate: endDate,
          days: days,
          reason: leaveReasons[Math.floor(Math.random() * leaveReasons.length)],
          status: status,
          approvedBy: status !== 'Pending' ? hrAdmin._id : null,
          approvalComments: status === 'Approved' ? 'Leave approved' : status === 'Rejected' ? 'Insufficient leave balance' : null,
          approvalDate: status !== 'Pending' ? randomDate(startDate, today) : null
        });
        leaveCount++;
      }
    }
    console.log(`✓ Created ${leaveCount} leave requests`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\nSummary:');
    console.log(`• HR Admins: 1`);
    console.log(`• Employees: ${employees.length}`);
    console.log(`• Attendance Records: ${attendanceCount}`);
    console.log(`• Leave Requests: ${leaveCount}`);
    console.log('\nLogin Credentials:');
    console.log('─'.repeat(50));
    console.log('HR Admin:');
    console.log('  Email: admin@dayflow.com');
    console.log('  Password: admin123');
    console.log('\nEmployees:');
    console.log('  Email: john.doe@dayflow.com (or any employee email)');
    console.log('  Password: employee123');
    console.log('─'.repeat(50));

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});
