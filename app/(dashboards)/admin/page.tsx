import OverviewStats from "@/components/adminPages/overview/OverviewStats";
import PendingapprovalsOverView from "@/components/adminPages/overview/PendingapprovalsOverView";
import QuickActionsAdmin from "@/components/adminPages/overview/QuickActionsAdmin";
import RecentUsersOverview from "@/components/adminPages/overview/RecentUsersOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function AdminDashboardPage() {
  const OverviewStatsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 h-[110px]">
              {" "}
              {/* Match real card height */}
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" /> {/* Title */}
                  <div className="h-8 w-24 bg-muted rounded" />{" "}
                  {/* Main value */}
                  <div className="h-3 w-32 bg-muted rounded" /> {/* Subtext */}
                </div>
                <div className="h-8 w-8 bg-muted rounded-full" /> {/* Icon */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const QuickActionsAdminSkeleton = () => {
    return (
      <div className="animate-pulse">
        <Card>
          <CardHeader>
            <CardTitle className="h-5 w-32 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-muted rounded-lg"
                >
                  <div className="h-6 w-6 bg-background/60 rounded" />
                  <div className="h-4 w-20 bg-background/60 rounded" />
                  <div className="h-3 w-8 bg-background/60 rounded" />{" "}
                  {/* placeholder for badge */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const PendingapprovalsOverViewSkeleton = () => {
    return (
      <div className="animate-pulse">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="h-5 w-48 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded" />{" "}
            {/* placeholder for 'View All' button */}
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="space-y-2 w-full">
                  <div className="h-4 w-32 bg-background/60 rounded" />
                  <div className="h-3 w-24 bg-background/60 rounded" />
                  <div className="h-2 w-20 bg-background/60 rounded" />
                </div>
                <div className="h-4 w-12 bg-background/60 rounded" />{" "}
                {/* placeholder for badge */}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const RecentUsersOverviewSkeleton = () => {
    return (
      <div className="animate-pulse">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="h-5 w-36 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded" />{" "}
            {/* placeholder for 'View All' button */}
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="space-y-2 w-full">
                  <div className="h-4 w-32 bg-background/60 rounded" />{" "}
                  {/* name */}
                  <div className="h-3 w-40 bg-background/60 rounded" />{" "}
                  {/* email */}
                  <div className="h-2 w-24 bg-background/60 rounded" />{" "}
                  {/* joined date */}
                </div>
                <div className="space-y-1">
                  <div className="h-4 w-12 bg-background/60 rounded" />{" "}
                  {/* role badge */}
                  <div className="h-4 w-12 bg-background/60 rounded" />{" "}
                  {/* status badge */}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage the Kaushaly platform
        </p>
      </div>

      {/* Key Metrics */}
      <Suspense fallback={<OverviewStatsSkeleton />}>
        <OverviewStats />
      </Suspense>

      {/* Quick Actions */}
      <Suspense fallback={<QuickActionsAdminSkeleton />}>
        <QuickActionsAdmin />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Teacher Approvals */}
        <Suspense fallback={<PendingapprovalsOverViewSkeleton />}>
          <PendingapprovalsOverView />
        </Suspense>

        {/* Recent Users */}
        <Suspense fallback={<RecentUsersOverviewSkeleton />}>
          <RecentUsersOverview />
        </Suspense>
      </div>

      {/* Platform Health */}
      {/* <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1 mb-2">
                  {Math.round((stats.approvedTeachers / stats.totalTeachers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Teacher Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2 mb-2">
                  {Math.round((stats.totalStudents / stats.totalUsers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Student Ratio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3 mb-2">
                  ₹{Math.round(stats.totalRevenue / stats.totalStudents)}
                </div>
                <p className="text-sm text-muted-foreground">Revenue per Student</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
    </div>
  );
}
