# Kaushaly Home Learning — API Documentation (new)

# Kaushaly Home Learning — API Documentation (new)

This documentation defines the complete API for the Kaushaly Home Learning platform.

The platform supports the following user roles:

- Admin
- Teacher
- Student

## Naming convention

- All endpoints use plural form unless the resource is naturally singular.
- All endpoints are lowercase.
- JSON variable names use camelCase.
- All date/time values use ISO 8601 format.

## Base URL

```
https://api.kaushaly.in/api
```

## Authentication

This needs to be added later.

All endpoints below require authentication via JWT-based cookies; no token needs to be passed in headers.

## Admin dashboards API

### Main page

#### GET /admin/stats

- Description: Get overall statistics for the admin dashboard for overview.

- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "totalUsers": 1500,
      "activeTeachers": 150,
      "totalRevenue": 75,
      "TotalStudents": 60
    }
    ```

#### GET /admin/recent-users 

- Description: Get recent users for the admin overview page.
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "recentUsers": [
        {
          "id": "user123",
          "name": "Jane Smith",
          "email": "",
            "role": "student",
            "joinedAt": "2024-01-20T14:30:00Z",
            "status": "active" | "pending",
            
        }
      ]
    }
    ```



#### GET /admin/approval-preview

- Description: Get a preview of pending approvals for the admin overview page.

- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "pendingTeachers": [
        {
          "id": "teacher123",
          "name": "John Doe",
          "email": "asdf@example.com",
          "appliedAt": "2024-01-15T10:00:00Z",
          "subjects": ["Math", "Science"]
        }
      ]
    }
    ```


#### GET /admin/teacher-managment/
- Description: Get all pending approvals for teachers for the overview page.

- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "pendingTeachers": [
        {
          "id": "teacher123",
          "name": "John Doe",
          "email": "asdfj@example.com",
          "aadharNumber": "1234-5678-9012",
          "phone" : "9876543210",
          "location": "New Delhi, India",
           "pincode": "110001",
           "Subjects": ["Math", "Science"],
           "highestQualification": "M.Sc in Physics",
           "10thPercentage": 85.5,
              "12thPercentage": 88.0,
           "applyedAt": "2024-01-15T10:00:00Z",
           "marksheetUrl10": "https://example.com/marksheet.jpg",
            "marksheetUrl12": "https://example.com/marksheet12.jpg",
             "resume": "https://example.com/resume.jpg"
        }
      ]
        },
    ```



#### POST /admin/teacher-managment/:teacherId/approve
- Description: Approve a teacher's application. 

- Process: Move the teacher from the temp_user table to the user table and update related info in the teachers table.
- Set isVarified: true

Role: admin only
- Request:
    - Parameters:
        - nome
    - Body: teacherId (string, required)


- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Teacher approved successfully",
        "teacherId": "teacher123", 
        "teacherName": "John Doe"
        }
        ```



#### POST /admin/teacher-managment/:teacherId/reject
- Description: Reject a teacher's application.
- Process: Delete the teacher from the temp_user table and related info in the teachers table.
- Role: admin only

- Request:
    - Parameters:
        - nome
    - Body: teacherId (string, required)
- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Teacher rejected successfully",
        "teacherId": "teacher123", 
        "teacherName": "John Doe"
        }
        ```



## Admin - Users Page

####  GET /admin/users-managment

- Description: Get a list of all users (students and teachers) with pagination and filtering options.
- Request:
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - limit (integer, optional, default: 20) - Number of users per page.
    - role (string, optional) - Filter by user role (e.g., "student", "teacher").
    - status (string, optional) - Filter by user status (e.g., "active", "inactive").

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "users": [
            {
            "id": "user123",
            "name": "Jane Smith",
            "email": "",
            "role": "student",
            "status": "active" | "inactive",
            "joinedAt": "2024-01-20T14:30:00Z"
            }
        ],
        "page": 1,
        "totalPages": 10,
        "totalUsers": 200
        }
        ```



#### GET /admin/users-managment/:userId
- Description: Get detailed information about a specific user by their ID.

- Request:
  - Parameters:
    - userId (string, required) - The ID of the user to retrieve.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "id": "user123",
        "name": "Jane Smith",
        "email": "",
        "role": "student",
        "status": "active" | "inactive",
        "joinedAt": "2024-01-20T14:30:00Z",
        "profile": {
            "aadharNumber": "1234-5678-9012",
            "photoUrl": "https://example.com/photo.jpg",
            "phone": "9876543210",
            "location": "New Delhi, India",
            "pincode": "110001",
            "additionalInfo": "Additional user information here"
        }

        "if (role === teacher)" 
        {
            "subjects": ["Math", "Science"],
            "highestQualification": "M.Sc in Physics",
            "10thPercentage": 85.5,
            "12thPercentage": 88.0,
            "isVarified": true | false,
            "marksheetUrl10": "https://example.com/marksheet.jpg",
            "marksheetUrl12": "https://example.com/marksheet12.jpg",
            "resume": "https://example.com/resume.jpg"
        }

        }
        ```



