// admin route now uses route layout
import UserManagementPageClient from "@/components/adminPages/usersManagementPage/UsersManagementPageClient";

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <UserManagementPageClient />
    </div>
  );
}
