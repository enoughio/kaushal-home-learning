import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord, ApiResponse } from "@/lib/types";
import myFetch from "@/lib/requestHelper";

// Server component: fetches or builds data on the server. Currently uses placeholder data.
export default async function RecentAttendanceOverview() {
  // Default placeholder while server fetch runs
  let recentAttendance: AttendanceRecord[] = [
    {
      id: "r1",
      studentId: "s1",
      teacherId: "t1",
      teacherName: "Ms. Parker",
      subject: "Mathematics",
      date: "2025-10-10",
      status: "present",
      duration: 45,
    },
  ];

  try {
    const res = await myFetch("/api/student/(overview)/atten-ov");
    if (res.ok) {
      const json = (await res.json()) as ApiResponse<Array<any>>;
      if (json && Array.isArray(json.data)) {
        recentAttendance = json.data.map((r) => ({
          id: String(r.id),
          studentId: r.studentId ?? null,
          teacherId: r.teacherId ?? null,
          teacherName: r.teacherName ?? "",
          subject: r.subject ?? "",
          date: r.date ?? null,
          status: (typeof r.status === "string" ? r.status.toLowerCase() : "absent"),
          duration: r.duration ?? null,
        } as AttendanceRecord));
      }
    } else {
      console.error("RecentAttendanceOverview: fetch failed", res.status);
    }
  } catch (err) {
    console.error("RecentAttendanceOverview: error fetching attendance", err);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Attendance</CardTitle>
        <Link href="/student/attendance">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentAttendance.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No attendance records</p>
        ) : (
          <div className="space-y-3">
            {recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{record.subject}</p>
                  <p className="text-sm text-muted-foreground">{record.teacherName}</p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
                <Badge variant={record.status === "present" ? "default" : "destructive"}>{record.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}