#### PUT /admin/users-managment/:userId
- Description: Update user information (e.g., name, email, status).
- Request:
  - Parameters:
    - userId (string, required) - The ID of the user to update.
  - Body:
    ```json
    {
      "name": "Jane Doe",
      "email": "",
      "status": "active" | "inactive", 
        "phone": "9876543210",
        "location": "New Delhi, India",
        "pincode": "110001",
        "additionalInfo": "Updated user information here"
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "User updated successfully",
        "userId": "user123",
        "updatedFields": {
            "name": "Jane Doe",
            "email": "",
            "status": "active" | "inactive", 
            "phone": "9876543210",
            "location": "New Delhi, India",
            "pincode": "110001",
            "additionalInfo": "Updated user information here"
        }
        }
        ```



#### DELETE /admin/users-managment/:userId
- Description: Delete a user by their ID.

- Request:
  - Parameters:
    - userId (string, required) - The ID of the user to delete.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "User deleted successfully",
        "userId": "user123"
        }
        ```




## Admin - Analytics Page

#### GET /admin/analytics/stats 
- Description: Get overall analytics statistics for the admin analytics dashboard.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "monthlygrouth": 1200,
        "newTeachersThisMonth": 15,
        "newStudentsThisMonth": 50,
        "revenueThisMonth": 10,
        "activeUsers": 1400
        }
        ```



#### GET /admin/analytics/grouth/anual-revenue
- Description: Get annual revenue data for the past year for chart.
- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "annualRevenue": [
            {"label": "2023", "value": 5},
            {"label": "2024", "value": 6},
            {"label": "2025", "value": 7},
            {"label": "2026", "value": 8},
            {"label": "2027", "value": 9}
        ]
        }
        ```



#### GET /admin/analytics/grouth/user-growth

- Description: Get user growth data (students and teachers) for the past year for chart.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "userGrowth": [
            {"month": "Jan", "students": 100, "teachers": 10},
            {"month": "Feb", "students": 120, "teachers": 12},
            {"month": "Mar", "students": 140, "teachers": 14},
            {"month": "Apr", "students": 160, "teachers": 16},
            {"month": "May", "students": 180, "teachers": 18},
            {"month": "Jun", "students": 200, "teachers": 20},
            {"month": "Jul", "students": 220, "teachers": 22},
            {"month": "Aug", "students": 240, "teachers": 24},
            {"month": "Sep", "students": 260, "teachers": 26},
            {"month": "Oct", "students": 280, "teachers": 28},
            {"month": "Nov", "students": 300, "teachers": 30},
            {"month": "Dec", "students": 320, "teachers": 32}
        ]
        }
        ```




#### GET /admin/analytics/grouth/student-grouth
- Description: Get student growth data for the past year for chart.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "studentGrowth": [
            {"month": "Jan", "students": 100},
            {"month": "Feb", "students": 120},
            {"month": "Mar", "students": 140},
            {"month": "Apr", "students": 160},
            {"month": "May", "students": 180},
            {"month": "Jun", "students": 200},
            {"month": "Jul", "students": 220},
            {"month": "Aug", "students": 240},
            {"month": "Sep", "students": 260},
            {"month": "Oct", "students": 280},
            {"month": "Nov", "students": 300},
            {"month": "Dec", "students": 320}
        ]
        }
        ```



#### GET /admin/analytics/grouth/teacher-growth
- Description: Get teacher growth data for the past year for chart.

- Response:
  - Status: 200 OK
    - Body:
      ```json
      {
        "teacherGrouth": [
            {"month":"jan", "teachers": 11},
            {"month":"feb", "teachers": 12},
            {"month":"mar", "teachers": 13},
            {"month":"apr", "teachers": 14},
            {"month":"may", "teachers": 15},
            {"month":"jun", "teachers": 16},
            {"month":"jul", "teachers": 17},
            {"month":"aug", "teachers": 18},
            {"month":"sep", "teachers": 19},
            {"month":"oct", "teachers": 20},
            {"month":"nov", "teachers": 21},
            {"month":"dec", "teachers": 22}
        ]
      }
      ```


#### GET /admin/analytics/grouth/subject-distribution

- Description: Get distribution of students across different subjects for chart.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "subjectDistribution": [
            {"subject": "Math", "studentCount": 300},
            {"subject": "Science", "studentCount": 250},
            {"subject": "English", "studentCount": 200},
            {"subject": "History", "studentCount": 150},
            {"subject": "Geography", "studentCount": 100}
        ]
        }
        ```

