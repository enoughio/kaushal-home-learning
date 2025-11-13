import AssignmentCard from "./AssignmentCard";
import AssignmentsStats from "./AssignmentsStats";
import type { Assignment, ApiResponse, StudentApiAssignment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import myFetch from "@/lib/requestHelper";

// Server component: fetches assignments and stats from internal APIs and passes data to children
export default async function AssignmentList() {
  // defaults
  let assignments: Assignment[] = [];
  let stats = { pending: 0, submitted: 0, graded: 0 };

  try {
    const [assignRes, statsRes] = await Promise.all([
      myFetch("/api/student/assignments"),
      myFetch("/api/student/assignments/stats"),
    ]);

    if (assignRes.ok) {
      const json = (await assignRes.json()) as ApiResponse<{ assignments: StudentApiAssignment[] }>;
      const apiAssignments = json?.data?.assignments ?? [];
      assignments = apiAssignments.map((a) => {
        const mappedStatus =
          a.status === "ASSIGNED" ? "pending" : a.status === "SUBMITTED" ? "submitted" : a.status === "GRADED" ? "graded" : a.status.toLowerCase();

        const firstAttachment = a.attachments && a.attachments.length > 0 ? a.attachments[0] : null;

        return {
          id: String(a.id),
          title: a.title,
          description: a.description || "",
          subject: "",
          teacherId: a.teacherId ?? "",
          teacherName: "",
          dueDate: a.dueDate ?? "",
          status: mappedStatus as Assignment["status"],
          grade: a.submission?.grade ?? undefined,
          submittedAt: a.submission?.submittedAt ?? undefined,
          attachmentUrl: firstAttachment?.fileUrl ?? undefined,
          attachmentName: firstAttachment?.fileName ?? undefined,
          submissionFileUrl: a.submission?.fileUrl ?? undefined,
          submissionFileName: a.submission?.fileName ?? undefined,
        } as Assignment;
      });
    } else {
      console.error("Failed to fetch assignments", assignRes.status);
    }

    if (statsRes.ok) {
      const sjson = (await statsRes.json()) as ApiResponse<{ pending: number; submitted: number; graded: number }>;
      if (sjson?.data) {
        stats = {
          pending: sjson.data.pending ?? 0,
          submitted: sjson.data.submitted ?? 0,
          graded: sjson.data.graded ?? 0,
        };
      }
    } else {
      console.error("Failed to fetch assignment stats", statsRes.status);
    }
  } catch (err) {
    console.error("Error fetching assignments or stats", err);
  }

  const pendingAssignments = stats.pending ?? assignments.filter((a) => a.status === "pending").length;
  const submittedAssignments = stats.submitted ?? assignments.filter((a) => a.status === "submitted").length;
  const gradedAssignments = stats.graded ?? assignments.filter((a) => a.status === "graded").length;

  return (
    <div className="space-y-6">
      <AssignmentsStats
        pendingCount={pendingAssignments}
        submittedCount={submittedAssignments}
        gradedCount={gradedAssignments}
      />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments available</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            // Pass assignment data down to client component that handles submission
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))
        )}
      </div>
    </div>
  );
}