# Kaushaly Home Learning — API Documentation (new)

This documentiation defines complete API for Kaushaly Home Learning platform.

the platform supports following user roles:

- Admin
- Teacher
- Student

# naming convention

- all endpoints are in plural form till the resource is singular in nature.
- all endpoints are in lowercase
- json variables are in camelCase
- all date time values are in ISO 8601 format

## Base URL

```
https://api.kaushaly.in/api
```

## Authentication

this need to be added later

In all the below endpints requires authentication via JWT based cookies, no need to pass token in headers.

## admin dashboards APi

### main page

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


#### GET /admin/recent-usrts 

- Description: Get recent users for admin overview page.
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

- Description: Get a preview of pending approvals for admin overvirw page.

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

#### GET /admin/approvals

- Description: Get all of pending approvals for teachers for overview page.

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


#### POST /admin/approvals/:teacherId/approve
- Description: Approve a teacher's application. 

-process: move the teacher form temp_user table to user table and update related info in teachers table, 
- set isVarified : true  

role- admin only
-Request  :  
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


#### POST /admin/approvals/:teacherId/reject
- Description: Reject a teacher's application.
- Process: delete the teacher form temp_user table and related info in teachers table
- role- admin only

-Request  :  
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



## Admin- Users Page

####  GET /admin/users

- Description: Get a list of all users (students and teachers) with pagination and filtering options.
- Request:
  - Query Parameters:
    - page (integer, optional, default: 1) - Page number for pagination.
    - limit (integer, optional, default: 20) - Number of users per page.
    - role (string, optional) - Filter by user role (e.g., "student", "teacher").
    - status (string, optional) - Filter by user status (e.g., "active", "inactive" ).

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


#### GET /admin/users/:userId

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


#### PUT /admin/users/:userId
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


#### DELETE /admin/users/:userId
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


## Admin - analytics Page

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


#### GET /admin/analytics/anual-revenue
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


#### GET /admin/analytics/user-growth

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

#### GET /admin/analytics/subject-distribution

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


