"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, type User } from "@/lib/auth";
import { StudentProfileForm } from "@/components/profile/StudentProfileForm";
import { TeacherProfileForm } from "@/components/profile/TeacherProfileForm";

export default function ProfileSetupPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push("/");
      return;
    }

    if (currentUser.profileComplete) {
      // Redirect to appropriate dashboard
      switch (currentUser.role) {
        case "student":
          router.push("/student");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "admin":
          router.push("/admin");
          break;
      }
      return;
    }

    setUser(currentUser);
  }, [router]);

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Please fill in your details to get started with Kaushaly Home
            Learning
          </p>
        </div>

        {user.role === "student" ? (
          <StudentProfileForm user={user} />
        ) : (
          <TeacherProfileForm user={user} />
        )}
      </div>
    </div>
  );
}
