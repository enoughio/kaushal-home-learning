import { z } from "zod";

const NAME_REGEX = /^[A-Za-z ,'.-]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

export const studentRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(NAME_REGEX, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(NAME_REGEX, "Last name contains invalid characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select a gender",
  }),
  DateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => !isNaN(new Date(date).getTime()), "Invalid date format")
    .refine((date) => new Date(date) <= new Date(), "Date cannot be in the future"),
  grade: z.string().min(1, "Grade is required"),
  schoolName: z.string().min(2, "School name is required"),
  SchoolBoard: z.string().min(1, "School board is required"),
  parentName: z
    .string()
    .min(2, "Parent name is required")
    .regex(NAME_REGEX, "Parent name contains invalid characters"),
  parentPhone: z
    .string()
    .regex(PHONE_REGEX, "Invalid phone number format"),
  parentEmail: z
    .string()
    .email("Invalid email format")
    .toLowerCase(),
  emergencyNumber: z
    .string()
    .regex(PHONE_REGEX, "Invalid emergency contact number format"),
  houseNumber: z.string().min(1, "House number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  pincode: z
    .string()
    .regex(PINCODE_REGEX, "Pincode must be a 6 digit number"),
  subjectsInterested: z
    .array(z.string())
    .min(1, "Please select at least one subject"),
  locationCoordinates: z.object({
    latitude: z
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude"),
    longitude: z
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude"),
  }),
  preferedTimeSlots: z
    .array(z.string())
    .min(1, "Please select at least one time slot"),
  aadharFile: z
    .instanceof(File, { message: "Aadhar file is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must not exceed 10MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
});

export type StudentRegistrationFormData = z.infer<typeof studentRegistrationSchema>;
