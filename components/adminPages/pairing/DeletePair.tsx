"use client"

import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface DeletePairProps {
  pairId: number
  studentId: string
  studentName: string
  teacherName: string
}

export default function DeletePair({
  studentId,
  studentName,
  teacherName,
}: DeletePairProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(
        `/api/admin/assign-teacher/${studentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to delete assignment (${response.status})`
        )
      }

      toast.success(data.data?.message || "Assignment deleted successfully!")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete assignment"
      console.error("Delete error:", error)
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md bg-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-semibold">{teacherName}</span> from{" "}
            <span className="font-semibold">{studentName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            This action will unassign the teacher from the student and make the student available for new assignments.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2 bg-destructive hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
