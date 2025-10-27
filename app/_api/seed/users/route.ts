// import { query as sql  } from "@/database/db";
// import bcrypt from "bcryptjs";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(req: NextRequest) {
// 	// Step 1: define seed users
// 	const avatarUrl = "https://source.unsplash.com/random";
// 	const plainPassword = "password";

// 	const seeds = [
// 		// admins
// 		{
// 			role: "admin",
// 			email: "admin1@kaushaly.com",
// 			first_name: "System",
// 			last_name: "AdminOne",
// 			phone: "+91-9000000001",
// 			city: "Mumbai",
// 			state: "Maharashtra",
// 			profile_image_url: avatarUrl
// 		},
// 		{
// 			role: "admin",
// 			email: "admin2@kaushaly.com",
// 			first_name: "Platform",
// 			last_name: "AdminTwo",
// 			phone: "+91-9000000002",
// 			city: "Pune",
// 			state: "Maharashtra",
// 			profile_image_url: avatarUrl
// 		},

// 		// teachers
// 		{
// 			role: "teacher",
// 			email: "teacher1@kaushaly.com",
// 			first_name: "Ravi",
// 			last_name: "Shah",
// 			phone: "+91-9000000011",
// 			city: "Mumbai",
// 			state: "Maharashtra",
// 			profile_image_url: avatarUrl,
// 			// teacher specific
// 			qualification: "M.Sc. Mathematics",
// 			experience_years: 5,
// 			subjects_taught: ["Mathematics", "Logical Reasoning"],
// 			teaching_mode: "both",
// 			hourly_rate: 800.0,
// 			resume_url: avatarUrl,
// 			certificates_url: [avatarUrl, avatarUrl]
// 		},
// 		{
// 			role: "teacher",
// 			email: "teacher2@kaushaly.com",
// 			first_name: "Anita",
// 			last_name: "Desai",
// 			phone: "+91-9000000012",
// 			city: "Nashik",
// 			state: "Maharashtra",
// 			profile_image_url: avatarUrl,
// 			qualification: "B.Ed., English Literature",
// 			experience_years: 7,
// 			subjects_taught: ["English", "Communication"],
// 			teaching_mode: "online",
// 			hourly_rate: 700.0,
// 			resume_url: avatarUrl,
// 			certificates_url: [avatarUrl]
// 		},

// 		// students
// 		{
// 			role: "student",
// 			email: "student1@kaushaly.com",
// 			first_name: "Aarav",
// 			last_name: "Patel",
// 			phone: "+91-9000000101",
// 			city: "Vadodara",
// 			state: "Gujarat",
// 			profile_image_url: avatarUrl,
// 			// student specific
// 			grade: "8",
// 			school_name: "Sunrise High School",
// 			parent_name: "Mr. Patel",
// 			parent_phone: "+91-9000000201",
// 			parent_email: "parent1@kaushaly.com",
// 			subjects_interested: ["Mathematics", "Science"],
// 			learning_goals: "Improve math fundamentals",
// 			preferred_schedule: "Weekday evenings"
// 		},
// 		{
// 			role: "student",
// 			email: "student2@kaushaly.com",
// 			first_name: "Meera",
// 			last_name: "Singh",
// 			phone: "+91-9000000102",
// 			city: "Jaipur",
// 			state: "Rajasthan",
// 			profile_image_url: avatarUrl,
// 			grade: "10",
// 			school_name: "Bright Future School",
// 			parent_name: "Mrs. Singh",
// 			parent_phone: "+91-9000000202",
// 			parent_email: "parent2@kaushaly.com",
// 			subjects_interested: ["English", "Social Studies"],
// 			learning_goals: "Score A+ in board exams",
// 			preferred_schedule: "Weekend mornings"
// 		}
// 	];

// 	const seeded: any[] = [];

// 	try {
// 		for (const item of seeds) {
// 			// hash password per-user (avoid reusing same salt variable)
// 			const password_hash = bcrypt.hashSync(plainPassword, 10);