#### Get /admin/analytics/grouth/attendence-trend

- Description: Gives monthly attendance rate (percentage) for the past year for chart. (Percentage is calculated as attended classes / total classes held in the month.)

- Response:
   - Status: 200 OK
    - Body:
        ```json
        {
        "attendenceTrend": [
            {"month": "Jan", "attendanceRate": 85},
            {"month": "Feb", "attendanceRate": 88},
            {"month": "Mar", "attendanceRate": 90},
            {"month": "Apr", "attendanceRate": 87},
            {"month": "May", "attendanceRate": 89},
            {"month": "Jun", "attendanceRate": 92},
            {"month": "Jul", "attendanceRate": 91},
            {"month": "Aug", "attendanceRate": 93},
            {"month": "Sep", "attendanceRate": 94},
            {"month": "Oct", "attendanceRate": 95},
            {"month": "Nov", "attendanceRate": 96},
            {"month": "Dec", "attendanceRate": 97}
        ]
        }
        ```



#### GET /admin/analytics/revenue/distribution

- Description: Get distribution of payments done in the company for student fees and teacher salaries for a pie chart (percentage).

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "paymentDistribution": [
            {"type": "Student Fees", "amount": 60},
            {"type": "Teacher Salaries", "amount": 40}
        ]
        }
        ```




#### GET /admin/analytics/revenue/revenue-expenditure

- Description: Get revenue vs expenditure data for the past year for chart.

- Response:
   - Status: 200 OK
    - Body:
        ```json
        {
        "revenueExpenditure": [
            {"month": "Jan", "revenue": 5, "expenditure": 3},
            {"month": "Feb", "revenue": 6, "expenditure": 4},
            {"month": "Mar", "revenue": 7, "expenditure": 5},
            {"month": "Apr", "revenue": 8, "expenditure": 6},
            {"month": "May", "revenue": 9, "expenditure": 7},
            {"month": "Jun", "revenue": 10, "expenditure": 8},
            {"month": "Jul", "revenue": 11, "expenditure": 9},
            {"month": "Aug", "revenue": 12, "expenditure": 10},
            {"month": "Sep", "revenue": 13, "expenditure": 11},
            {"month": "Oct", "revenue": 14, "expenditure": 12},
            {"month": "Nov", "revenue": 15, "expenditure": 13},
            {"month": "Dec", "revenue": 16, "expenditure": 14}
        ]
        }
        ```

#### GET /admin/analytics/revenue/totla-payments

- Description: Gives total payments done on the platform so far for fees and salaries.

- Response:
   - Status: 200 OK
    - Body:
        ```json
        {
        "totalPayments": {
            "studentFees": 600932,
            "teacherSalaries": 4093284
        }
        }
        ```



## Admin - Payment Page

#### GET /admin/payments
- Description: Get a list of all payments with pagination and filtering options.

- Request:
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - type (string, optional) - Filter by payment type (e.g., "student_fee", "teacher_salary").
    - status (string, optional) - Filter by payment status (e.g., "completed", "pending").


- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "payments": [
            {
            "id": "payment123",
            "userId": "user123",
            "userName": "Jane Smith",
            "type": "student_fee" | "teacher_salary",
            "amount": 100,
            "status": "paid" | "due",
            "date": "2024-01-20T14:30:00Z", 
            "dueDate": "2024-02-20T14:30:00Z",
            "method": "cash" | "bank_transfer" | "upi"
            }
        ],
        "page": 1,
        "totalPages": 10,
        "totalPayments": 200
        }
        ```



