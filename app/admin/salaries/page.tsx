import { AdminLayout } from "@/components/layout/AdminLayout";
import TeacherSalariesPageClient from "@/components/adminPage/TeacherSalariesPage/TeacherSalariesPageClient";

export default function TeacherSalariesPage() {
  return (
    <AdminLayout activeTab="salaries">
      <TeacherSalariesPageClient />
    </AdminLayout>
  );
}
