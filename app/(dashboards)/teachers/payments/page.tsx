import Payment from "@/components/teachersPages/payments/Payment";
import PaymentSearch from "@/components/teachersPages/payments/PaymentSearch";
import PaymentStats from "@/components/teachersPages/payments/PaymentStats";
import myFetch from "@/lib/requestHelper";

const PaymentsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; status?: string; page?: string }>;
}) => {
  const sp = (await searchParams) || {};
  const query = sp.query || "";
  const status = sp.status || "all";
  const page = sp.page || "1";


  // Fetch salary stats
  const statsRes = await myFetch(`/api/teacher/salary/stats`, );
  const statsJson = await statsRes.json().catch(() => ({}));

  // Fetch salary history (payments)
  const historyRes = await myFetch(`/api/teacher/salary?page=${page}&status=${status}`);
  const historyJson = await historyRes.json().catch(() => ({}));

  const statsData = statsJson?.data || {};
  const historyData = historyJson?.data || { salaryHistory: [], page: 1, totalPages: 0, totalRecords: 0 };

  // Map stats to PaymentStats props (use defaults for missing fields)
  const paymentStatsProps = {
    totalEarnings: statsData.totalEarnings ?? 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalHours: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">Track your earnings and payment status</p>
      </div>

      <PaymentStats {...paymentStatsProps} />

      <PaymentSearch placeholder="Search payments (month)" />
      <Payment
        payments={historyData.salaryHistory}
        query={query}
        status={status}
      />
    </div>
  );
};

export default PaymentsPage;
