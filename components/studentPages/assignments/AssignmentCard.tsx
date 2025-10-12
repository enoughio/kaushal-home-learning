"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, FileText, Upload, CheckCircle } from "lucide-react";
import type { Assignment } from "@/lib/types";

type Props = {
  assignment: Assignment;
};

export default function AssignmentCard({ assignment }: Props) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "submitted":
        return "secondary";
      case "graded":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return <FileText className="h-4 w-4" />;
      case "submitted":
        return <Upload className="h-4 w-4" />;
      case "graded":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    setSubmitting(assignmentId);
    try {
      // Simulate a submission delay. In future replace with API call.
      await new Promise((resolve) => setTimeout(resolve, 700));
      // Optionally we could persist form data in client storage here during dev.
      router.refresh();
    } catch (err) {
      console.error("Failed to submit assignment", err);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        {assignment.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {assignment.teacherName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {assignment.dueDate}
                        </div>
                        {assignment.attachmentUrl && (
                          <a
                            className="underline underline-offset-2"
                            href={assignment.attachmentUrl}
                            download={assignment.attachmentName || undefined}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download Attachment
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                      {assignment.grade && <Badge variant="outline">{assignment.grade}%</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Subject: {assignment.subject}</p>
                      <p className="text-muted-foreground mt-1">{assignment.description}</p>
                    </div>

                    {assignment.status === "pending" && (
                      <div className="space-y-3 border-t border-border pt-4">
                        <div>
                          <label className="text-sm font-medium">Your Submission</label>
                          <Textarea
                            placeholder="Write your answer or upload your work..."
                            value={submissions[assignment.id] || ""}
                            onChange={(e) => setSubmissions((prev) => ({ ...prev, [assignment.id]: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFiles((prev) => ({ ...prev, [assignment.id]: file }));
                            }}
                          />
                          {files[assignment.id]?.name && (
                            <span className="text-sm text-muted-foreground">
                              Selected: {files[assignment.id]?.name}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleSubmit(assignment.id)}
                          disabled={
                            submitting === assignment.id ||
                            !(submissions[assignment.id]?.trim() || files[assignment.id])
                          }
                        >
                          {submitting === assignment.id ? "Submitting..." : "Submit Assignment"}
                        </Button>
                      </div>
                    )}

                    {assignment.status === "submitted" && assignment.submittedAt && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Submitted on {assignment.submittedAt} - Waiting for review
                        </p>
                        {assignment.submissionFileUrl && (
                          <p className="text-sm mt-1">
                            Uploaded file:{" "}
                            <a
                              href={assignment.submissionFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-2"
                              download={assignment.submissionFileName || undefined}
                            >
                              {assignment.submissionFileName || "Download"}
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {assignment.status === "graded" && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Grade: {assignment.grade}%</span>
                          {assignment.submittedAt && (
                            <span className="text-muted-foreground ml-2">(Submitted on {assignment.submittedAt})</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

  );
}
