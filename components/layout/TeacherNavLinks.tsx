"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Home,
  FileText,
  DollarSign,
  User,
  Users,
} from "lucide-react";

interface TeacherNavLinksProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TeacherNavLinks({ setSidebarOpen }: TeacherNavLinksProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/teacher", icon: Home, id: "dashboard" },
    {
      name: "My Students",
      href: "/teacher/students",
      icon: Users,
      id: "students",
    },
    {
      name: "Assignments",
      href: "/teacher/assignments",
      icon: FileText,
      id: "assignments",
    },
    {
      name: "Attendance",
      href: "/teacher/attendance",
      icon: Calendar,
      id: "attendance",
    },
    {
      name: "Payments",
      href: "/teacher/payments",
      icon: DollarSign,
      id: "payments",
    },
    { name: "Profile", href: "/teacher/profile", icon: User, id: "profile" },
  ];

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              router.push(item.href);
              setSidebarOpen(false);
            }}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.name}
          </Button>
        );
      })}
    </nav>
  );
}
