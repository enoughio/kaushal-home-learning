# API Usage Examples

## Authentication Headers
All requests (except public endpoints) require these headers:
```
x-user-id: <number>
x-user-role: "admin" | "teacher" | "student"
x-user-email: <email>
```

## Admin Endpoints Examples

### Get Admin Dashboard Stats
```bash
GET /api/admin/stats

Response:
{
  "data": {
    "totalUsers": 1500,
    "activeTeachers": 150,
    "totalRevenue": 750000,
    "TotalStudents": 600
  },
  "status": 200,
  "code": 200
}
```

### Get All Users with Filtering
```bash
GET /api/admin/users-managment?page=1&limit=20&role=student&status=active

Response:
{
  "data": {
    "users": [
      {
        "id": "123",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "student",
        "status": "active",
        "joinedAt": "2024-01-20T14:30:00Z"
      }
    ],
    "page": 1,
    "totalPages": 10,
    "totalUsers": 200
  },
  "status": 200,
  "code": 200
}
```

### Approve Teacher Application
```bash
POST /api/admin/teacher-managment/123/approve

Response:
{
  "data": {
    "message": "Teacher approved successfully",
    "teacherId": "123",
    "teacherName": "John Doe"
  },
  "status": 200,
  "code": 200
}
```

### Get Analytics Data
```bash
GET /api/admin/analytics/grouth/user-growth

Response:
{
  "data": {
    "userGrowth": [
      {"month": "Jan", "students": 100, "teachers": 10},
      {"month": "Feb", "students": 120, "teachers": 12},
      // ... 12 months of data
    ]
  },
  "status": 200,
  "code": 200
}
```

### Get Payment Statistics
```bash
GET /api/admin/payments/stats

Response:
{
  "data": {
    "totalPayments": 1500,
    "duePayments": 150,
    "paidAmmount": 750000,
    "dueAmmount": 60000
  },
  "status": 200,
  "code": 200
}
```

### Assign Teacher to Student
```bash
POST /api/admin/assign-teacher/456
Content-Type: application/json

{
  "teacherId": "789"
}

Response:
{
  "data": {
    "message": "Teacher assigned to student successfully",
    "studentId": "456",
    "teacherId": "789"
  },
  "status": 200,
  "code": 200
}
```

### Mark Student Fee as Paid
```bash
POST /api/admin/student-fee/101/paid
Content-Type: application/json

{
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123456",
  "date": "2024-01-20T14:30:00Z"
}

Response:
{
  "data": {
    "message": "Fee marked as paid successfully",
    "feeId": "101",
    "paymentDetails": {
      "paymentMethod": "bank_transfer",
      "transactionId": "TXN123456",
      "date": "2024-01-20T14:30:00Z"
    }
  },
  "status": 200,
  "code": 200
}
```

## Teacher Endpoints Examples

### Get Teacher Dashboard Stats
```bash
GET /api/teacher/stats
Headers: x-user-id: 5, x-user-role: teacher

Response:
{
  "data": {
    "totalStudents": 25,
    "totalEarnings": 50000,
    "pendingAssignments": 5
  },
  "status": 200,
  "code": 200
}
```

### Get All Assigned Students
```bash
GET /api/teacher/students
Headers: x-user-id: 5, x-user-role: teacher

Response:
{
  "data": {
    "students": [
      {
        "id": "1",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profileImg": "https://example.com/photo.jpg",
        "phone": "9876543210",
        "parentName": "John Smith",
        "mapLocation": "https://maps.google.com/?q=28.6139,77.2090",
        "location": "New Delhi, India",
        "pincode": "110001",
        "status": "active",
        "enrolledAt": "2024-01-20T14:30:00Z"
      }
    ]
  },
  "status": 200,
  "code": 200
}
```

### Create Assignment
```bash
POST /api/teacher/assignments
Headers: x-user-id: 5, x-user-role: teacher
Content-Type: application/json

{
  "studentId": "1",
  "title": "Math Homework 1",
  "subject": "Math",
  "description": "Complete exercises on page 42",
  "dueDate": "2024-02-01T14:30:00Z",
  "attachments": [
    {
      "fileName": "worksheet.pdf",
      "fileUrl": "https://cdn.example.com/worksheet.pdf",
      "mimeType": "application/pdf",
      "size": 123456
    }
  ]
}

Response:
{
  "data": {
    "message": "Assignment created successfully",
    "assignmentId": "10",
    "studentId": "1"
  },
  "status": 201,
  "code": 201
}
```

