import PendingReviewsOverview from "@/components/teachersPages/overview/PendingReviewsOverview";
import QuickActions from "@/components/teachersPages/overview/QuickActions";
import RecentPaymentOverview from "@/components/teachersPages/overview/RecentPaymentOverview";
import RecentStudentOverview from "@/components/teachersPages/overview/RecentStudentOverview";
import Stats from "@/components/teachersPages/overview/Stats";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your students and track your teaching progress
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <Stats />
      </Suspense>

      {/* Quick Action */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <QuickActions />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* recent students */}
            <Suspense fallback={<div>Loading stats...</div>}>
            <RecentStudentOverview />
            </Suspense>

            {/* pending reviews */}
            <Suspense fallback={<div>Loading stats...</div>}>
            <PendingReviewsOverview />
            </Suspense>
      </div>

      {/* Recent Payments */}
    <Suspense fallback={<div>Loading stats...</div>}>
        <RecentPaymentOverview />
    </Suspense>
         
    </div>
  );
};

export default page;
