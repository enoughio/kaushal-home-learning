import { StudentInfo } from "@/lib/types"

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


export const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "1",
    teacherId: "T1",
    subject: "Mathematics",
    date: "2024-01-10",
    status: "present",
    duration: 45,
  },
  {
    id: "2",
    studentId: "2",
    teacherId: "T1",
    subject: "Chemistry",
    date: "2024-01-12",
    status: "absent",
    duration: 0,
  },
  {
    id: "3",
    studentId: "1",
    teacherId: "T1",
    subject: "Physics",
    date: "2024-01-15",
    status: "present",
    duration: 60,
  },
]


export const mockStudents: StudentInfo[] = [
  {
    id: "1",
    name: "John Doe",
    age: 16,
    location: "Mumbai, Bandra",
    phone: "+91 9876543210",
    parentName: "Robert Doe",
    parentPhone: "+91 9876543211",
    skillsLearning: ["Mathematics", "Physics"],
    joinedDate: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    age: 15,
    location: "Mumbai, Andheri",
    phone: "+91 9876543213",
    parentName: "Michael Wilson",
    parentPhone: "+91 9876543214",
    skillsLearning: ["Chemistry", "Biology"],
    joinedDate: "2024-01-15",
    status: "active",
  },
  {
    id: "3",
    name: "Raj Patel",
    age: 17,
    location: "Mumbai, Juhu",
    phone: "+91 9876543215",
    skillsLearning: ["Mathematics", "Computer Science"],
    parentName: "Anil Patel",
    parentPhone: "+91 9876543216",
    joinedDate: "2023-12-20",
    status: "inactive",
  },
]



export class TeacherDataService {


  static async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Import from existing mock data
    return mockAttendance.filter((record) => record.studentId === studentId)
  }

  static async markStudentAttendance(
    studentId: string,
    teacherId: string,
    subject: string,
    status: "present" | "absent",
    duration: number,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // In real app, this would update the database
    console.log("Marked attendance:", { studentId, teacherId, subject, status, duration })
  }

  static async listTeacherStudents(): Promise<StudentInfo[]> {
    await new Promise((r) => setTimeout(r, 200))
    return mockStudents.filter((s) => s.status === "active")
  }

  static async getStudentMonthAttendance(
    teacherId: string,
    studentId: string,
    year: number,
    month: number, // 1-12
  ): Promise<Array<{ date: string; status: "present" | "absent" }>> {
    await new Promise((r) => setTimeout(r, 200))
    const y = year
    const m = month
    const records = mockAttendance.filter((r) => {
      const d = new Date(r.date)
      return r.teacherId === teacherId && r.studentId === studentId && d.getFullYear() === y && d.getMonth() + 1 === m
    })
    return records.map((r) => ({ date: r.date, status: r.status }))
  }

  static async getStudentAttendanceHistory(
    teacherId: string,
    studentId: string,
  ): Promise<Array<{ month: string; present: number; sessions: number }>> {
    await new Promise((r) => setTimeout(r, 200))
    const byMonth = new Map<string, { present: number; sessions: number }>()
    for (const r of mockAttendance) {
      if (r.teacherId !== teacherId || r.studentId !== studentId) continue
      const key = r.date.slice(0, 7) // YYYY-MM
      const agg = byMonth.get(key) ?? { present: 0, sessions: 0 }
      agg.sessions += 1
      if (r.status === "present") agg.present += 1
      byMonth.set(key, agg)
    }
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([month, v]) => ({ month, present: v.present, sessions: v.sessions }))
  }

  static async markTeacherAttendance(input: {
    teacherId: string
    studentId: string
    date: string // YYYY-MM-DD
    atHome: boolean
    notes?: string
  }): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    if (!input.atHome) {
      console.warn("[v0] markTeacherAttendance called without atHome confirmation")
      return
    }
    mockAttendance.push({
      id: Date.now().toString(),
      studentId: input.studentId,
      teacherId: input.teacherId,
      subject: "Session",
      date: input.date,
      status: "present",
      duration: 60,
      atHome: true,
      notes: input.notes,
    })
  }
}

export type TeacherStudent = StudentInfo

export async function listTeacherStudents() {
  return TeacherDataService.listTeacherStudents()
}

export async function getStudentMonthAttendance(teacherId: string, studentId: string, year: number, month: number) {
  return TeacherDataService.getStudentMonthAttendance(teacherId, studentId, year, month)
}

export async function getStudentAttendanceHistory(teacherId: string, studentId: string) {
  return TeacherDataService.getStudentAttendanceHistory(teacherId, studentId)
}

export async function markTeacherAttendance(input: {
  teacherId: string
  studentId: string
  date: string // YYYY-MM-DD
  atHome: boolean
  notes?: string
}) {
  return TeacherDataService.markTeacherAttendance(input)
}
