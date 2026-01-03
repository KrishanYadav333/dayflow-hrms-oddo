# Dayflow HRMS - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://dayflow-hrms.onrender.com/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "error": null
}
```

## Error Responses
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": "Detailed error information"
}
```

## Authentication Endpoints

### POST /auth/signup
Register a new user

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "email": "john.doe@company.com",
  "password": "password123",
  "role": "Employee",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "employeeId": "EMP001",
    "email": "john.doe@company.com",
    "role": "Employee",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Status Codes:**
- 201: User created successfully
- 400: Validation error or user already exists
- 500: Server error

### POST /auth/signin
Authenticate user login

**Request Body:**
```json
{
  "email": "john.doe@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "employeeId": "EMP001",
    "email": "john.doe@company.com",
    "role": "Employee",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Status Codes:**
- 200: Login successful
- 400: Invalid credentials
- 500: Server error

## Employee Endpoints

### GET /employee/profile
Get current user's profile (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "user_id",
  "employeeId": "EMP001",
  "email": "john.doe@company.com",
  "role": "Employee",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "department": "Engineering",
  "position": "Software Developer",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "baseSalary": 75000,
  "allowances": 5000,
  "profilePicture": "profile_url"
}
```

**Status Codes:**
- 200: Profile retrieved successfully
- 401: Unauthorized
- 500: Server error

### PUT /employee/profile
Update current user's profile (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "address": "456 New St, City, State",
  "profilePicture": "new_profile_url"
}
```

**Response:**
```json
{
  "id": "user_id",
  "employeeId": "EMP001",
  "email": "john.doe@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "456 New St, City, State",
  "profilePicture": "new_profile_url"
}
```

**Status Codes:**
- 200: Profile updated successfully
- 401: Unauthorized
- 500: Server error

### GET /employee/all
Get all employees (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "user_id_1",
    "employeeId": "EMP001",
    "email": "john.doe@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Engineering",
    "position": "Software Developer",
    "isActive": true
  },
  {
    "id": "user_id_2",
    "employeeId": "EMP002",
    "email": "jane.smith@company.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "department": "HR",
    "position": "HR Manager",
    "isActive": true
  }
]
```

**Status Codes:**
- 200: Employees retrieved successfully
- 401: Unauthorized
- 403: Forbidden (not admin)
- 500: Server error

### PUT /employee/:id
Update employee by ID (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "department": "Engineering",
  "position": "Senior Software Developer",
  "baseSalary": 85000,
  "allowances": 7000
}
```

**Response:**
```json
{
  "id": "user_id",
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Engineering",
  "position": "Senior Software Developer",
  "baseSalary": 85000,
  "allowances": 7000
}
```

**Status Codes:**
- 200: Employee updated successfully
- 401: Unauthorized
- 403: Forbidden (not admin)
- 404: Employee not found
- 500: Server error

## Attendance Endpoints

### POST /attendance/checkin
Check in for the day (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "attendance_id",
  "employeeId": "user_id",
  "date": "2024-01-15T00:00:00.000Z",
  "checkIn": "2024-01-15T09:00:00.000Z",
  "checkOut": null,
  "status": "Present",
  "workingHours": 0
}
```

**Status Codes:**
- 200: Check-in successful
- 400: Already checked in today
- 401: Unauthorized
- 500: Server error

### POST /attendance/checkout
Check out for the day (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "attendance_id",
  "employeeId": "user_id",
  "date": "2024-01-15T00:00:00.000Z",
  "checkIn": "2024-01-15T09:00:00.000Z",
  "checkOut": "2024-01-15T17:30:00.000Z",
  "status": "Present",
  "workingHours": 8.5
}
```

**Status Codes:**
- 200: Check-out successful
- 400: No check-in found or already checked out
- 401: Unauthorized
- 500: Server error

### GET /attendance/my
Get own attendance records (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "attendance_id",
    "employeeId": "user_id",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T17:30:00.000Z",
    "status": "Present",
    "workingHours": 8.5,
    "remarks": null
  }
]
```