#### Get /admin/payments/stats
- Description: Get overall payment statistics for the admin payments dashboard.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalPayments": 1500,
        "duePayments": 150,
        "paidAmmount": 75,
        "dueAmmount": 60
        }
        ```

#### GET /admin/payments/:paymentId
- Description: Get detailed information about a specific payment by its ID.

- Request:
  - Parameters:
    - paymentId (string, required) - The ID of the payment to retrieve.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "id": "payment123",
        "userId": "user123",
        "userName": "Jane Smith",
        "type": "student_fee" | "teacher_salary",
        "amount": 100,
        "status": "paid" | "due",
        "date": "2024-01-20T14:30:00Z", 
        "dueDate": "2024-02-20T14:30:00Z",
        "method": "cash" | "bank_transfer" | "upi",
        "transactionId": "txn_456789",
        "UserDetails": {
            "id": "user123",
            "name": "Jane Smith",
            "email": "",
            "profileImg": "https://example.com/photo.jpg", 
            "phone": "9876543210",
            "location": "New Delhi, India",
            "role": "student" | "teacher"
        }
        ```


### Admin - Teacher salary management page

#### GET /admin/teacher-salary/stats
- Description: Get overall teacher salary statistics for the admin teacher salary dashboard.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalSalaries": 1500,
        "dueSalaries": 150,
        "activeTeachers": 60
        }
        ```

#### GET /admin/teacher-salary
- Description: Get a list of all teacher salaries with pagination and filtering options.

- Request: 
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - status (string, optional) - Filter by salary status (e.g., "paid").

- Response: 
   - Status : 200 OK
    - Body :  
    ``` json 
    {
      "teacherSalary" : 
      [
        {
          "name" : "xyz", 
          "Date"  : "",
          "Base" : "33,293",
          "Bonus" : "3,32",
          "thisMonthStatus" : "paid" | "due",
          "thisMonthPaidDate" : "",
        }
      ]
    } 
    ````



#### GET /admin/teacher-salary/:teacherId
- Description: Get detailed salary information about a specific teacher by their ID (along with history).

- Request:
  - Parameters:
    - teacherId (string, required) - The ID of the teacher to retrieve salary details for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "teacherId": "teacher123",
        "name": "John Doe",
        "email": "dhas",
        "profileImg": "https://example.com/photo.jpg",
        "phone": "9876543210",
        "location": "New Delhi, India",
        "subjects": ["Math", "Science"],
        "salaryDetails": {
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "MonthPaidDate": "2024-01-20T14:30:00Z"
        },
        "salaryHistory": [
            {
            "month": "Dec",
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "paidDate": "2023-12-20T14:30:00Z",
            "status": "paid"
            },
            {
            "month": "Nov",
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "paidDate": "2023-11-20T14:30:00Z",
            "status": "paid"
            }
        ]
        }
        ```


#### POST /admin/teacher-salary/:teacherId/pay
- Description: Mark a teacher's salary as paid for the current month.
- Process: create a new payment entry in the payments table, update the salary history for the teacher, and update the last paid month and paid date in the teachers table.


- Request:
  - Parameters:
    - teacherId (string, required) - The ID of the teacher to mark salary as paid.
  - Body:
    ```json
    {
      "month": "Jan",
      "year": 2024,
      "paymentMethod": "bank_transfer" | "upi" | "cash",
      "transactionId": "txn_456789", // this can be manually cenerate  
      "date": "2024-01-20T14:30:00Z" // date of payment
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Salary marked as paid successfully",
        "teacherId": "teacher123",
        "month": "Jan",
        "year": 2024,
        "paymentDetails": {
            "paymentMethod": "bank_transfer",
            "transactionId": "txn_456789",
            "date": "2024-01-20T14:30:00Z"
        }
        }
        ```

#### POST /admin/teacher-salary/add
- Description:  Add a new salary record for a teacher (in case of a new teacher).



- Request:
  - Body:
    ```json
    {
      "teacherId": "teacher123",
      "baseSalary": 3000,
      "bonus": 300, 
      "payDay"  : 20  // day of month when salary is to be paid
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Salary record added successfully",
        "teacherId": "teacher123",
        "salaryDetails": {
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "payDay" : 20
        }
        }
    ```


## Admin - Student-fee-management Page 

#### GET /admin/student-fee/stats
- Description: Get overall student fee statistics for the admin student fee dashboard.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalCollection": 1500,
        "dueFees": 150, //due fees which are crossed due date
        "pendingFees": 6000  //this is the fees which a student has to pay in this month but it is not crossed due date yet
        }
        ```


#### GET /admin/student-fee
- Description: Get a list of all student fees with pagination.

