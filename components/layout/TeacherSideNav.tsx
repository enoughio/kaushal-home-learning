import { TeacherUserInfo } from "./TeacherUserInfo";
import { TeacherNavLinks } from "./TeacherNavLinks";
import { TeacherLogout } from "./TeacherLogout";
import Link from "next/link";

interface TeacherSideNavProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TeacherSideNav({ setSidebarOpen }: TeacherSideNavProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <Link
        href="/teacher"
        className="hidden lg:flex items-center justify-start p-4 border-b border-border"
      >
        <div>
          <h1 className="text-xl font-bold text-primary">Kaushaly</h1>
          <p className="text-sm text-muted-foreground">Teacher Portal</p>
        </div>
      </Link>

      {/* User info */}
      <TeacherUserInfo />

      {/* Navigation */}
      <div className="flex grow flex-col justify-between">
        <TeacherNavLinks setSidebarOpen={setSidebarOpen} />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <TeacherLogout />
      </div>
    </div>
  );
}
