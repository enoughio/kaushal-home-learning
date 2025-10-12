import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type AttendanceRecord } from "@/lib/types";
import { MockDataService } from "@/lib/mock-data";
import AttendanceStats from "@/components/studentPages/Attendance/AttendanceStats";
import AttendanceCalender from "@/components/studentPages/Attendance/AttendanceCalender";

type Props = {
  searchParams?: { month?: string };
};

function normalizeMonth(month?: string) {
  if (!month) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return month;
}

export default async function AttendancePage({ searchParams }: Props) {
  const monthISO = normalizeMonth(searchParams?.month);

  // Server fetch attendance records once for this student (filtering client-side by month)
  let records: AttendanceRecord[] = [];
  try {
    // placeholder student id
    records = await MockDataService.getAttendanceRecords("2");
    // sort most-recent-first
    records = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (e) {
    records = [];
  }

  // Filter down to entries for the month (YYYY-MM)
  const monthRecords = records.filter((r) => r.date.startsWith(monthISO));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">View teacher-marked attendance on the monthly calendar</p>
        </div>
      </div>

      {/* Stats (fetches own data if needed) */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <AttendanceStats />
      </Suspense>

      {/* Calendar — parent passes the month's attendance records and the selected month */}
      <AttendanceCalender attendance={monthRecords} monthISO={monthISO} />
    </div>
  );
}
