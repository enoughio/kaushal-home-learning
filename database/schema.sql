-- Kaushaly Home Learning Database Schema
-- Revised for comprehensive tutoring platform management, incorporating fixes and additions for API support

    -- Temp users table for initial registrations (e.g., teacher applicants)
    CREATE TABLE temp_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        date_of_birth DATE,
        gender VARCHAR(20),
        phone VARCHAR(20),
        email VARCHAR(100),
        verification_token VARCHAR(255),
        expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
        created_at TIMESTAMP DEFAULT NOW(),
        verified BOOLEAN DEFAULT FALSE
    );

    -- Temp teachers table (for detailed applicant info during approval)
    CREATE TABLE temp_teachers (
        id SERIAL PRIMARY KEY,
        temp_user_id INTEGER REFERENCES temp_users(id) ON DELETE CASCADE,
        qualification VARCHAR(500),
        experience_years INTEGER,
        subjects_taught TEXT[], -- Array of subjects
        teaching_mode VARCHAR(50) CHECK (teaching_mode IN ('online', 'offline', 'both')),
        hourly_rate DECIMAL(8,2),
        monthly_salary DECIMAL(10,2) DEFAULT 0,
        bank_account_number VARCHAR(50),  -- not needed at this stage but kept for completeness
        bank_ifsc_code VARCHAR(20), --- not needed
        bank_name VARCHAR(200), --- not needed
        account_holder_name VARCHAR(200),   --- not needed
        pan_number VARCHAR(20),    --- not needed
        aadhar_url VARCHAR(200),   
        addhar_url_publicID VARCHAR(500),
        resume_url VARCHAR(500),
        certificates_url TEXT[], -- Array of certificate URLs
        certificates_url_publicIDs TEXT[], -- Array of certificate public IDs
        tenth_percentage DECIMAL(5,2),
        twelfth_percentage DECIMAL(5,2),
        marksheet_url_tenth VARCHAR(500),
        marksheet_url_tenth_publicID VARCHAR(500),
        marksheet_url_twelfth VARCHAR(500),
        marksheet_url_twelfth_publicID VARCHAR(500),
        availability_schedule JSONB, -- JSON object for weekly schedule
        max_students INTEGER DEFAULT 20,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Users table (base table for all user types)
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) DEFAULT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        house_number VARCHAR(300),  -- Added for detailed address
        street VARCHAR(300),       -- Added for detailed address
        city VARCHAR(100),
        pincode VARCHAR(10),
        date_of_birth DATE,
        location TEXT,
        home_latitude DECIMAL(10,7),  -- Added for geolocation
        home_longitude DECIMAL(10,7), -- Added for geolocation

        -- Verification & security
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        verification_token_expires TIMESTAMP,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        access_token VARCHAR(255),

        profile_image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
    );

    -- Students table (extends users)
    CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        grade VARCHAR(20),
        school_name VARCHAR(200),
        parent_name VARCHAR(200),
        parent_phone VARCHAR(20),
        parent_email VARCHAR(255),
        emergency_contact VARCHAR(20),
        subjects_interested TEXT[], -- Array of subjects
        preferred_schedule VARCHAR(100),
        monthly_fee DECIMAL(10,2) DEFAULT 0,
        fee_due_date DATE,
        addhar_url VARCHAR(200),
        addhar_url_publicID VARCHAR(500),
        -- payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue', 'grace_period')),
        grace_period_end DATE,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Student fees table (new: for per-month fee tracking and reminders)
    CREATE TABLE student_fees (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
        year INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'due' CHECK (status IN ('paid', 'due', 'overdue')),
        reminder_sent INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, month, year
    );

    -- Teachers table (extends users)
    CREATE TABLE teachers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        qualification VARCHAR(500),
        experience_years INTEGER,
        subjects_taught TEXT[], -- Array of subjects
        teaching_mode VARCHAR(50) CHECK (teaching_mode IN ('online', 'offline', 'both')),
        monthly_salary DECIMAL(10,2) DEFAULT 0,
        -- salary_status VARCHAR(20) DEFAULT 'pending' CHECK (salary_status IN ('paid', 'pending', 'processing')),
        salary_pay_day INTEGER CHECK (salary_pay_day BETWEEN 1 AND 31) DEFAULT 1, -- Added for pay day
        bank_account_number VARCHAR(50),
        bank_ifsc_code VARCHAR(20),
        bank_name VARCHAR(200),
        account_holder_name VARCHAR(200),
        -- pan_number VARCHAR(20),
        aadhar_URL VARCHAR(500),
        aadhar_url_publicID VARCHAR(500),
        resume_url VARCHAR(500),
        resume_url_publicID VARCHAR(500),
        certificates_url TEXT[], -- Array of certificate URLs
        certificates_url_publicIDs TEXT[], -- Array of certificate public IDs
        tenth_percentage DECIMAL(5,2),         -- Added
        twelth_percentage DECIMAL(5,2),       -- Added
        marksheet_url_tenth VARCHAR(500),      -- Added
        marksheet_url_tenth_publicID VARCHAR(500), -- Added
        marksheet_url_twelfth VARCHAR(500),    -- Added
        marksheet_url_twelfth_publicID VARCHAR(500), -- Added
        approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        availability_schedule JSONB, -- JSON object for weekly schedule
        max_students INTEGER DEFAULT 20,
        current_students INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Teacher-Student assignments (pairs)
    CREATE TABLE teacher_student_assignments (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        subject VARCHAR(100) NOT NULL,
        assigned_date DATE DEFAULT CURRENT_DATE,
        assigned_by INTEGER REFERENCES users(id), -- Admin who assigned
        -- notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(teacher_id, student_id, subject)
    );

    -- Assignments/homework table
    CREATE TABLE assignments (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        due_date DATE,
        assignment_type VARCHAR(50) CHECK (assignment_type IN ('homework', 'test', 'project', 'quiz')),
        max_marks INTEGER DEFAULT 100,
        instructions TEXT,
        grade VARCHAR(5) CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D')),
        status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'graded', 'overdue')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Assignment attachments (new: for multi-file support)
    CREATE TABLE assignment_attachments (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        file_name VARCHAR(255),
        file_url VARCHAR(500),
        file_url_publicID VARCHAR(500),
        mime_type VARCHAR(100),
        size INTEGER,
        is_submission BOOLEAN DEFAULT false, -- true for student submissions
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Assignment submissions
    CREATE TABLE assignment_submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        submission_text TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        marks_obtained INTEGER,
        grade VARCHAR(5) CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D')), -- Added for letter grades
        feedback TEXT,
        graded_at TIMESTAMP,
        graded_by INTEGER REFERENCES teachers(id),
        is_late BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Attendance table
    CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
        notes TEXT,
        marked_by INTEGER REFERENCES users(id),
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_duration INTEGER, -- in minutes
        subject VARCHAR(100),
        latitude DECIMAL(10,7),   -- Added for geolocation
        longitude DECIMAL(10,7),  -- Added for geolocation
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, teacher_id, date, subject)
    );

    -- Payments table (for student fees)
    CREATE TABLE payments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(50) DEFAULT 'monthly_fee' CHECK (payment_type IN ('monthly_fee', 'registration', 'late_fee', 'other')),
        payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'online', 'bank_transfer', 'upi', 'card')),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        transaction_id VARCHAR(100),
        payment_date DATE,
        due_date DATE,
        late_fee DECIMAL(8,2) DEFAULT 0,
        discount DECIMAL(8,2) DEFAULT 0,
        notes TEXT,
        processed_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Salary payments table (for teachers)
    CREATE TABLE salary_payments (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
        year INTEGER NOT NULL,
        base_salary DECIMAL(10,2) NOT NULL,
        bonus DECIMAL(8,2) DEFAULT 0,
        deductions DECIMAL(8,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
        payment_date DATE,
        payment_method VARCHAR(50) CHECK (payment_method IN ('bank_transfer', 'cash', 'cheque')),
        transaction_id VARCHAR(100),
        notes TEXT,
        processed_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(teacher_id, month, year)
    );

    -- System settings table
    CREATE TABLE system_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(50) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
        description TEXT,
        is_public BOOLEAN DEFAULT false,
        updated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit log table
    CREATE TABLE audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100),
        record_id INTEGER,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for better performance
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_role ON users(role);
    CREATE INDEX idx_users_is_active ON users(is_active);
    CREATE INDEX idx_users_created_at ON users(created_at); -- Added for analytics
    CREATE INDEX idx_students_user_id ON students(user_id);
    CREATE INDEX idx_teachers_user_id ON teachers(user_id);
    CREATE INDEX idx_teachers_approval_status ON teachers(approval_status);
    CREATE INDEX idx_assignments_teacher_student ON assignments(teacher_id, student_id);
    CREATE INDEX idx_assignments_created_at ON assignments(created_at); -- Added for stats
    CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
    CREATE INDEX idx_attendance_created_at ON attendance(created_at); -- Added for trends
    CREATE INDEX idx_payments_student_id ON payments(student_id);
    CREATE INDEX idx_payments_created_at ON payments(created_at); -- Added for revenue
    CREATE INDEX idx_salary_payments_teacher_month_year ON salary_payments(teacher_id, month, year);
    CREATE INDEX idx_salary_payments_created_at ON salary_payments(created_at); -- Added for expenditure
    CREATE INDEX idx_student_fees_student_month_year ON student_fees(student_id, month, year);

