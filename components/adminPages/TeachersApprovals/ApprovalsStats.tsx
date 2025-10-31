import { Card, CardContent } from '@/components/ui/card'

export default function ApprovalsStats({ pending }: { pending: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">{pending}</p>
            <p className="text-muted-foreground">Pending Applications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
