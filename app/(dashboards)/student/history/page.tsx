import { Suspense } from "react";
import HistoryTable from "@/components/studentPages/PaymentHistory/HistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  const HistoryTableSkeleton = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Table Skeleton */}
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Date", "Amount", "Method", "Status", "Transaction"].map(
                    (text, i) => (
                      <th key={i} className="text-left p-3">
                        <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse" />
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="p-3">
                        <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 w-6 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          Review your fee payments and transactions
        </p>
      </div>

      <Suspense fallback={<HistoryTableSkeleton />}>
        <HistoryTable />
      </Suspense>
    </div>
  );
}
