'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { UserCheck } from 'lucide-react'

type Props = { teacherId: string }

export default function ApproveAction({ teacherId }: Props) {
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  async function handleApprove() {
    setProcessing(true)
    await fetch(`/api/admin/teachers/${teacherId}/approve`, { method: 'POST' })
    setProcessing(false)
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm">Approve</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Teacher</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to approve this teacher?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} className="bg-chart-2">{processing ? 'Processing...' : 'Approve'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
