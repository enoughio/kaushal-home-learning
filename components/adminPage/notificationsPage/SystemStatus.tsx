"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SystemStatus({ loading }: { loading: boolean }) {
  const services = [
    {
      name: "Email Service",
      deliveryRate: "99.2%",
      queue: "12 pending",
    },
    {
      name: "WhatsApp Service",
      deliveryRate: "97.8%",
      queue: "8 pending",
    },
  ];

  if (loading)
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-48 bg-neutral-300 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-32 bg-neutral-300 rounded animate-pulse"></div>

                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="h-3 w-20 bg-neutral-300 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.name}>
              <h3 className="font-semibold mb-3">{s.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Service Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delivery Rate</span>
                  <span className="text-sm font-medium">{s.deliveryRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Queue Status</span>
                  <span className="text-sm font-medium">{s.queue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
