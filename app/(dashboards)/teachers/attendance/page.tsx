import React, { Suspense } from "react";
import { MonthCalendar } from "@/components/teachersPages/attendence/MonthCalendar";
import MarkAttendence from "@/components/teachersPages/attendence/MarkAttendence";
import AttendanceStats from "@/components/teachersPages/attendence/AttendanceStats";
import {
  DayAttendance,
  TeacherStudentData,
  TeacherStudentAttendanceResponse,
} from "@/lib/types";
import myFetch from "@/lib/requestHelper";

const AttendancePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    year?: string;
    studentId?: string;
    page?: string;
  }>;
}) => {
  const {
    month: monthParam = "",
    year: yearParam = "",
    studentId: studentIdParam = "",
    page: pageParam = "1",
  } = await searchParams;
  const month = monthParam || "";
  // const { month = "" } = await searchParams;

  console.log("Query month param:", month);

  // Fetch students assigned to teacher
  let students: TeacherStudentData[] = [];
  try {
    const studentsRes = await myFetch(`/api/teacher/my-students`);
    if (studentsRes.ok) {
      const j = await studentsRes.json();
      students = (j?.data?.students ?? []) as TeacherStudentData[];
    } else {
      console.error("Failed fetching students", studentsRes.status);
    }
  } catch (e) {
    console.error("Error fetching students", e);
  }

  // Determine selected student id (from query or first student)
  const selectedStudentId =
    studentIdParam || (students[0] ? String(students[0].id) : "");

  // Default to current month/year if not provided
  const now = new Date();
  const year = yearParam ? Number(yearParam) : now.getFullYear();
  const monthNumber = month ? Number(month) : now.getMonth() + 1;

  // Fetch attendance for selected student (if available)
  let monthRecords: DayAttendance[] = [];
  try {
    if (selectedStudentId) {
      const attRes = await myFetch(
        `/api/teacher/attendence/${selectedStudentId}?month=${monthNumber}&year=${year}&page=${pageParam}`
      );

      if (attRes.ok) {
        const aj = await attRes.json();
        const data = aj?.data as TeacherStudentAttendanceResponse | undefined;
        if (data?.attendanceRecords) {
          // Normalize statuses to uppercase strings so calendar component can map easily
          monthRecords = data.attendanceRecords.map((r) => ({
            date: r.date,
            // convert to uppercase token, fallback to original string
            status: String(r.status).toUpperCase(),
          })) as DayAttendance[];
        }
      } else {
        console.error("Failed fetching attendance", attRes.status);
      }
    }
  } catch (e) {
    console.error("Error fetching attendance", e);
  }

  const MonthCalendarSkeleton = () => {
    return (
      <section className="rounded-lg border bg-card text-card-foreground animate-pulse">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-muted" />
                  <span className="h-3 w-10 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted rounded-md" />
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-8 w-8 bg-muted rounded-md" />
          </div>
        </header>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-px border-t bg-border">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-muted/30 p-2 text-center text-xs font-medium"
            >
              <div className="h-3 w-6 bg-muted rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-px bg-border">
          {[...Array(37)].map((_, i) => (
            <div key={i} className="min-h-16 bg-background p-2">
              <div className="flex items-start justify-between">
                <div className="h-3 w-3 bg-muted rounded" />
                <div className="h-2 w-2 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const AttendanceFormSkeleton = () => {
    return (
      <div className="rounded-lg border bg-background p-4 space-y-3 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-3 w-56 bg-muted rounded mb-2" />

        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded-md" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-3 w-80 bg-muted rounded" />
        </div>

        <div>
          <div className="h-3 w-24 bg-muted rounded mb-2" />
          <div className="w-full h-20 bg-muted rounded-md" />
        </div>

        <div className="w-full h-9 bg-muted rounded-md" />

        <div className="h-3 w-64 bg-muted rounded" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card text-card-foreground">
        <header className="flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-pretty">Attendance</h1>
            <p className="text-sm text-muted-foreground">
              Mark attendance only when you are physically at the student’s
              home. Select a student to view their calendar and history.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Student dropdown - server-rendered; for interactive selection convert to client component */}
            <label className="text-sm">
              <span className="mr-2">Student</span>
              <select
                defaultValue={selectedStudentId}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {students.length > 0 ? (
                  students.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.user?.first_name
                        ? `${s.user.first_name} ${s.user.last_name ?? ""}`
                        : `Student ${s.id}`}
                    </option>
                  ))
                ) : (
                  <option value="">No students</option>
                )}
              </select>
            </label>
          </div>
        </header>

        <div className="grid gap-4 border-t p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<MonthCalendarSkeleton />}>
              <MonthCalendar
                year={year}
                month={Number(monthNumber)}
                records={monthRecords}
                title="Monthly Calendar"
              />
            </Suspense>
          </div>
          <Suspense fallback={<AttendanceFormSkeleton />}>
            <MarkAttendence
              student={{
                id: selectedStudentId || "",
                name: "",
                isMarkedToday: false,
              }}
            />
          </Suspense>
        </div>
      </section>

      {/* Attendance stats at the bottom */}
      <Suspense fallback={<div>Loading attendance stats...</div>}>
        <AttendanceStats />
      </Suspense>
    </div>
  );
};

export default AttendancePage;
