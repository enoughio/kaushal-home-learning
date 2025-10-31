"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { UserX } from 'lucide-react'

type Props = { teacherId: string }

export default function RejectAction({ teacherId }: Props) {
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  async function handleReject() {
    setProcessing(true)
    await fetch(`/api/admin/teachers/${teacherId}/reject`, { method: 'POST' })
    setProcessing(false)
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent text-destructive">Reject</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Teacher</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to reject this teacher application? This action can be reverted manually.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">{processing ? 'Processing...' : 'Reject'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}