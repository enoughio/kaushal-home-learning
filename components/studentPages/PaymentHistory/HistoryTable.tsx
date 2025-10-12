import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudentPayment } from "@/lib/types";
import PaginationControll from "./PaginationControll";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
  page?: number;
  pageSize?: number;
};

export default async function HistoryTable({ searchParams, page: pageProp, pageSize: pageSizeProp }: Props) {
  const pageFromQuery = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page) || 1;
  const page = pageProp ?? pageFromQuery ?? 1;
  const pageSize = pageSizeProp ?? 5;

  // Placeholder payments (server-side). Will be replaced with API response later.
  const payments: StudentPayment[] = [
    { id: "p1", studentId: "2", amount: 1500, paymentMethod: "upi", paymentStatus: "completed", transactionId: "tx1001", paymentDate: "2025-10-01" },
    { id: "p2", studentId: "2", amount: 1200, paymentMethod: "card", paymentStatus: "completed", transactionId: "tx1002", paymentDate: "2025-09-15" },
    { id: "p3", studentId: "2", amount: 1500, paymentMethod: "upi", paymentStatus: "pending", transactionId: "tx1003", paymentDate: "2025-08-20" },
    { id: "p4", studentId: "2", amount: 1000, paymentMethod: "cash", paymentStatus: "completed", transactionId: "tx1004", paymentDate: "2025-07-10" },
    { id: "p5", studentId: "2", amount: 2000, paymentMethod: "card", paymentStatus: "refunded", transactionId: "tx1005", paymentDate: "2025-06-05" },
    { id: "p6", studentId: "2", amount: 1300, paymentMethod: "upi", paymentStatus: "completed", transactionId: "tx1006", paymentDate: "2025-05-22" },
    { id: "p7", studentId: "2", amount: 900, paymentMethod: "cash", paymentStatus: "completed", transactionId: "tx1007", paymentDate: "2025-04-18" },
    { id: "p8", studentId: "2", amount: 1600, paymentMethod: "card", paymentStatus: "completed", transactionId: "tx1008", paymentDate: "2025-03-12" },
    { id: "p9", studentId: "2", amount: 800, paymentMethod: "upi", paymentStatus: "failed", transactionId: "tx1009", paymentDate: "2025-02-05" },
    { id: "p10", studentId: "2", amount: 1700, paymentMethod: "card", paymentStatus: "completed", transactionId: "tx1010", paymentDate: "2025-01-25" },
    { id: "p11", studentId: "2", amount: 1100, paymentMethod: "upi", paymentStatus: "completed", transactionId: "tx1011", paymentDate: "2024-12-15" },
    { id: "p12", studentId: "2", amount: 1400, paymentMethod: "card", paymentStatus: "completed", transactionId: "tx1012", paymentDate: "2024-11-03" },
  ];

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const pageItems = payments.slice(start, end);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Method</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-3">{p.paymentDate}</td>
                      <td className="p-3">₹{p.amount.toLocaleString()}</td>
                      <td className="p-3 uppercase">{p.paymentMethod}</td>
                      <td className="p-3">
                        <Badge
                          variant={p.paymentStatus === "completed" ? "default" : p.paymentStatus === "pending" ? "secondary" : "destructive"}
                        >
                          {p.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-3">{p.transactionId || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControll page={page} pageSize={pageSize} total={payments.length} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}