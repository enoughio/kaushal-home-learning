import { NextRequest } from "next/server";
import { respondWithError } from "./http";

export interface AuthUser {
  id: number;
  email: string;
  role: "admin" | "teacher" | "student";
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role");
  const userEmail = req.headers.get("x-user-email");

  if (!userId || !userRole || !userEmail) return null;

  const id = Number(userId);
  if (!Number.isInteger(id) || id <= 0) return null;

  if (!["admin", "teacher", "student"].includes(userRole)) return null;

  return {
    id,
    email: userEmail,
    role: userRole as "admin" | "teacher" | "student",
  };
}

// export function requireAuth(req: NextRequest): AuthUser {
//   const user = getAuthUser(req);
//   if (!user) {
//     throw respondWithError({
//       error: "UNAUTHENTICATED",
//       message: "Authentication required",
//       status: 401,
//     });
//   }
//   return user;
// // }

// export function requireRole(req: NextRequest, requiredRole: "admin" | "teacher" | "student"): AuthUser {
//   const user = requireAuth(req);
//   if (user.role !== requiredRole) {
//     throw respondWithError({
//       error: "FORBIDDEN",
//       message: `Access denied. Required role: ${requiredRole}`,
//       status: 403,
//     });
//   }
//   return user;
// }