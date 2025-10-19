import { sql } from "@/database/db";
import { EmailFormate } from "@/helper/mail/formateVelidator";
import { NextResponse, NextRequest } from "next/server";
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
import { TeacherRegistrationData } from "@/lib/api.types";

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
  tenthPercentage: "tenth_percentage",
  twelfthPercentage: "twelfth_percentage",
  marksheetUrlTenth: "marksheet_url_tenth",
  marksheetUrlTwelfth: "marksheet_url_twelfth",
  aadharUrl: "aadhar_url",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ✅ Extract each field from FormData
    const teacherData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      gender: formData.get("gender") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      houseNumber: formData.get("houseNumber") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      pincode: formData.get("pincode") as string,
      qualification: formData.get("qualification") as string,
      tenthPercentage: Number(formData.get("tenthPercentage")) as number,
      twelfthPercentage: Number(formData.get("twelfthPercentage")) as number,
      marksheetTenth: formData.get("marksheetTenth") as File, // 📄 actual File object
      marksheetTwelfth: formData.get("marksheetTwelfth") as File,
      aadhar: formData.get("aadhar") as File,
    } as TeacherRegistrationData;

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
      marksheetTenth,
      marksheetTwelfth,
      aadhar,
    } = sanitized as TeacherRegistrationData;

    // verify required fields
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
      !marksheetTenth ||
      !marksheetTwelfth ||
      !aadhar
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
            "Validation failed, Please enter a valid percentage between 0 to 100",
          code: "400",
        },
        { status: 400 }
      );
    }

    // Upload files to cloudinary

    // if (
    //   !isValidUrl(marksheetUrlTenth) ||
    //   !isValidUrl(marksheetUrlTwelfth) ||
    //   !isValidUrl(aadharUrl)
    // ) {
    //   return NextResponse.json(
    //     {
    //       error: "INVALID_URL_FORMAT",
    //       message: "Validation failed, Please enter a valid url",
    //       code: "400",
    //     },
    //     { status: 400 }
    //   );
    // }

    const teacherDataWithRole = {
      ...sanitized,
      role: "teacher",
    };

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

  // Send successful account creation male

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
