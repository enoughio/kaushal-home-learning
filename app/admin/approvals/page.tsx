import { AdminLayout } from "@/components/layout/AdminLayout";
import TeacherApprovalsWrapper from "@/components/adminPage/teacherApprovalsPage/TeacherApprovalsWrapper";

export default async function TeacherApprovalsPage() {

  return (
    <AdminLayout activeTab="approvals">
      <TeacherApprovalsWrapper />
    </AdminLayout>
  );
}