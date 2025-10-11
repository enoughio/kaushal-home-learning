import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SalariesTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="h-5 w-48 bg-neutral-200 rounded animate-pulse"></div>
        </CardTitle>
        <div className="h-8 w-36 bg-neutral-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              {/* Grid matching SalaryRow */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-neutral-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}