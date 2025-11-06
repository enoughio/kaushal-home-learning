'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

type Props = { teacherId: string }

export default function ApproveAction({ teacherId }: Props) {
  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleApprove() {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/approvals/${teacherId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to approve teacher (${response.status})`)
      }

      toast.success(data.data?.message || 'Teacher approved successfully')
      setOpen(false)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve teacher'
      console.error('Error approving teacher:', error)
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          title="Click to approve teacher"
        >
          Approve
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-100'>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Teacher</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this teacher? They will be able to access the platform immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={processing}
            className="bg-chart-2"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              'Approve'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
