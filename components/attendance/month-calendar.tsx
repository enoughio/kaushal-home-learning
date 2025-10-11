"use client"
import { cn } from "@/lib/utils"

type AttendanceStatus = "present" | "absent" | "none"

export type DayAttendance = {
  date: string // YYYY-MM-DD
  status: AttendanceStatus
}

export function MonthCalendar({
  year,
  month, // 1-12
  records,
  onPrevMonth,
  onNextMonth,
  title = "Attendance",
}: {
  year: number
  month: number
  records: DayAttendance[]
  onPrevMonth?: () => void
  onNextMonth?: () => void
  title?: string
}) {
  const firstDay = new Date(year, month - 1, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7 // Monday=0
  const daysInMonth = new Date(year, month, 0).getDate()

  const map = new Map<string, AttendanceStatus>()
  for (const r of records) map.set(r.date, r.status)

  const cells: Array<{ day?: number; date?: string; status?: AttendanceStatus }> = []

  for (let i = 0; i < startWeekday; i++) cells.push({})

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    const iso = date.toISOString().slice(0, 10)
    cells.push({
      day: d,
      date: iso,
      status: map.get(iso) ?? "none",
    })
  }

  const monthName = firstDay.toLocaleString(undefined, { month: "long", year: "numeric" })

  const Dot = ({ status }: { status?: AttendanceStatus }) => {
    const bg =
      status === "present" ? "bg-emerald-500" : status === "absent" ? "bg-destructive" : "bg-muted-foreground/30"
    return <span aria-hidden className={cn("inline-block h-2 w-2 rounded-full", bg)} />
  }

  return (
    <section className="rounded-lg border bg-card text-card-foreground">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-pretty">{title}</h2>
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-destructive" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span>No entry</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            aria-label="Previous month"
          >
            {"<"}
          </button>
          <div className="text-sm font-medium">{monthName}</div>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            aria-label="Next month"
          >
            {">"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px border-t bg-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="bg-muted/30 p-2 text-center text-xs font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border">
        {cells.map((c, i) => (
          <div key={i} className="min-h-16 bg-background p-2">
            {c.day ? (
              <div className="flex items-start justify-between">
                <span className="text-xs text-muted-foreground">{c.day}</span>
                <Dot status={c.status} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
