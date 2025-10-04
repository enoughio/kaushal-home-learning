import Link from "next/link"
import { AdminNavLinks } from "./AdminNavLinks"
import { AdminLogout } from "./AdminLogout"
import { AdminUserInfo } from "./AdminUserInfo"

export function AdminSideNav() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <Link
        href="/admin"
        className="flex items-center justify-start p-4 border-b border-border"
      >
        <div>
          <h1 className="text-xl font-bold text-primary">Kaushaly</h1>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
        </div>
      </Link>

      {/* User info */}
      <AdminUserInfo />

      {/* Navigation */}
      <div className="flex grow flex-col justify-between">
        <AdminNavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <AdminLogout />
      </div>
    </div>
  )
}