import AssignmentCard from "./AssignmentCard";
import AssignmentsStats from "./AssignmentsStats";
import type { Assignment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

// Server component: fetches assignments (placeholder) and passes data to children
export default async function AssignmentList() {
  // Placeholder student id for now — replace with real user id later
  const studentId = "2";

  // Placeholder assignments (will be replaced with API response later)
  const assignments: Assignment[] = [
    {
      id: "a1",
      title: "Math: Algebra Worksheet",
      description: "Practice problems on linear equations",
      subject: "Mathematics",
      teacherId: "t1",
      teacherName: "Ms. Rao",
      dueDate: "2025-10-25",
      status: "pending",
      attachmentUrl: "https://example.com/assignments/a1.pdf",
      attachmentName: "algebra-worksheet.pdf",
    },
    {
      id: "a2",
      title: "Science: Plant Cell Diagram",
      description: "Label the parts of a plant cell and submit a scanned copy",
      subject: "Science",
      teacherId: "t2",
      teacherName: "Mr. Singh",
      dueDate: "2025-10-20",
      status: "submitted",
      submittedAt: "2025-10-10",
      submissionFileUrl: "https://example.com/submissions/a2-student.pdf",
      submissionFileName: "plant-cell-scan.pdf",
    },
    {
      id: "a3",
      title: "English: Reading Comprehension",
      description: "Read the passage and answer the questions",
      subject: "English",
      teacherId: "t3",
      teacherName: "Mrs. Patel",
      dueDate: "2025-10-18",
      status: "graded",
      grade: 92,
      submittedAt: "2025-10-12",
    },
  ];

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter((a) => a.status === "submitted");
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  return (
    <div className="space-y-6">
      <AssignmentsStats
        pendingCount={pendingAssignments.length}
        submittedCount={submittedAssignments.length}
        gradedCount={gradedAssignments.length}
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