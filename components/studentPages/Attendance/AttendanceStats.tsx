import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import type { AttendanceRecord } from "@/lib/types";
import { MockDataService } from "@/lib/mock-data";

type Props = {
  attendance?: AttendanceRecord[];
};

export default async function AttendanceStats() {
  // fetch own data (server-side)
    let records: AttendanceRecord[] = [];
    try {
      // placeholder student id
      records = await MockDataService.getAttendanceRecords("2");
    } catch (e) {
      records = [];
    }
  

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;
  const totalHours = records.filter((r) => r.status === "present").reduce((s, r) => s + (r.duration || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-bold text-chart-1">{attendanceRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-chart-2">{presentCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-destructive">{absentCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold text-chart-3">{Math.round(totalHours / 60)}</p>
            </div>
            <Clock className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}