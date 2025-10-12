import { AdminDataService, type PlatformStats } from "@/lib/adminData";
import { KeyMetricsClient } from "./KeyMetricsClient";

// Server component: fetches data and passes to client component
export default async function KeyMetrics() {
  const stats: PlatformStats = await AdminDataService.getPlatformStats();

  return <KeyMetricsClient stats={stats} />;
}