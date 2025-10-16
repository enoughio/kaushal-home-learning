import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, AlertTriangle, Clock } from 'lucide-react'

type Payment = { id: string; amount: number; status: 'paid' | 'due' | 'overdue' }

async function fetchPayments(): Promise<Payment[]> {
  // placeholder payments
  return [
    { id: 'p1', amount: 5000, status: 'paid' },
    { id: 'p2', amount: 2500, status: 'due' },
    { id: 'p3', amount: 3000, status: 'overdue' },
    { id: 'p4', amount: 1500, status: 'due' },
  ]
}

export default async function PaymentStats({ searchParams }: { searchParams?: Record<string, string> | any }) {
  const payments = await fetchPayments()
  const totalAmount = payments.reduce((s, p) => s + p.amount, 0)
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const dueAmount = payments.filter(p => p.status === 'due').reduce((s, p) => s + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-chart-2">₹{paidAmount.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-chart-3">₹{dueAmount.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-destructive">₹{overdueAmount.toLocaleString()}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}