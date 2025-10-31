import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface DataPoint {
  date: string
  count: number
}

interface LineChartProps {
  title: string
  description?: string
  data: DataPoint[]
}

export default function LineChart({ title, description, data }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map(d => d.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end gap-1">
          {data.slice(-30).map((item, index) => {
            const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-secondary rounded-t relative flex-1 flex items-end">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-background px-1 rounded whitespace-nowrap">
                      {item.count}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground rotate-45 origin-top-left mt-2">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