- Request: 
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
   
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "studentFees": [
        {
          "id": "fee123",
          "studentId": "student123",
          "studentName": "Jane Smith",
          "fee": 100,
          "status": "paid" | "due",
          "date": "2024-01-20T14:30:00Z", 
          "ReminderSent": 3,
          "dueDate": "2024-02-20T14:30:00Z",
        }
      ],
      "page": 1,
      "totalPages": 10,
      "totalFees": 200
    }
    ```



#### GET /admin/student-fee/:feeId 
- Description: Get detailed information about a specific student fee by its ID along with its history.

- Request:
  - Parameters:
    - feeId (string, required) - The ID of the fee to retrieve.
- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "id": "fee123",
        "studentId": "student123",
        "studentName": "Jane Smith",
        "studentEmail": "",
        "profileImg": "https://example.com/photo.jpg",
        "phone": "9876543210",
        "location": "New Delhi, India",
        "feeDetails": {
            "fee": 100,
            "status": "paid" | "due",
            "date": "2024-01-20T14:30:00Z", 
            "dueDate": "2024-02-20T14:30:00Z",
            "ReminderSent": 3
        },
        "paymentHistory": [
            {
            "paymentId": "payment123",
            "amount": 100,
            "date": "2024-01-20T14:30:00Z",
            "method": "cash" | "bank_transfer" | "upi",
            "transactionId": "txn_456789"
            }
        ]
        }
        ```



#### POST /admin/student-fee/:feeId/paid

- Description: Mark the fee as paid.
- Process: Create a new payment entry in the payments table and update the fee status in the student_fees table.

- Request:
  - Parameters:
    - feeId (string, required) - The ID of the fee to mark as paid.
  - Body:
    ```json
    {
      "paymentMethod": "bank_transfer" | "upi" | "cash",
      "transactionId": "txn_456789", // this can be manually cenerate if cash payment or through payment gateway
      "date": "2024-01-20T14:30:00Z" // date of payment
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Fee marked as paid successfully",
        "feeId": "fee123",
        "paymentDetails": {
            "paymentMethod": "bank_transfer",
            "transactionId": "txn_456789",
            "date": "2024-01-20T14:30:00Z"
        }
        }
        ```
  


#### POST /admin/student-fee/add

- Description:  Add a new fee record for a student (in case of a new student).

- Request:
  - Body:
    ```json
    {
      "studentId": "student123",
      "fee": 100,
      "dueDate": "2024-02-20T14:30:00Z"
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Fee record added successfully",
        "studentId": "student123",
        "feeDetails": {
            "fee": 100,
            "status": "due",
            "dueDate": "2024-02-20T14:30:00Z"
        }
        }
        ```

#### CRON JOB for student fee reminder
- A cron job will run daily at 8 AM to check for any student fees that are due in the next 3 days and send a reminder email if not already sent 3 reminders.

#### POST /admin/student-fee/:feeId/send-reminder
- Description: Send a payment reminder to the student via email (this will increase the ReminderSent count by 1 in the student_fees table).

- Process: Automatically send an email to the student with fee details and the due date. This can also be manually triggered by an admin if needed. 

- Request:
  - Parameters:
    - feeId (string, required) - The ID of the fee to send a reminder for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Payment reminder sent successfully",
        "feeId": "fee123",
        "studentId": "student123",
        "studentName": "Jane Smith",
        "dueDate": "2024-02-20T14:30:00Z",
        "ReminderSent": 4
        }
        ```



## Teacher - Dashboard API

#### GET /teacher//stats

- Description: Get overall statistics for the specific teacher dashboard.
- 

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher to retrieve stats for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalStudents": 100,
        "totalEarnings": 50,
        "pendingAssignments": 5,
        //"pendingSalaries": 3000
        }
        ```

