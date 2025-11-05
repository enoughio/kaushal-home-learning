"use client"

export type MonthlySummary = {
  month: string // YYYY-MM
  present: number
  sessions: number
}

export function StudentAttendanceHistory({
  rows,
  title = "Attendance History",
}: {
  rows: MonthlySummary[]
  title?: string
}) {
  return (
    <section className="rounded-lg border bg-card text-card-foreground">
      <header className="flex items-center justify-between p-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-t bg-muted/30">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Month</th>
              <th className="px-4 py-2 text-left font-medium">Present</th>
              <th className="px-4 py-2 text-left font-medium">Total Sessions</th>
              <th className="px-4 py-2 text-left font-medium">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No history available.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const pct = r.sessions > 0 ? Math.round((r.present / r.sessions) * 100) : 0
                const monthLabel = new Date(r.month + "-01").toLocaleString(undefined, {
                  month: "long",
                  year: "numeric",
                })
                return (
                  <tr key={r.month} className="border-t">
                    <td className="px-4 py-2">{monthLabel}</td>
                    <td className="px-4 py-2">{r.present}</td>
                    <td className="px-4 py-2">{r.sessions}</td>
                    <td className="px-4 py-2">{pct}%</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
