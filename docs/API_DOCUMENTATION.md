Rewrote the entire API documentation to include common conventions and complete Admin, Teacher, and Student routes with request/response details. 

# Kaushaly Home Learning — API Documentation

This document defines the complete backend API contract for the Kaushaly Home Learning platform across Admin, Teacher, and Student roles.

Base URL
- Production: https://api.kaushaly.example.com
- Staging: https://staging.kaushaly.example.com
- Local: http://localhost:3000 (configurable)

Authentication
- All protected routes require Authorization: Bearer <accessToken>
- Token format: JWT
- Roles: admin | teacher | student

Common Headers
- Authorization: Bearer <token>
- Content-Type: application/json (unless multipart/form-data is specified)
- Idempotency-Key: <uuid> (optional, for safe retries on POST/PATCH)

Date/Time and IDs
- Timestamps use ISO 8601 strings (e.g., 2025-02-06T10:45:00Z)
- Dates use YYYY-MM-DD
- IDs are integers unless otherwise specified

Pagination & Filtering
- Query params: page (default 1), limit (default 10)
- Responses include page, total, totalPages when listing
- Common filters: search, city, subject, status, year, month, startDate, endDate

Error Response (all endpoints)
- 400/401/403/404/409/422/500
{
  "error": {
    "code": "string_identifier",
    "message": "Human-readable error",
    "details": { "field": "validation detail if any" }
  }
}

--------------------------------------------------------------------

## Auth APIs

### POST /auth/login
Authenticate a user.

Body:
{
  "email": "user@example.com",
  "password": "secret"
}

Response 200:
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "user": {
    "id": 1,
    "role": "admin",
    "email": "user@example.com",
    "firstName": "Asha",
    "lastName": "Verma"
  }
}

Errors: 401 invalid_credentials

### POST /auth/refresh
Refresh tokens.

Body:
{
  "refreshToken": "jwt"
}

Response 200:
{
  "accessToken": "jwt",
  "refreshToken": "jwt"
}

Errors: 401 invalid_refresh_token

### POST /auth/logout
Invalidate refresh token for current session.

Response 204 (no body)

### GET /auth/me
Return current authenticated user profile.

Response 200:
{
  "id": 1,
  "role": "teacher",
  "email": "teacher@example.com",
  "firstName": "Asha",
  "lastName": "Verma"
}

--------------------------------------------------------------------

## Admin Dashboard APIs

All endpoints require role=admin.

### Analytics

#### GET /admin/analytics/overview
KPIs for dashboard cards.

Response 200:
{
  "totalStudents": 320,
  "totalTeachers": 58,
  "activePairs": 240,
  "monthlyRevenue": 850000,
  "monthlySalaries": 1450000,
  "netBalance": -600000
}

#### GET /admin/analytics/revenue
Query: year (number)

Response 200:
{
  "year": 2025,
  "months": [
    { "month": "Jan", "fees": 820000, "salaries": 1400000, "net": -580000 },
    { "month": "Feb", "fees": 900000, "salaries": 1450000, "net": -550000 }
  ],
  "annual": { "fees": 10800000, "salaries": 16800000, "net": -6000000 }
}

#### GET /admin/analytics/user-growth
Query: year

Response 200:
{
  "year": 2025,
  "teacherGrowth": [
    { "month": "Jan", "count": 52 },
    { "month": "Feb", "count": 58 }
  ],
  "studentGrowth": [
    { "month": "Jan", "count": 300 },
    { "month": "Feb", "count": 320 }
  ]
}

#### GET /admin/analytics/payments-breakdown
Query: year

Response 200:
{
  "year": 2025,
  "monthly": [
    { "month": "Jan", "fees": 820000, "salaries": 1400000 },
    { "month": "Feb", "fees": 900000, "salaries": 1450000 }
  ],
  "totals": { "fees": 10800000, "salaries": 16800000 }
}

### Users & Roles

#### GET /admin/users
Query: role (admin|teacher|student), search, city, status (active|inactive|deleted), page, limit

Response 200:
{
  "users": [
    { "id": 1, "role": "teacher", "email": "t@example.com", "firstName": "Asha", "lastName": "Verma", "status": "active", "city": "Mumbai" }
  ],
  "page": 1,
  "total": 120,
  "totalPages": 12
}

