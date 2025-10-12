export type AttendanceStatus = "present" | "absent" | "none"
export type DayAttendance = {
  date: string // YYYY-MM-DD
  status: AttendanceStatus
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
