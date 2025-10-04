import { StudentUserInfo } from "./StudentUserInfo";
import { StudentNavLinks } from "./StudentNavLinks";
import { StudentLogout } from "./StudentLogout";
import Link from "next/link";

export function StudentSideNav() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <Link
        href="/teacher"
        className="hidden lg:flex items-center justify-start p-4 border-b border-border"
      >
        <div>
          <h1 className="text-xl font-bold text-primary">Kaushaly</h1>
          <p className="text-sm text-muted-foreground">Student Portal</p>
        </div>
      </Link>

      {/* User info */}
      <StudentUserInfo/>

      {/* Navigation */}
      <div className="flex grow flex-col justify-between">
        <StudentNavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <StudentLogout />
      </div>
    </div>
  );
}
