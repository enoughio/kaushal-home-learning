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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { TeacherStudentData } from "@/lib/types";
import { createAssignmentSchema } from "@/helper/validation/assignmentSchema";
import { ZodError } from "zod";

interface NewAssignmentDialogProps {
  onAssignmentCreated?: () => void;
}

const NewAssignmentDialog: React.FC<NewAssignmentDialogProps> = ({
  onAssignmentCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentListLoading, setStudentListLoading] = useState(false);
  const [students, setStudents] = useState<TeacherStudentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    title: "",
    studentId: "",
    subject: "",
    dueDate: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // Fetch students when dialog opens
  React.useEffect(() => {
    if (open && students.length === 0) {
      fetchStudents();
    }
  }, [open, students.length]);

  const fetchStudents = async () => {
    setStudentListLoading(true);
    try {
      const response = await fetch("/api/teacher/my-students");
      if (!response.ok) {
        setError("Failed to load students");
        return;
      }
      const data = await response.json();
      setStudents(data.data?.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Error loading students");
    } finally {
      setStudentListLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    setValidationErrors({});

    try {
      createAssignmentSchema.parse({
        title: formData.title,
        studentId: formData.studentId ? Number(formData.studentId) : 0,
        subject: formData.subject,
        dueDate: formData.dueDate,
        description: formData.description || null,
      });
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue: any) => {
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
      const formDataToSend = new FormData();

      formDataToSend.append(
        "json",
        JSON.stringify({
          title: formData.title,
          studentId: Number(formData.studentId),
          subject: formData.subject,
          dueDate: formData.dueDate,
          description: formData.description || null,
        })
      );

      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create assignment"
        );
      }

      toast.success("Assignment created successfully!");
      setFormData({
        title: "",
        studentId: "",
        subject: "",
        dueDate: "",
        description: "",
      });
      setFile(null);
      setOpen(false);
      onAssignmentCreated?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create assignment";
      setError(message);
      toast.error(message);
      console.error("Error creating assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Assignment title"
              className="bg-input"
              disabled={loading}
            />
            {validationErrors.title && (
              <p className="text-xs text-destructive">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Student Field */}
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            {studentListLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading students...
                </span>
              </div>
            ) : (
              <Select
                value={formData.studentId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, studentId: value }))
                }
                disabled={loading}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.length === 0 ? (
                    <SelectItem value="no-students" disabled>
                      No students assigned
                    </SelectItem>
                  ) : (
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.user.first_name} {student.user.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
            {validationErrors.studentId && (
              <p className="text-xs text-destructive">
                {validationErrors.studentId}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="e.g., Mathematics, Science"
              className="bg-input"
              disabled={loading}
            />
            {validationErrors.subject && (
              <p className="text-xs text-destructive">
                {validationErrors.subject}
              </p>
            )}
          </div>

          {/* Due Date Field */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="bg-input"
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
            />
            {validationErrors.dueDate && (
              <p className="text-xs text-destructive">
                {validationErrors.dueDate}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Assignment description and instructions"
              className="bg-input min-h-24"
              disabled={loading}
            />
            {validationErrors.description && (
              <p className="text-xs text-destructive">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* File Attachment */}
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            <Input
              id="attachment"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="bg-input"
              disabled={loading}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {file && file.size > 20 * 1024 * 1024 && (
              <p className="text-xs text-destructive">
                File size exceeds 20MB limit
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || studentListLoading || students.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Assignment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssignmentDialog;
