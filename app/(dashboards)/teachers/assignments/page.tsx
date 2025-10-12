import React, { Suspense } from "react";
import AssignmentStats from "@/components/teachersPages/assignments.tsx/AssignmentStats";
import AssignmentList from "@/components/teachersPages/assignments.tsx/AssignmentList";
import NewAssignmentDialog from "@/components/teachersPages/assignments.tsx/NewAssignmentDialog";

const AssignmentPage = async () => {
  // No client state, server component only

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
        <Suspense fallback={<div>Loading dialog...</div>}>
          <NewAssignmentDialog />
        </Suspense>
      </div>

      {/* Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <AssignmentStats />
      </Suspense>

      {/* Assignments List */}
      <Suspense fallback={<div>Loading assignments...</div>}>
        <AssignmentList />
      </Suspense>
    </div>
  );
};

export default AssignmentPage;