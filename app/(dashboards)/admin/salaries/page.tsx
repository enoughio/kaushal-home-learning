import SalaryStats from "@/components/adminPages/Salary/SalaryStats";
import SalaryTable from "@/components/adminPages/Salary/SalaryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { Suspense } from "react";

export default async function TeacherSalariesPage() {
  const SalaryStatsFallback = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                  <div className="h-6 w-16 bg-neutral-300 rounded" />
                </div>
                <div className="h-8 w-8 bg-neutral-200 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const SalaryTableSkeleton = ({rows}) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-48 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(rows)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Teacher Name + Month */}
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                    </div>

                    {/* Base Salary */}
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>

                    {/* Bonuses */}
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>

                    {/* Deductions */}
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>

                    {/* Total */}
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>

                    {/* Status Badge */}
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Salaries</h1>
        <p className="text-muted-foreground">
          Manage monthly teacher compensation
        </p>
      </div>

      {/* Summary Cards */}
      <Suspense fallback={<SalaryStatsFallback />}>
        <SalaryStats />
      </Suspense>

      {/* Salaries Table */}

      <Suspense fallback={<SalaryTableSkeleton rows = {4}/>}>
        <SalaryTable />
      </Suspense>
    </div>
  );
}

// ---- old code -----
// "use client"

// import { useState, useEffect } from "react"
// import { AdminLayout } from "@/components/layout/admin-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { AdminDataService, type TeacherSalary } from "@/lib/admin-data"
// import { DollarSign, Edit, Check, X, Plus } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function TeacherSalariesPage() {
//   const [salaries, setSalaries] = useState<TeacherSalary[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [editForm, setEditForm] = useState<Partial<TeacherSalary>>({})
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   useEffect(() => {
//     const loadSalaries = async () => {
//       try {
//         const data = await AdminDataService.getTeacherSalaries()
//         setSalaries(data)
//       } catch (error) {
//         console.error("Failed to load teacher salaries:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadSalaries()
//   }, [])

//   const handleEdit = (salary: TeacherSalary) => {
//     setEditingId(salary.id)
//     setEditForm(salary)
//   }

//   const handleSave = async () => {
//     if (!editingId) return

//     try {
//       await AdminDataService.updateTeacherSalary(editingId, editForm)
//       setSalaries((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...editForm } : s)))
//       setEditingId(null)
//       setEditForm({})
//     } catch (error) {
//       console.error("Failed to update salary:", error)
//     }
//   }

//   const handleCancel = () => {
//     setEditingId(null)
//     setEditForm({})
//   }

//   const getStatusColor = (status: TeacherSalary["status"]) => {
//     switch (status) {
//       case "paid":
//         return "default"
//       case "processing":
//         return "secondary"
//       case "pending":
//         return "destructive"
//       default:
//         return "outline"
//     }
//   }

//   const totalItems = salaries.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const startIndex = (page - 1) * pageSize
//   const endIndex = Math.min(startIndex + pageSize, totalItems)
//   const pagedSalaries = salaries.slice(startIndex, endIndex)

//   if (loading) {
//     return (
//       <AdminLayout activeTab="salaries">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-2 text-muted-foreground">Loading salaries...</p>
//           </div>
//         </div>
//       </AdminLayout>
//     )
//   }

//   const totalPaid = salaries.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.totalSalary, 0)
//   const totalPending = salaries.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.totalSalary, 0)

//   return (
//     <AdminLayout activeTab="salaries">
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">Teacher Salaries</h1>
//           <p className="text-muted-foreground">Manage monthly teacher compensation</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
//                   <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
//                 </div>
//                 <DollarSign className="h-8 w-8 text-chart-1" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
//                   <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
//                 </div>
//                 <DollarSign className="h-8 w-8 text-chart-2" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
//                   <p className="text-2xl font-bold">{new Set(salaries.map((s) => s.teacherId)).size}</p>
//                 </div>
//                 <DollarSign className="h-8 w-8 text-chart-3" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Salaries Table */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Monthly Salaries</CardTitle>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Salary Record
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {pagedSalaries.map((salary) => (
//                 <div key={salary.id} className="p-4 border rounded-lg">
//                   {editingId === salary.id ? (
//                     <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//                       <div>
//                         <Label>Teacher</Label>
//                         <p className="text-sm font-medium">{salary.teacherName}</p>
//                       </div>
//                       <div>
//                         <Label>Base Salary</Label>
//                         <Input
//                           type="number"
//                           value={editForm.baseSalary || 0}
//                           onChange={(e) => setEditForm((prev) => ({ ...prev, baseSalary: Number(e.target.value) }))}
//                         />
//                       </div>
//                       <div>
//                         <Label>Bonuses</Label>
//                         <Input
//                           type="number"
//                           value={editForm.bonuses || 0}
//                           onChange={(e) => setEditForm((prev) => ({ ...prev, bonuses: Number(e.target.value) }))}
//                         />
//                       </div>
//                       <div>
//                         <Label>Deductions</Label>
//                         <Input
//                           type="number"
//                           value={editForm.deductions || 0}
//                           onChange={(e) => setEditForm((prev) => ({ ...prev, deductions: Number(e.target.value) }))}
//                         />
//                       </div>
//                       <div>
//                         <Label>Total</Label>
//                         <p className="text-sm font-medium">
//                           ₹
//                           {(
//                             (editForm.baseSalary || 0) +
//                             (editForm.bonuses || 0) -
//                             (editForm.deductions || 0)
//                           ).toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button size="sm" onClick={handleSave}>
//                           <Check className="h-4 w-4" />
//                         </Button>
//                         <Button size="sm" variant="outline" onClick={handleCancel}>
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-between">
//                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
//                         <div>
//                           <p className="font-medium">{salary.teacherName}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {salary.month} {salary.year}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-muted-foreground">Base</p>
//                           <p className="font-medium">₹{salary.baseSalary.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-muted-foreground">Bonuses</p>
//                           <p className="font-medium text-chart-1">+₹{salary.bonuses.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-muted-foreground">Deductions</p>
//                           <p className="font-medium text-chart-2">-₹{salary.deductions.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-muted-foreground">Total</p>
//                           <p className="font-bold">₹{salary.totalSalary.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <Badge variant={getStatusColor(salary.status)}>{salary.status}</Badge>
//                           {salary.paymentDate && (
//                             <p className="text-xs text-muted-foreground mt-1">Paid: {salary.paymentDate}</p>
//                           )}
//                         </div>
//                       </div>
//                       <Button size="sm" variant="ghost" onClick={() => handleEdit(salary)}>
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <div className="flex items-center justify-between pt-2">
//                 <div className="text-sm text-muted-foreground">
//                   Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems}
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-muted-foreground">Rows per page</span>
//                     <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
//                       <SelectTrigger className="h-8 w-[90px] bg-input">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="5">5</SelectItem>
//                         <SelectItem value="10">10</SelectItem>
//                         <SelectItem value="20">20</SelectItem>
//                         <SelectItem value="50">50</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="bg-transparent"
//                       onClick={() => setPage((p) => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                     >
//                       Prev
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Page {page} of {totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="bg-transparent"
//                       onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                       disabled={page === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   )
// }
