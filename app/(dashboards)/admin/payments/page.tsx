import React, { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import PaymentStats from '@/components/adminPages/Payments/PaymentStats'
import PaymentsList from '@/components/adminPages/Payments/PaymentsList'

function StatsFallback() {
  return (
    <div className="animate-pulse">
      <Card className="h-24" />
    </div>
  )
}

function ListFallback() {
  return (
    <div className="space-y-4">
      <Card className="h-28" />
      <Card className="h-28" />
    </div>
  )
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams?: Record<string, string> | URLSearchParams | any }) {
  const params = (searchParams as any) ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Overview</h1>
        <p className="text-muted-foreground">Monitor payment status and dues across the platform</p>
      </div>

      <Suspense fallback={<StatsFallback />}>
        <PaymentStats searchParams={params} />
      </Suspense>

      <Suspense fallback={<ListFallback />}>
        <PaymentsList searchParams={params} />
      </Suspense>
    </div>
  )
}