#### GET /teacher/students
- Description: Get a list of all students assigned to the specific teacher.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher to retrieve students for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "students": [
            {
            "id": "student123",
            "name": "Jane Smith",
            "email": "",
            "profileImg": "https://example.com/photo.jpg",
            "phone": "9876543210",
            "parentName": "Jhon Doe",
            "mapLocation": "https://maps.google.com/?q=28.6139,77.2090",
            "location": "New Delhi, India",
            "pincode": "110001",
            "status": "active" | "inactive",
            "enrolledAt": "2024-01-20T14:30:00Z"
            }
        ],
        }
        ```


#### GET /teacher/assignments
- Description: Get a list of all assignments created by the specific teacher.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher to retrieve assignments for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "assignments": [
            {
            "id": "assignment123",
            "studentId": "student123",
            "title": "Math Homework 1",
            "description": "Complete the exercises on page 42",
            "dueDate": "2024-02-01T14:30:00Z",
            "createdAt": "2024-01-20T14:30:00Z",
            "status": "pending" | "completed",
            "attachments": [
                {
                  "fileName": "worksheet.pdf",
                  "fileUrl": "https://cdn.example.com/worksheet.pdf",
                  "mimeType": "application/pdf",
                  "size": 123456
                }
            ],
            "submissions": [
              {
                "studentId": "student123",
                "submittedAt": "2024-01-30T10:00:00Z",
                "fileName": "submission1.pdf",
                "fileUrl": "https://cdn.example.com/submission1.pdf",
                "mimeType": "application/pdf",
                "size": 234567,
                "grade": "A" | "B" | "C" | "D" | "0-100" | null,
                "feedback": "Good work!" | null
              }
            ]
            }
        ]
        }
        ```


#### POST /teacher/assignments/:assignmentId/grade  
(add feedback and grade for the assignment)

- Description: Grade or add feedback for a specific student's submission.
- Process: Update the submission record with the provided grade and feedback and notify the student via email about the grade and feedback.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher.
    - assignmentId (string, required) - The ID of the assignment to grade or provide feedback for.
  - Body:
    ```json
    {
      "studentId": "student123",
      "grade": "A" | "B" | "C" | "D" | "0-100",
      "feedback": "Great job on the assignment!"
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Assignment updated successfully",
        "assignmentId": "assignment123",
        "studentId": "student123"
        }
        ```

      

#### POST /teacher/assignments
- Description: Create a new assignment for a single student.
- Note: Each assignment is assigned to one student only.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher creating the assignment.
  - Body:
    ```json
    {
      "studentId": "student123", // student ID the assignment is assigned to
      "title": "Math Homework 1",
      "subject": "Math",
      "description": "Complete the exercises on page 42",
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
    ```


#### PATCH /teacher/assignments/:assignmentId
- Description: Update an existing assignment (metadata or attachments).

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher.
  - Parameters:
    - assignmentId (string, required) - The ID of the assignment to update.

  - Body:
    ```json
    {
      "title": "Updated Math Homework 1",
      "description": "Complete the exercises on page 45",
      "dueDate": "2024-02-05T14:30:00Z",
      "attachments": [
        {
          "fileName": "worksheet_v2.pdf",
          "fileUrl": "https://cdn.example.com/worksheet_v2.pdf",
          "mimeType": "application/pdf",
          "size": 234567
        }
      ]
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Assignment updated successfully",
        "assignmentId": "assignment123"
        }
        ```

#### GET /teacher/assignments/:assignmentId/submissions/:studentId/download
- Description: Download a student's submission file for an assignment. Teachers use this to retrieve submitted files for review.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher.
  - Parameters:
    - assignmentId (string, required) - The ID of the assignment.
    - studentId (string, required) - The ID of the student whose submission to download.

- Response:
  - Status: 200 OK
    - Body: File stream (attachment)

#### GET /teacher/assignments/:assignmentId/attachments/:fileName
- Description: Download an original attachment file that the teacher attached to the assignment (e.g., worksheet).

- Request:
  - cookies:
    - id (string, required)
  - Parameters:
    - assignmentId (string, required)
    - fileName (string, required) - The filename to download.

- Response:
  - Status: 200 OK
    - Body: File stream (attachment)



