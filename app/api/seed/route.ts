import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// create a admin user for the application
export async function GET() {

    let data = {
        email: "aniketjatav376@gmail.com",
        first_name: "Aniket",
        last_name: "Jatav",
        password_hash: "Aniket@1234",
        role: "admin",
        is_verified : true,
        is_active : true,
    };
    

    try {
    
    const hash =  await bcrypt.hash(data.password_hash, 10);
    data.password_hash = hash;

    const user = await prisma.users.create({
        data: data
    });

    if (!user) {
        return NextResponse.json({
            error : "ADMIN_CREATION_FAILED",
            message: "Admin user creation failed",
            code : 500,
        }, {
            status: 500,
        })
    }


    return NextResponse.json({
        message: "Admin user created successfully",
        userId: user.id,
        code: 201,
    });

    } catch (error) {

        console.error("Error creating admin user:", error);
        return NextResponse.json({
            error : "ADMIN_CREATION_FAILED",
            message: "Admin user creation failed",
            code : 500,
        }, {
            status: 500,
        })
    }

}
