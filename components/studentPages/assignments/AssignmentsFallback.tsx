import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AssignmentsSectionFallback() {
  return (
    <div className="space-y-6">
      {/* AssignmentsStats Fallback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-14 bg-neutral-300 rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AssignmentCard list fallback */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse mb-2" />
                  <div className="flex gap-2 mt-1">
                    <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              <div className="h-24 bg-neutral-100 rounded animate-pulse" />
              <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}