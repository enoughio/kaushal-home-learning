import { z } from "zod";

// Create Assignment Schema
export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  studentId: z.number().int("Student ID must be an integer").positive("Student ID must be positive"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Due date must be a valid date")
    .refine((date) => new Date(date) > new Date(), "Due date must be in the future"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .nullable(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

// Edit Assignment Schema
export const editAssignmentSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
    subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters").optional(),
    dueDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Due date must be a valid date")
      .optional(),
    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .optional()
      .nullable(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided for update",
  });

export type EditAssignmentInput = z.infer<typeof editAssignmentSchema>;

// Grade Assignment Schema
export const gradeAssignmentSchema = z.object({
  studentId: z
    .string()
    .transform((id) => Number(id))
    .refine((id) => !isNaN(id) && id > 0, "Invalid student ID"),
  grade: z
    .string()
    .min(1, "Grade is required")
    .max(5, "Grade must be a letter grade (A, B, C, D, F)")
    .refine((grade) => /^[A-F]$/.test(grade.toUpperCase()), "Grade must be A, B, C, D, or F"),
  feedback: z
    .string()
    .min(1, "Feedback is required")
    .max(1000, "Feedback must be less than 1000 characters"),
});

export type GradeAssignmentInput = z.infer<typeof gradeAssignmentSchema>;

// Assignment ID Schema
export const assignmentIdSchema = z
  .string({ message: "Assignment ID required" })
  .transform((id) => {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid assignment ID");
    }
    return parsedId;
  });

export type AssignmentId = z.infer<typeof assignmentIdSchema>;
