"use client";
import { AuthService, type User as UserType } from "@/lib/auth";
import { User} from "lucide-react";
import { useEffect, useState } from "react";

export function StudentUserInfo() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium">Loading...</p>
            <p className="text-sm text-muted-foreground">Student</p>
          </div>
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
        </div>
      </div>
    </div>
  );
}