<!-- this is a student assignment api -->
#### GET /student/assignments
- Description: Get a list of all assignments assigned to the specific student.
- Request:
  - cookies:
    - id (string, required) - The ID of the student to retrieve assignments for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "assignments": [
            {
            "id": "assignment123",
            "teacherId": "teacher123",
            "title": "Math Homework 1",
            "description": "Complete the exercises on page 42",
            "dueDate": "2024-02-01T14:30:00Z",
            "createdAt": "2024-01-20T14:30:00Z",
            "status": "pending" | "completed",
            "attachments": [
                {
                  "fileName": "worksheet.pdf",
                  "fileUrl": "https://cdn.example.com/worksheet.pdf",
                  "mimeType": "application/pdf",
                  "size": 123456
                }
            ],
            "submission": {
                "submittedAt": "2024-01-30T10:00:00Z",
                "fileName": "submission1.pdf",
                "fileUrl": "https://cdn.example.com/submission1.pdf",
                "mimeType": "application/pdf",
                "size": 234567,
                "grade": "A" | "B" | "C" | "D" | "0-100" | null,
                "feedback": "Good work!" | null
              }
            }
        ]
        }
        ```

<!-- this is a studnet assignment api -->
#### POST /student/assignments/:assignmentId/submit
- Description: Submit an assignment by uploading a file. Students use this endpoint to upload their submission for a specific assignment.

- Request:
  - cookies:
    - id (string, required) - The ID of the student submitting the assignment.
  - Parameters:
    - assignmentId (string, required) - The ID of the assignment being submitted.
  - Body: multipart/form-data
    - file: (required) the file to upload
    - optional JSON fields (in form-data): note, submittedAt (ISO 8601)

- Response:
  - Status: 201 Created
    - Body:
        ```json
        {
        "message": "Submission uploaded successfully",
        "assignmentId": "assignment123",
        "studentId": "student123",
        "fileName": "submission1.pdf",
        "fileUrl": "https://cdn.example.com/submission1.pdf",
        "submittedAt": "2024-01-30T10:00:00Z"
        }
        ```


#### GET /teacher/attendence/:studentId/monthly
- Description: Get attendance records of teacher for an specifice student for current month.

-  Request:
  - cookies:
    - id (string, required) - The ID of the teacher.
  - Parameters:
    - studentId (string, required) - The ID of the student whose attendance to retrieve.

- Response:
  - Status : 200 OK
    - Body:
        ```json
        {
        "studentId": "student123",
        "teacherId": "teacher123",
        "month": "January",
        "year": 2024,
        "attendanceRecords": [
            {"date": "2024-01-01", "status": "present"},
            {"date": "2024-01-02", "status": "absent"},
            {"date": "2024-01-03", "status": "present"},
            // ... more records for the month
        ]
        }
        ```
        


#### GET /teacher/attendence/:studentId
- Description: Get attendance records of teacher for an specifice student with pagination and filtering options.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher.
  - Parameters:
    - studentId (string, required) - The ID of the student whose attendance to retrieve.
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - month (integer, optional) - Filter by month (1-12).
    - year (integer, optional) - Filter by year (e.g., 2024).


- Response:  - Status: 200 OK
    - Body:
        ```json
        {
        "studentId": "student123",
        "teacherId": "teacher123",
        "month": 1,
        "year": 2024,
        "attendanceRecords": [
            {"date": "2024-01-01", "status": "present"},
            {"date": "2024-01-02", "status": "absent"},
            {"date": "2024-01-03", "status": "present"},
            // ... more records
        ],
        "page": 1,
        "totalPages": 5,
        "totalRecords": 150
        }
        ```

#### POST /teacher/attendence/:studentId/mark
- Description: Mark attendance for a specific student on a specific date with the location.
- Process: Check if the tacher is present at student home or not, by matching the teacher current location by geolocation api

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher marking attendance.
  - Parameters:
    - studentId (string, required) - The ID of the student whose attendance is being marked.
  - Body:
    ```json
    {
      "date": "2024-01-25", // date for which attendance is being marked generally current date
      "status": "present" | "absent",
      "location": {
          "latitude": 28.6139,
          "longitude": 77.2090
      }
    }
    ```

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "message": "Attendance marked successfully",
        "studentId": "student123",
        "teacherId": "teacher123",
        "date": "2024-01-25",
        "status": "present",
        "location": {
            "latitude": 28.6139,
            "longitude": 77.2090
        }
        }
        ```



### Teacher - Salary API

#### GET /teacher/salary/stats
- Description: Get overall salary statistics for the specific teacher salary dashboard.

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher to retrieve salary stats for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalEarnings": 3000,
        "pendingSalaries": 6000,

        "salaryDetails": {
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "lastPaidMonth": "Jan",
            "lastPaidDate": "2024-01-20T14:30:00Z"
        },
        }
        ```

#### GET /teacher/salary
- Description: Get detailed salary information for the specific teacher salary history with pagination.
- process: show all the payments made to this teacherId by the admin

- Request:
  - cookies:
    - id (string, required) - The ID of the teacher to retrieve salary details for.
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "teacherId": "teacher123",
        "name": "John Doe",
        "salaryHistory": [
            {
            "month": "Dec",
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "paidDate": "2023-12-20T14:30:00Z",
            "status": "paid"
            },
            {
            "month": "Nov",
            "baseSalary": 3000,
            "bonus": 300,
            "totalSalary": 3300,
            "paidDate": "2023-11-20T14:30:00Z",
            "status": "paid"
            }
        ],
        "page": 1,
        "totalPages": 5,
        "totalRecords": 60
        }
        ```