### Grade Student Assignment
```bash
POST /api/teacher/assignments/10/grade
Headers: x-user-id: 5, x-user-role: teacher
Content-Type: application/json

{
  "studentId": "1",
  "grade": "A",
  "feedback": "Great work! Very well done."
}

Response:
{
  "data": {
    "message": "Assignment updated successfully",
    "assignmentId": "10",
    "studentId": "1"
  },
  "status": 200,
  "code": 200
}
```

### Mark Student Attendance
```bash
POST /api/teacher/attendence/1/mark
Headers: x-user-id: 5, x-user-role: teacher
Content-Type: application/json

{
  "date": "2024-01-25",
  "status": "present",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}

Response:
{
  "data": {
    "message": "Attendance marked successfully",
    "studentId": "1",
    "teacherId": "5",
    "date": "2024-01-25",
    "status": "present",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "status": 200,
  "code": 200
}
```

## Student Endpoints Examples

### Get Student Dashboard Stats
```bash
GET /api/student/stats
Headers: x-user-id: 10, x-user-role: student

Response:
{
  "data": {
    "pendingAssignments": 5,
    "activeTeachers": 3,
    "attendanceRate": 90
  },
  "status": 200,
  "code": 200
}
```

### Get All Assignments
```bash
GET /api/student/assignments
Headers: x-user-id: 10, x-user-role: student

Response:
{
  "data": {
    "assignments": [
      {
        "id": "10",
        "submited": false,
        "teacherId": "5",
        "title": "Math Homework 1",
        "description": "Complete exercises on page 42",
        "dueDate": "2024-02-01T14:30:00Z",
        "createdAt": "2024-01-20T14:30:00Z",
        "status": "assigned",
        "attachments": [
          {
            "fileName": "worksheet.pdf",
            "fileUrl": "https://cdn.example.com/worksheet.pdf",
            "mimeType": "application/pdf",
            "size": 123456
          }
        ],
        "submission": null
      }
    ]
  },
  "status": 200,
  "code": 200
}
```

### Submit Assignment
```bash
POST /api/student/assignments/10/submit
Headers: x-user-id: 10, x-user-role: student
Content-Type: multipart/form-data

file: <binary pdf file>

Response:
{
  "data": {
    "message": "Submission uploaded successfully",
    "assignmentId": "10",
    "studentId": "10",
    "fileName": "submission.pdf",
    "fileUrl": "https://example.com/submission.pdf",
    "submittedAt": "2024-01-30T10:00:00Z"
  },
  "status": 201,
  "code": 201
}
```

### Get Attendance Records
```bash
GET /api/student/attendence/?page=1&month=1&year=2024
Headers: x-user-id: 10, x-user-role: student

Response:
{
  "data": {
    "studentId": "10",
    "month": 1,
    "year": 2024,
    "attendanceRecords": [
      {"date": "2024-01-01", "status": "present"},
      {"date": "2024-01-02", "status": "absent"},
      {"date": "2024-01-03", "status": "present"}
    ],
    "page": 1,
    "totalPages": 1,
    "totalRecords": 20
  },
  "status": 200,
  "code": 200
}
```

### Get Payment History
```bash
GET /api/student/payments?page=1
Headers: x-user-id: 10, x-user-role: student

Response:
{
  "data": {
    "payments": [
      {
        "id": "1",
        "type": "student_fee",
        "amount": 5000,
        "status": "paid",
        "date": "2024-01-20T14:30:00Z",
        "dueDate": "2024-02-20T14:30:00Z",
        "method": "bank_transfer",
        "transactionId": "TXN123456"
      }
    ],
    "page": 1,
    "totalPages": 1,
    "totalPayments": 5
  },
  "status": 200,
  "code": 200
}
```

## Error Response Examples

### Missing Required Field
```bash
POST /api/admin/teacher-managment/123/approve
Content-Type: application/json

{}

Response (400):
{
  "error": "INVALID_REQUEST",
  "message": "Invalid teacher ID",
  "code": 400,
  "status": 400
}
```

### Unauthorized Access
```bash
GET /api/admin/payments
# No headers provided

Response (403):
{
  "error": "FORBIDDEN",
  "message": "Only teachers can access this endpoint",
  "code": 403,
  "status": 403
}
```

### Resource Not Found
```bash
GET /api/admin/users-managment/99999

Response (404):
{
  "error": "NOT_FOUND",
  "message": "User not found",
  "code": 404,
  "status": 404
}
```

### Server Error
```bash
Response (500):
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Failed to fetch admin stats",
  "code": 500,
  "status": 500,
  "details": "Database connection error"
}
```

---

## Notes
- All timestamps are in ISO 8601 format
- Monetary amounts are in the base currency unit (e.g., cents or smallest unit)
- IDs are returned as strings in the response
- Pagination defaults: page=1, limit=20
- All array responses support pagination with page, totalPages, and total count fields
