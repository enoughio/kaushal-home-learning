import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, User, Calendar } from "lucide-react";

// Placeholder assignments data
const assignments = [
  {
    id: 1,
    title: "Math Homework",
    studentName: "John Doe",
    dueDate: "2024-06-10",
    status: "assigned",
    subject: "Math",
    description: "Complete exercises 1-10",
    grade: null,
    feedback: "",
    submissionText: "",
  },
  {
    id: 2,
    title: "Science Project",
    studentName: "Jane Smith",
    dueDate: "2024-06-12",
    status: "submitted",
    subject: "Science",
    description: "Build a volcano model",
    grade: null,
    feedback: "",
    submissionText: "Here is my project submission.",
  },
  {
    id: 3,
    title: "History Essay",
    studentName: "Alice Johnson",
    dueDate: "2024-06-15",
    status: "graded",
    subject: "History",
    description: "Write about World War II",
    grade: 92,
    feedback: "Excellent work!",
    submissionText: "My essay on WW II.",
  },
];

const AssignmentList = async () => {
  // Later: fetch assignments from API here

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assignments created yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first assignment to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {assignment.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {assignment.studentName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {assignment.dueDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    assignment.status === "graded"
                      ? "bg-green-100 text-green-800"
                      : assignment.status === "submitted"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {assignment.status}
                  </span>
                  {assignment.grade && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      {assignment.grade}%
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Subject: {assignment.subject}</p>
                  <p className="text-muted-foreground mt-1">{assignment.description}</p>
                </div>
                {assignment.status === "submitted" && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div>
                      <p className="font-medium mb-2">Student Submission:</p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{assignment.submissionText}</p>
                      </div>
                    </div>
                  </div>
                )}
                {assignment.status === "graded" && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Graded: {assignment.grade}%</span>
                      {assignment.feedback && (
                        <span className="text-muted-foreground ml-2">• {assignment.feedback}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AssignmentList;
