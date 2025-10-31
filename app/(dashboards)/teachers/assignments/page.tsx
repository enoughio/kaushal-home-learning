import React, { Suspense } from "react";
import AssignmentStats from "@/components/teachersPages/assignments.tsx/AssignmentStats";
import AssignmentList from "@/components/teachersPages/assignments.tsx/AssignmentList";
import NewAssignmentDialog from "@/components/teachersPages/assignments.tsx/NewAssignmentDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";

const AssignmentPage = async () => {
  // No client state, server component only
  const NewAssignmentDialogSkeleton = () => {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-300 animate-pulse">
        <div className="h-4 w-4 rounded-full bg-neutral-400" />
        <div className="h-4 w-28 bg-neutral-400 rounded" />
      </div>
    );
  };

  const AssignmentStatsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2 w-3/4">
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-neutral-300 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const AssignmentListSkeleton = () => {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between w-full animate-pulse">
                <div className="space-y-2 w-3/4">
                  <div className="h-4 w-32 bg-neutral-200 rounded"></div>
                  <div className="flex gap-4 mt-2">
                    <div className="h-3 w-20 bg-neutral-300 rounded"></div>
                    <div className="h-3 w-24 bg-neutral-300 rounded"></div>
                  </div>
                </div>
                <div className="h-5 w-10 bg-neutral-200 rounded" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-3 w-1/2 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-neutral-300 rounded animate-pulse"></div>
              <div className="h-12 bg-neutral-200 rounded animate-pulse mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage student assignments
          </p>
        </div>
        <Suspense fallback={<NewAssignmentDialogSkeleton />}>
          <NewAssignmentDialog />
        </Suspense>
      </div>

      {/* Stats */}
      <Suspense fallback={<AssignmentStatsSkeleton />}>
        <AssignmentStats />
      </Suspense>

      {/* Assignments List */}
      <Suspense fallback={<AssignmentListSkeleton />}>
        <AssignmentList />
      </Suspense>
    </div>
  );
};

export default AssignmentPage;