# Student - Dashboard API



#### GET /student/stats
- Description: Get overall statistics for the specific student dashboard.

- Request:
  - cookies:
    - id (string, required) - The ID of the student to retrieve stats for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "pendingAssignments": 20,
        "pendingAssignments": 5,
        "activeTeachers": 3,
        "attendanceRate": 90 // percentage of days present in the current month
        }
        ```

#### GET /student/teachers
- Description: Get a list of all teachers assigned to the specific student.

- Request:
  - cookies:
    - studentId (string, required) - The ID of the student to retrieve teachers for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "teachers": [
            {
            "id": "teacher123",
            "name": "John Doe",
            "email": "",
            "profileImg": "https://example.com/photo.jpg",
            "phone": "9876543210",
            "location": "New Delhi, India",
            "subjects": ["Math", "Science"],
            "status": "active" | "inactive",
            "assignedAt": "2024-01-20T14:30:00Z"
            }
        ],
        }
        ```

#### GET /student/assignments/stats
- Description: Get overall assignment statistics for the specific student dashboard.

- Request:
  - cookies:
    - studentId (string, required) - The ID of the student to retrieve assignment stats for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "pending": 50,
        "submitted": 20,
        "graded": 30
        }
        ```

#### GET /student/assignments
- Description: Get a list of all assignments assigned to the specific student.

- Request:
  - cookies:
    - studentId (string, required) - The ID of the student to retrieve assignments for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "assignments": [
            {
            "id": "assignment123",
            "submited" : true | false,
            "teacherId": "teacher123",
            "title": "Math Homework 1",
            "description": "Complete the exercises on page 42",
            "dueDate": "2024-02-01T14:30:00Z",
            "createdAt": "2024-01-20T14:30:00Z",
            "status": "pending" | "completed",
            "attachments": [
                {
                  "fileName": "worksheet.pdf",
                  "fileUrl": "https://cdn.example.com/worksheet.pdf",
                  "mimeType": "application/pdf",
                  "size": 123456
                }
            ],
            "submission": {
                "submittedAt": "2024-01-30T10:00:00Z",
                "fileName": "submission1.pdf",
                "fileUrl": "https://cdn.example.com/submission1.pdf",
                "mimeType": "application/pdf",
                "size": 234567,
                "grade": "A" | "B" | "C" | "D" | "0-100" | null,
                "feedback": "Good work!" | null
              }
            }
        ]
        }
        ```


#### GET /student/attendence/
- Description: Get attendance records of student with pagination based on month.

- Request:
  - cookies:
    - studentId (string, required) - The ID of the student whose attendance to retrieve.
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - month (integer, optional) - Filter by month (1-12).
    - year (integer, optional) - Filter by year (e.g., 2024).

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "studentId": "student123",
        "month": 1,
        "year": 2024,
        "attendanceRecords": [
            {"date": "2024-01-01", "status": "present"},
            {"date": "2024-01-02", "status": "absent"},
            {"date": "2024-01-03", "status": "present"},
            // ... more records
        ],
        "page": 1,
        "totalPages": 5,
        "totalRecords": 150
        }
        ```

#### GET /student/payments/stats
- Description: Get overall payment statistics for the specific student payments dashboard.
- Request:
  - cookies:
    - studentId (string, required) - The ID of the student to retrieve payment stats for.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "totalFees": 500,
        "dueFees": 100,
        }
        ```

#### GET /student/payments
- Description: Get a list of all payments made by the specific student with pagination.

- Request:
  - cookies:
    - studentId (string, required) - The ID of the student to retrieve payments for.
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.

- Response:
  - Status: 200 OK
    - Body:
        ```json
        {
        "payments": [
            {
            "id": "payment123",
            "type": "student_fee",
            "amount": 100,
            "status": "paid" | "due",
            "date": "2024-01-20T14:30:00Z", 
            "dueDate": "2024-02-20T14:30:00Z",
            "method": "cash" | "bank_transfer" | "upi",
            "transactionId": "txn_456789"
            }
        ],
        "page": 1,
        "totalPages": 10,
        "totalPayments": 50
        }
        ```
