"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  User,
  Calendar,

  Loader2,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import GradeSubmissionDialog from "./GradeSubmissionDialog";
import EditAssignmentDialog from "./EditAssignmentDialog"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface AssignmentListProps {
  assignments: Assignment[];
}

const getStatusColor = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "ASSIGNED":
      return "secondary";
    case "SUBMITTED":
      return "outline";
    case "GRADED":
      return "default";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ASSIGNED":
      return <FileText className="h-4 w-4" />;
    case "SUBMITTED":
      return <Clock className="h-4 w-4" />;
    case "GRADED":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
}) => {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (assignmentId: number) => {
    setDeleting(assignmentId);
    try {
      const response = await fetch(
        `/api/teacher/assignments/${assignmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }

      toast.success("Assignment deleted successfully");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    } finally {
      setDeleting(null);
    }
  };

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No assignments created yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first assignment to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const submission =
          assignment.assignment_submissions.length > 0
            ? assignment.assignment_submissions[0]
            : null;
        const studentName = `${assignment.student.user.first_name} ${assignment.student.user.last_name}`;

        return (
          <Card key={assignment.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5" />
                    {assignment.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {studentName}
                    </div>
                    {assignment.subject && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {assignment.subject}
                      </span>
                    )}
                    {assignment.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(assignment.due_date).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusColor(assignment.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </span>
                  </Badge>
                  {submission?.grade && (
                    <Badge variant="outline" className="bg-green-50">
                      Grade: {submission.grade}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            {assignment.description && (
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {assignment.description}
                </p>
              </CardContent>
            )}

            {/* Attachments */}
            {assignment.assignment_attachments.length > 0 && (
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Attachments:
                  </p>
                  <div className="space-y-1">
                    {assignment.assignment_attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.file_url}
                        download={att.file_name || "attachment"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline block"
                      >
                        ↓ {att.file_name}
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}

            {/* Submission Details */}
            {submission && (
              <CardContent className="pb-3 border-t pt-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium">Submission:</p>
                  {submission.submission_text && (
                    <div className="bg-muted p-2 rounded text-sm max-h-32 overflow-y-auto">
                      <p className="whitespace-pre-wrap">
                        {submission.submission_text}
                      </p>
                    </div>
                  )}
                  {submission.feedback && (
                    <div className="bg-blue-50 p-2 rounded text-sm border border-blue-200">
                      <p className="font-medium text-xs mb-1">Feedback:</p>
                      <p>{submission.feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}

            {/* Actions */}
            <CardContent className="flex gap-2 pt-3 border-t flex-wrap">
              {assignment.status === "SUBMITTED" && !submission?.grade && (
                <GradeSubmissionDialog
                  assignmentId={assignment.id}
                  studentId={assignment.student_id}
                  assignmentTitle={assignment.title}
                />
              )}

              <EditAssignmentDialog
                assignmentId={assignment.id}
                initialData={{
                  title: assignment.title,
                  subject: assignment.subject || "",
                  dueDate: assignment.due_date
                    ? new Date(assignment.due_date).toISOString().split("T")[0]
                    : "",
                  description: assignment.description || "",
                }}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The assignment <strong>{assignment.title}</strong> will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(assignment.id)}
                      disabled={deleting === assignment.id}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {deleting === assignment.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssignmentList;
