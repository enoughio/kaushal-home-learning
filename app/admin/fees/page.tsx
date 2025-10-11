import { AdminLayout } from "@/components/layout/AdminLayout";
import StudentFeesWrapper from "@/components/adminPage/StudentFeesPage/StudentFees";

export default function StudentFeesPage() {
  return (
    <AdminLayout activeTab="fees">
      <StudentFeesWrapper />
    </AdminLayout>
  );
}