// 			// Insert into users table matching current schema (includes location and is_verified)
// 			const insertUserSql = `
// 				INSERT INTO users
// 					(email, password_hash, role, first_name, last_name, phone, address, city, state, pincode, date_of_birth, location, profile_image_url, is_verified, is_active)
// 				VALUES
// 					($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
// 				RETURNING id, email, role
// 			`;
// 			const userParams = [
// 				item.email,
// 				password_hash,
// 				item.role,
// 				item.first_name || null,
// 				item.last_name || null,
// 				item.phone || null,
// 				item.address || null,
// 				item.city || null,
// 				item.state || null,
// 				item.pincode || null,
// 				item.date_of_birth || null,
// 				item.location || null,
// 				item.profile_image_url || avatarUrl,
// 				// for development seeds mark verified true so login flows work
// 				true,
// 				// mark active true
// 				true
// 			];

// 			const userRes: any = await query(insertUserSql, userParams);
// 			let userId = userRes?.rows?.[0]?.id ?? userRes?.insertId ?? userRes?.id;

// 			// fallback lookup by email if needed
// 			if (!userId) {
// 				const lookup: any = await query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [item.email]);
// 				userId = lookup?.rows?.[0]?.id ?? lookup?.insertId ?? lookup?.id;
// 			}

// 			if (!userId) {
// 				throw new Error(`Failed to get id for user ${item.email}`);
// 			}

// 			seeded.push({ id: userId, email: item.email, role: item.role });

// 			// students insert (match schema columns)
// 			if (item.role === "student") {
// 				const insertStudentSql = `
// 					INSERT INTO students
// 						(user_id, grade, school_name, parent_name, parent_phone, parent_email, emergency_contact, subjects_interested, learning_goals, preferred_schedule, monthly_fee, fee_due_date, payment_status, grace_period_end, enrollment_date, is_active)
// 					VALUES
// 						($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
// 					RETURNING id
// 				`;
// 				const studentParams = [
// 					userId,
// 					item.grade || null,
// 					item.school_name || null,
// 					item.parent_name || null,
// 					item.parent_phone || null,
// 					item.parent_email || null,
// 					item.emergency_contact || null,
// 					item.subjects_interested ?? null, // text[] in Postgres
// 					item.learning_goals || null,
// 					item.preferred_schedule || null,
// 					item.monthly_fee ?? 0,
// 					item.fee_due_date || null,
// 					item.payment_status || "pending",
// 					item.grace_period_end || null,
// 					item.enrollment_date || null,
// 					true
// 				];
// 				await query(insertStudentSql, studentParams);
// 			}

// 			// teachers insert (match schema columns)
// 			if (item.role === "teacher") {
// 				const insertTeacherSql = `
// 					INSERT INTO teachers
// 						(user_id, qualification, experience_years, subjects_taught, teaching_mode, hourly_rate, monthly_salary, salary_status, bank_account_number, bank_ifsc_code, bank_name, account_holder_name, pan_number, aadhar_number, resume_url, certificates_url, approval_status, availability_schedule, max_students, current_students, rating, total_reviews, is_active)
// 					VALUES
// 						($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
// 					RETURNING id
// 				`;
// 				const teacherParams = [
// 					userId,
// 					item.qualification || null,
// 					item.experience_years ?? null,
// 					item.subjects_taught ?? null, // text[] in Postgres
// 					item.teaching_mode || null,
// 					item.hourly_rate ?? null,
// 					item.monthly_salary ?? 0,
// 					item.salary_status || "pending",
// 					item.bank_account_number || null,
// 					item.bank_ifsc_code || null,
// 					item.bank_name || null,
// 					item.account_holder_name || null,
// 					item.pan_number || null,
// 					item.aadhar_number || null,
// 					item.resume_url || avatarUrl,
// 					item.certificates_url ?? null, // text[] 
// 					item.approval_status || "pending",
// 					JSON.stringify(item.availability_schedule || { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }),
// 					item.max_students ?? 20,
// 					item.current_students ?? 0,
// 					item.rating ?? 0,
// 					item.total_reviews ?? 0,
// 					true
// 				];
// 				await query(insertTeacherSql, teacherParams);
// 			}
// 		}

// 		return NextResponse.json({ ok: true, seeded });
// 	} catch (err: any) {
// 		console.error("Seeding error:", err);
// 		return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
// 	}
// }