#### GET /admin/users/{id}
Response 200: user object with role-specific profile if expanded=true

#### PATCH /admin/users/{id}
Body (any subset):
{
  "status": "inactive",
  "firstName": "Asha",
  "lastName": "Verma",
  "city": "Mumbai"
}
Response 200: updated user

#### DELETE /admin/users/{id}
Soft delete a user.
Response 204

#### POST /admin/users/{id}/restore
Restore soft-deleted user.
Response 200: restored user

### Teacher Approvals

#### GET /admin/approvals
Query: status (pending|approved|rejected), page, limit

Response 200:
{
  "applications": [
    { "teacherId": 42, "submittedAt": "2025-01-05T10:00:00Z", "status": "pending", "city": "Pune", "subjects": ["Math","Physics"] }
  ],
  "page": 1,
  "total": 5,
  "totalPages": 1
}

#### POST /admin/approvals/{teacherId}/approve
Body:
{
  "notes": "Verified documents."
}
Response 200: { "teacherId": 42, "status": "approved" }

#### POST /admin/approvals/{teacherId}/reject
Body:
{
  "reason": "Insufficient experience."
}
Response 200: { "teacherId": 42, "status": "rejected" }

### Teacher–Student Pairing

#### GET /admin/pairings
Query: teacherId, studentId, page, limit

Response 200:
{
  "pairs": [
    { "id": 900, "teacherId": 42, "studentId": 101, "since": "2024-12-01" }
  ],
  "page": 1, "total": 1, "totalPages": 1
}

#### POST /admin/pairings
Body:
{
  "teacherId": 42,
  "studentId": 101
}
Response 201: { "id": 900, "teacherId": 42, "studentId": 101, "since": "2025-02-01" }

#### DELETE /admin/pairings/{id}
Unpair a teacher and student.
Response 204

### Student Fees & Payments

#### GET /admin/fees
Query: studentId, status (due|paid|overdue|grace_period), year, month

Response 200:
{
  "invoices": [
    { "id": 501, "studentId": 101, "amount": 5000, "periodMonth": 2, "periodYear": 2025, "dueDate": "2025-02-10", "status": "grace_period", "graceUntil": "2025-02-20" }
  ]
}

#### POST /admin/fees/generate
Body:
{
  "studentId": 101,
  "amount": 5000,
  "periodMonth": 2,
  "periodYear": 2025,
  "dueDate": "2025-02-10",
  "graceDays": 10
}
Response 201: invoice object

#### PATCH /admin/fees/{invoiceId}
Body (any subset):
{
  "status": "paid",
  "dueDate": "2025-02-12",
  "graceUntil": "2025-02-22"
}
Response 200: updated invoice

#### GET /admin/payments
Query: paymentType (monthly_fee|salary), status (pending|completed|failed|refunded), studentId, teacherId, startDate, endDate, page, limit

Response 200:
{
  "payments": [
    { "id": 9001, "paymentType": "monthly_fee", "studentId": 101, "amount": 5000, "paymentMethod": "upi", "paymentStatus": "completed", "transactionId": "TXN123", "paymentDate": "2025-02-09" }
  ],
  "page": 1, "total": 10, "totalPages": 1
}

#### GET /admin/payments/{id}
Response 200: payment object

### Teacher Salaries (Employees)

#### GET /admin/salaries
Query: teacherId, year, month, status (pending|paid), page, limit

Response 200:
{
  "salaries": [
    { "id": 11, "teacherId": 42, "baseSalary": 30000, "bonuses": 2000, "deductions": 0, "totalSalary": 32000, "month": 1, "year": 2025, "status": "paid", "paymentDate": "2025-01-31" }
  ],
  "page": 1, "total": 12, "totalPages": 1
}

#### POST /admin/salaries/run
Create/mark a monthly salary for a teacher.

Body:
{
  "teacherId": 42,
  "month": 2,
  "year": 2025,
  "baseSalary": 30000,
  "bonuses": 0,
  "deductions": 0,
  "markPaid": true,
  "paymentDate": "2025-02-28"
}
Response 201: salary record

#### PATCH /admin/salaries/{salaryId}
Body:
{
  "status": "paid",
  "paymentDate": "2025-02-28",
  "bonuses": 1000,
  "deductions": 0
}
Response 200: updated salary

### Notifications

