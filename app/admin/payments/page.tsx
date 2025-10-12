import PaymentsPage from "@/components/adminPage/paymentsPage/PaymentsPage";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminPaymentsPage() {
  return (
    <AdminLayout activeTab="payments">
      <PaymentsPage />
    </AdminLayout>
  );
}