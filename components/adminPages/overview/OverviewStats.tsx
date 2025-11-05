import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, TrendingUp } from "lucide-react";
import { createRequestHeader } from "@/lib/requestHelper";


type PlatformStats = {
  totalUsers: number;
  // monthlyGrowth: number;
  // approvedTeachers: number;
  // pendingTeachers: number;
  activeTeachers: number;
  totalRevenue: number;
  // yearlyGrowth: number;
  totalStudents: number;
};

async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // createRequestHeader is async now and must be awaited so cookies() is
    // resolved before using its value (required by Next).
    const fetchOptions = await createRequestHeader();

    const response = await fetch(`${baseUrl}/api/admin/stats`, fetchOptions);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch platform stats");
    }
    return result.data;
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    // Fallback to placeholder data in case of error
    return {
      totalUsers: 0,
      totalRevenue: 0,
      activeTeachers: 0,
      totalStudents: 0,
    };
  }
}

const OverviewStats = async () => {
  const stats = await fetchPlatformStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              {/* <p className="text-xs text-chart-1">
                +{stats.monthlyGrowth ?? 0}% this month
              </p> */}
            </div>
            <Users className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Teachers
              </p>
              <p className="text-2xl font-bold">{stats.activeTeachers}</p>
            </div>
            <UserCheck className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              {/* <p className="text-xs text-chart-3">
                +{stats.yearlyGrowth ?? 0}% this year
              </p> */}
            </div>
            <DollarSign className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Students
              </p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
              <p className="text-xs text-chart-4">Active learners</p>
            </div>
            <TrendingUp className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;
