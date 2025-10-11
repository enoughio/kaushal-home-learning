import { AdminLayout } from "@/components/layout/AdminLayout";
import UserManagementPageClient from "@/components/adminPage/usersManagementPage/UsersManagementPageClient";

export default function UserManagementPage() {
  return (
    <AdminLayout activeTab="users">
      <UserManagementPageClient />
    </AdminLayout>
  );
}
