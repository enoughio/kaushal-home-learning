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

// Mock data
export const mockPlatformStats: PlatformStats = {
  totalUsers: 156,
  totalStudents: 89,
  totalTeachers: 34,
  approvedTeachers: 28,
  pendingTeachers: 6,
  totalRevenue: 245000,
  monthlyGrowth: 12.5,
  yearlyGrowth: 145.2,
}

export const mockUsers: UserManagement[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "2024-01-20",
    profileComplete: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "teacher",
    status: "active",
    joinedDate: "2024-01-10",
    lastActive: "2024-01-19",
    profileComplete: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "teacher",
    status: "pending",
    joinedDate: "2024-01-18",
    lastActive: "2024-01-18",
    profileComplete: true,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "student",
    status: "active",
    joinedDate: "2024-01-12",
    lastActive: "2024-01-20",
    profileComplete: true,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "teacher",
    status: "inactive",
    joinedDate: "2023-12-20",
    lastActive: "2024-01-05",
    profileComplete: true,
  },
]

export const mockTeacherApprovals: TeacherApproval[] = [
  {
    id: "1",
    name: "Mike Johnson",
    email: "mike@example.com",
    location: "Mumbai, Bandra",
    skillsToTeach: ["Mathematics", "Physics"],
    experience: 3,
    phone: "+91 9876543216",
    idProof: "AADHAR123456790",
    appliedDate: "2024-01-18",
    status: "pending",
  },
  {
    id: "2",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    location: "Mumbai, Andheri",
    skillsToTeach: ["English", "Hindi"],
    experience: 5,
    phone: "+91 9876543217",
    idProof: "AADHAR123456791",
    appliedDate: "2024-01-17",
    status: "pending",
  },
  {
    id: "3",
    name: "Robert Taylor",
    email: "robert@example.com",
    location: "Mumbai, Juhu",
    skillsToTeach: ["Chemistry", "Biology"],
    experience: 7,
    phone: "+91 9876543218",
    idProof: "AADHAR123456792",
    appliedDate: "2024-01-16",
    status: "pending",
  },
]

export const mockPaymentDues: PaymentDue[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    teacherId: "2",
    teacherName: "Jane Smith",
    amount: 2000,
    dueDate: "2024-01-25",
    status: "due",
    subject: "Mathematics",
  },
  {
    id: "2",
    studentId: "4",
    studentName: "Sarah Wilson",
    teacherId: "2",
    teacherName: "Jane Smith",
    amount: 1500,
    dueDate: "2024-01-20",
    status: "overdue",
    subject: "Physics",
  },
  {
    id: "3",
    studentId: "1",
    studentName: "John Doe",
    teacherId: "5",
    teacherName: "David Brown",
    amount: 1800,
    dueDate: "2024-01-30",
    status: "due",
    subject: "Chemistry",
  },
]

export const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", students: 45, teachers: 15, revenue: 85000 },
  { month: "Feb", students: 52, teachers: 18, revenue: 95000 },
  { month: "Mar", students: 61, teachers: 22, revenue: 110000 },
  { month: "Apr", students: 68, teachers: 25, revenue: 125000 },
  { month: "May", students: 74, teachers: 28, revenue: 140000 },
  { month: "Jun", students: 81, teachers: 31, revenue: 155000 },
  { month: "Jul", students: 89, teachers: 34, revenue: 170000 },
]

export const mockTeacherSalaries: TeacherSalary[] = [
  {
    id: "1",
    teacherId: "2",
    teacherName: "Jane Smith",
    baseSalary: 25000,
    bonuses: 2000,
    deductions: 500,
    totalSalary: 26500,
    month: "January",
    year: 2024,
    status: "paid",
    paymentDate: "2024-01-31",
  },
  {
    id: "2",
    teacherId: "5",
    teacherName: "David Brown",
    baseSalary: 22000,
    bonuses: 1500,
    deductions: 0,
    totalSalary: 23500,
    month: "January",
    year: 2024,
    status: "pending",
  },
  {
    id: "3",
    teacherId: "2",
    teacherName: "Jane Smith",
    baseSalary: 25000,
    bonuses: 3000,
    deductions: 0,
    totalSalary: 28000,
    month: "February",
    year: 2024,
    status: "processing",
  },
]

export const mockStudentFees: StudentFee[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    monthlyFee: 2000,
    dueDate: "2024-01-25",
    status: "paid",
    paidDate: "2024-01-23",
    remindersSent: 1,
  },
  {
    id: "2",
    studentId: "4",
    studentName: "Sarah Wilson",
    monthlyFee: 1500,
    dueDate: "2024-01-20",
    status: "overdue",
    gracePeriodEnd: "2024-01-30",
    remindersSent: 3,
  },
  {
    id: "3",
    studentId: "1",
    studentName: "John Doe",
    monthlyFee: 2000,
    dueDate: "2024-02-25",
    status: "due",
    remindersSent: 0,
  },
]

export const mockNotificationStats: NotificationStats = {
  totalSent: 1247,
  assignmentReminders: 456,
  paymentReminders: 234,
  attendanceAlerts: 557,
  emailsSent: 623,
  whatsappSent: 624,
}

export const mockAttendanceStats: AttendanceStats = {
  totalSessions: 1250,
  attendedSessions: 1087,
  missedSessions: 163,
  attendanceRate: 87,
  byMonth: [
    { month: "Jan", rate: 85 },
    { month: "Feb", rate: 88 },
    { month: "Mar", rate: 87 },
    { month: "Apr", rate: 89 },
    { month: "May", rate: 86 },
    { month: "Jun", rate: 90 },
  ],
}

