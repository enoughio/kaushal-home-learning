"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { TeacherSideNav } from "./TeacherSideNav";

export function TeacherMobileHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h1 className="text-xl font-bold text-primary">Kaushaly</h1>
              <p className="text-sm text-muted-foreground">Teacher Portal</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Rest of sidebar content */}
          <div className="flex-1 flex flex-col">
            <TeacherSideNav setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Kaushaly</h1>
          </div>
          <div className="w-8" />
        </div>
      </div>
    </>
  );
}
