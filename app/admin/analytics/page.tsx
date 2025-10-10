import React, { Suspense, lazy } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Lazy-loaded chart components
const KeyMetrics = lazy(
  () => import("@/components/adminPage/analyticsPage/KeyMetrics")
);
const AnnualGrowth = lazy(
  () => import("@/components/adminPage/analyticsPage/AnnualGrowth")
);
const PaymentAnalytics = lazy(
  () => import("@/components/adminPage/analyticsPage/PaymentAnalytics")
);
const MonthlyUserGrowth = lazy(
  () => import("@/components/adminPage/analyticsPage/MonthlyUserGrowth")
);
const UserDistribution = lazy(
  () => import("@/components/adminPage/analyticsPage/UserDistribution")
);
const SubjectDistribution = lazy(
  () => import("@/components/adminPage/analyticsPage/SubjectDistribution")
);
const AttendenceAnalytics = lazy(
  () => import("@/components/adminPage/analyticsPage/AttendenceAnalytics")
);

// Simple loader for each chart, Can be customized later
function ChartLoader({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-muted-foreground bg-muted/30 rounded-md">
      <div className="text-center">
        <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto mb-2 rounded-full"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into platform performance and growth
          </p>
        </div>

        {/* Independent Suspense Boundaries */}
        <Suspense fallback={<ChartLoader text="Loading Key Metrics..." />}>
          <KeyMetrics />
        </Suspense>

        <Suspense fallback={<ChartLoader text="Loading Annual Growth..." />}>
          <AnnualGrowth />
        </Suspense>

        <Suspense
          fallback={<ChartLoader text="Loading Payment Analytics..." />}
        >
          <PaymentAnalytics />
        </Suspense>

        <Suspense
          fallback={<ChartLoader text="Loading Attendance Analytics..." />}
        >
          <AttendenceAnalytics />
        </Suspense>

        <Suspense
          fallback={<ChartLoader text="Loading Subject Distribution..." />}
        >
          <SubjectDistribution />
        </Suspense>

        <Suspense
          fallback={<ChartLoader text="Loading Monthly User Growth..." />}
        >
          <MonthlyUserGrowth />
        </Suspense>

        <Suspense
          fallback={<ChartLoader text="Loading User Distribution..." />}
        >
          <UserDistribution />
        </Suspense>
      </div>
    </AdminLayout>
  );
}
