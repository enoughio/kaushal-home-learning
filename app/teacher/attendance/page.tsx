"use client"

import { useState, useEffect } from "react"
import { TeacherLayout } from "@/components/layout/teacher-layout"
import { TeacherDataService, type StudentInfo } from "@/lib/teacher-data"
import { MockDataService, type AttendanceRecord } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { AttendanceManager } from "@/components/teacher/attendance-manager"

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<StudentInfo[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  // Form state for marking attendance
  const [attendanceForm, setAttendanceForm] = useState({
    subject: "",
    status: "present" as "present" | "absent",
    duration: "60",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (user) {
          const studentsData = await TeacherDataService.getMyStudents(user.id)
          setStudents(studentsData.filter((s) => s.status === "active"))
        }
      } catch (error) {
        console.error("Failed to load students:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentAttendance(selectedStudent)
    }
  }, [selectedStudent])

  const loadStudentAttendance = async (studentId: string) => {
    try {
      const records = await MockDataService.getAttendanceRecords(studentId)
      setAttendanceRecords(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error("Failed to load attendance:", error)
    }
  }

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !attendanceForm.subject) return

    setMarking(true)
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        await TeacherDataService.markStudentAttendance(
          selectedStudent,
          user.id,
          attendanceForm.subject,
          attendanceForm.status,
          Number.parseInt(attendanceForm.duration),
        )
        // Reload attendance records
        await loadStudentAttendance(selectedStudent)
        setAttendanceForm({ subject: "", status: "present", duration: "60" })
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error)
    } finally {
      setMarking(false)
    }
  }

  const selectedStudentData = students.find((s) => s.id === selectedStudent)
  const presentCount = attendanceRecords.filter((r) => r.status === "present").length
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0

  if (loading) {
    return (
      <TeacherLayout activeTab="attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading attendance...</p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout activeTab="attendance">
      <AttendanceManager />
    </TeacherLayout>
  )
}