#### POST /admin/notifications/broadcast
Send a broadcast notification (email/WhatsApp/system).

Body:
{
  "targets": { "audience": "all" | "students" | "teachers" | "ids", "ids": [1,2,3] },
  "channel": "email" | "whatsapp" | "system",
  "title": "string",
  "message": "string"
}
Response 202: { "message": "scheduled", "jobId": "uuid" }

#### GET /admin/notifications
Query: channel, type, isRead, page, limit

Response 200:
{
  "notifications": [
    { "id": 901, "title": "System maintenance", "message": "Scheduled at 10 PM", "type": "system", "channel": "system", "isRead": false, "createdAt": "2025-02-05T10:00:00Z" }
  ],
  "page": 1, "total": 5, "totalPages": 1
}

### System

#### GET /admin/system/cache/status
Response 200:
{
  "resources": [
    { "name": "map", "lastUpdatedAt": "2025-02-06T09:00:00Z", "status": "fresh" }
  ]
}

#### POST /admin/system/cache/refresh
Body:
{
  "resource": "map"
}
Response 202: { "message": "refresh_started", "resource": "map" }

--------------------------------------------------------------------

## Teacher Dashboard APIs

All endpoints require role=teacher.

### Profile

#### GET /teacher/me
Response 200:
{
  "id": 42,
  "email": "teacher@example.com",
  "firstName": "Asha",
  "lastName": "Verma",
  "qualification": "M.Sc. Mathematics",
  "experienceYears": 5,
  "subjectsTaught": ["Mathematics","Physics"],
  "teachingMode": "both",
  "hourlyRate": 500,
  "monthlySalary": 30000,
  "approvalStatus": "approved",
  "rating": 4.7,
  "totalReviews": 32,
  "maxStudents": 20,
  "currentStudents": 12,
  "city": "Mumbai",
  "state": "MH"
}

#### PUT /teacher/me
Body (subset):
{
  "qualification": "M.Sc. Mathematics",
  "experienceYears": 6,
  "subjectsTaught": ["Mathematics","Physics"],
  "teachingMode": "both",
  "hourlyRate": 600,
  "maxStudents": 22,
  "city": "Mumbai",
  "state": "MH"
}
Response 200: teacher object

### Students

#### GET /teacher/students
Query: page, limit, search, city, grade

Response 200:
{
  "students": [
    { "id": 101, "firstName": "Rohan", "lastName": "Patel", "email": "rohan@example.com", "grade": "10th", "city": "Mumbai", "subjectsInterested": ["Mathematics"], "monthlyFee": 5000, "paymentStatus": "paid", "enrollmentDate": "2024-01-15" }
  ],
  "page": 1, "total": 25, "totalPages": 3
}

#### GET /teacher/students/{id}
Response 200: student detail

### Assignments

#### GET /teacher/assignments
Query: status (assigned|submitted|graded|overdue), studentId, subject, page, limit

Response 200:
{
  "assignments": [
    { "id": 456, "teacherId": 42, "studentId": 101, "title": "Algebra Practice", "description": "Exercises 1-20", "subject": "Mathematics", "dueDate": "2025-02-15", "assignmentType": "homework", "maxMarks": 100, "status": "assigned", "createdAt": "2025-02-01T10:00:00Z" }
  ],
  "page": 1, "total": 12, "totalPages": 2
}

#### POST /teacher/assignments
Body:
{
  "studentId": 101,
  "title": "Algebra Practice",
  "description": "Exercises 1-20",
  "subject": "Mathematics",
  "dueDate": "2025-02-15",
  "assignmentType": "homework",
  "maxMarks": 100,
  "instructions": "Show working"
}
Response 201: assignment

#### GET /teacher/assignments/{id}
Response 200: assignment

#### GET /teacher/assignments/{id}/submissions
Response 200:
{
  "submissions": [
    { "id": 789, "assignmentId": 456, "studentId": 101, "submittedAt": "2025-02-14T15:30:00Z", "submissionText": "Solution...", "attachments": [{ "filename": "work.pdf", "url": "https://storage/abc.pdf", "size": 123456 }], "status": "submitted", "marks": null, "feedback": null }
  ]
}

