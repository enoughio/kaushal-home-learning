import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";

import { EmailFormate } from "@/helper/mail/formateVelidator";
import { NextResponse, NextRequest } from "next/server";
import {
  FieldLimits,
  isValidIndianPhone,
  isValidIndianPincode,
  isValidISODate,
  isValidPercentage,
  sanitizeAndValidate,
  validateFiles,
  validateRequiredFields,
} from "@/helper/validation";
import { SanitizedTeacherRegistData, TeacherFiles } from "@/lib/api.types";
import { uploadFile } from "@/helper/cloudinaryActions";
import { sendWelcomeEmail } from "@/helper/mail/emailHelpers";

const teacherRequiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "gender",
  "dateOfBirth",
  "houseNumber",
  "street",
  "city",
  "pincode",
  "qualification",
  "tenthPercentage",
  "twelfthPercentage",
  "marksheetTenth",
  "marksheetTwelfth",
  "aadhar",
];

// Define max lengths for TeacherRegistrationData fields
export const registrationFieldLimits: FieldLimits = {
  firstName: 100,
  lastName: 100,
  email: 255,
  phone: 20,
  gender: 20,
  dateOfBirth: 10,
  houseNumber: 50,
  street: 200,
  city: 100,
  pincode: 10,
  qualification: 500,
  tenthPercentage: 5,
  twelfthPercentage: 5,
  aadharUrl: 200,
};

// Object key -> DB column mapping
// As of now only fields which are required for temp_users are added here, more fields can be added later when used for permanent users
// const usersFieldMap: Record<string, string> = {
//   email: "email",
//   firstName: "first_name",
//   lastName: "last_name",
//   role: "role",
//   dateOfBirth: "date_of_birth",
//   gender: "gender",
//   phone: "phone",
//   houseNumber: "house_number",
//   street: "street",
//   city: "city",
//   pincode: "pincode",
// };

// const teachersFieldMap: Record<string, string> = {
//   qualification: "qualification",
//   tenthPercentage: "tenth_percentage",
//   twelfthPercentage: "twelfth_percentage",
//   marksheetUrlTenth: "marksheet_url_tenth",
//   marksheetUrlTwelfth: "marksheet_url_twelfth",
//   aadharUrl: "aadhar_url",
// };

