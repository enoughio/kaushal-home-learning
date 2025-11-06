'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface SalaryCardProps {
  salary: {
    id: string
    name: string
    email: string
    payDate: string
    base: string
    thisMonthStatus: 'paid' | 'due'
    thisMonthPaidDate: string
  }
}

function getStatusColor(status: 'paid' | 'due') {
  return status === 'paid' ? 'default' : 'destructive'
}

function getStatusLabel(status: 'paid' | 'due') {
  return status === 'paid' ? 'Paid' : 'Due'
}

export default function SalaryCard({ salary }: SalaryCardProps) {
  const [copying, setCopying] = useState(false)
  const router = useRouter()

  async function handleMarkPaid() {
    setCopying(true)
    try {
      const response = await fetch(`/api/admin/salary/${salary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to mark as paid (${response.status})`)
      }

      toast.success('Salary marked as paid')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update salary'
      console.error('Error:', error)
      toast.error(message)
    } finally {
      setCopying(false)
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
          <Button size="sm" onClick={handleMarkPaid} disabled={copying} variant="outline">
            {copying ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Processing
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Mark Paid
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

