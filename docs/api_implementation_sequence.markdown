# Kaushaly Home Learning API Implementation Sequence

This document outlines the recommended sequence for implementing the API endpoints for the Kaushaly Home Learning platform to avoid dependencies and collisions. The sequence is grouped logically, prioritizing endpoints that create data before those that retrieve or aggregate it. Each group should be implemented and tested before moving to the next, with database seeding as needed to simulate dependencies.

---

## Implementation Sequence

### Group 1: Admin Teacher Management
These endpoints create verified teachers from pending applications, populating the `users` and `teachers` tables from `temp_users`/`temp_teachers`. This is foundational as teachers are needed for most features.

- **GET /admin/teacher-managment/** - List pending teacher applications.
- **GET /admin/approval-preview** - Preview pending teacher approvals.
- **POST /admin/teacher-managment/:teacherId/approve** - Approve a teacher, moving them to `users`/`teachers`.
- **POST /admin/teacher-managment/:teacherId/reject** - Reject a teacher, removing from `temp_users`/`temp_teachers`.

**Why?** Minimal dependencies; assumes `temp_users`/`temp_teachers` are populated (e.g., via registration endpoints or seeding).

**Post-Implementation**: Seed test teachers into `temp_users`/`temp_teachers` for testing approvals.

---

### Group 2: Admin Users Management
These manage users (students, teachers, admins), populating/updating `users`, `students`, and `teachers` tables. Use for creating/updating students (since no explicit student creation endpoint exists).

- **DELETE /admin/users-managment/:userId** - Delete a user.
- **PUT /admin/users-managment/:userId** - Update user details (e.g., student/teacher info).
- **GET /admin/users-managment** - List users with pagination and filters.
- **GET /admin/users-managment/:userId** - Get detailed user information.

**Why?** Depends on users existing (from Group 1 or seeding). Enables student creation for subsequent endpoints.

**Post-Implementation**: Seed students into `users`/`students` for testing.

---

### Group 3: Admin Teacher Salary Management
These create and manage teacher salary records, populating `salary_payments` and updating `teachers`.

- **POST /admin/teacher-salary/add** - Add a new salary record for a teacher.
- **POST /admin/teacher-salary/:teacherId/pay** - Mark a teacher's salary as paid, creating a payment entry.
- **GET /admin/teacher-salary** - List teacher salaries with pagination.
- **GET /admin/teacher-salary/:teacherId** - Get detailed salary info and history for a teacher.
- **GET /admin/teacher-salary/stats** - Get overall teacher salary statistics.

**Why?** Depends on teachers (Group 1). Provides data for analytics and payments.

**Post-Implementation**: Seed salary records for testing.

---

### Group 4: Admin Student Fee Management
These create and manage student fee records, populating `student_fees` and `payments`.

- **POST /admin/student-fee/add** - Add a new fee record for a student.
- **POST /admin/student-fee/:feeId/paid** - Mark a fee as paid, creating a payment entry.
- **POST /admin/student-fee/:feeId/send-reminder** - Send a fee reminder, updating reminder count.
- **GET /admin/student-fee** - List student fees with pagination.
- **GET /admin/student-fee/:feeId** - Get detailed fee info and payment history.
- **GET /admin/student-fee/stats** - Get overall student fee statistics.

**Why?** Depends on students (Group 2). Provides data for payments and analytics.

**Post-Implementation**: Implement the CRON job for daily fee reminders (checks fees due in 3 days). Seed fee records.

---

### Group 5: Admin Payments Management
These aggregate payment data from fees and salaries.

- **GET /admin/payments** - List all payments with pagination and filters.
- **GET /admin/payments/:paymentId** - Get detailed payment information.
- **GET /admin/payments/stats** - Get overall payment statistics.

**Why?** Depends on payment records (Groups 3-4).

**Post-Implementation**: Verify payment data from previous groups.

---

### Group 6: Teacher Assignments Management
These handle assignment creation and management, populating `assignments`, `assignment_attachments`, and `assignment_submissions`.

- **POST /teacher/assignments** - Create a new assignment for a student.
- **PATCH /teacher/assignments/:assignmentId** - Update an assignment's metadata or attachments.
- **POST /teacher/assignments/:assignmentId/grade** - Grade or add feedback to a student's submission.
- **GET /teacher/assignments/:assignmentId/attachments/:fileName** - Download an assignment attachment.
- **GET /teacher/assignments/:assignmentId/submissions/:studentId/download** - Download a student's submission.
- **GET /teacher/assignments** - List all assignments created by the teacher.

**Why?** Depends on teachers and students (Groups 1-2). Assumes teacher-student assignments in `teacher_student_assignments` (seed if needed). Requires file storage setup (e.g., S3).

**Post-Implementation**: Seed teacher-student assignments and test file uploads/downloads.

---

### Group 7: Student Assignments Management
These handle student-facing assignment actions.

- **POST /student/assignments/:assignmentId/submit** - Submit an assignment with file upload.
- **GET /student/assignments** - List all assignments assigned to the student.
- **GET /student/assignments/stats** - Get assignment statistics for the student.

**Why?** Depends on assignments (Group 6).

**Post-Implementation**: Test with seeded assignments and submissions.

---

### Group 8: Teacher Attendance Management
These manage attendance records, populating the `attendance` table.

- **POST /teacher/attendence/:studentId/mark** - Mark attendance with geolocation check.
- **GET /teacher/attendence/:studentId** - List attendance records for a student with pagination.
- **GET /teacher/attendence/:studentId/monthly** - Get monthly attendance for a student.

**Why?** Depends on teachers and students (Groups 1-2). Requires geolocation integration (compare with `students.home_latitude/longitude`).

**Post-Implementation**: Seed attendance records and test geolocation logic.

---

### Group 9: Student Attendance Management
- **GET /student/attendence/** - List attendance records for the student with pagination.

**Why?** Depends on attendance records (Group 8).

**Post-Implementation**: Verify with seeded attendance data.

---

### Group 10: Teacher Dashboard and Salary
These provide teacher dashboard overviews.

- **GET /teacher/students** - List students assigned to the teacher.
- **GET /teacher/salary** - Get salary history for the teacher.
- **GET /teacher/salary/stats** - Get salary statistics for the teacher.
- **GET /teacher/stats** - Get overall teacher dashboard statistics.

**Why?** Depends on students, salaries, and assignments (Groups 2, 3, 6).

**Post-Implementation**: Test with seeded data.

---

### Group 11: Student Dashboard and Payments
These provide student dashboard overviews.

- **GET /student/teachers** - List teachers assigned to the student.
- **GET /student/payments** - List payments made by the student.
- **GET /student/payments/stats** - Get payment statistics for the student.
- **GET /student/stats** - Get overall student dashboard statistics.

**Why?** Depends on teachers, payments, assignments, and attendance (Groups 1-9).

**Post-Implementation**: Verify with seeded data.

---

### Group 12: Admin Analytics and Stats
These aggregate data for analytics and dashboard stats.

- **GET /admin/stats** - Get overall admin dashboard statistics.
- **GET /admin/recent-users** - List recently joined users.
- **GET /admin/analytics/stats** - Get overall analytics statistics.
- **GET /admin/analytics/grouth/anual-revenue** - Get annual revenue data.
- **GET /admin/analytics/grouth/user-growth** - Get user growth data.
- **GET /admin/analytics/grouth/student-grouth** - Get student growth data.
- **GET /admin/analytics/grouth/teacher-growth** - Get teacher growth data.
- **GET /admin/analytics/grouth/subject-distribution** - Get subject distribution data.
- **GET /admin/analytics/grouth/attendence-trend** - Get attendance trend data.
- **GET /admin/analytics/revenue/distribution** - Get payment distribution data.
- **GET /admin/analytics/revenue/revenue-expenditure** - Get revenue vs expenditure data.
- **GET /admin/analytics/revenue/totla-payments** - Get total payments data.

**Why?** Depends on all previous data (users, payments, attendance, etc.). Uses `created_at` and other fields for trends.

**Post-Implementation**: Test with comprehensive seeded data.

---

## Additional Notes
- **Authentication**: Implement JWT-based cookie authentication first (or mock it for testing), as all endpoints require it.
- **Database Seeding**: After each group, seed relevant tables (e.g., `users`, `students`, `teachers`, `payments`, `assignments`) to test subsequent endpoints. Use SQL scripts or tools like Postman.
- **File Storage**: Set up file storage (e.g., AWS S3) for assignment attachments/submissions (Groups 6-7).
- **CRON Job**: Implement the student fee reminder CRON job after Group 4, as it relies on `student_fees`.
- **Teacher-Student Assignments**: No explicit endpoint for creating `teacher_student_assignments`. Either seed the table or add a `POST /admin/assign-teacher-student` endpoint before Group 6.
- **Tech Stack**: Consider Express.js/Node.js for the backend, Sequelize/Prisma for ORM (aligned with schema), and Postman for testing.
- **Error Handling**: Implement the error response format (`{ Error, message, code, status }`) across all endpoints.
- **Validation**: Ensure schema constraints (e.g., `UNIQUE`, `CHECK`) are enforced in API logic.
- **Timeline**: Aim for 1-2 groups per day/week, depending on complexity and team size.

This sequence ensures data dependencies are met, allowing smooth implementation and testing of the Kaushaly Home Learning API.