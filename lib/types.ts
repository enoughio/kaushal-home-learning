export type AttendanceStatus = "present" | "absent" | "none"
export type DayAttendance = {
  date: string // YYYY-MM-DD
  status: AttendanceStatus
}


export interface PaymentStatsProps {
  totalEarnings?: number
  pendingAmount?: number
  overdueAmount?: number
  totalHours?: number
}


//  {
//     id: "1",
//     name: "John Doe",
//     age: 16,
//     location: "Mumbai, Bandra",
//     phone: "+91 9876543210",
//     parentName: "Robert Doe",
//     parentPhone: "+91 9876543211",
//     skillsLearning: ["Mathematics", "Physics"],
//     joinedDate: "2024-01-01",
//     status: "active",
//   },


export interface StudentInfo{

  id: string
  name: string
  age: number
  location: string
  phone: string
  parentName: string
  parentPhone: string
  skillsLearning: string[]
  joinedDate: string // YYYY-MM-DD
  status: "active" | "inactive"
}