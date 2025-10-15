"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AdminDataService,
  type PlatformStats,
  type UserManagement,
  type TeacherApproval,
} from "@/lib/adminData";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import OverviewStats from "@/components/adminPages/overview/OverviewStats";
import QuickActionsAdmin from "@/components/adminPages/overview/QuickActionsAdmin";
import PendingapprovalsOverView from "@/components/adminPages/overview/PendingapprovalsOverView";
import RecentUsersOverview from "@/components/adminPages/overview/RecentUsersOverview";

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserManagement[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<TeacherApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, usersData, teachersData] = await Promise.all([
          AdminDataService.getPlatformStats(),
          AdminDataService.getAllUsers(),
          AdminDataService.getPendingTeachers(),
        ]);

        setStats(statsData);
        setRecentUsers(usersData.slice(0, 5));
        setPendingTeachers(teachersData);
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage the Kaushaly platform
        </p>
      </div>

      {/* Key Metrics */}
      <Suspense fallback={<div>Loading Stats...</div>}>
        <OverviewStats />
      </Suspense>

      {/* Quick Actions */}
      <Suspense fallback={<div>Loading Quick Actions...</div>}>
        <QuickActionsAdmin />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Teacher Approvals */}
        <Suspense fallback={<div>Loading Pending Approvals...</div>}>
          <PendingapprovalsOverView />
        </Suspense>

        {/* Recent Users */}
        <Suspense fallback={<div>Loading Recent Users...</div>}>
          <RecentUsersOverview />
        </Suspense>
      </div>

      {/* Platform Health */}
      {/* <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1 mb-2">
                  {Math.round((stats.approvedTeachers / stats.totalTeachers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Teacher Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2 mb-2">
                  {Math.round((stats.totalStudents / stats.totalUsers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Student Ratio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3 mb-2">
                  ₹{Math.round(stats.totalRevenue / stats.totalStudents)}
                </div>
                <p className="text-sm text-muted-foreground">Revenue per Student</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
    </div>
  );
}