**Status Codes:**
- 200: Attendance records retrieved successfully
- 401: Unauthorized
- 500: Server error

### GET /attendance/all
Get all attendance records (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "attendance_id",
    "employeeId": {
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": "EMP001"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T17:30:00.000Z",
    "status": "Present",
    "workingHours": 8.5
  }
]
```

**Status Codes:**
- 200: All attendance records retrieved successfully
- 401: Unauthorized
- 403: Forbidden (not admin)
- 500: Server error

## Leave Endpoints

### POST /leave/apply
Apply for leave (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "leaveType": "Paid",
  "startDate": "2024-01-20",
  "endDate": "2024-01-22",
  "reason": "Family vacation"
}
```

**Response:**
```json
{
  "id": "leave_id",
  "employeeId": "user_id",
  "leaveType": "Paid",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-01-22T00:00:00.000Z",
  "days": 3,
  "reason": "Family vacation",
  "status": "Pending",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Status Codes:**
- 201: Leave application submitted successfully
- 400: Validation error
- 401: Unauthorized
- 500: Server error

### GET /leave/my
Get own leave requests (Protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "leave_id",
    "employeeId": "user_id",
    "leaveType": "Paid",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-01-22T00:00:00.000Z",
    "days": 3,
    "reason": "Family vacation",
    "status": "Approved",
    "approvedBy": {
      "firstName": "HR",
      "lastName": "Manager"
    },
    "approvalComments": "Approved for vacation",
    "approvalDate": "2024-01-16T14:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

**Status Codes:**
- 200: Leave requests retrieved successfully
- 401: Unauthorized
- 500: Server error

### GET /leave/all
Get all leave requests (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "leave_id",
    "employeeId": {
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": "EMP001"
    },
    "leaveType": "Paid",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-01-22T00:00:00.000Z",
    "days": 3,
    "reason": "Family vacation",
    "status": "Pending",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

**Status Codes:**
- 200: All leave requests retrieved successfully
- 401: Unauthorized
- 403: Forbidden (not admin)
- 500: Server error

### PUT /leave/:id/status
Approve or reject leave request (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "Approved",
  "comments": "Approved for vacation"
}
```

**Response:**
```json
{
  "id": "leave_id",
  "employeeId": {
    "firstName": "John",
    "lastName": "Doe",
    "employeeId": "EMP001"
  },
  "leaveType": "Paid",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-01-22T00:00:00.000Z",
  "days": 3,
  "reason": "Family vacation",
  "status": "Approved",
  "approvalComments": "Approved for vacation",
  "approvedBy": "admin_user_id",
  "approvalDate": "2024-01-16T14:00:00.000Z"
}
```

**Status Codes:**
- 200: Leave status updated successfully
- 401: Unauthorized
- 403: Forbidden (not admin)
- 404: Leave request not found
- 500: Server error

## Status Codes Reference

| Code | Description                                     |
|------|-------------------------------------------------|
| 200  | OK - Request successful                         |
| 201  | Created - Resource created successfully         |
| 400  | Bad Request - Invalid input or validation error |
| 401  | Unauthorized - Authentication required          |
| 403  | Forbidden - Insufficient permissions            |
| 404  | Not Found - Resource not found                  |
| 500  | Internal Server Error - Server error            |

## Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Data Validation Rules

### User Registration
- Employee ID: Required, unique, alphanumeric
- Email: Required, valid email format, unique
- Password: Minimum 6 characters
- First Name: Required, minimum 2 characters
- Last Name: Required, minimum 2 characters
- Role: Must be "Employee" or "HR"

### Leave Application
- Leave Type: Must be "Paid", "Sick", or "Unpaid"
- Start Date: Required, cannot be in the past
- End Date: Required, must be after start date
- Reason: Required, minimum 10 characters

### Attendance
- Check-in: Only once per day
- Check-out: Only after check-in
- Date: Automatically set to current date