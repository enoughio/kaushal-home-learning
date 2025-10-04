import type React from "react";
import { TeacherLayout as TeacherLayoutWrapper } from "@/components/layout/TeacherLayoutWrapper";

interface TeacherLayoutProps {
  children: React.ReactNode;
  activeTab?: string; // optional, since nav links can detect active path
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  return <TeacherLayoutWrapper>{children}</TeacherLayoutWrapper>;
}
