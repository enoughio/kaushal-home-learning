import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentStats from "@/components/adminPages/Payments/PaymentStats";
import PaymentsList from "@/components/adminPages/Payments/PaymentsList";

function StatsFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-24 bg-neutral-200 rounded mb-2 animate-pulse" />
                <div className="h-6 w-20 bg-neutral-300 rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ListFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-neutral-200 rounded-full" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-neutral-300 rounded" />
                  <div className="h-3 w-24 bg-neutral-200 rounded" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-16 bg-neutral-300 rounded ml-auto" />
                <div className="h-3 w-12 bg-neutral-200 rounded ml-auto" />
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-neutral-300 rounded animate-pulse" />
              <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams?: Record<string, string> | URLSearchParams | any;
}) {
  const params = (searchParams as any) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Overview</h1>
        <p className="text-muted-foreground">
          Monitor payment status and dues across the platform
        </p>
      </div>

      <Suspense fallback={<StatsFallback />}>
        <PaymentStats searchParams={params} />
      </Suspense>

      <Suspense fallback={<ListFallback />}>
        <PaymentsList searchParams={params} />
      </Suspense>
    </div>
  );
}
