import Payment from "@/components/teachersPages/payments/Payment";
import PaymentSearch from "@/components/teachersPages/payments/PaymentSearch";
import PaymentStats from "@/components/teachersPages/payments/PaymentStats";

const PaymentsPage = async ({ searchParams }: { searchParams?: Promise<{ query?: string; status?: string; page?: string }> }) => {

  const query = (await searchParams)?.query || "";
  const status = ( await searchParams)?.status || "all";
  console.log("Query params:", { query, status });
  // You can fetch filtered payments here if needed

  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">Track your earnings and payment status</p>
      </div>

      <PaymentStats />

      <PaymentSearch  placeholder="Search by student name or subject..." />
      <Payment query={query} status={status} />

    </div>
  );
};

export default PaymentsPage;