#### POST /teacher/assignments/{id}/grade
Body:
{
  "submissionId": 789,
  "marks": 92,
  "feedback": "Great work. Minor mistakes in Q4.",
  "status": "graded"
}
Response 200:
{ "message": "graded", "assignmentId": 456, "submissionId": 789, "marks": 92, "status": "graded" }

### Attendance

#### GET /teacher/attendance
Query: startDate, endDate, studentId, subject, page, limit

Response 200:
{
  "records": [
    { "id": 321, "studentId": 101, "teacherId": 42, "date": "2025-02-01", "status": "present", "notes": "Active", "sessionDuration": 60, "subject": "Mathematics" }
  ],
  "page": 1, "total": 30, "totalPages": 3
}

#### POST /teacher/attendance
Body:
{
  "studentId": 101,
  "date": "2025-02-20",
  "status": "present",
  "notes": "Participated",
  "sessionDuration": 60,
  "subject": "Mathematics"
}
Response 201: attendance

#### PATCH /teacher/attendance/{id}
Body:
{
  "status": "excused",
  "notes": "Medical leave"
}
Response 200: attendance

### Salary

#### GET /teacher/salary
Query: year, month

Response 200:
{
  "salaries": [
    { "id": 11, "teacherId": 42, "baseSalary": 30000, "bonuses": 2000, "deductions": 0, "totalSalary": 32000, "month": 1, "year": 2025, "status": "paid", "paymentDate": "2025-01-31" }
  ]
}

#### GET /teacher/salary/{id}
Response 200: salary record

### Notifications

#### GET /teacher/notifications
Query: isRead, type (assignment|payment|attendance|system), page, limit

Response 200:
{
  "notifications": [
    { "id": 901, "title": "Payment processed", "message": "Your January salary has been paid", "type": "payment", "priority": "medium", "isRead": false, "createdAt": "2025-02-01T10:00:00Z" }
  ],
  "page": 1, "total": 5, "totalPages": 1
}

#### PATCH /teacher/notifications/{id}/read
Response 200: { "id": 901, "isRead": true }

### Teacher Analytics

#### GET /teacher/analytics/overview
Response 200:
{
  "activeStudents": 12,
  "sessionsThisMonth": 28,
  "avgAttendanceRate": 92.5,
  "assignmentsPending": 3,
  "assignmentsOverdue": 1,
  "upcomingDueDates": [
    { "assignmentId": 456, "studentId": 101, "dueDate": "2025-02-25" }
  ]
}

#### GET /teacher/analytics/monthly
Query: year

Response 200:
{
  "months": [
    { "month": "Jan", "sessions": 22, "assigned": 10, "submitted": 9, "graded": 8, "attendanceRate": 91 }
  ]
}

--------------------------------------------------------------------

## Student Dashboard APIs

All endpoints require role=student unless noted.

### Profile

#### GET /student/me
Response 200:
{
  "id": 101,
  "email": "student@example.com",
  "firstName": "Rohan",
  "lastName": "Patel",
  "grade": "10th",
  "schoolName": "ABC School",
  "parentName": "Meera Patel",
  "parentPhone": "+91-98xxxxxxx",
  "parentEmail": "parent@example.com",
  "subjectsInterested": ["Mathematics","Science"],
  "monthlyFee": 5000,
  "paymentStatus": "grace_period",
  "enrollmentDate": "2024-01-15",
  "city": "Mumbai",
  "state": "MH"
}

#### PUT /student/me
Body (subset):
{
  "grade": "10th",
  "schoolName": "ABC School",
  "parentName": "Meera Patel",
  "parentPhone": "+91-98xxxxxxx",
  "parentEmail": "parent@example.com",
  "subjectsInterested": ["Mathematics","Science"],
  "city": "Mumbai",
  "state": "MH"
}
Response 200: student object

### Teachers (Discovery & Assigned)

#### GET /student/teachers
Query: page, limit, search, subject, city, assignedOnly=false

Response 200:
{
  "teachers": [
    { "id": 42, "firstName": "Asha", "lastName": "Verma", "qualification": "M.Sc. Mathematics", "experienceYears": 5, "subjectsTaught": ["Mathematics"], "teachingMode": "both", "rating": 4.7, "city": "Mumbai", "approvalStatus": "approved" }
  ],
  "page": 1, "total": 25, "totalPages": 3
}

#### GET /teachers/{id}
Public teacher profile by ID.
Response 200: teacher object

