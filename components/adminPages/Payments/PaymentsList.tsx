import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, User, AlertTriangle, Clock } from 'lucide-react'
import PaymentsFilter from './PaymentsFilter'
import PaymentsPagination from './PaymentsPagination'
import myFetch from '@/lib/requestHelper'

interface Payment {
  id: string
  userId: string
  userName: string
  type: 'FEE' | 'SALARY'
  amount: number
  transactionId: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
  date: string
  method: string
}

interface PaymentResponse {
  payments: Payment[]
  page: number
  totalPages: number
  totalPayments: number
}

async function fetchPayments(
  page: number = 1,
  status?: string
): Promise<PaymentResponse | null> {
  try {
    const params = new URLSearchParams()
    params.set('page', String(page))
    if (status && status !== 'all') {
      params.set('status', status)
    }

    const response = await myFetch(`/api/admin/payments?${params.toString()}`)

    if (!response.ok) {
      console.error('Failed to fetch payments:', response.status)
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching payments:', error)
    return null
  }
}

function getStatusColor(status: Payment['status']) {
  switch (status) {
    case 'SUCCESS':
      return 'default'
    case 'PENDING':
      return 'secondary'
    case 'FAILED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getStatusLabel(status: Payment['status']) {
  switch (status) {
    case 'SUCCESS':
      return 'Paid'
    case 'PENDING':
      return 'Pending'
    case 'FAILED':
      return 'Failed'
    default:
      return status
  }
}

function getStatusIcon(status: Payment['status']) {
  switch (status) {
    case 'SUCCESS':
      return <DollarSign className="h-4 w-4" />
    case 'PENDING':
      return <Clock className="h-4 w-4" />
    case 'FAILED':
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

export default async function PaymentsList({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}) {
  const params = (await searchParams) ?? {}
  const statusFilter = params.status?.toString() ?? 'all'
  const page = Math.max(1, Number(params.page ?? 1))

  const paymentData = await fetchPayments(page, statusFilter)

  if (!paymentData) {
    return (
      <div className="space-y-4">
        <PaymentsFilter />
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Failed to load payment records. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { payments, totalPages, totalPayments } = paymentData

  return (
    <div className="space-y-4">
      <PaymentsFilter />

      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({totalPayments})</CardTitle>
        </CardHeader>
        <CardContent>
          {totalPayments === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter !== 'all'
                  ? 'No payments found matching your criteria'
                  : 'No payment records found'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {payment.type === 'FEE' ? 'Fee Payment' : 'Salary Payment'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {payment.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(payment.date)}
                        </div>
                        <div className="text-xs">
                          {payment.method.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </p>
                    <Badge variant={getStatusColor(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {payments.length > 0 ? (page - 1) * 20 + 1 : 0}-
                  {page * 20} of {totalPayments}
                </div>
                <PaymentsPagination page={page} totalPages={totalPages} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}