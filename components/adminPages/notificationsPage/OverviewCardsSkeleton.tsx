"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function OverviewCardsSkeleton() {
  const cards = [1, 2, 3, 4]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-300 animate-pulse rounded" />
                <div className="h-6 w-16 bg-gray-400 animate-pulse rounded" />
              </div>
              <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}