import type React from "react";
import { TeacherMobileHeader } from "./TeacherMobileHeader";
import { TeacherSideNav } from "./TeacherSideNav";

interface TeacherLayoutServerProps {
  children: React.ReactNode;
}

export function TeacherLayoutServer({ children }: TeacherLayoutServerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r lg:border-border">
        <TeacherSideNav setSidebarOpen={() => {}} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <TeacherMobileHeader />

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
