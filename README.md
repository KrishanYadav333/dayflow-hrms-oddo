# Dayflow HRMS - Human Resource Management System

## 1. Project Overview

Dayflow HRMS is a lightweight Human Resource Management System designed to digitize and streamline everyday HR operations. It helps organizations manage employees, track attendance, handle leave workflows, and provide payroll visibility through a centralized platform.

The system is built with simplicity, scalability, and cost-efficiency in mind, using only free and open-source technologies.

## 2. Problem Statement

Many small and medium organizations still rely on manual or fragmented systems for HR operations, leading to:

- Inaccurate attendance tracking
- Delays in leave approvals
- Poor visibility of employee records
- Inefficient HR workflows

These issues reduce productivity and create administrative overhead.

## 3. Proposed Solution

Dayflow HRMS provides a centralized, role-based system that enables:

- Digital employee profile management
- Attendance tracking with clear status
- Leave application and approval workflows
- Payroll visibility for employees
- Administrative control for HR teams

The system improves transparency, efficiency, and reliability in daily HR processes.

## 4. User Roles

### Employee
- View personal profile
- Mark daily attendance
- View attendance history
- Apply for leave
- Track leave request status
- View salary details (read-only)

### Admin / HR Officer
- Manage employee profiles
- View attendance of all employees
- Approve or reject leave requests
- Manage payroll information
- View reports and analytics

## 5. Core Features

### Authentication
- Email & password-based login
- Role-based access control (Employee / Admin)

### Employee Profile Management
- Personal details
- Job information
- Salary structure
- Documents

### Attendance Management
- Daily attendance tracking
- Attendance status:
  - Present
  - Absent
  - Half-day
  - Leave
- Employees can view only their own records
- Admin can view attendance of all employees

### Leave Management
- Leave types:
  - Paid
  - Sick
  - Unpaid
- Leave status:
  - Pending
  - Approved
  - Rejected
- Admin approval workflow with comments

### Payroll (Read-Only for Employees)
- Salary structure visibility
- Payroll managed by Admin
- No direct modification by employees

## 6. Tech Stack

**Frontend**
- React.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas (Free Tier)

**Deployment**
- Render (Backend & Frontend)

## 7. System Architecture (High-Level)

1. User interacts with the React frontend
2. Frontend sends requests to Express APIs
3. Backend processes business logic
4. Data is stored and retrieved from MongoDB Atlas
5. Role-based responses are returned to the client

The architecture is cloud-native, scalable, and cost-free.

## 8. Database Design (MongoDB)

### User Collection
```json
{
  "name": "Employee Name",
  "email": "employee@email.com",
  "password": "hashed_password",
  "role": "employee | admin",
  "designation": "Software Engineer"
}
```

### Attendance Collection
```json
{
  "userId": "ObjectId",
  "date": "2026-01-03",
  "status": "Present"
}
```

### Leave Collection
```json
{
  "userId": "ObjectId",
  "leaveType": "Paid",
  "fromDate": "2026-01-05",
  "toDate": "2026-01-06",
  "status": "Pending"
}
```

## 9. API Endpoints (Sample)

| Endpoint        | Method | Description           |
|-----------------|--------|-----------------------|
| /login          | POST   | User login            |
| /users          | POST   | Create user           |
| /attendance     | POST   | Mark attendance       |
| /attendance/:id | GET    | View attendance       |
| /leave          | POST   | Apply for leave       |
| /leave/approve  | POST   | Approve leave (Admin) |

## 10. Deployment Strategy

- Backend deployed as a Web Service on Render
- MongoDB Atlas used as a managed cloud database
- Environment variables used for secure credentials
- Entire system built using free-tier services only

## 11. Security Considerations

- Passwords stored securely (hashed)
- Role-based access enforced at API level
- Environment variables used for sensitive data
- No hardcoded credentials

## 12. Future Enhancements

- Email and notification system
- Biometric or location-based attendance
- Payslip generation and export
- Advanced analytics dashboard
- Department and role hierarchy
- OAuth-based authentication

## 13. Hackathon Details

- **Event**: ODDO Hackathon
- **Project Type**: Team Project
- **Focus**: Practical HR automation using free cloud services
- **Goal**: Deliver a functional, scalable HRMS prototype

## 14. Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Render account for deployment

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd dayflow-hrms-oddo

# Install dependencies
npm run install-deps

# Set up environment variables
cp server/.env.example server/.env
# Update MongoDB URI and JWT secret

# Start development servers
npm run dev
```

### Deployment
1. Create MongoDB Atlas cluster
2. Deploy backend to Render as Web Service
3. Deploy frontend to Render as Static Site
4. Configure environment variables

## 15. Conclusion

Dayflow HRMS demonstrates how a modern HR system can be built using lightweight architecture and free cloud services. The project focuses on real-world usability, clear workflows, and scalable design, making it suitable for startups and small organizations.