export type Role = "male" | "female" | "other";

export type Gender = "male" | "female" | "other";

export interface SanitizedTeacherRegistData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  role?: Role;
  dateOfBirth: string;
  houseNumber: string;
  street: string;
  city: string;
  pincode: string;
  qualification: string;
  tenthPercentage: number;
  twelfthPercentage: number;
  marksheetTenth?: File;
  marksheetTwelfth?: File;
  aadhar: File;
}

export type TeacherFiles = "marksheetTenth" | "marksheetTwelfth" | "aadhar";
