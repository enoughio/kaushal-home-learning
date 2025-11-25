import { z } from "zod";

const NAME_REGEX = /^[A-Za-z ,'.-]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

export const teacherRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name is too long")
    .regex(NAME_REGEX, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name is too long")
    .regex(NAME_REGEX, "Last name contains invalid characters"),
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email is too long")
    .toLowerCase(),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .regex(PHONE_REGEX, "Invalid phone number format"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => !isNaN(new Date(date).getTime()), "Invalid date format")
    .refine((date) => new Date(date) <= new Date(), "Date cannot be in the future"),
  houseNumber: z.string().min(1, "House number is required").max(50, "House number is too long"),
  street: z.string().min(1, "Street is required").max(2000, "Street is too long"),
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  pincode: z
    .string()
    .regex(PINCODE_REGEX, "Pincode must be a 6 digit number"),
  qualification: z.string().min(1, "Qualification is required").max(500, "Qualification is too long"),
  tenthPercentage: z
    .string()
    .min(1, "10th percentage is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Percentage must be between 0 and 100"),
  twelfthPercentage: z
    .string()
    .min(1, "12th percentage is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Percentage must be between 0 and 100"),
  marksheetTenth: z
    .instanceof(File, { message: "10th marksheet is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must not exceed 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
  marksheetTwelfth: z
    .instanceof(File, { message: "12th marksheet is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must not exceed 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
  aadhar: z
    .instanceof(File, { message: "Aadhar card is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must not exceed 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
});

export type TeacherRegistrationFormData = z.infer<typeof teacherRegistrationSchema>;
