import { Gender } from "@/app/api/register/student/route";

type Role = "male" | "female" | "other";

export interface TeacherRegistrationData {
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
  marksheetTenth: File;
  marksheetTwelfth: File;
  aadhar: File;
}
