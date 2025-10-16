"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddRecord() {
  const [open, setOpen] = useState(false)
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    // placeholder fetch of teachers without salary
    setTeachers([
      { id: "t1", name: "Teacher 1" },
      { id: "t2", name: "Teacher 2" },
      { id: "t3", name: "Teacher 3" },
    ])
  }, [])

  async function handleCreate() {
    if (!selected) return
    await fetch(`/api/admin/salaries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId: selected, amount }),
    })
    setOpen(false)
    router.refresh()
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Salary Record
      </Button>

      {open && (
        <div className="p-4 bg-card rounded shadow-md mt-2">
          <div className="space-y-2">
            <div>
              <Label>Teacher</Label>
              <Select onValueChange={(v) => setSelected(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem value={t.id} key={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={(e: any) => setAmount(Number(e.target.value))} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
