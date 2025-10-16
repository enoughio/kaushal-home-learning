import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, User, AlertTriangle, Clock } from 'lucide-react'
import PaymentFilters from './PaymentsFilter'
import PaymentsPagination from './PaymentsPagination'

type Payment = {
  id: string
  studentName: string
  teacherName: string
  subject: string
  amount: number
  status: 'paid' | 'due' | 'overdue'
  dueDate?: string
}

async function fetchPayments(): Promise<Payment[]> {
  return [
    { id: 'p1', studentName: 'Aisha', teacherName: 'Rahul', subject: 'Math', amount: 5000, status: 'paid', dueDate: '2025-10-10' },
    { id: 'p2', studentName: 'Meera', teacherName: 'Sonia', subject: 'Science', amount: 2500, status: 'due', dueDate: '2025-10-15' },
    { id: 'p3', studentName: 'Karan', teacherName: 'Arjun', subject: 'English', amount: 3000, status: 'overdue', dueDate: '2025-09-30' },
    { id: 'p4', studentName: 'Priya', teacherName: 'Nisha', subject: 'Physics', amount: 1500, status: 'due', dueDate: '2025-10-20' },
  ]
}

function getStatusColor(status: Payment['status']) {
  switch (status) {
    case 'paid': return 'default'
    case 'due': return 'secondary'
    case 'overdue': return 'destructive'
    default: return 'secondary'
  }
}

function getStatusIcon(status: Payment['status']) {
  switch (status) {
    case 'paid': return <DollarSign className="h-4 w-4" />
    case 'due': return <Clock className="h-4 w-4" />
    case 'overdue': return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export default async function PaymentsList({ searchParams }: { searchParams?: Record<string, string> | any }) {
  const params = searchParams ?? {}
  const searchTerm = (params?.search ?? '').toString()
  const statusFilter = (params?.status ?? 'all').toString()
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 10)

  const all = await fetchPayments()
  let filtered = all
  if (searchTerm) filtered = filtered.filter(p => [p.studentName, p.teacherName, p.subject].some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter as any)

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const pagedPayments = filtered.slice(startIndex, endIndex)

  const currentPage = page

  return (
    <>
      <PaymentFilters />

      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          {totalItems === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{searchTerm || statusFilter !== 'all' ? 'No payments found matching your criteria' : 'No payment records found'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagedPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-medium">{payment.subject} Session</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><User className="h-4 w-4" />{payment.studentName}</div>
                        <div className="flex items-center gap-1"><User className="h-4 w-4" />Teacher: {payment.teacherName}</div>
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />Due: {payment.dueDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">₹{payment.amount.toLocaleString()}</p>
                    <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems}</div>
                <PaymentsPagination page={currentPage} totalPages={totalPages} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}