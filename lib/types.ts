import { AttendanceStatus } from "@/generated/prisma";

// API Response Types
export interface ApiResponse<T = unknown | null> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown | null;
  };
  status?: number;
  code?: number;
}

// Admin Stats Response
export interface AdminStatsResponse {
  totalUsers: number;
  activeTeachers: number;
  totalRevenue: number;
  TotalStudents: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User Response
export interface UserResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: "admin" | "teacher" | "student";
  isActive: boolean;
  createdAt: string;
}

// Recent User Response
export interface RecentUserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Teacher Approval Request
export interface TeacherApprovalResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  subjects: string[];
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

// Student Response
export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  parentName: string;
  parentPhone: string;
  pincode: string;
  profileImg: string;
  status: string;
  enrolledAt: string;
}

// Teacher Response
export interface TeacherResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  subjects: string[];
  hourlyRate: number;
  bio: string;
  profileImg: string;
  status: string;
  createdAt: string;
}

// Teacher Stats Response
export interface TeacherStatsResponse {
  totalStudents: number;
  totalEarnings: number;
  pendingAssignments: number;
}

// Student Stats Response
export interface StudentStatsResponse {
  pendingAssignments: number;
  activeTeachers: number;
  attendanceRate: number;
}

// Assignment Response
export interface AssignmentResponse {
  id: number;
  title: string;
  description: string;
  subject: string;
  teacherId: number;
  studentId: number;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number | null;
  feedback?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  attachments?: AttachmentResponse[];
  submission?: SubmissionResponse | null;
}

// Attachment Response
export interface AttachmentResponse {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
}

// Submission Response
export interface SubmissionResponse {
  id: number;
  fileName: string;
  fileUrl: string;
  submittedAt: string;
  status: "submitted" | "graded";
}

// Attendance Response
export interface AttendanceResponse {
  id: number;
  studentId: number;
  teacherId: number;
  date: string;
  status: "present" | "absent";
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Payment Response
export interface PaymentResponse {
  id: number;
  type: string;
  studentId?: number;
  teacherId?: number;
  amount: number;
  status: "paid" | "pending" | "due" | "overdue";
  date: string;
  dueDate?: string;
  method?: string;
  transactionId?: string;
}

// Analytics Response
export interface AnalyticsUserGrowthResponse {
  userGrowth: Array<{
    month: string;
    students: number;
    teachers: number;
  }>;
}

export interface AnalyticsPaymentDistributionResponse {
  distribution: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
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
  details?: unknown | null;
}

export interface PaymentStatsProps {
  totalEarnings?: number;
  pendingAmount?: number;
  overdueAmount?: number;
  totalHours?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
  submittedAt?: string;
  // optional file attachment metadata (for assignment attachments and student submissions)
  attachmentUrl?: string;
  attachmentName?: string;
  submissionFileUrl?: string;
  submissionFileName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  status: "present" | "absent";
  duration: number; // in minutes
}

export interface StudentInfo {
  id: string;
  name: string;
  age: number;
  location: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  skillsLearning: string[];
  joinedDate: string; // YYYY-MM-DD
  status: "active" | "inactive";
}

export interface TeacherSearchResult {
  id: string;
  name: string;
  location: string;
  skillsToTeach: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  distance: string;
  profileImage?: string;
}

export interface StudentPayment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: "upi" | "card" | "cash";
  paymentStatus: "completed" | "pending" | "failed" | "refunded";
  transactionId?: string;
  paymentDate: string; // YYYY-MM-DD
}

// Admin-specific mock data and services
export interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  approvedTeachers: number;
  pendingTeachers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive" | "pending";
  joinedDate: string;
  lastActive: string;
  profileComplete: boolean;
}


export type Teacher = {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  experience?: number
  idProof?: string
  subjects?: string[]
  aadharUrl?: string
  appliedAt: string;
}


export interface TeacherApproval {
  id: string;
  name: string;
  email: string;
  location: string;
  skillsToTeach: string[];
  experience: number;
  phone: string;
  idProof: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface PaymentDue {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  dueDate: string;
  status: "due" | "overdue" | "paid";
  subject: string;
}

export interface MonthlyData {
  month: string;
  students: number;
  teachers: number;
  revenue: number;
}

// New interfaces for enhanced admin functionality
export interface TeacherSalary {
  id: string;
  teacherId: string;
  teacherName: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  totalSalary: number;
  month: string;
  year: number;
  status: "pending" | "paid" | "processing";
  paymentDate?: string;
}

export interface JwtPayload {
  userId: number;
  role: string;
}



export interface StudentFee {
  id: string;
  studentId: string;
  studentName: string;
  monthlyFee: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "due" | "overdue" | "grace_period";
  gracePeriodEnd?: string;
  remindersSent: number;
}

export interface NotificationStats {
  totalSent: number;
  assignmentReminders: number;
  paymentReminders: number;
  attendanceAlerts: number;
  emailsSent: number;
  whatsappSent: number;
}

export interface AttendanceStats {
  totalSessions: number;
  attendedSessions: number;
  missedSessions: number;
  attendanceRate: number;
  byMonth: { month: string; rate: number }[];
}

export interface AssignmentStats {
  totalAssignments: number;
  submittedOnTime: number;
  lateSubmissions: number;
  pendingSubmissions: number;
  averageGrade: number;
  bySubject: { subject: string; count: number; avgGrade: number }[];
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  createdAt?: Date;
}

// Mock data for the application
export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
  submittedAt?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submissionFileUrl?: string;
  submissionFileName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  status: "present" | "absent";
  duration: number; // in minutes
}

export interface TeacherSearchResult {
  id: string;
  name: string;
  location: string;
  skillsToTeach: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  distance: string;
  profileImage?: string;
}

export interface StudentPayment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: "upi" | "card" | "cash";
  paymentStatus: "completed" | "pending" | "failed" | "refunded";
  transactionId?: string;
  paymentDate: string; // YYYY-MM-DD
}

// Teacher-specific mock data and services
export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  subject: string;
  hoursTeached: number;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  studentId: string;
  studentName: string;
  assignedDate: string;
  dueDate: string;
  status: "assigned" | "submitted" | "graded";
  submissionText?: string;
  grade?: number;
  feedback?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  date: string;
  status: "present" | "absent";
  duration: number;
  atHome?: boolean;
  notes?: string;
}


export type DayAttendance = {
  date: string // ISO date string YYYY-MM-DD
  status: AttendanceStatus
}