### Assignments & Submissions

#### GET /student/assignments
Query: status (assigned|submitted|graded|overdue), subject, page, limit

Response 200:
{
  "assignments": [
    { "id": 456, "teacherId": 42, "studentId": 101, "title": "Algebra Practice", "description": "Exercises 1-20", "subject": "Mathematics", "dueDate": "2025-02-15", "assignmentType": "homework", "maxMarks": 100, "status": "assigned", "createdAt": "2025-02-01T10:00:00Z" }
  ],
  "page": 1, "total": 12, "totalPages": 2
}

#### GET /student/assignments/{id}
Response 200:
{
  "assignment": { "...": "assignment fields" },
  "submission": {
    "id": 789,
    "assignmentId": 456,
    "studentId": 101,
    "submittedAt": "2025-02-14T15:30:00Z",
    "submissionText": "Solution...",
    "attachments": [{ "filename": "work.pdf", "url": "https://storage/abc.pdf", "size": 123456 }],
    "status": "submitted",
    "marks": null,
    "feedback": null
  }
}

#### POST /assignments/{id}/submit
Content-Type: multipart/form-data

Form fields:
- submissionText (string)
- file (binary, optional)

Response 200:
{ "message": "Assignment submitted successfully", "submissionId": 789 }

### Attendance

#### GET /student/attendance
Query: startDate, endDate, subject, page, limit

Response 200:
{
  "records": [
    { "id": 321, "studentId": 101, "teacherId": 42, "date": "2025-02-01", "status": "present", "notes": "Active", "sessionDuration": 60, "subject": "Mathematics" }
  ],
  "page": 1, "total": 30, "totalPages": 3
}

### Fees & Payments

#### GET /student/fees
Query: year, month, status (due|paid|overdue|grace_period)

Response 200:
{
  "invoices": [
    { "id": 501, "studentId": 101, "amount": 5000, "periodMonth": 2, "periodYear": 2025, "dueDate": "2025-02-10", "status": "grace_period", "graceUntil": "2025-02-20" }
  ]
}

#### GET /student/payments
Query: startDate, endDate, status (pending|completed|failed|refunded)

Response 200:
{
  "payments": [
    { "id": 9001, "studentId": 101, "amount": 5000, "paymentType": "monthly_fee", "paymentMethod": "upi", "paymentStatus": "completed", "transactionId": "TXN123", "paymentDate": "2025-02-09", "dueDate": "2025-02-10" }
  ]
}

#### POST /payments
Body:
{
  "studentId": 101,
  "amount": 5000,
  "paymentType": "monthly_fee",
  "paymentMethod": "upi",
  "notes": "Feb fee"
}
Response 201: payment object

### Notifications

#### GET /student/notifications
Query: isRead, type (assignment|payment|attendance|system), page, limit

Response 200:
{
  "notifications": [
    { "id": 901, "title": "Assignment graded", "message": "Your Algebra Practice was graded", "type": "assignment", "priority": "low", "isRead": false, "createdAt": "2025-02-16T08:00:00Z" }
  ],
  "page": 1, "total": 5, "totalPages": 1
}

#### PATCH /student/notifications/{id}/read
Response 200: { "id": 901, "isRead": true }

### Student History & Analytics

#### GET /student/history
Response 200:
{
  "assignmentsTotal": 24,
  "submitted": 22,
  "graded": 20,
  "averageMarks": 86.4,
  "attendanceRate": 93.2,
  "bySubject": [
    { "subject": "Mathematics", "avgMarks": 88.5, "attendanceRate": 95.0 },
    { "subject": "Science", "avgMarks": 84.0, "attendanceRate": 91.0 }
  ]
}

#### GET /student/analytics/overview
Response 200:
{
  "assigned": 5,
  "submitted": 4,
  "graded": 3,
  "upcomingDueDates": [
    { "assignmentId": 456, "title": "Algebra Practice", "dueDate": "2025-02-25" }
  ],
  "attendanceRate": 92.5
}

#### GET /student/analytics/monthly
Query: year

Response 200:
{
  "months": [
    { "month": "Jan", "assigned": 8, "submitted": 7, "graded": 6, "attendanceRate": 91 },
    { "month": "Feb", "assigned": 9, "submitted": 8, "graded": 7, "attendanceRate": 93 }
  ]
}





===========================================
