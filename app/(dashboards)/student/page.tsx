import OverVieewStats from "@/components/studentPages/overview/OverVieewStats";
import StudentQuicsActions from "@/components/studentPages/overview/StudentQuicsActions";
import PendingAssignmentsOverview from "@/components/studentPages/overview/PendingAssignmentsOverview";
import RecentAttendanceOverview from "@/components/studentPages/overview/RecentAttendanceOverview";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Server component: composes server-side child components. Child components currently use placeholder data.
export default async function StudentDashboard() {
  const OverVieewStatsSkeleton = () => {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                {/* Text placeholders */}
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-8 w-12 bg-muted rounded" />
              </div>
              {/* Icon placeholder */}
              <div className="h-8 w-8 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const StudentQuicsActionsSkeleton = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-5 w-32 bg-muted rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-muted rounded-lg"
              >
                <div className="h-6 w-6 bg-background/60 rounded" />
                <div className="h-4 w-20 bg-background/60 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const RecentAttendanceOverviewSkeleton = () => {
    return (
      <div className="animate-pulse">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <div className="h-5 w-32 bg-muted rounded" />
            </CardTitle>
            <div className="h-6 w-16 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-background/60 rounded" />
                    <div className="h-3 w-20 bg-background/60 rounded" />
                    <div className="h-3 w-16 bg-background/60 rounded" />
                  </div>
                  <div className="h-5 w-12 bg-background/60 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your learning overview.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<OverVieewStatsSkeleton />}>
        <OverVieewStats />
      </Suspense>

      {/* Quick Actions */}
      <Suspense fallback={<StudentQuicsActionsSkeleton />}>
        <StudentQuicsActions />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <Suspense fallback={<RecentAttendanceOverviewSkeleton />}>
          <PendingAssignmentsOverview />
        </Suspense>

        {/* Recent Attendance */}
        <Suspense fallback={<RecentAttendanceOverviewSkeleton />}>
          <RecentAttendanceOverview />
        </Suspense>
      </div>
    </div>
  );
}
