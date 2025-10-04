import type React from "react";
import { StudentLayout as StudentLayoutWrapper } from "@/components/layout/StudentLayoutWrapper";

interface StudentLayoutProps {
  children: React.ReactNode;
  activeTab?: string; // optional, since nav links can detect active path
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <StudentLayoutWrapper>{children}</StudentLayoutWrapper>;
}
