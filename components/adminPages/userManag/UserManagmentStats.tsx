import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import myFetch from "@/lib/requestHelper";

type StatsShape = {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  students: number;
  teachers: number;
};

async function fetchStats(): Promise<StatsShape> {
  try {

    const response = await myFetch('/api/admin/users/stats');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    // Fallback to empty array
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      students: 0,
      teachers: 0,
    };
  }
}

export default async function UserManagmentStats() {
  
  const stats = await fetchStats();
  const { totalUsers, activeUsers, pendingUsers, students, teachers } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-2">{activeUsers}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">
              {pendingUsers}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-3">{students}</p>
            <p className="text-sm text-muted-foreground">Students</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-4">{teachers}</p>
            <p className="text-sm text-muted-foreground">Teachers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
