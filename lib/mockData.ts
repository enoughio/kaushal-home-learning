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

// Mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Quadratic Equations Practice",
    description: "Solve the given quadratic equations using different methods",
    subject: "Mathematics",
    teacherId: "3",
    teacherName: "Jane Smith",
    dueDate: "2024-01-15",
    status: "pending",
  },
  {
    id: "2",
    title: "Newton's Laws Essay",
    description: "Write a 500-word essay on Newton's three laws of motion",
    subject: "Physics",
    teacherId: "3",
    teacherName: "Jane Smith",
    dueDate: "2024-01-20",
    status: "submitted",
    submittedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Chemical Bonding Worksheet",
    description: "Complete the worksheet on ionic and covalent bonding",
    subject: "Chemistry",
    teacherId: "3",
    teacherName: "Jane Smith",
    dueDate: "2024-01-10",
    status: "graded",
    grade: 85,
    submittedAt: "2024-01-09",
  },
]

// Mock attendance records
export const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "2",
    teacherId: "3",
    teacherName: "Jane Smith",
    subject: "Mathematics",
    date: "2024-01-15",
    status: "present",
    duration: 60,
  },
  {
    id: "2",
    studentId: "2",
    teacherId: "3",
    teacherName: "Jane Smith",
    subject: "Physics",
    date: "2024-01-14",
    status: "present",
    duration: 90,
  },
  {
    id: "3",
    studentId: "2",
    teacherId: "3",
    teacherName: "Jane Smith",
    subject: "Mathematics",
    date: "2024-01-13",
    status: "absent",
    duration: 0,
  },
]

// Mock teacher search results
export const mockTeacherSearch: TeacherSearchResult[] = [
  {
    id: "1",
    name: "Jane Smith",
    location: "Mumbai, Bandra",
    skillsToTeach: ["Mathematics", "Physics", "Chemistry"],
    experience: 5,
    rating: 4.8,
    hourlyRate: 500,
    distance: "2.3 km",
  },
  {
    id: "2",
    name: "Raj Patel",
    location: "Mumbai, Andheri",
    skillsToTeach: ["Mathematics", "Computer Science"],
    experience: 3,
    rating: 4.5,
    hourlyRate: 400,
    distance: "3.1 km",
  },
  {
    id: "3",
    name: "Priya Sharma",
    location: "Mumbai, Juhu",
    skillsToTeach: ["English", "Hindi", "History"],
    experience: 7,
    rating: 4.9,
    hourlyRate: 600,
    distance: "4.2 km",
  },
  {
    id: "4",
    name: "Amit Kumar",
    location: "Mumbai, Powai",
    skillsToTeach: ["Biology", "Chemistry"],
    experience: 4,
    rating: 4.6,
    hourlyRate: 450,
    distance: "5.8 km",
  },
]

export class MockDataService {
  static async getAssignments(studentId: string): Promise<Assignment[]> {
    // Simulate API delay
    console.log("Fetching assignments for student:", studentId)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAssignments
  }

  static async getAttendanceRecords(studentId: string): Promise<AttendanceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAttendance.filter((record) => record.studentId === studentId)
  }

  static async searchTeachers(location: string, skills: string[]): Promise<TeacherSearchResult[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockTeacherSearch.filter((teacher) => {
      const locationMatch = teacher.location.toLowerCase().includes(location.toLowerCase())
      const skillMatch = skills.some((skill) => teacher.skillsToTeach.includes(skill))
      return locationMatch || skillMatch
    })
  }

  static async submitAssignment(assignmentId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const assignment = mockAssignments.find((a) => a.id === assignmentId)
    if (assignment) {
      assignment.status = "submitted"
      assignment.submittedAt = new Date().toISOString().split("T")[0]
    }
  }

  static async markAttendance(studentId: string, teacherId: string, subject: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId,
      teacherId,
      teacherName: "Jane Smith", // In real app, fetch teacher name
      subject,
      date: new Date().toISOString().split("T")[0],
      status: "present",
      duration: 60,
    }
    mockAttendance.push(newRecord)
  }
}
