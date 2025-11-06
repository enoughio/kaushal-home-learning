'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface SalaryCardProps {
  salary: {
    id: string
    teacherId: number
    name: string
    email: string
    payDate: string
    base: number
    thisMonthStatus: 'paid' | 'due'
    thisMonthPaidDate: string
  }
  processedBy: number
}

function getStatusColor(status: 'paid' | 'due') {
  return status === 'paid' ? 'default' : 'destructive'
}

function getStatusLabel(status: 'paid' | 'due') {
  return status === 'paid' ? 'Paid' : 'Due'
}

export default function SalaryCard({ salary, processedBy }: SalaryCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handlePaySalary() {
    setIsLoading(true)
    try {
      // Call the pay salary API endpoint
      const response = await fetch(`/api/admin/payments/${salary.teacherId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: salary.base,
          paymentDate: new Date().toISOString(),
          paymentType: 'SALARY',
          paymentMethod: 'BANK_TRANSFER',
          processedBy: processedBy,
          notes: `Salary payment for ${salary.name}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to process salary payment (${response.status})`)
      }

      toast.success('Salary payment processed successfully')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process salary payment'
      console.error('Error:', error)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
      {/* Teacher Info */}
      <div>
        <p className="font-medium">{salary.name}</p>
        <p className="text-sm text-muted-foreground">{salary.email}</p>
      </div>

      {/* Pay Date */}
      <div>
        <p className="text-sm text-muted-foreground">Pay Date</p>
        <p className="font-medium">{salary.payDate || '-'}</p>
      </div>

      {/* Base Salary */}
      <div>
        <p className="text-sm text-muted-foreground">Base Salary</p>
        <p className="font-medium">₹{Number(salary.base).toLocaleString('en-IN')}</p>
      </div>

      {/* Status */}
      <div>
        <p className="text-sm text-muted-foreground">Status</p>
        <Badge variant={getStatusColor(salary.thisMonthStatus)}>
          {getStatusLabel(salary.thisMonthStatus)}
        </Badge>
      </div>

      {/* Paid Date */}
      <div>
        <p className="text-sm text-muted-foreground">Paid Date</p>
        <p className="text-sm">
          {salary.thisMonthPaidDate
            ? new Date(salary.thisMonthPaidDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '-'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {salary.thisMonthStatus === 'due' && (
          <Button size="sm" onClick={handlePaySalary} disabled={isLoading} variant="default">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Processing
              </>
            ) : (
              'Pay Salary'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

