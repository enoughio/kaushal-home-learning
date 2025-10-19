import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { calculateAge } from "@/helper/calculateAge";
import { EmailFormate } from "@/helper/mail/formateVelidator";
import { uploadFile } from "@/helper/cloudinaryActions";

type Gender = "male" | "female" | "other";

type ValidationIssue = {
  field: string;
  message: string;
};

const NAME_REGEX = /^[A-Za-z ,'.-]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;
const VALID_GENDERS: Gender[] = ["male", "female", "other"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function validationError(details: ValidationIssue[]) {
  return NextResponse.json(
    {
      error: "VALIDATION_ERROR",
      message: "Provided student details are invalid",
      details,
    },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch (error) {
    return NextResponse.json(
      {
        error: "INVALID_FORM_DATA",
        message: "Unable to parse form data payload",
      },
      { status: 400 }
    );
  }

  const rawJson = formData.get("json");
  const file = formData.get("aadharFile");

  if (!rawJson || typeof rawJson !== "string") {
    return NextResponse.json(
      {
        error: "MISSING_JSON",
        message: "Student details are required in the json field",
      },
      { status: 400 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawJson);
  } catch (error) {
    return NextResponse.json(
      {
        error: "INVALID_JSON",
        message: "The json field must be valid JSON",
      },
      { status: 400 }
    );
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      {
        error: "AADHAR_REQUIRED",
        message: "Aadhar file is required",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: "FILE_TOO_LARGE",
        message: "Aadhar file size must not exceed 5MB",
      },
      { status: 400 }
    );
  }

  const {
    firstName: rawFirstName,
    lasName,
    lastName: rawLastName,
    gender: rawGender,
    DateOfBirth: rawDob,
    grade: rawGrade,
    schoolName: rawSchoolName,
    SchoolBoard: rawSchoolBoard,
    schoolBoard: altSchoolBoard,
    parentName: rawParentName,
    parentPhone: rawParentPhone,
    ParentEmail: rawParentEmail,
    parentEmail: altParentEmail,
    emergencyNumber: rawEmergencyNumber,
    houseNumber: rawHouseNumber,
    street: rawStreet,
    city: rawCity,
    pincode: rawPincode,
    subjectsInterested: rawSubjects,
    locationCoordinates: rawLocation,
    preferedTimeSlots: rawPreferredSlots,
    preferredTimeSlots: altPreferredSlots,
  } = payload as Record<string, unknown>;

  const firstName = String(rawFirstName ?? "").trim();
  const lastName = String(rawLastName ?? lasName ?? "").trim();
  const gender = (rawGender ?? "") as Gender;
  const dobString = String(rawDob ?? "").trim();
  const grade = String(rawGrade ?? "").trim();
  const schoolName = String(rawSchoolName ?? "").trim();
  const schoolBoard = String(rawSchoolBoard ?? altSchoolBoard ?? "").trim();
  const parentName = String(rawParentName ?? "").trim();
  const parentPhone = String(rawParentPhone ?? "").trim();
  const parentEmail = String(rawParentEmail ?? altParentEmail ?? "").trim().toLowerCase();
  const emergencyNumber = String(rawEmergencyNumber ?? "").trim();
  const houseNumber = String(rawHouseNumber ?? "").trim();
  const street = String(rawStreet ?? "").trim();
  const city = String(rawCity ?? "").trim();
  const pincode = String(rawPincode ?? "").trim();

  const subjectsList = Array.isArray(rawSubjects)
    ? rawSubjects
    : typeof rawSubjects === "string"
      ? rawSubjects.split(",")
      : [];

  const preferredSlotsSource = Array.isArray(rawPreferredSlots)
    ? rawPreferredSlots
    : Array.isArray(altPreferredSlots)
      ? altPreferredSlots
      : typeof rawPreferredSlots === "string"
        ? rawPreferredSlots.split(",")
        : typeof altPreferredSlots === "string"
          ? altPreferredSlots.split(",")
          : [];

  const subjects = subjectsList
    .map((val) => String(val).trim())
    .filter((val) => val.length > 0);

  const preferredSlots = preferredSlotsSource
    .map((val) => String(val).trim())
    .filter((val) => val.length > 0);

  const location = (rawLocation ?? {}) as { latitude?: unknown; longitude?: unknown };
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  const issues: ValidationIssue[] = [];

  if (!firstName) {
    issues.push({ field: "firstName", message: "First name is required" });
  } else if (!NAME_REGEX.test(firstName)) {
    issues.push({ field: "firstName", message: "First name contains invalid characters" });
  }

  if (!lastName) {
    issues.push({ field: "lastName", message: "Last name is required" });
  } else if (!NAME_REGEX.test(lastName)) {
    issues.push({ field: "lastName", message: "Last name contains invalid characters" });
  }

  if (!gender || !VALID_GENDERS.includes(gender)) {
    issues.push({ field: "gender", message: "Gender must be one of male, female, or other" });
  }

  const dob = new Date(dobString);
  if (!dobString) {
    issues.push({ field: "dateOfBirth", message: "Date of birth is required" });
  } else if (Number.isNaN(dob.getTime())) {
    issues.push({ field: "dateOfBirth", message: "Date of birth must be a valid ISO date" });
  } else if (dob > new Date()) {
    issues.push({ field: "dateOfBirth", message: "Date of birth cannot be in the future" });
  }

  if (!grade) {
    issues.push({ field: "grade", message: "Grade is required" });
  }

  if (!schoolName) {
    issues.push({ field: "schoolName", message: "School name is required" });
  }

  if (!schoolBoard) {
    issues.push({ field: "schoolBoard", message: "School board is required" });
  }

  if (!parentName) {
    issues.push({ field: "parentName", message: "Parent name is required" });
  } else if (!NAME_REGEX.test(parentName)) {
    issues.push({ field: "parentName", message: "Parent name contains invalid characters" });
  }

  if (!parentPhone) {
    issues.push({ field: "parentPhone", message: "Parent phone is required" });
  } else if (!PHONE_REGEX.test(parentPhone)) {
    issues.push({ field: "parentPhone", message: "Parent phone format is invalid" });
  }

  if (!parentEmail) {
    issues.push({ field: "parentEmail", message: "Parent email is required" });
  } else if (!EmailFormate(parentEmail)) {
    issues.push({ field: "parentEmail", message: "Parent email format is invalid" });
  }

  if (!emergencyNumber) {
    issues.push({ field: "emergencyNumber", message: "Emergency contact number is required" });
  } else if (!PHONE_REGEX.test(emergencyNumber)) {
    issues.push({ field: "emergencyNumber", message: "Emergency contact number format is invalid" });
  }

  if (!houseNumber) {
    issues.push({ field: "houseNumber", message: "House number is required" });
  }

  if (!street) {
    issues.push({ field: "street", message: "Street is required" });
  }

  if (!city) {
    issues.push({ field: "city", message: "City is required" });
  }

  if (!pincode) {
    issues.push({ field: "pincode", message: "Pincode is required" });
  } else if (!PINCODE_REGEX.test(pincode)) {
    issues.push({ field: "pincode", message: "Pincode must be a 6 digit number" });
  }

  if (subjects.length === 0) {
    issues.push({ field: "subjectsInterested", message: "At least one subject is required" });
  }

  if (preferredSlots.length === 0) {
    issues.push({ field: "preferredTimeSlots", message: "At least one preferred slot is required" });
  }

  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) {
    issues.push({ field: "latitude", message: "Latitude must be between -90 and 90" });
  }

  if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) {
    issues.push({ field: "longitude", message: "Longitude must be between -180 and 180" });
  }

  if (issues.length > 0) {
    return validationError(issues);
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: parentEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "EMAIL_ALREADY_REGISTERED",
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    const uploadResult = await uploadFile(file, "student_aadhar");

    if (!uploadResult?.url) {
      return NextResponse.json(
        {
          error: "UPLOAD_FAILED",
          message: "Failed to upload Aadhar file",
        },
        { status: 500 }
      );
    }

    const userId = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.users.create({
        data: {
          email: parentEmail,
          role: "student",
          first_name: firstName,
          last_name: lastName,
          phone: parentPhone,
          house_number: houseNumber,
          street,
          city,
          pincode,
          date_of_birth: new Date(dobString),
          // storing string address helps with quick lookups without geocoding
          location: `${houseNumber}, ${street}, ${city}`,
          home_latitude: latitude,
          home_longitude: longitude,
        },
        select: { id: true },
      });

      await tx.students.create({
        data: {
          user_id: createdUser.id,
          grade,
          school_name: schoolName,
          parent_name: parentName,
          parent_phone: parentPhone,
          parent_email: parentEmail,
          emergency_contact: emergencyNumber,
          subjects_interested: subjects,
          preferred_schedule: JSON.stringify(preferredSlots),
          aadhar_url: uploadResult.url,
          aadhar_url_public_id: uploadResult.public_id ?? null,
        },
      });

      return createdUser.id;
    });

    return NextResponse.json(
      {
        message: "Registration successful. Our team will connect with you for further process.",
        userId,
        age: calculateAge(dobString),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        {
          error: "CONFLICT",
          message: "A user with the provided details already exists",
        },
        { status: 409 }
      );
    }

    console.error("Student registration error", error);
    return NextResponse.json(
      {
        error: "REGISTRATION_ERROR",
        message: "We were unable to process the registration. Please try again later.",
      },
      { status: 500 }
    );
  }
}
