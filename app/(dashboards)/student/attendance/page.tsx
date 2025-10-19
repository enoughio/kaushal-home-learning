import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type AttendanceRecord } from "@/lib/types";
import { MockDataService } from "@/lib/mock-data";
import AttendanceStats from "@/components/studentPages/Attendance/AttendanceStats";
// import AttendanceCalender from "@/components/studentPages/Attendance/AttendanceCalender";

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

export default async function AttendancePage() {

  // const monthISO = normalizeMonth(searchParams?.month);
  // Server fetch attendance records once for this student (filtering client-side by month)
  let records: AttendanceRecord[] = [];
  try {
    // placeholder student id
    records = await MockDataService.getAttendanceRecords("2");
    // sort most-recent-first
    records = records.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (e) {
    records = [];
  }

  // Filter down to entries for the month (YYYY-MM)
  // const monthRecords = records.filter((r) => r.date.startsWith(monthISO));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">
            View teacher-marked attendance on the monthly calendar
          </p>
        </div>
      </div>

      {/* Stats (fetches own data if needed) */}
      <Suspense fallback={<AttendanceStatsSkeleton />}>
        <AttendanceStats />
      </Suspense>

      {/* Calendar — parent passes the month's attendance records and the selected month */}
      {/* <AttendanceCalender attendance={monthRecords} monthISO={monthISO} /> */}
    </div>
  );
}



  const AttendanceStatsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-12 bg-neutral-300 rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
