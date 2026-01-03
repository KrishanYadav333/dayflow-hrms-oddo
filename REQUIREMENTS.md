# Dayflow HRMS - Project Requirements Document

## 1. Functional Requirements

### 1.1 Authentication & Authorization

#### 1.1.1 Sign Up
- Users can register using:
  - Employee ID (unique identifier)
  - Email address
  - Password (minimum 6 characters)
  - Role selection (Employee / HR)
  - First Name and Last Name
- Password must follow security rules
- Email verification required
- Duplicate email/employee ID validation

#### 1.1.2 Sign In
- Users can log in using email and password
- Incorrect credentials display appropriate error messages
- Successful login redirects to role-based dashboard
- JWT token-based session management

### 1.2 Dashboard Requirements

#### 1.2.1 Employee Dashboard
- Quick-access cards for:
  - Profile management
  - Attendance tracking
  - Leave requests
  - Logout functionality
- Display recent activity or alerts
- Show current attendance status

#### 1.2.2 Admin / HR Dashboard
- Display comprehensive overview:
  - Employee list with basic info
  - Attendance records summary
  - Pending leave approvals
  - Quick statistics
- Ability to switch between employee views
- Administrative action buttons

### 1.3 Employee Profile Management

#### 1.3.1 View Profile
- Employees can view:
  - Personal details (name, contact, address)
  - Job details (department, position, join date)
  - Salary structure (base salary, allowances)
  - Uploaded documents
  - Profile picture
- Read-only access to sensitive information

#### 1.3.2 Edit Profile
- Employees can edit limited fields:
  - Address
  - Phone number
  - Profile picture
- Admin can edit all employee details:
  - Personal information
  - Job details
  - Salary structure
  - Role assignments

### 1.4 Attendance Management

#### 1.4.1 Attendance Tracking
- Daily and weekly attendance views
- Check-in/check-out functionality for employees
- Automatic working hours calculation
- Status types supported:
  - Present
  - Absent
  - Half-day
  - Leave
- Date-wise attendance records

#### 1.4.2 Attendance View Permissions
- Employees can view only their own attendance records
- Admin/HR can view attendance of all employees
- Filter options by date range
- Export functionality for reports

### 1.5 Leave & Time-Off Management

#### 1.5.1 Apply for Leave (Employee)
- Leave application form with:
  - Leave type selection (Paid, Sick, Unpaid)
  - Date range picker (start and end dates)
  - Reason/remarks field
  - Automatic days calculation
- Leave request status tracking:
  - Pending (default)
  - Approved
  - Rejected
- View history of all leave requests

#### 1.5.2 Leave Approval (Admin/HR)
- View all pending leave requests
- Approve or reject requests with comments
- Bulk approval functionality
- Email notifications to employees
- Leave balance tracking
- Changes reflect immediately in employee records

### 1.6 Payroll/Salary Management

#### 1.6.1 Employee Payroll View
- Read-only access to:
  - Current salary structure
  - Basic salary breakdown
  - Allowances and deductions
  - Historical payroll data
- No modification permissions for employees

#### 1.6.2 Admin Payroll Control
- View payroll of all employees
- Update salary structures
- Manage allowances and deductions
- Ensure payroll accuracy
- Generate salary reports

## 2. Non-Functional Requirements

### 2.1 Performance Requirements
- Page load time under 3 seconds
- API response time under 500ms
- Support for 100+ concurrent users
- Database query optimization

### 2.2 Security Requirements
- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- HTTPS encryption for all communications
- Environment variables for sensitive data

### 2.3 Usability Requirements
- Responsive design for mobile and desktop
- Intuitive user interface
- Clear navigation structure
- Error messages and user feedback
- Accessibility compliance (WCAG 2.1)

### 2.4 Reliability Requirements
- 99.5% uptime availability
- Data backup and recovery mechanisms
- Error handling and logging
- Graceful degradation of services

### 2.5 Scalability Requirements
- Horizontal scaling capability
- Database indexing for performance
- Caching mechanisms
- Load balancing support

## 3. Technical Specifications

### 3.1 Frontend Requirements
- React.js framework
- Responsive UI components
- State management (Context API or Redux)
- Form validation
- Date/time pickers
- File upload functionality
- Charts and data visualization

### 3.2 Backend Requirements
- Node.js with Express.js framework
- RESTful API design
- JWT authentication middleware
- Input validation middleware
- Error handling middleware
- File upload handling
- Database connection pooling

### 3.3 Database Requirements
- MongoDB document database
- Proper indexing strategy
- Data validation schemas
- Relationship management
- Backup and recovery procedures

### 3.4 Deployment Requirements
- Cloud-based deployment (Render)
- Environment configuration
- CI/CD pipeline setup
- Monitoring and logging
- SSL certificate configuration

## 4. User Stories

### 4.1 Employee User Stories
- As an employee, I want to log in securely so that I can access my personal HR information
- As an employee, I want to mark my daily attendance so that my work hours are tracked
- As an employee, I want to apply for leave so that I can take time off when needed
- As an employee, I want to view my salary details so that I understand my compensation
- As an employee, I want to update my contact information so that HR can reach me

### 4.2 Admin/HR User Stories
- As an HR officer, I want to view all employee profiles so that I can manage the workforce
- As an HR officer, I want to approve leave requests so that I can manage team availability
- As an HR officer, I want to view attendance reports so that I can monitor productivity
- As an HR officer, I want to update employee salary information so that payroll is accurate
- As an HR officer, I want to add new employees so that I can onboard new hires

## 5. Acceptance Criteria

### 5.1 Authentication
- User can successfully register with valid information
- User receives appropriate error messages for invalid input
- User can log in with correct credentials
- User session is maintained across page refreshes
- User can log out successfully

### 5.2 Profile Management
- Employee can view all profile information
- Employee can update allowed fields only
- Admin can update any employee information
- Changes are saved and reflected immediately
- Profile picture upload works correctly

### 5.3 Attendance
- Employee can check in once per day
- Employee can check out after checking in
- Working hours are calculated correctly
- Attendance history is displayed accurately
- Admin can view all employee attendance

### 5.4 Leave Management
- Employee can submit leave requests
- Leave days are calculated correctly
- Admin receives leave requests for approval
- Approval/rejection updates employee records
- Email notifications are sent appropriately

### 5.5 Payroll
- Employee can view salary information
- Salary data is read-only for employees
- Admin can update salary structures
- Changes are reflected in employee view
- Historical payroll data is maintained

## 6. Testing Requirements

### 6.1 Unit Testing
- Test individual functions and components
- Mock external dependencies
- Achieve 80%+ code coverage
- Automated test execution

### 6.2 Integration Testing
- Test API endpoints
- Test database operations
- Test authentication flows
- Test file upload functionality

### 6.3 User Acceptance Testing
- Test complete user workflows
- Verify business requirements
- Test across different browsers
- Test responsive design

### 6.4 Security Testing
- Test authentication mechanisms
- Test authorization controls
- Test input validation
- Test for common vulnerabilities

## 7. Deployment Checklist

### 7.1 Pre-deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificates installed
- [ ] Performance testing completed
- [ ] Security testing completed

### 7.2 Deployment
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] Database migrations executed
- [ ] Environment-specific configurations applied
- [ ] Health checks implemented

### 7.3 Post-deployment
- [ ] Application functionality verified
- [ ] Performance monitoring enabled
- [ ] Error logging configured
- [ ] Backup procedures tested
- [ ] User acceptance testing completed