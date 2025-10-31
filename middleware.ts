import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "teacher" | "student" | "guest";

interface AuthPayload {
	id: number;
	email: string;
	role: Role;
	iat?: number;
	exp?: number;
}

const PUBLIC_PATHS = [
	"/",
	"/about",
	"/contact",
	"/auth/login",
	"/auth/verify",
	"/auth/forgot",
	"/favicon.ico",
	"/register/"
];

const PUBLIC_API_PATHS = [
	"/api/auth/login",
	"/api/auth/signup",
	"/api/auth/forgot",
	"/api/auth/create-password",
	"/api/auth/verify",
	"/api/register/student",
	"/api/register/teacher",
	// "/api/seed",
];

const RBAC_PREFIXES: { prefix: string; allowed: Role[] }[] = [
	{ prefix: "/admin", allowed: ["admin"] },
	{ prefix: "/api/admin", allowed: ["admin"] },
	{ prefix: "/teachers", allowed: ["teacher"] },
	{ prefix: "/api/teacher", allowed: ["teacher"] },
	{ prefix: "/student", allowed: ["student"] },
	{ prefix: "/api/student", allowed: ["student"] },
];


function isPublicPath(pathname: string) {
	// exact match or startsWith for some public prefixes (e.g. static assets)
	if (PUBLIC_PATHS.includes(pathname)) return true;
	if (PUBLIC_API_PATHS.includes(pathname)) return true;
	if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/assets")) return true;
	return false;
}

function findRbacRule(pathname: string) {
	for (const rule of RBAC_PREFIXES) {
		if ( pathname === rule.prefix || pathname.startsWith(rule.prefix + "/") ) {
			return rule;
		}
	}
	return null;
}



export async function middleware(req: NextRequest) {
  console.log("Middleware invoked for:", req.url);

  try {
		const { pathname } = req.nextUrl;
		
		
		// Allow public paths immediately
		if (isPublicPath(pathname)) return NextResponse.next();
		const isApiRoute = pathname.startsWith('/api/');
		
		if(isApiRoute) return NextResponse.next();
		// Read token
		const token = req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
		if (!token) {
			// No token -> redirect to login for pages, return 401 for API routes
			if (isApiRoute) {
				return NextResponse.json(
					{ success: false, message: "Authentication required", error: { code: "UNAUTHENTICATED" } },
					{ status: 401 }
				);
			}
			const loginUrl = new URL("/auth/login", req.url);
			return NextResponse.redirect(loginUrl);
		}
		
		// Verify token
		let payload: AuthPayload | null = null;
		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
			const { payload: decodedPayload } = await jwtVerify(token, secret);
			const decoded = decodedPayload as unknown;
			// console.log("No auth token found for API route:", pathname);
			// normalize common payload shapes
			const asObj = typeof decoded === "object" && decoded !== null ? decoded as any : {};
			payload = {
				id: Number(asObj.userId ?? -1),
				email: String(asObj.email ?? ""),
				role: (asObj.role ?? "guest") as Role,
				iat: asObj.iat,
				exp: asObj.exp
			};
			
			if (!payload.id || !payload.role) payload = null;
			
	
			
        } catch (e) {
			// invalid/expired token -> redirect to login for pages, return 401 for API routes
			if (isApiRoute) {
				return NextResponse.json(
					{ success: false, message: "Invalid or expired token", error: { code: "UNAUTHENTICATED" } },
					{ status: 401 }
				);
			}
			const loginUrl = new URL("/auth/login", req.url);
			return NextResponse.redirect(loginUrl);
		}

		if (!payload) {
			if (isApiRoute) {
				return NextResponse.json(
					{ success: false, message: "Authentication required", error: { code: "UNAUTHENTICATED" } },
					{ status: 401 }
				);
			}
			const loginUrl = new URL("/auth/login", req.url);
			return NextResponse.redirect(loginUrl);
		}else {
			// if user is trying to access login page but is already logged in, redirect based on role
			if( pathname.startsWith("/auth/login") ){
				const role = payload.role

				if( role == "admin" ){
					return NextResponse.redirect(new URL("/admin", req.url));
				} else if ( role == "teacher" ) {
					return NextResponse.redirect(new URL("/teachers", req.url));
				} else if ( role == "student" ) {
					return NextResponse.redirect(new URL("/student", req.url));
				}
			}
		}

        
		// RBAC: check if this path requires a role and whether the user's role is allowed
		const rule = findRbacRule(pathname);
		if (rule) {
            if (!rule.allowed.includes(payload.role)) {
                // Unauthorized for this role -> redirect to 403 page for pages, return 403 for API routes
				if (isApiRoute) {
					return NextResponse.json(
						{ success: false, message: `Access denied. Required role: ${rule.allowed.join(', ')}`, error: { code: "FORBIDDEN" } },
						{ status: 403 }
					);
				}
				const forbiddenUrl = new URL("/403", req.url);
				return NextResponse.redirect(forbiddenUrl);
			}
		}

		// Pass user info to downstream via headers
		const res = NextResponse.next();
		res.headers.set("x-user-id", String(payload.id));
		res.headers.set("x-user-role", payload.role);
		res.headers.set("x-user-email", payload.email);

		return res;
        // This can be acceses in the req body of the api routes vai 
        // req.headers.get("x-user-id"), req.headers.get("x-user-role"), req.headers.get("x-user-email")

        } catch (err) {
                // On unexpected errors, clear cookie and redirect to login
                console.error("Middleware error:", err);
                const loginUrl = new URL("/auth/login", req.url);
                const res = NextResponse.redirect(loginUrl);
                res.cookies.set("auth-token", "", { path: "/", expires: new Date(0) });
                return res;
        }
}

