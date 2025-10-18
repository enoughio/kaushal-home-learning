// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {  type UserManagement } from "@/lib/types"
// import { Users, UserPlus, Check } from "lucide-react"

// export default function TeacherAssignmentsPage() {
//   const [studentsWithoutTeachers, setStudentsWithoutTeachers] = useState<UserManagement[]>([])
//   const [teachers, setTeachers] = useState<UserManagement[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedStudent, setSelectedStudent] = useState<string>("")
//   const [selectedTeacher, setSelectedTeacher] = useState<string>("")
//   const [assigning, setAssigning] = useState(false)
//   const [successMessage, setSuccessMessage] = useState("")

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const allUsers = await getAllUsers()
//         const studentsNoTeacher = allUsers.filter((u) => u.role === "student" && u.status === "active")
//         const activeTeachers = allUsers.filter((u) => u.role === "teacher" && u.status === "active")

//         setStudentsWithoutTeachers(studentsNoTeacher)
//         setTeachers(activeTeachers)
//       } catch (error) {
//         console.error("Failed to load data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadData()
//   }, [])

//   const handleAssign = async () => {
//     if (!selectedStudent || !selectedTeacher) {
//       alert("Please select both a student and a teacher")
//       return
//     }

//     setAssigning(true)
//     try {
//       await assignTeacherToStudent(selectedTeacher, selectedStudent)
//       setSuccessMessage(`Teacher assigned successfully!`)
//       setTimeout(() => setSuccessMessage(""), 3000)

//       // Reload data
//       const allUsers = await getAllUsers()
//       const studentsNoTeacher = allUsers.filter((u) => u.role === "student" && u.status === "active")
//       setStudentsWithoutTeachers(studentsNoTeacher)
//       setSelectedStudent("")
//       setSelectedTeacher("")
//     } catch (error) {
//       console.error("Failed to assign teacher:", error)
//       alert("Failed to assign teacher")
//     } finally {
//       setAssigning(false)
//     }
//   }

//   if (loading) {
//     return (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-2 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//     )
//   }

//   return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">Teacher Assignments</h1>
//           <p className="text-muted-foreground">Assign teachers to students without a teacher</p>
//         </div>

//         {/* Assignment Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <UserPlus className="h-5 w-5" />
//               Assign Teacher to Student
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {successMessage && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
//                 <Check className="h-4 w-4" />
//                 {successMessage}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Select Student</label>
//                 <Select value={selectedStudent} onValueChange={setSelectedStudent}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose a student" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {studentsWithoutTeachers.map((student) => (
//                       <SelectItem key={student.id} value={student.id}>
//                         {student.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block">Select Teacher</label>
//                 <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose a teacher" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {teachers.map((teacher) => (
//                       <SelectItem key={teacher.id} value={teacher.id}>
//                         {teacher.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-end">
//                 <Button
//                   onClick={handleAssign}
//                   disabled={assigning || !selectedStudent || !selectedTeacher}
//                   className="w-full"
//                 >
//                   {assigning ? "Assigning..." : "Assign Teacher"}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Students Without Teachers */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5" />
//               Students Without Teachers ({studentsWithoutTeachers.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {studentsWithoutTeachers.length === 0 ? (
//               <p className="text-muted-foreground text-center py-8">All students have been assigned teachers!</p>
//             ) : (
//               <div className="space-y-2">
//                 {studentsWithoutTeachers.map((student) => (
//                   <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
//                     <div>
//                       <p className="font-medium">{student.name}</p>
//                       <p className="text-sm text-muted-foreground">{student.email}</p>
//                     </div>
//                     <Badge variant="secondary">Unassigned</Badge>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//   )
// }



import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page