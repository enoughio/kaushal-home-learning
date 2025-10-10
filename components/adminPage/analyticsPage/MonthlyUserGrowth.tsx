import { AdminDataService, type MonthlyData } from "@/lib/adminData";
import { MonthlyUserGrowthClient } from "./MonthlyUserGrowthClient";

// Server component: fetches data and passes it to client chart
export default async function MonthlyUserGrowth() {
  const monthlyData: MonthlyData[] = await AdminDataService.getMonthlyData();
  return <MonthlyUserGrowthClient monthlyData={monthlyData} />;
}