// Only run middleware for specific protected routes
export const config = {
	matcher: [
		"/auth/login",
		"/admin/:path*",
		"/student/:path*", 
		"/teachers/:path*",
		"/api/admin/:path*",
		"/api/student/:path*",
		"/api/teacher/:path*"
	]
};










// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// type Role = "admin" | "teacher" | "student" | "guest";

// interface AuthPayload {
// 	id: number;
// 	email: string;
// 	role: Role;
// 	iat?: number;
// 	exp?: number;
// }

// const PUBLIC_PATHS = [
// 	"/", 
// 	"/about", 
// 	"/contact", 
// 	"/auth/login", 
// 	"/auth/signup", 
// 	"/auth/verify",
// 	"/auth/forgot",
// 	"/api/auth/login",
// 	"/favicon.ico",
// ];

// const RBAC_PREFIXES: { prefix: string; allowed: Role[] }[] = [
// 	{ prefix: "/admin", allowed: ["admin"] },
// 	// { prefix: "/api/admin", allowed: ["admin"] },
// 	{ prefix: "/teacher", allowed: ["teacher"] },
// 	// { prefix: "/api/teacher", allowed: ["teacher"] },
// 	{ prefix: "/student", allowed: ["student"] },
// 	// { prefix: "/api/student", allowed: ["student"] },
//     //TODO :
// 	// API routes that need role checks can be added, e.g. { prefix: "/api/admin", allowed: ["admin"] } ccurrently nuterilized for development
// ];


// function isPublicPath(pathname: string) {
// 	// exact match or startsWith for some public prefixes (e.g. static assets)
// 	if (PUBLIC_PATHS.includes(pathname)) return true;
// 	if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/assets")) return true;
// 	return false;
// }

// function findRbacRule(pathname: string) {
// 	for (const rule of RBAC_PREFIXES) {
// 		if ( pathname === rule.prefix || pathname.startsWith(rule.prefix + "/") ) {
// 			return rule;
// 		}
// 	}
// 	return null;
// }

// export function middleware(req: NextRequest) {
// 	try {
// 		const { pathname } = req.nextUrl;

// 		// Allow public paths immediately
// 		if (isPublicPath(pathname)) return NextResponse.next();

// 		// Read token
// 		const token = req.cookies.get("auth-token")?.value;
// 		if (!token) {
// 			console.log("No auth token found for protected route:", pathname);
// 			// No token -> redirect to login
// 			const loginUrl = new URL("/auth/login", req.url);
// 			return NextResponse.redirect(loginUrl);
// 		}

// 		// Verify token
// 		let payload: AuthPayload | null = null;
// 		try {
// 			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown;
// 			// normalize common payload shapes
// 			const asObj = typeof decoded === "object" && decoded !== null ? decoded as any : {};
// 			payload = {
// 				id: Number(asObj.userId ?? -1),
// 				email: String(asObj.email ?? ""),
// 				role: (asObj.role ?? "guest") as Role,
// 				iat: asObj.iat,
// 				exp: asObj.exp
// 			};

// 			if (!payload.id || !payload.role) payload = null;
		
//         } catch (e) {
// 			// invalid/expired token -> redirect to login
// 			const loginUrl = new URL("/auth/login", req.url);
// 			return NextResponse.redirect(loginUrl);
// 		}

// 		if (!payload) {
// 			const loginUrl = new URL("/auth/login", req.url);
// 			return NextResponse.redirect(loginUrl);
// 		}else {
// 			// if user is trying to access login page but is already logged in, redirect based on role
// 			if( pathname.startsWith("/auth/login") ){
				
// 				const role = payload.role

// 				if( role == "admin" ){
// 					return NextResponse.redirect(new URL("/admin", req.url));
// 				} else if ( role == "teacher" ) {
// 					return NextResponse.redirect(new URL("/teachers", req.url));
// 				} else if ( role == "student" ) {
// 					return NextResponse.redirect(new URL("/student", req.url));
// 				}
// 			}
// 		}

// 		// RBAC: check if this path requires a role and whether the user's role is allowed
// 		const rule = findRbacRule(pathname);
// 		if (rule) {
//             if (!rule.allowed.includes(payload.role)) {
//                 // Unauthorized for this role -> redirect to a 403 page or login
// 				const forbiddenUrl = new URL("/403", req.url);
// 				return NextResponse.redirect(forbiddenUrl);
// 			}
// 		}
//         //TODO : Make a 404 and 403 Page

// 		// Pass user info to downstream via headers
// 		const res = NextResponse.next();
// 		res.headers.set("x-user-id", String(payload.id));
// 		res.headers.set("x-user-role", payload.role);
// 		res.headers.set("x-user-email", payload.email);

// 		return res;
//         // This can be acceses in the req body of the api routes vai 
//         // req.headers.get("x-user-id"), req.headers.get("x-user-role"), req.headers.get("x-user-email")

// 	} catch (err) {
// 		// On unexpected errors, clear cookie and redirect to login
// 		console.error("Middleware error:", err);
// 		const loginUrl = new URL("/auth/login", req.url);
// 		const res = NextResponse.redirect(loginUrl);
// 		res.cookies.set("auth-token", "", { path: "/", expires: new Date(0) });
// 		return res;
// 	}
// }

// // Only run middleware for application routes (exclude static/_next)
// // TODO: Adjust matcher later  in producction
