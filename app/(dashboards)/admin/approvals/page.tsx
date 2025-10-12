// admin route now uses route layout
import TeacherApprovalsWrapper from "@/components/adminPages/teacherApprovalsPage/TeacherApprovalsWrapper";

export default async function TeacherApprovalsPage() {

  return (
    <div className="space-y-6">
      <TeacherApprovalsWrapper />
    </div>
  );
}