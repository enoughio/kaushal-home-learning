"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationTypesSkeleton() {
  const placeholders = [1, 2, 3]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {placeholders.map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
              <div className="h-4 w-40 bg-gray-300 animate-pulse rounded" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Big Number */}
              <div className="text-center space-y-2">
                <div className="h-8 w-16 mx-auto bg-gray-300 animate-pulse rounded" />
                <div className="h-3 w-32 mx-auto bg-gray-200 animate-pulse rounded" />
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <div className="h-3 w-28 bg-gray-300 animate-pulse rounded" />
                    <div className="h-3 w-10 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}