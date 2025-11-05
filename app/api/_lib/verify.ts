import { randomBytes } from "crypto";
import { respondWithError } from "./http";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { JwtPayload } from "@/lib/types";


export async function generateVerificationToken(): Promise<string> {
    const token = randomBytes(32).toString("hex");
    return token;
}


// Shared authentication logic
export async function authenticateAndValidateAdmin(
  req: NextRequest
): Promise<{ payload: JwtPayload } | { error: Response }> {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return {
      error: respondWithError({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
        status: 401,
      }),
    };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") {
      return {
        error: respondWithError({
          error: "UNAUTHORIZED",
          message: "Admin access required",
          status: 403,
        }),
      };
    }
    return {
      payload: { userId: payload.userId as number, role: payload.role as string },
    };
  } catch {
    return {
      error: respondWithError({
        error: "UNAUTHENTICATED",
        message: "Invalid or expired token",
        status: 401,
      }),
    };
  }
}
