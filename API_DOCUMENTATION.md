# Dayflow HRMS API Documentation

## Authentication

This API uses Clerk for authentication. All protected endpoints require a valid Clerk JWT token.

**Headers for Protected Routes:**
```
Authorization: Bearer <clerk_jwt_token>
```

## Employee Endpoints

### POST /employee/setup
Setup employee profile after Clerk registration (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "department": "Engineering",
  "position": "Software Developer",
  "joinDate": "2024-01-15",
  "baseSalary": 75000,
  "role": "Employee"
}
```

**Response:**
```json
{
  "id": "user_id",
  "clerkId": "clerk_user_id",
  "employeeId": "EMP001",
  "email": "john.doe@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Engineering",
  "position": "Software Developer",
  "role": "Employee"
}
```

### GET /employee/profile
Get current user's profile (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "id": "user_id",
  "clerkId": "clerk_user_id",
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
  "allowances": 5000
}
```

### GET /employee/all
Get all employees (Admin only)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
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
    "position": "Software Developer"
  }
]
```

## Attendance Endpoints

### POST /attendance/checkin
Check in for the day (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "id": "attendance_id",
  "employeeId": "user_id",
  "date": "2024-01-15T00:00:00.000Z",
  "checkIn": "2024-01-15T09:00:00.000Z",
  "status": "Present"
}
```

### POST /attendance/checkout
Check out for the day (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
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

### GET /attendance/my
Get own attendance records (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
[
  {
    "id": "attendance_id",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T17:30:00.000Z",
    "status": "Present",
    "workingHours": 8.5
  }
]
```

### GET /attendance/all
Get all attendance records (Admin only)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
[
  {
    "id": "attendance_id",
    "employee": {
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

## Leave Endpoints

### POST /leave/apply
Apply for leave (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
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
  "status": "Pending"
}
```

### GET /leave/my
Get own leave requests (Protected)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
[
  {
    "id": "leave_id",
    "leaveType": "Paid",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-01-22T00:00:00.000Z",
    "days": 3,
    "reason": "Family vacation",
    "status": "Approved"
  }
]
```

### GET /leave/all
Get all leave requests (Admin only)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
[
  {
    "id": "leave_id",
    "employee": {
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": "EMP001"
    },
    "leaveType": "Paid",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-01-22T00:00:00.000Z",
    "days": 3,
    "reason": "Family vacation",
    "status": "Pending"
  }
]
```

### PUT /leave/:id/status
Approve or reject leave request (Admin only)

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
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
  "status": "Approved",
  "approvalComments": "Approved for vacation",
  "approvedBy": "admin_user_id"
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |