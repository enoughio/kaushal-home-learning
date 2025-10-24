// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export interface RegisterTeacherRequest {
  json: string; // JSON string containing teacher data
  marksheetTenthFile?: File;
  marksheetTwelfthFile?: File;
  aadharFile?: File;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface CreatePasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}


export interface PaymentStatsProps {
  totalEarnings?: number
  pendingAmount?: number
  overdueAmount?: number
  totalHours?: number
}


export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  teacherId: string
  teacherName: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submittedAt?: string
  // optional file attachment metadata (for assignment attachments and student submissions)
  attachmentUrl?: string
  attachmentName?: string
  submissionFileUrl?: string
  submissionFileName?: string
}


export interface AttendanceRecord {
  id: string
  studentId: string
  teacherId: string
  teacherName: string
  subject: string
  date: string
  status: "present" | "absent"
  duration: number // in minutes
}


export interface StudentInfo{
  id: string
  name: string
  age: number
  location: string
  phone: string
  parentName: string
  parentPhone: string
  skillsLearning: string[]
  joinedDate: string // YYYY-MM-DD
  status: "active" | "inactive"
}



export interface TeacherSearchResult {
  id: string
  name: string
  location: string
  skillsToTeach: string[]
  experience: number
  rating: number
  hourlyRate: number
  distance: string
  profileImage?: string
}



export interface StudentPayment {
  id: string
  studentId: string
  amount: number
  paymentMethod: "upi" | "card" | "cash"
  paymentStatus: "completed" | "pending" | "failed" | "refunded"
  transactionId?: string
  paymentDate: string // YYYY-MM-DD
}



// Admin-specific mock data and services
export interface PlatformStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  approvedTeachers: number
  pendingTeachers: number
  totalRevenue: number
  monthlyGrowth: number
  yearlyGrowth: number
}

export interface UserManagement {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  status: "active" | "inactive" | "pending"
  joinedDate: string
  lastActive: string
  profileComplete: boolean
}

export interface TeacherApproval {
  id: string
  name: string
  email: string
  location: string
  skillsToTeach: string[]
  experience: number
  phone: string
  idProof: string
  appliedDate: string
  status: "pending" | "approved" | "rejected"
}

export interface PaymentDue {
  id: string
  studentId: string
  studentName: string
  teacherId: string
  teacherName: string
  amount: number
  dueDate: string
  status: "due" | "overdue" | "paid"
  subject: string
}

export interface MonthlyData {
  month: string
  students: number
  teachers: number
  revenue: number
}

// New interfaces for enhanced admin functionality
export interface TeacherSalary {
  id: string
  teacherId: string
  teacherName: string
  baseSalary: number
  bonuses: number
  deductions: number
  totalSalary: number
  month: string
  year: number
  status: "pending" | "paid" | "processing"
  paymentDate?: string
}

export interface StudentFee {
  id: string
  studentId: string
  studentName: string
  monthlyFee: number
  dueDate: string
  paidDate?: string
  status: "paid" | "due" | "overdue" | "grace_period"
  gracePeriodEnd?: string
  remindersSent: number
}

export interface NotificationStats {
  totalSent: number
  assignmentReminders: number
  paymentReminders: number
  attendanceAlerts: number
  emailsSent: number
  whatsappSent: number
}

export interface AttendanceStats {
  totalSessions: number
  attendedSessions: number
  missedSessions: number
  attendanceRate: number
  byMonth: { month: string; rate: number }[]
}

export interface AssignmentStats {
  totalAssignments: number
  submittedOnTime: number
  lateSubmissions: number
  pendingSubmissions: number
  averageGrade: number
  bySubject: { subject: string; count: number; avgGrade: number }[]
}

export interface PlatformAnalytics {
  userGrowth: { month: string; students: number; teachers: number }[]
  revenueAnalytics: { month: string; studentFees: number; teacherSalaries: number; profit: number }[]
  engagementMetrics: { metric: string; value: number; change: number }[]
  geographicDistribution: { location: string; students: number; teachers: number }[]
}


// Mock data for the application
export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  teacherId: string
  teacherName: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submittedAt?: string
  attachmentUrl?: string
  attachmentName?: string
  submissionFileUrl?: string
  submissionFileName?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  teacherId: string
  teacherName: string
  subject: string
  date: string
  status: "present" | "absent"
  duration: number // in minutes
}

export interface TeacherSearchResult {
  id: string
  name: string
  location: string
  skillsToTeach: string[]
  experience: number
  rating: number
  hourlyRate: number
  distance: string
  profileImage?: string
}

export interface StudentPayment {
  id: string
  studentId: string
  amount: number
  paymentMethod: "upi" | "card" | "cash"
  paymentStatus: "completed" | "pending" | "failed" | "refunded"
  transactionId?: string
  paymentDate: string // YYYY-MM-DD
}


// Teacher-specific mock data and services

export interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  amount: number
  date: string
  status: "paid" | "pending" | "overdue"
  subject: string
  hoursTeached: number
}

export interface TeacherAssignment {
  id: string
  title: string
  description: string
  subject: string
  studentId: string
  studentName: string
  assignedDate: string
  dueDate: string
  status: "assigned" | "submitted" | "graded"
  submissionText?: string
  grade?: number
  feedback?: string
  attachmentUrl?: string
  attachmentName?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  teacherId: string
  subject: string
  date: string
  status: "present" | "absent"
  duration: number
  atHome?: boolean
  notes?: string
}
