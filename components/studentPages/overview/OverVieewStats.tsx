import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Calendar, Users } from "lucide-react";
import type { AttendanceRecord, Assignment } from "@/lib/types";

type Props = {
  // Accept optional data from parent in future. Currently uses placeholder server-side data.
  assignments?: Assignment[];
  attendance?: AttendanceRecord[];
};

export default async function OverVieewStats({
  assignments,
  attendance,
}: Props) {
  // Placeholder data when none provided
  const placeholderAssignments: Assignment[] = assignments ?? [
    {
      id: "a1",
      title: "Algebra Worksheet",
      description: "Practice problems",
      subject: "Mathematics",
      teacherId: "t1",
      teacherName: "Ms. Parker",
      dueDate: "2025-10-15",
      status: "pending",
    },
  ];

  const placeholderAttendance: AttendanceRecord[] = attendance ?? [
    { id: "r1", studentId: "s1", teacherId: "t1", teacherName: "Ms. Parker", subject: "Math", date: "2025-10-10", status: "present", duration: 45 },
    { id: "r2", studentId: "s1", teacherId: "t2", teacherName: "Mr. Gomez", subject: "Science", date: "2025-10-09", status: "absent", duration: 50 },
  ];

  const pendingCount = placeholderAssignments.filter((a) => a.status === "pending").length;
  const attendanceRate = placeholderAttendance.length
    ? Math.round((placeholderAttendance.filter((a) => a.status === "present").length / placeholderAttendance.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <FileText className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-bold">{attendanceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{placeholderAttendance.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <Users className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}