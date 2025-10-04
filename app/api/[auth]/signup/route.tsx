import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) { 

    const { email, firstName, lastName, role } = await req.json();

    // create temporary user object in databse untill email verification is done
    

}

