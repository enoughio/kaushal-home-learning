import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { StudentFee } from "@/lib/adminData";

interface SummaryCardsProps {
  fees: StudentFee[];
  loading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ fees, loading }) => {
  const totalCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.monthlyFee, 0);
  const totalPending = fees
    .filter((f) => f.status !== "paid")
    .reduce((sum, f) => sum + f.monthlyFee, 0);
  const overdueCount = fees.filter((f) => f.status === "overdue").length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 w-full">
                    {/* Title placeholder */}
                    <div className="h-4 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                    {/* Value placeholder */}
                    <div className="h-6 w-20 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Collected
              </p>
              <p className="text-2xl font-bold">
                ₹{totalCollected.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Collection
              </p>
              <p className="text-2xl font-bold">
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overdue Payments
              </p>
              <p className="text-2xl font-bold">{overdueCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Collection Rate
              </p>
              <p className="text-2xl font-bold">
                {loading
                  ? Math.round(
                      (fees.filter((f) => f.status === "paid").length /
                        fees.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
