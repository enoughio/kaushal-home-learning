import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeesTableSkeletonLoader = ({ rows }: { rows: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-5 w-44 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(rows)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {/* Columns grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                  {/* Student Info */}
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Monthly Fee */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-2 w-16 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Status Badge */}
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Reminders */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-10 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeesTableSkeletonLoader;