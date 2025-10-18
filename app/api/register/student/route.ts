import { query } from "@/database/db";
import { EmailFormate } from "@/helper/mail/formateVelidator";
import { NextResponse, NextRequest } from "next/server";

export type Gender = "male" | "female" | "other";

interface StudentRegistrationData {
  firstName: string;
  lasName: string;
  gender: Gender;
  DateOfBirth: string;
  grade: string;
    schoolName: string;
    SchoolBoard: string;
    parentName: string;
    parentPhone: string;
    ParentEmail: string;
    emergencyNumber: string;
    houseNumber: string;
    street: string;
    city: string;
    pincode: string;
    subjectsInterested: string[];
    parentAadhar: string;
    locationCoordinates: {
        latitude: number;
        longitude: number;
    };
    preferedTimeSlots: string[];
}

export async function POSt(req: NextRequest) {
  const {
    firstName,
    lasName,
    gender,
    DateOfBirth,
    grade,
    schoolName,
    SchoolBoard,
    parentName,
    parentPhone,
    ParentEmail,
    emergencyNumber,
    houseNumber,
    street,
    city,
    pincode,
    subjectsInterested,
    parentAadhar,
    locationCoordinates,
    preferedTimeSlots,
  } = await req.json();



//   verify required fields

    if ( !firstName
    || !lasName|| !gender || !DateOfBirth
    || !grade || !schoolName || !SchoolBoard || !parentName || !parentPhone
    || !ParentEmail || !emergencyNumber || !houseNumber || !street || !city 
    || !pincode|| !subjectsInterested
    || !parentAadhar || !locationCoordinates || !preferedTimeSlots
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }   

    if( EmailFormate(ParentEmail) === false ){
        return NextResponse.json({
            error: "INVALID_EMAIL_FORMAT",
            message: "Invalid email format",
            code: 400
        },{
            status: 400
        }
    )}

    // save data in database 

    query( 
        `INSERT INTO users `

    )




}
