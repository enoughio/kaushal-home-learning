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
import { Edit2, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { editAssignmentSchema } from "@/helper/validation/assignmentSchema";
import { ZodError } from "zod";

interface EditAssignmentDialogProps {
  assignmentId: number;
  initialData: {
    title: string;
    subject: string;
    dueDate: string;
    description: string;
  };
}

const EditAssignmentDialog: React.FC<EditAssignmentDialogProps> = ({
  assignmentId,
  initialData,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState(initialData);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    setValidationErrors({});

    try {
      editAssignmentSchema.parse({
        title: formData.title || undefined,
        subject: formData.subject || undefined,
        dueDate: formData.dueDate || undefined,
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
      const updateData: Record<string, any> = {};

      if (formData.title !== initialData.title) {
        updateData.title = formData.title;
      }
      if (formData.subject !== initialData.subject) {
        updateData.subject = formData.subject;
      }
      if (formData.dueDate !== initialData.dueDate) {
        updateData.dueDate = formData.dueDate;
      }
      if (formData.description !== initialData.description) {
        updateData.description = formData.description;
      }

      if (Object.keys(updateData).length === 0) {
        toast("No changes to save", {
          icon: "ℹ️",
        });
        return;
      }

      const response = await fetch(
        `/api/teacher/assignments/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update assignment");
      }

      toast.success("Assignment updated successfully!");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update assignment";
      setError(message);
      toast.error(message);
      console.error("Error updating assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
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
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
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

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-subject">Subject</Label>
            <Input
              id="edit-subject"
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
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Assignment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentDialog;
