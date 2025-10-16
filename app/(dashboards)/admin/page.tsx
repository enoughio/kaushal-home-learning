import OverviewStats from "@/components/adminPages/overview/OverviewStats";
import PendingapprovalsOverView from "@/components/adminPages/overview/PendingapprovalsOverView";
import QuickActionsAdmin from "@/components/adminPages/overview/QuickActionsAdmin";
import RecentUsersOverview from "@/components/adminPages/overview/RecentUsersOverview";
import { Suspense } from "react";

export default function AdminDashboardPage() {
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
      <Suspense fallback={<div>Loading Stats...</div>}>
        <OverviewStats />
      </Suspense>

      {/* Quick Actions */}
      <Suspense fallback={<div>Loading Quick Actions...</div>}>
        <QuickActionsAdmin />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Teacher Approvals */}
        <Suspense fallback={<div>Loading Pending Approvals...</div>}>
          <PendingapprovalsOverView />
        </Suspense>

        {/* Recent Users */}
        <Suspense fallback={<div>Loading Recent Users...</div>}>
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
