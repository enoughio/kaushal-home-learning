import { AttendenceAnalyticsClient } from "./AttendenceAnalyticsClient";

export default function AttendenceAnalytics() {
  // For now, defining the data here
  const attendanceStats = [
    { month: "Jan", attendance: 92 },
    { month: "Feb", attendance: 89 },
    { month: "Mar", attendance: 94 },
    { month: "Apr", attendance: 87 },
    { month: "May", attendance: 91 },
    { month: "Jun", attendance: 88 },
  ];

  return <AttendenceAnalyticsClient data={attendanceStats} />;
}