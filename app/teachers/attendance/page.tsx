import React, { Suspense } from "react"
import { MonthCalendar } from "@/components/teachers/attendence/MonthCalendar"
import MarkAttendence from "@/components/teachers/attendence/MarkAttendence"
import AttendanceStats from "@/components/teachers/attendence/AttendanceStats"
import { DayAttendance } from "@/helper/mail/types"

// Placeholder students data
const students = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Sarah Wilson" },
  { id: "3", name: "Raj Patel" },
]

// Placeholder selected student (could be set via search params or default)
const selectedStudentId = students[0].id
const selectedStudent = students.find((s) => s.id === selectedStudentId)

const year = 2024
const month = 6

// Placeholder attendance records
const monthRecords : DayAttendance[] = [
  { date: "2024-06-01", status: "present" },
  { date: "2024-06-02", status: "absent" },
  { date: "2024-06-03", status: "present" },
]

const AttendancePage = async () => {
  // In future, fetch students, selectedStudentId, monthRecords from API

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card text-card-foreground">
        <header className="flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-pretty">Attendance</h1>
            <p className="text-sm text-muted-foreground">
              Mark attendance only when you are physically at the student’s home. Select a student to view their
              calendar and history.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Student dropdown */}
            <label className="text-sm">
              <span className="mr-2">Student</span>
              <select
                defaultValue={selectedStudentId}
                className="rounded-md border bg-background px-3 py-2 text-sm"
                // In a real app, use state or search params to control selected student
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className="grid gap-4 border-t p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<div>Loading calendar...</div>}>
              <MonthCalendar
                year={year}
                month={month}
                records={monthRecords}
                onPrevMonth={() => {}}
                onNextMonth={() => {}}
                title="Monthly Calendar"
              />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading mark attendance...</div>}>
            <MarkAttendence student={selectedStudent} />
          </Suspense>
        </div>
      </section>

      {/* Attendance stats at the bottom */}
      <Suspense fallback={<div>Loading attendance stats...</div>}>
        <AttendanceStats />
      </Suspense>
    </div>
  )
}

export default AttendancePage
