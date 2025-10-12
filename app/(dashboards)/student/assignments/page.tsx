import { Suspense } from "react";
import OverVieewStats from "@/components/studentPages/overview/OverVieewStats";
import AssignmentList from "@/components/studentPages/assignments/AssignmetList";

// Server component: render assignments page and compose server-side AssignmentList
export default async function AssignmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Manage your assignments and submissions</p>
      </div>

      {/* Stats and list are provided by server components */}
      <Suspense fallback={<div>Loading assignments...</div>}>
        <AssignmentList />
      </Suspense>
    </div>
  );
}