export const mockAssignmentStats: AssignmentStats = {
  totalAssignments: 456,
  submittedOnTime: 389,
  lateSubmissions: 45,
  pendingSubmissions: 22,
  averageGrade: 78.5,
  bySubject: [
    { subject: "Mathematics", count: 156, avgGrade: 82.3 },
    { subject: "Physics", count: 134, avgGrade: 76.8 },
    { subject: "Chemistry", count: 98, avgGrade: 79.2 },
    { subject: "English", count: 68, avgGrade: 85.1 },
  ],
}

export const mockPlatformAnalytics: PlatformAnalytics = {
  userGrowth: [
    { month: "Jan", students: 45, teachers: 15 },
    { month: "Feb", students: 52, teachers: 18 },
    { month: "Mar", students: 61, teachers: 22 },
    { month: "Apr", students: 68, teachers: 25 },
    { month: "May", students: 74, teachers: 28 },
    { month: "Jun", students: 81, teachers: 31 },
    { month: "Jul", students: 89, teachers: 34 },
  ],
  revenueAnalytics: [
    { month: "Jan", studentFees: 85000, teacherSalaries: 45000, profit: 40000 },
    { month: "Feb", studentFees: 95000, teacherSalaries: 52000, profit: 43000 },
    { month: "Mar", studentFees: 110000, teacherSalaries: 58000, profit: 52000 },
    { month: "Apr", studentFees: 125000, teacherSalaries: 65000, profit: 60000 },
    { month: "May", studentFees: 140000, teacherSalaries: 72000, profit: 68000 },
    { month: "Jun", studentFees: 155000, teacherSalaries: 78000, profit: 77000 },
    { month: "Jul", studentFees: 170000, teacherSalaries: 85000, profit: 85000 },
  ],
  engagementMetrics: [
    { metric: "Daily Active Users", value: 156, change: 12.5 },
    { metric: "Session Duration (min)", value: 45, change: 8.3 },
    { metric: "Assignment Completion Rate", value: 85, change: -2.1 },
    { metric: "Teacher Response Time (hrs)", value: 2.3, change: -15.2 },
  ],
  geographicDistribution: [
    { location: "Mumbai", students: 45, teachers: 18 },
    { location: "Delhi", students: 23, teachers: 8 },
    { location: "Bangalore", students: 12, teachers: 5 },
    { location: "Pune", students: 9, teachers: 3 },
  ],
}

export class AdminDataService {
  static async getPlatformStats(): Promise<PlatformStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockPlatformStats
  }

  static async getAllUsers(): Promise<UserManagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUsers.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
  }

  static async getPendingTeachers(): Promise<TeacherApproval[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockTeacherApprovals.filter((t) => t.status === "pending")
  }

  static async approveTeacher(teacherId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const teacher = mockTeacherApprovals.find((t) => t.id === teacherId)
    if (teacher) {
      teacher.status = "approved"
      // Update user status
      const user = mockUsers.find((u) => u.email === teacher.email)
      if (user) {
        user.status = "active"
      }
    }
  }

  static async rejectTeacher(teacherId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const teacher = mockTeacherApprovals.find((t) => t.id === teacherId)
    if (teacher) {
      teacher.status = "rejected"
      // Update user status
      const user = mockUsers.find((u) => u.email === teacher.email)
      if (user) {
        user.status = "inactive"
      }
    }
  }

  static async updateUserStatus(userId: string, status: "active" | "inactive"): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.status = status
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockUsers.findIndex((u) => u.id === userId)
    if (index > -1) {
      mockUsers.splice(index, 1)
    }
  }

  static async getPaymentDues(): Promise<PaymentDue[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockPaymentDues.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  static async getMonthlyData(): Promise<MonthlyData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockMonthlyData
  }

  static async getTeacherStudents(): Promise<UserManagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Mock: return students assigned to this teacher
    return mockUsers.filter((u) => u.role === "student" && u.status === "active").slice(0, 3)
  }

  // New service methods for enhanced functionality
  static async getTeacherSalaries(): Promise<TeacherSalary[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockTeacherSalaries.sort((a, b) => b.year - a.year || b.month.localeCompare(a.month))
  }

  static async updateTeacherSalary(salaryId: string, updates: Partial<TeacherSalary>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const salary = mockTeacherSalaries.find((s) => s.id === salaryId)
    if (salary) {
      Object.assign(salary, updates)
    }
  }

  static async getStudentFees(): Promise<StudentFee[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockStudentFees.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  static async updateStudentFeeStatus(feeId: string, status: StudentFee["status"], paidDate?: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const fee = mockStudentFees.find((f) => f.id === feeId)
    if (fee) {
      fee.status = status
      if (paidDate) fee.paidDate = paidDate
    }
  }

  static async getNotificationStats(): Promise<NotificationStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockNotificationStats
  }

  static async getAttendanceStats(): Promise<AttendanceStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAttendanceStats
  }

  static async getAssignmentStats(): Promise<AssignmentStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAssignmentStats
  }

  static async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockPlatformAnalytics
  }

  static async assignTeacherToStudent(teacherId: string, studentId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Mock implementation - in real app, this would create the assignment
    console.log(`Assigned teacher ${teacherId} to student ${studentId}`)
  }

  static async softDeleteUser(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.status = "inactive"
      // In real implementation, this would be a soft delete flag
    }
  }
}