-- Insert default admin user
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, city, state) 
VALUES ('admin@kaushaly.com', '$2b$10$example_hash', 'admin', 'System', 'Administrator', '+91-9999999999', 'Mumbai', 'Maharashtra');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Kaushaly Home Learning', 'string', 'Platform display name', true),
('grace_period_days', '10', 'number', 'Payment grace period in days', false),
('max_students_per_teacher', '20', 'number', 'Maximum students per teacher', false),
('notification_email_enabled', 'true', 'boolean', 'Enable email notifications', false),
('notification_whatsapp_enabled', 'true', 'boolean', 'Enable WhatsApp notifications', false),
('auto_assignment_enabled', 'false', 'boolean', 'Enable automatic teacher-student assignment', false);











-- -- Kaushaly Home Learning Database Schema
-- -- Created for comprehensive tutoring platform management

-- CREATE TABLE temp_users (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     role VARCHAR(50) NOT NULL,
--     verification_token VARCHAR(255),
--     expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
--     created_at TIMESTAMP DEFAULT NOW(),
--     verified BOOLEAN DEFAULT FALSE
-- );


-- -- Users table (base table for all user types)
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) DEFAULT NULL,
--     role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
--     first_name VARCHAR(100) ,
--     last_name VARCHAR(100) ,
--     phone VARCHAR(20),
--     address TEXT,
--     city VARCHAR(100),
--     state VARCHAR(100),
--     pincode VARCHAR(10),
--     date_of_birth DATE,
--     location TEXT, -- fixed typo from `localion`

-- ------verification & security------
--     is_verified BOOLEAN DEFAULT false, -- fixed typo from `is_varifaied`
--     verification_token VARCHAR(255),
--     verification_token_expires TIMESTAMP,
--     reset_token VARCHAR(255),
--     reset_token_expires TIMESTAMP,
--     access_token VARCHAR(255),
-- -------------------------------------

--     profile_image_url VARCHAR(500),
--     is_active BOOLEAN DEFAULT true,
--     is_deleted BOOLEAN DEFAULT false,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMP NULL
-- );


-- -- Students table (extends users)
-- CREATE TABLE students (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     grade VARCHAR(20),
--     school_name VARCHAR(200),
--     parent_name VARCHAR(200),
--     parent_phone VARCHAR(20),
--     parent_email VARCHAR(255),
--     emergency_contact VARCHAR(20),
--     subjects_interested TEXT[], -- Array of subjects
--     learning_goals TEXT,
--     preferred_schedule VARCHAR(100),
--     monthly_fee DECIMAL(10,2) DEFAULT 0,
--     fee_due_date DATE,
--     payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue', 'grace_period')),
--     grace_period_end DATE,
--     enrollment_date DATE DEFAULT CURRENT_DATE, -- removed stray token `loca`
--     is_active BOOLEAN DEFAULT true,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- -- Teachers table (extends users)
-- CREATE TABLE teachers (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     qualification VARCHAR(500),
--     experience_years INTEGER,
--     subjects_taught TEXT[], -- Array of subjects
--     teaching_mode VARCHAR(50) CHECK (teaching_mode IN ('online', 'offline', 'both')),
--     hourly_rate DECIMAL(8,2),
--     monthly_salary DECIMAL(10,2) DEFAULT 0,
--     salary_status VARCHAR(20) DEFAULT 'pending' CHECK (salary_status IN ('paid', 'pending', 'processing')),
--     bank_account_number VARCHAR(50),
--     bank_ifsc_code VARCHAR(20),
--     bank_name VARCHAR(200),
--     account_holder_name VARCHAR(200),
--     pan_number VARCHAR(20),
--     aadhar_number VARCHAR(20),
--     resume_url VARCHAR(500),
--     certificates_url TEXT[], -- Array of certificate URLs
--     approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
--     approved_by INTEGER REFERENCES users(id),
--     approved_at TIMESTAMP,
--     rejection_reason TEXT,
--     availability_schedule JSONB, -- JSON object for weekly schedule
--     max_students INTEGER DEFAULT 20,
--     current_students INTEGER DEFAULT 0,
--     rating DECIMAL(3,2) DEFAULT 0,
--     total_reviews INTEGER DEFAULT 0,
--     is_active BOOLEAN DEFAULT true,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- -- Teacher-Student assignments (pairs)
-- CREATE TABLE teacher_student_assignments (
--     id SERIAL PRIMARY KEY,
--     teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
--     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
--     subject VARCHAR(100) NOT NULL,
--     assigned_date DATE DEFAULT CURRENT_DATE,
--     start_date DATE,  --needs to be removed
--     end_date DATE,     -- needs to be removed
--     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')), --remove 
--     assigned_by INTEGER REFERENCES users(id), -- Admin who assigned
--     notes TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(teacher_id, student_id, subject)
-- );


-- -- Assignments/homework to a student table
-- CREATE TABLE assignments (
--     id SERIAL PRIMARY KEY,
--     teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
--     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
--     title VARCHAR(200) NOT NULL,
--     description TEXT,
--     subject VARCHAR(100),
--     due_date DATE,
--     assignment_type VARCHAR(50) CHECK (assignment_type IN ('homework', 'test', 'project', 'quiz')),
--     max_marks INTEGER DEFAULT 100,
--     file_url VARCHAR(500),
--     instructions TEXT,
--     grade VARCHAR(5) CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D')),
--     status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'graded', 'overdue')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- -- Assignment submissions
-- CREATE TABLE assignment_submissions (
--     id SERIAL PRIMARY KEY,
--     assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
--     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
--     submission_text TEXT,
--     file_url VARCHAR(500),
--     submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     marks_obtained INTEGER,
--     feedback TEXT,
--     graded_at TIMESTAMP,
--     graded_by INTEGER REFERENCES teachers(id),
--     is_late BOOLEAN DEFAULT false,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Attendance table
-- CREATE TABLE attendance (
--     id SERIAL PRIMARY KEY,
--     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
--     teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
--     date DATE NOT NULL,
--     location TEXT,
--     status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
--     notes TEXT,
--     marked_by INTEGER REFERENCES users(id),
--     marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     session_duration INTEGER, -- in minutes
--     subject VARCHAR(100),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(student_id, teacher_id, date, subject)
-- );

-- -- Payments table (for student fees)
-- CREATE TABLE payments (
--     id SERIAL PRIMARY KEY,
--     student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
--     amount DECIMAL(10,2) NOT NULL,
--     payment_type VARCHAR(50) DEFAULT 'monthly_fee' CHECK (payment_type IN ('monthly_fee', 'registration', 'late_fee', 'other')),
--     payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'online', 'bank_transfer', 'upi', 'card')),
--     payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
--     transaction_id VARCHAR(100),
--     payment_date DATE,
--     due_date DATE,
--     late_fee DECIMAL(8,2) DEFAULT 0,
--     discount DECIMAL(8,2) DEFAULT 0,
--     notes TEXT,
--     processed_by INTEGER REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Salary payments table (for teachers)
-- CREATE TABLE salary_payments (
--     id SERIAL PRIMARY KEY,
--     teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
--     month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
--     year INTEGER NOT NULL,
--     base_salary DECIMAL(10,2) NOT NULL,
--     bonus DECIMAL(8,2) DEFAULT 0,
--     deductions DECIMAL(8,2) DEFAULT 0,
--     total_amount DECIMAL(10,2) NOT NULL,
--     payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
--     payment_date DATE,
--     payment_method VARCHAR(50) CHECK (payment_method IN ('bank_transfer', 'cash', 'cheque')),
--     transaction_id VARCHAR(100),
--     notes TEXT,
--     processed_by INTEGER REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(teacher_id, month, year)
-- );

-- -- Notifications table
-- -- do not use this table 
-- CREATE TABLE notifications (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     title VARCHAR(200) NOT NULL,
--     message TEXT NOT NULL,
--     type VARCHAR(50) CHECK (type IN ('assignment', 'payment', 'attendance', 'general', 'system')),
--     priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
--     is_read BOOLEAN DEFAULT false,
--     delivery_method VARCHAR(50) CHECK (delivery_method IN ('in_app', 'email', 'whatsapp', 'sms')),
--     delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
--     scheduled_at TIMESTAMP,
--     sent_at TIMESTAMP,
--     read_at TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- System settings table
-- CREATE TABLE system_settings (
--     id SERIAL PRIMARY KEY,
--     setting_key VARCHAR(100) UNIQUE NOT NULL,
--     setting_value TEXT,
--     setting_type VARCHAR(50) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
--     description TEXT,
--     is_public BOOLEAN DEFAULT false,
--     updated_by INTEGER REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Audit log table
-- CREATE TABLE audit_logs (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id),
--     action VARCHAR(100) NOT NULL,
--     table_name VARCHAR(100),
--     record_id INTEGER,
--     old_values JSONB,
--     new_values JSONB,
--     ip_address INET,
--     user_agent TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Indexes for better performance
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_role ON users(role);
-- CREATE INDEX idx_users_is_active ON users(is_active);
-- CREATE INDEX idx_students_user_id ON students(user_id);
-- CREATE INDEX idx_teachers_user_id ON teachers(user_id);
-- CREATE INDEX idx_teachers_approval_status ON teachers(approval_status);
-- CREATE INDEX idx_assignments_teacher_student ON assignments(teacher_id, student_id);
-- CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
-- CREATE INDEX idx_payments_student_id ON payments(student_id);
-- CREATE INDEX idx_salary_payments_teacher_month_year ON salary_payments(teacher_id, month, year);
-- CREATE INDEX idx_notifications_user_id ON notifications(user_id);
-- CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- -- Insert default admin user
-- INSERT INTO users (email, password_hash, role, first_name, last_name, phone, city, state) 
-- VALUES ('admin@kaushaly.com', '$2b$10$example_hash', 'admin', 'System', 'Administrator', '+91-9999999999', 'Mumbai', 'Maharashtra');

-- -- Insert default system settings
-- INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
-- ('platform_name', 'Kaushaly Home Learning', 'string', 'Platform display name', true),
-- ('grace_period_days', '10', 'number', 'Payment grace period in days', false),
-- ('max_students_per_teacher', '20', 'number', 'Maximum students per teacher', false),
-- ('notification_email_enabled', 'true', 'boolean', 'Enable email notifications', false),
-- ('notification_whatsapp_enabled', 'true', 'boolean', 'Enable WhatsApp notifications', false),
-- ('auto_assignment_enabled', 'false', 'boolean', 'Enable automatic teacher-student assignment', false);
-- ('auto_assignment_enabled', 'false', 'boolean', 'Enable automatic teacher-student assignment', false);

