import { sql } from "@/database/db";
import { EmailFormate } from "@/helper/mail/formateVelidator";
import { NextResponse, NextRequest } from "next/server";
import { Gender } from "../student/route";
import {
  FieldLimits,
  isValidIndianPhone,
  isValidIndianPincode,
  isValidISODate,
  isValidPercentage,
  isValidUrl,
  mapToDbColumns,
  sanitizeAndValidate,
} from "@/helper/validation";

interface TeacherRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  role: string;
  dateOfBirth: string;
  houseNumber: string;
  street: string;
  city: string;
  pincode: string;
  qualification: string;
  tenthPercentage: number;
  twelfthPercentage: number;
  marksheetUrlTenth: string;
  marksheetUrlTwelfth: string;
  aadharUrl: string;
}

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
  marksheetUrlTenth: 500,
  marksheetUrlTwelfth: 500,
  aadharUrl: 200,
};

// Object key -> DB column mapping
// As of now only fields which are required for temp_users are added here, more fields can be added later when used for permanent users
const usersFieldMap: Record<string, string> = {
  email: "email",
  firstName: "first_name",
  lastName: "last_name",
  role: "role",
  dateOfBirth: "date_of_birth",
  gender: "gender",
  phone: "phone",
  houseNumber: "house_number",
  street: "street",
  city: "city",
  pincode: "pincode",
};

const teachersFieldMap: Record<string, string> = {
  qualification: "qualification",
  aadharUrl: "aadhar_url",
  tenthPercentage: "tenth_percentage",
  twelfthPercentage: "twelfth_percentage",
  marksheetUrlTenth: "marksheet_url_tenth",
  marksheetUrlTwelfth: "marksheet_url_twelfth",
};

export async function POST(req: NextRequest) {
  try {
    const teacherData = await req.json();

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
      marksheetUrlTenth,
      marksheetUrlTwelfth,
      aadharUrl,
    } = teacherData as TeacherRegistrationData;

    //   verify required fields

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !houseNumber ||
      !street ||
      !city ||
      !pincode ||
      !qualification ||
      !tenthPercentage ||
      !twelfthPercentage ||
      !marksheetUrlTenth ||
      !marksheetUrlTwelfth ||
      !aadharUrl
    ) {
      return NextResponse.json(
        {
          error: "MISSING_REQUIRED_FEILD",
          message: "Missing required fields",
          code: "400",
        },
        { status: 400 }
      );
    }

    // Validate max lengths dynamically
    const { sanitized, error } = sanitizeAndValidate(
      teacherData,
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

    let existingUser = await sql`
    SELECT email FROM temp_users
    WHERE email= ${email};
  `;
    // If user not present in temp_users then check in users otherwise return conflict error
    if (existingUser.length == 0) {
      existingUser = await sql`
    SELECT email FROM users
    WHERE email= ${email};
  `;
    }

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: "USER_ALREADY_EXIST",
          message: "A user already registered with this email",
          code: "409",
        },
        {
          status: 409,
        }
      );
    }

    if (!["male", "female", "other"].includes(sanitized.gender)) {
      return NextResponse.json(
        {
          error: "INVALID_GENDER",
          message: "Validation failed, Please enter a valid gender",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (!isValidISODate(sanitized.dateOfBirth)) {
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
    if (!isValidIndianPhone(sanitized.phone)) {
      return NextResponse.json(
        {
          error: "INVALID_PHONE_FORMAT",
          message: "Validation failed, Please enter a valid phone number",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (!isValidIndianPincode(sanitized.pincode)) {
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
      !isValidPercentage(sanitized.tenthPercentage) ||
      !isValidPercentage(sanitized.twelfthPercentage)
    ) {
      return NextResponse.json(
        {
          error: "INVALID_PERCENTAGE",
          message:
            "Validation failed, Please enter a valid percentage between 0 to 100",
          code: "400",
        },
        { status: 400 }
      );
    }

    if (
      !isValidUrl(sanitized.marksheetUrlTenth) ||
      !isValidUrl(sanitized.marksheetUrlTwelfth) ||
      !isValidUrl(sanitized.aadharUrl)
    ) {
      return NextResponse.json(
        {
          error: "INVALID_URL_FORMAT",
          message: "Validation failed, Please enter a valid url",
          code: "400",
        },
        { status: 400 }
      );
    }

    const teacherDataWithRole = {
      ...sanitized,
      role: "teacher",
    } as TeacherRegistrationData;

    // save some fields data in temp_users
    const userdbData = mapToDbColumns(teacherDataWithRole, usersFieldMap);

    const tempUser = await sql`
    INSERT INTO temp_users
      ${sql(userdbData)}
    RETURNING *;
  `;

    // save remaining fields data in temp_teachers
    const teacherdbData = mapToDbColumns(teacherDataWithRole, teachersFieldMap);

    const referencedTeacherData = {
      ...teacherdbData,
      temp_user_id: tempUser[0].id as number,
    };

    const tempTeacher = await sql`
    INSERT INTO temp_teachers
      ${sql(referencedTeacherData)}
    RETURNING *;
  `;

    return NextResponse.json(
      {
        user: { tempUser: tempUser[0], tempTeacher: tempTeacher[0] },
        message: "You are successfully registered in the platform",
        code: "200",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Internal server error",
        code: "500",
        details: { error },
      },
      { status: 500 }
    );
  }
}
