// 'use client'

// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, XCircle, User, Clock, ChevronLeft, ChevronRight } from "lucide-react";
// import type { AttendanceRecord } from "@/lib/types";

// type Props = {
//   attendance: AttendanceRecord[];
//   monthISO: string; // YYYY-MM
// };

// function parseMonthISO(monthISO: string) {
//   const [y, m] = monthISO.split("-").map((s) => parseInt(s, 10));
//   return new Date(y, (m || 1) - 1, 1);
// }

// function monthToISO(date: Date) {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
// }


// export default function AttendanceCalender({ attendance }: Props) {
  // const currentMonth = parseMonthISO(monthISO);

  // function fmtISO(d: Date) {
  //   const y = d.getFullYear();
  //   const m = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   return `${y}-${m}-${day}`;
  // }

  // Build month grid like before
  // const year = currentMonth.getFullYear();
  // const month = currentMonth.getMonth();
  // const firstDay = new Date(year, month, 1);
  // const startWeekday = firstDay.getDay();
  // const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const cells: Array<{
//     date: Date;
//     inMonth: boolean;
//     status: "present" | "absent" | "none";
//     duration?: number;
//     teacherName?: string;
//     subjects?: string[];
//   }> = [];

//   // Leading
//   for (let i = 0; i < startWeekday; i++) {
//     const d = new Date(year, month, 0 - (startWeekday - 1 - i));
//     cells.push({ date: d, inMonth: false, status: "none" });
//   }

//   // Current month days
//   for (let day = 1; day <= daysInMonth; day++) {
//     const d = new Date(year, month, day);
//     const key = fmtISO(d);
//     const recs = attendance.filter((r) => r.date.startsWith(key));
//     let status: "present" | "absent" | "none" = "none";
//     let duration = 0;
//     let teacherName: string | undefined;
//     const subjects = new Set<string>();
//     if (recs.length > 0) {
//       const anyPresent = recs.some((r) => r.status === "present");
//       const anyAbsent = recs.some((r) => r.status === "absent");
//       if (anyPresent) status = "present";
//       else if (anyAbsent) status = "absent";
//       duration = recs.filter((r) => r.status === "present").reduce((s, r) => s + (r.duration || 0), 0);
//       teacherName = recs[0]?.teacherName;
//       recs.forEach((r) => subjects.add(r.subject));
//     }
//     cells.push({ date: d, inMonth: true, status, duration, teacherName, subjects: Array.from(subjects) });
//   }

//   while (cells.length % 7 !== 0) {
//     const last = cells[cells.length - 1].date;
//     const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
//     cells.push({ date: next, inMonth: false, status: "none" });
//   }

//   const weeks: typeof cells[] = [];
//   for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

//   const prev = new Date(year, month - 1, 1);
//   const next = new Date(year, month + 1, 1);

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Monthly Attendance Calendar</CardTitle>
//         <div className="flex items-center gap-2">
//           <Link href={`/student/attendance?month=${monthToISO(prev)}`} className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-muted">
//             <ChevronLeft className="h-4 w-4" />
//           </Link>
//           <div className="text-sm font-medium">{currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
//           <Link href={`/student/attendance?month=${monthToISO(next)}`} className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-muted">
//             <ChevronRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-7 gap-2 text-xs md:text-sm">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div key={d} className="text-center text-muted-foreground font-medium">{d}</div>
//           ))}
//           {weeks.map((week, wi) =>
//             week.map((cell, di) => {
//               const isPresent = cell.status === "present" && cell.inMonth;
//               const isAbsent = cell.status === "absent" && cell.inMonth;
//               const isOtherMonth = !cell.inMonth;
//               return (
//                 <div
//                   key={`${wi}-${di}`}
//                   className={[
//                     "rounded-md border p-2 min-h-20 md:min-h-24",
//                     isOtherMonth ? "opacity-40" : "",
//                     isPresent ? "border-chart-2 bg-[color:var(--chart-2)]/10" : "",
//                     isAbsent ? "border-destructive bg-destructive/10" : "",
//                     !isPresent && !isAbsent && !isOtherMonth ? "bg-muted" : "",
//                   ].join(" ")}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs">{cell.date.getDate()}</span>
//                     {isPresent && <CheckCircle className="h-4 w-4 text-chart-2" />}
//                     {isAbsent && <XCircle className="h-4 w-4 text-destructive" />}
//                   </div>
//                   {cell.inMonth && (isPresent || isAbsent) && (
//                     <div className="mt-2 space-y-1">
//                       {cell.teacherName && (
//                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                           <User className="h-3 w-3" />
//                           <span className="truncate">{cell.teacherName}</span>
//                         </div>
//                       )}
//                       {isPresent && cell.duration ? (
//                         <div className="flex items-center gap-1 text-xs">
//                           <Clock className="h-3 w-3" />
//                           <span>{Math.round((cell.duration || 0) / 60)} hr</span>
//                         </div>
//                       ) : null}
//                       {cell.subjects && cell.subjects.length > 0 ? <div className="text-xs truncate">{cell.subjects.join(", ")}</div> : null}
//                     </div>
//                   )}
//                 </div>
//               );
//             }),
//           )}

//           {/* Legend */}
//         </div>

//         <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
//           <div className="flex items-center gap-2">
//             <span className="inline-block h-3 w-3 rounded bg-[color:var(--chart-2)]/30 border border-[color:var(--chart-2)]" />
//             Present
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="inline-block h-3 w-3 rounded bg-destructive/30 border border-destructive" />
//             Absent
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="inline-block h-3 w-3 rounded bg-muted border border-border" />
//             No record
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }