import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PendingApplicationsLoader = ({ count = 2 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="h-6 w-20 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-3 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingApplicationsLoader;
