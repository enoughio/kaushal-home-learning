import { Suspense } from "react";
import HistoryTable from "@/components/studentPages/PaymentHistory/HistoryTable";



export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">Review your fee payments and transactions</p>
      </div>

      <Suspense fallback={<div>Loading payment history...</div>}>
        <HistoryTable  />
      </Suspense>
    </div>
  );
}
