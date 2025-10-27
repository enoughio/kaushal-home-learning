import { NextRequest, NextResponse } from "next/server";
import { testConnection } from "../../../database/db";

export async function GET(_req: NextRequest) {
    try {
        // Test database connection
        const connectionTest = await testConnection();

        if (!connectionTest.success) {
            return NextResponse.json(
                {
                    status: "unhealthy",
                    database: connectionTest,
                    environment: process.env.NODE_ENV,
                    timestamp: new Date().toISOString(),
                },
                { status: 503 }
            );
        }

        return NextResponse.json({
            status: "healthy",
            database: {
                connected: connectionTest.success,
                timestamp: connectionTest.timestamp,
                version: connectionTest.version,
            },
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        });

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
