import { z } from "zod";

export const tutorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Invalid email address."),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  age: z.coerce.number().min(18, "You must be at least 18 years old.").max(100),
  address: z.string().min(10, "Please enter your current address."),
  locations: z.string().min(3, "Please enter at least one location."),
  education: z.string().min(2, "Please specify your educational qualification."),
  marks10: z.string().min(1, "Please provide a link to your 10th marksheet."),
  marks12: z.string().min(1, "Please provide a link to your 12th marksheet."),
  idProof: z.string().min(1, "Please provide a link to your ID proof photo."),
  subjects: z.string().min(2, "Please list at least one subject you can teach."),
});

export const studentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    parentPhone: z.string().min(10, "Please enter a valid 10-digit phone number."),
    parentEmail: z.string().email("Invalid parent/guardian email address."),
    grade: z.string().min(1, "Please enter a grade level."),
    board: z.string().min(2, "Please enter the education board (e.g., CBSE, State)."),
    address: z.string().min(10, "Please enter your full address."),
    gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
    school: z.string().min(2, "Please enter the school name."),
    subjects: z.string().min(2, "Please list at least one subject or skill."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
