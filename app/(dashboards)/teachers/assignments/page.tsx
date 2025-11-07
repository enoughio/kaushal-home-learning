import React, { Suspense } from "react";
import AssignmentStats from "@/components/teachersPages/assignments.tsx/AssignmentStats";
import AssignmentList from "@/components/teachersPages/assignments.tsx/AssignmentList";
import NewAssignmentDialog from "@/components/teachersPages/assignments.tsx/NewAssignmentDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import myFetch from "@/lib/requestHelper";
import { AlertTriangle } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  teacher_id: number;
  student_id: number;
  due_date: string | null;
  status: "ASSIGNED" | "SUBMITTED" | "GRADED";
  created_at: string;
  student: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
  teacher: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
  assignment_submissions: Array<{
    id: number;
    grade: string | null;
    marks_obtained: number | null;
    feedback: string | null;
    submission_text: string | null;
  }>;
  assignment_attachments: Array<{
    id: number;
    file_name: string;
    file_url: string;
    mime_type: string;
  }>;
}

const fetchAssignmentsData = async (): Promise<Assignment[] | null> => {
  try {
    const response = await myFetch("/api/teacher/assignments");
    if (!response.ok) {
      console.error("Failed to fetch assignments data:", response.status);
      return null;
    }
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching assignments data:", error);
    return null;
  }
};

const AssignmentPage = async () => {
  const assignments = await fetchAssignmentsData();

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
        <NewAssignmentDialog />
      </div>

      {/* Stats */}
      <Suspense fallback={<AssignmentStatsSkeleton />}>
        <AssignmentStats />
      </Suspense>

      {/* Assignments List */}
      {!assignments ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-muted-foreground">
              Failed to load assignments. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Suspense fallback={<AssignmentListSkeleton />}>
          <AssignmentList assignments={assignments} />
        </Suspense>
      )}
    </div>
  );
};

export default AssignmentPage;
