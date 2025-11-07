import PendingReviewsOverview from "@/components/teachersPages/overview/PendingReviewsOverview";
import QuickActions from "@/components/teachersPages/overview/QuickActions";
import RecentPaymentOverview from "@/components/teachersPages/overview/RecentPaymentOverview";
import RecentStudentOverview from "@/components/teachersPages/overview/RecentStudentOverview";
import Stats from "@/components/teachersPages/overview/Stats";
import { Card, CardContent } from "@/components/ui/card";
import React, { Suspense } from "react";

const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="h-40 animate-pulse">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-5 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </div>
            <div className="h-10 w-10 bg-muted rounded-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const QuickActionsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="h-5 w-32 bg-muted rounded" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-muted rounded-lg"
              >
                <div className="h-6 w-6 bg-background/60 rounded" />
                <div className="h-4 w-24 bg-background/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentStudentOverviewSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 bg-background/60 rounded" />
                <div className="h-3 w-24 bg-background/40 rounded" />
                <div className="h-2.5 w-20 bg-background/30 rounded" />
              </div>
              <div className="h-5 w-12 bg-background/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PendingReviewsOverviewSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="space-y-2">
                <div className="h-4 w-36 bg-background/60 rounded" />
                <div className="h-3 w-24 bg-background/40 rounded" />
                <div className="h-2.5 w-20 bg-background/30 rounded" />
              </div>
              <div className="h-5 w-12 bg-background/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentPaymentOverviewSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-background/50" />
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-background/60 rounded" />
                  <div className="h-3 w-28 bg-background/40 rounded" />
                  <div className="h-2.5 w-24 bg-background/30 rounded" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 w-16 bg-background/60 rounded ml-auto" />
                <div className="h-5 w-12 bg-background/50 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      {/* Quick Action */}
      <Suspense fallback={<QuickActionsSkeleton />}>
        <QuickActions />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* recent students */}
        <Suspense fallback={<RecentStudentOverviewSkeleton />}>
          <RecentStudentOverview />
        </Suspense>

        {/* pending reviews */}
        <Suspense fallback={<PendingReviewsOverviewSkeleton />}>
          <PendingReviewsOverview />
        </Suspense>
      </div>

      {/* Recent Payments */}
      <Suspense fallback={<RecentPaymentOverviewSkeleton />}>
        <RecentPaymentOverview />
      </Suspense>
    </div>
  );
};

export default page;
