import { Card, CardContent } from '@/components/ui/card'
import myFetch from '@/lib/requestHelper'
import { DollarSign, AlertTriangle, Clock } from 'lucide-react'

interface PaymentStats {
  totalPayments: number
  feeRecived: number
  dueAmount: number
  SalaryPaid: number
}

async function fetchPaymentStats(): Promise<PaymentStats | null> {
  try {
    const response = await myFetch('/api/admin/payments/stats')

    if (!response.ok) {
      console.error('Failed to fetch payment stats:', response.status)
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching payment stats:', error)
    return null
  }
}

export default async function PaymentStats() {
  const stats = await fetchPaymentStats()

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-24 bg-neutral-200 rounded mb-2" />
                  <div className="h-6 w-20 bg-neutral-300 rounded" />
                </div>
                <div className="h-8 w-8 bg-neutral-200 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { totalPayments, feeRecived, dueAmount, SalaryPaid } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalPayments.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fees Received</p>
              <p className="text-2xl font-bold text-chart-2">₹{feeRecived.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due</p>
              <p className="text-2xl font-bold text-chart-3">₹{dueAmount.toLocaleString('en-IN')}</p>
            </div>
            <Clock className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Salary Paid</p>
              <p className="text-2xl font-bold text-destructive">₹{SalaryPaid.toLocaleString('en-IN')}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}