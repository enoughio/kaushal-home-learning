import OverVieewStats from "@/components/studentPages/overview/OverVieewStats";
import StudentQuicsActions from "@/components/studentPages/overview/StudentQuicsActions";
import PendingAssignmentsOverview from "@/components/studentPages/overview/PendingAssignmentsOverview";
import RecentAttendanceOverview from "@/components/studentPages/overview/RecentAttendanceOverview";
import { Suspense } from "react";

// Server component: composes server-side child components. Child components currently use placeholder data.
export default async function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your learning overview.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <OverVieewStats />
      </Suspense>

      {/* Quick Actions */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <StudentQuicsActions />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <Suspense fallback={<div>Loading stats...</div>}>
          <PendingAssignmentsOverview />
        </Suspense>

        {/* Recent Attendance */}
        <Suspense fallback={<div>Loading stats...</div>}>
          <RecentAttendanceOverview />
        </Suspense>
      </div>
    </div>
  );
}
