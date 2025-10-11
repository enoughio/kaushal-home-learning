
import Payment from "@/components/teachers/payments/Payment";
import PaymentSearch from "@/components/teachers/payments/PaymentSearch";
import PaymentStats from "@/components/teachers/payments/PaymentStats";

const PaymentsPage = ({ searchParams }: { searchParams?: { query?: string; status?: string; page?: string } }) => {
  const query = searchParams?.query || "";
  const status = searchParams?.status || "all";
  // You can fetch filtered payments here if needed
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">Track your earnings and payment status</p>
      </div>
      <PaymentStats />
      <PaymentSearch placeholder="Search by student name or subject..." />
      <Payment query={query} status={status} />
    </div>
  );
};

export default PaymentsPage;
