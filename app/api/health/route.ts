import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
    try {
        // Test database connection
       
        return NextResponse.json(
            {
                status: "healthy",
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );

       
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            {
                status: "unhealthy",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
