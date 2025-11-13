"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GraduationCap, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { gradeAssignmentSchema } from "@/helper/validation/assignmentSchema";
import { ZodError } from "zod";
import type { ZodIssue } from "zod";

interface GradeSubmissionDialogProps {
  assignmentId: number;
  studentId: number;
  assignmentTitle: string;
}

const GradeSubmissionDialog: React.FC<GradeSubmissionDialogProps> = ({
  assignmentId,
  studentId,
  assignmentTitle,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    grade: "",
    feedback: "",
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    setValidationErrors({});

    try {
      gradeAssignmentSchema.parse({
        studentId: studentId.toString(),
        grade: formData.grade,
        feedback: formData.feedback,
      });
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue: ZodIssue) => {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/teacher/assignments/${assignmentId}/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId.toString(),
            grade: formData.grade,
            feedback: formData.feedback,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit grade");
      }

      toast.success("Assignment graded successfully!");
      setFormData({ grade: "", feedback: "" });
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit grade";
      setError(message);
      toast.error(message);
      console.error("Error grading assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <GraduationCap className="h-4 w-4 mr-2" />
          Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Grade Assignment</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">Assignment:</span> {assignmentTitle}
            </p>
          </div>

          {/* Grade Field */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select
              value={formData.grade}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, grade: value }))
              }
              disabled={loading}
            >
              <SelectTrigger className="bg-input">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A (Excellent)</SelectItem>
                <SelectItem value="B">B (Good)</SelectItem>
                <SelectItem value="C">C (Average)</SelectItem>
                <SelectItem value="D">D (Below Average)</SelectItem>
                <SelectItem value="F">F (Fail)</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.grade && (
              <p className="text-xs text-destructive">
                {validationErrors.grade}
              </p>
            )}
          </div>

          {/* Feedback Field */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  feedback: e.target.value,
                }))
              }
              placeholder="Provide detailed feedback for the student"
              className="bg-input min-h-24"
              disabled={loading}
            />
            {validationErrors.feedback && (
              <p className="text-xs text-destructive">
                {validationErrors.feedback}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Grade"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeSubmissionDialog;
