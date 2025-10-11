"use client"

import React from "react"
import useSWR from "swr"
import { MonthCalendar, type DayAttendance } from "@/components/attendance/month-calendar"
import { StudentAttendanceHistory, type MonthlySummary } from "@/components/attendance/student-attendance-history"
import {
  listTeacherStudents,
  getStudentMonthAttendance,
  getStudentAttendanceHistory,
  markTeacherAttendance,
  type TeacherStudent,
} from "@/lib/teacher-data"

function useTodayYMD() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function AttendanceManager({ teacherId = "T1" }: { teacherId?: string }) {
  const [selectedStudent, setSelectedStudent] = React.useState<string>("")
  const [ym, setYm] = React.useState<{ y: number; m: number }>(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() + 1 }
  })
  const [date, setDate] = React.useState<string>(useTodayYMD())
  const [atHome, setAtHome] = React.useState(false)
  const [notes, setNotes] = React.useState("")

  const { data: students } = useSWR<TeacherStudent[]>(
    ["teacher-students", teacherId],
    () => listTeacherStudents(teacherId),
    { suspense: false },
  )

  const { data: monthRecords, mutate: refetchMonth } = useSWR<DayAttendance[]>(
    selectedStudent ? ["month-attendance", teacherId, selectedStudent, ym.y, ym.m] : null,
    () => getStudentMonthAttendance(teacherId, selectedStudent, ym.y, ym.m),
    { suspense: false },
  )

  const { data: history } = useSWR<MonthlySummary[]>(
    selectedStudent ? ["history-attendance", teacherId, selectedStudent] : null,
    () => getStudentAttendanceHistory(teacherId, selectedStudent),
    { suspense: false },
  )

  function shiftMonth(delta: number) {
    setYm((prev) => {
      let y = prev.y
      let m = prev.m + delta
      if (m < 1) {
        m = 12
        y -= 1
      } else if (m > 12) {
        m = 1
        y += 1
      }
      return { y, m }
    })
  }

  async function onMark() {
    if (!selectedStudent) return
    if (!atHome) return
    await markTeacherAttendance({
      teacherId,
      studentId: selectedStudent,
      date,
      atHome,
      notes: notes.trim() || undefined,
    })
    setNotes("")
    setAtHome(false)
    await refetchMonth()
  }

  const today = useTodayYMD()

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
            <label className="text-sm">
              <span className="mr-2">Student</span>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select student…</option>
                {(students || []).map((s) => (
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
            <MonthCalendar
              year={ym.y}
              month={ym.m}
              records={monthRecords || []}
              onPrevMonth={() => shiftMonth(-1)}
              onNextMonth={() => shiftMonth(1)}
              title="Monthly Calendar"
            />
          </div>
          <form
            className="rounded-lg border bg-background p-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              onMark()
            }}
          >
            <div className="text-sm font-medium">Mark Attendance</div>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Date</span>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={atHome} onChange={(e) => setAtHome(e.target.checked)} />
              <span className="text-sm">I confirm I am physically at the student’s home for this session</span>
            </label>

            <label className="block">
              <div className="mb-1 text-sm text-muted-foreground">Notes (optional)</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Lesson topic, duration, or other remarks"
              />
            </label>

            <button
              type="submit"
              disabled={!selectedStudent || !atHome || !date}
              className="w-full rounded-md border bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Present
            </button>

            <p className="text-xs text-muted-foreground">
              Students/parents have a read-only view of this calendar in their dashboard.
            </p>
          </form>
        </div>
      </section>

      <StudentAttendanceHistory rows={history || []} />
    </div>
  )
}
