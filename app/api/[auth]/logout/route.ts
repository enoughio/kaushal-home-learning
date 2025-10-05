import { NextRequest, NextResponse } from "next/server";

function buildLogoutResponse() {
	// Always return a JSON response and clear the auth cookie
	const res = NextResponse.json({ ok: true, message: "Logged out" });

	// Clear cookie by setting empty value and expired date
	res.cookies.set("auth-token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		expires: new Date(0)
	});

	return res;
}

// Support POST (preferred) and GET (convenience)
export async function POST(req: NextRequest) {
	return buildLogoutResponse();
}

export async function GET(req: NextRequest) {
	return buildLogoutResponse();
}