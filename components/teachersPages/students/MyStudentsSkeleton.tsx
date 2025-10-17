import { Card, CardContent } from "@/components/ui/card";

export function MyStudentsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="h-10 bg-muted rounded-md" />
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="h-6 w-12 bg-muted rounded mb-2" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="h-6 w-12 bg-muted rounded mb-2" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="h-5 w-16 bg-muted rounded" />
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mt-2">
                <div className="h-3 w-36 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>

              {/* Parent Info */}
              <div className="h-16 bg-muted rounded-lg" />

              {/* Subjects */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-5 w-14 bg-muted rounded" />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-border">
                <div className="h-8 w-full bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}