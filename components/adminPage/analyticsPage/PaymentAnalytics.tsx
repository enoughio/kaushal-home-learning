import { AdminDataService } from "@/lib/adminData";
import { PaymentAnalyticsClient } from "./PaymentAnalyticsClient";

// Server component: fetches data and passes it to client chart
export default async function PaymentAnalytics() {
  const monthlyData = await AdminDataService.getMonthlyData();

  // You can hardcode payment breakdown for now
  const paymentBreakdown = [
    { type: "Student Fees", amount: 3800000, percentage: 75, color: "#3b82f6" },
    { type: "Teacher Salaries", amount: 1200000, percentage: 25, color: "#ef4444" },
  ];

  return <PaymentAnalyticsClient monthlyData={monthlyData} paymentBreakdown={paymentBreakdown} />;
}