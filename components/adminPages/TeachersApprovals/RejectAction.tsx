"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

type Props = { teacherId: string }

export default function RejectAction({ teacherId }: Props) {
  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleReject() {
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/approvals/${teacherId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to reject teacher (${response.status})`)
      }

      toast.success(data.data?.message || 'Teacher application rejected')
      setOpen(false)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject teacher'
      console.error('Error rejecting teacher:', error)
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent text-destructive"
          title="Click to reject teacher"
        >
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-100'>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Teacher</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject this teacher application? They will be notified of the rejection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={processing}
            className="bg-destructive text-destructive-foreground"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}