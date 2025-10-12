"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, CheckCircle } from "lucide-react";
import type { NotificationStats } from "@/lib/adminData";
import OverviewCardsSkeleton from "./OverviewCardsSkeleton";

export default function OverviewCards({
  stats,
  loading,
}: {
  stats: NotificationStats | null;
  loading: boolean;
}) {
  if (loading) return <OverviewCardsSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Sent
              </p>
              <p className="text-2xl font-bold">
                {stats?.totalSent.toLocaleString()}
              </p>
            </div>
            <Bell className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email Notifications
              </p>
              <p className="text-2xl font-bold">{stats?.emailsSent}</p>
            </div>
            <Mail className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                WhatsApp Messages
              </p>
              <p className="text-2xl font-bold">{stats?.whatsappSent}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Success Rate
              </p>
              <p className="text-2xl font-bold">98.5%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