export async function POST(req: NextRequest) {
  try {
    let formData: FormData;

    try {
      formData = await req.formData();
    } catch (error) {
      return NextResponse.json(
        {
          error: "INVALID_FORM_DATA",
          message: "Unable to parse form data payload",
          code: "400",
        },
        { status: 400 }
      );
    }

    const rawJson = formData.get("json");

    if (!rawJson || typeof rawJson !== "string") {
      return NextResponse.json(
        {
          error: "MISSING_JSON",
          message: "Student details are required in the json field",
        },
        { status: 400 }
      );
    }

    let payload;
    try {
      payload = JSON.parse(rawJson);
    } catch (error) {
      return NextResponse.json(
        {
          error: "INVALID_JSON",
          message: "The json field must be valid JSON",
          code: "400",
        },
        { status: 400 }
      );
    }

    const teacherFiles = {
      marksheetTenth: formData.get("marksheetTenthFile"), // 📄 actual File object
      marksheetTwelfth: formData.get("marksheetTwelfthFile"),
      aadhar: formData.get("aadharFile"),
    };

    // Validation for files
    const { error: fileError, message } = validateFiles(teacherFiles, 5); // Pass size directly in MB

    if (fileError) {
      return NextResponse.json(
        {
          error: fileError,
          message,
          Code: "400",
        },
        { status: 400 }
      );
    }

    // Validate max lengths dynamically for all fields other than files
    const { sanitized, error } = sanitizeAndValidate(
      payload,
      registrationFieldLimits
    );

    if (error) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: `Validation failed, ${error.message}`,
          code: "400",
          details: { error },
        },
        { status: 400 }
      );
    }

    // verify all required fields
    const { errMessage } = validateRequiredFields(
      { ...sanitized, ...teacherFiles },
      teacherRequiredFields
    );

    if (errMessage) {
      return NextResponse.json(
        { error: "MISSING_REQUIRED_FIELD", message: errMessage, code: "400" },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      houseNumber,
      street,
      city,
      pincode,
      qualification,
      tenthPercentage,
      twelfthPercentage,
    } = sanitized as SanitizedTeacherRegistData;

    if (EmailFormate(email) === false) {
      return NextResponse.json(
        {
          error: "INVALID_EMAIL_FORMAT",
          message: "Invalid email format",
          code: "400",
        },
        {
          status: 400,
        }
      );
    }

    if (!["male", "female", "other"].includes(gender)) {
      return NextResponse.json(
        {
          error: "INVALID_GENDER",
          message: "Validation failed, Please enter a valid gender",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (!isValidISODate(dateOfBirth)) {
      return NextResponse.json(
        {
          error: "INVALID_DATE_FORMAT",
          message: "Validation failed, Please enter a valid date of birth",
          code: "400",
        },
        { status: 400 }
      );
    }

    // Assuming only Indian users
    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        {
          error: "INVALID_PHONE_FORMAT",
          message: "Validation failed, Please enter a valid phone number",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (!isValidIndianPincode(pincode)) {
      return NextResponse.json(
        {
          error: "INVALID_PINCODE_FORMAT",
          message: "Validation failed, Please enter a valid pincode",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (
      !isValidPercentage(tenthPercentage) ||
      !isValidPercentage(twelfthPercentage)
    ) {
      return NextResponse.json(
        {
          error: "INVALID_PERCENTAGE",
          message:
            "Validation failed, Please enter a valid percentage between 0 and 100",
          code: "400",
        },
        { status: 400 }
      );
    }
    // First check in temp_users
    let existingUser = await prisma.temp_users.findUnique({
      where: { email },
      select: { id: true },
    });
    // If confirmed not present in temp_users then only check in permanent users
    if (!existingUser) {
      existingUser = await prisma.users.findUnique({
        where: { email },
        select: { id: true },
      });
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error: "EMAIL_ALREADY_REGISTERED",
          message: "An account with this email already exists",
          code: "409",
        },
        { status: 409 }
      );
    }

    // Upload files to cloudinary
    let uploadedFiles: Record<
      TeacherFiles,
      {
        url: string;
        publicId: string;
      }
    >;
    try {
      const entries = Object.entries(teacherFiles as Record<string, File>);

      const uploadResults = await Promise.all(
        entries.map(async ([key, file]) => {
          const result = await uploadFile(file, key);

          if (!result?.url || !result?.public_id) {
            throw new Error(`Failed to upload ${key}`);
          }
          // console.log(result.url);
          return [
            key,
            { url: result.url, publicId: result.public_id },
          ] as const;
        })
      );

      // Convert array of entries back to an object
      uploadedFiles = Object.fromEntries(uploadResults) as Record<
        TeacherFiles,
        { url: string; publicId: string }
      >;
      // Success: uploadedFiles contains all URLs and publicIds
    } catch (err) {
      return NextResponse.json(
        {
          error: "UPLOAD_FAILED",
          message: (err as Error).message,
          code: "500",
        },
        { status: 500 }
      );
    }

    const userId = await prisma.$transaction(async (tx) => {
      // Insert some fields data in temp_users
      const createdUser = await tx.temp_users.create({
        data: {
          email,
          role: "teacher",
          first_name: firstName,
          last_name: lastName,
          date_of_birth: new Date(dateOfBirth),
          gender,
          phone,
          house_number: houseNumber,
          street,
          city,
          pincode,
        },
        select: { id: true },
      });

      // Insert remaining fields data in temp_teachers
      await tx.temp_teachers.create({
        data: {
          temp_user_id: createdUser.id,
          qualification,
          tenth_percentage: Number(tenthPercentage),
          twelfth_percentage: Number(twelfthPercentage),
          marksheet_url_tenth: uploadedFiles.marksheetTenth.url,
          marksheet_url_tenth_public_id: uploadedFiles.marksheetTenth.publicId,
          marksheet_url_twelfth: uploadedFiles.marksheetTenth.url,
          marksheet_url_twelfth_public_id:
            uploadedFiles.marksheetTwelfth.publicId,
          aadhar_url: uploadedFiles.aadhar.url,
          aadhar_url_public_id: uploadedFiles.aadhar.publicId,
          // add more teacher-specific fields here if needed
        },
      });

      return createdUser.id;
    });

    // Send successful account creation mail
    try {
      await sendWelcomeEmail(email, {
        name: firstName,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "ERROR_SENDING_MAIL",
          message: "Email sending failed",
          details: { error },
          code: "500",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        userId,
        message:
          "Registration successful. Our team will connect with you for further process.",
        code: "201",
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "CONFLICT",
          message: "A user with the provided details already exists",
          code: "409",
        },
        { status: 409 }
      );
    }

    console.error("Teacher registration error", error);
    return NextResponse.json(
      {
        error: "REGISTRATION_ERROR",
        message:
          "We were unable to process the registration. Please try again later.",
        code: "500",
        details: { error },
      },
      { status: 500 }
    );
  }
}
