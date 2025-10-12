"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";


import clsx from "clsx";
import {
  Users,
  UserCheck,
  BarChart3,
  DollarSign,
  Calendar,
  User,
  Search,
  FileText,
  Clock,
  Home,
  X,
  Shield,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id: string;
};
const adminNavigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home, id: "dashboard" },
  { name: "User Management", href: "/admin/users", icon: Users, id: "users" },
  { name: "Teacher Approvals", href: "/admin/approvals", icon: UserCheck, id: "approvals" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, id: "analytics" },
  { name: "Payments", href: "/admin/payments", icon: DollarSign, id: "payments" },
  { name: "Teacher Salaries", href: "/admin/salaries", icon: DollarSign, id: "salaries" },
  { name: "Student Fees", href: "/admin/fees", icon: Users, id: "fees" },
  { name: "Notifications", href: "/admin/notifications", icon: Shield, id: "notifications" },
];

// teacher navigation links
const teacherNavigation = [
  { name: "Dashboard", href: "/teachers", icon: Home, id: "dashboard" },
  { name: "My Students", href: "/teachers/students", icon: Users, id: "students" },
  { name: "Assignments", href: "/teachers/assignments", icon: FileText, id: "assignments" },
  { name: "Attendance", href: "/teachers/attendance", icon: Calendar, id: "attendance" },
  { name: "Payments", href: "/teachers/payments", icon: DollarSign, id: "payments" },
  { name: "Profile", href: "/teachers/profile", icon: User, id: "profile" },
];

// student navigation links
const studentNavigation = [
  { name: "Dashboard", href: "/student", icon: Home, id: "dashboard" },
  { name: "Find Teachers", href: "/student/teachers", icon: Search, id: "teachers" },
  { name: "Assignments", href: "/student/assignments", icon: FileText, id: "assignments" },
  { name: "Attendance", href: "/student/attendance", icon: Calendar, id: "attendance" },
  { name: "History", href: "/student/history", icon: Clock, id: "history" },
  { name: "Profile", href: "/student/profile", icon: X, id: "profile" }, // Updated icon to X
];

export default function NavLinks({ role }: { role?: string }) {

  // TODO : remove this in production
  const pathname = usePathname();
  if (pathname.includes("/admin")) {
    role = "admin";
  }
  else if (pathname.includes("/teachers")) {
    role = "teacher";
  }
  else if (pathname.includes("/student")) {
    role = "student";
  }


  const r = (role ?? "guest").toLowerCase();

  let nav: NavItem[] = [];
  if (r === "admin") nav = adminNavigation;
  else if (r === "teacher") nav = teacherNavigation;
  else if (r === "student") nav = studentNavigation;

  return (
    <div>
      {nav.map((link: NavItem) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <div className="">{link.name}</div>
          </Link>
        );
      })}
    </div>
  );
}
