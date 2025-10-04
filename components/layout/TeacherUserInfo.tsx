"use client";
import { AuthService, type User as UserType } from "@/lib/auth";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export function TeacherUserInfo() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {user.role}
          </p>
          {!user.approved && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Pending Approval
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
