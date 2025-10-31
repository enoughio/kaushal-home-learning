import React, { Suspense } from "react";
import { MonthCalendar } from "@/components/teachersPages/attendence/MonthCalendar";
import MarkAttendence from "@/components/teachersPages/attendence/MarkAttendence";
import AttendanceStats from "@/components/teachersPages/attendence/AttendanceStats";
import { DayAttendance } from "@/lib/types";

// Placeholder students data
const students = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Sarah Wilson" },
  { id: "3", name: "Raj Patel" },
];

// Placeholder selected student (could be set via search params or default)
const selectedStudentId = students[0].id;
const selectedStudent = students.find((s) => s.id === selectedStudentId);

// Placeholder attendance records
const monthRecords: DayAttendance[] = [
  { date: "2025-10-01", status: "present" },
  { date: "2025-10-02", status: "absent" },
  { date: "2025-10-03", status: "present" },
];

const AttendancePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) => {
  const month = (await searchParams).month || "";
  // const { month = "" } = await searchParams;

  console.log("Query month param:", month);
  // In future, fetch students, selectedStudentId, monthRecords from API

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
            <Suspense fallback={<MonthCalendarSkeleton />}>
              <MonthCalendar
                year={new Date().getFullYear()}
                month={Number(month)}
                records={monthRecords}
                title="Monthly Calendar"
              />
            </Suspense>
          </div>
          <Suspense fallback={<AttendanceFormSkeleton />}>
            <MarkAttendence student={selectedStudent} />
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
