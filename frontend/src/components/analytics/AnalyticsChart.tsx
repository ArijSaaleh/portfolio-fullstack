import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface DataPoint {
  label: string
  value: number
}

interface AnalyticsChartProps {
  title: string
  description?: string
  data: DataPoint[]
  type?: 'bar' | 'line'
}

export default function AnalyticsChart({ title, description, data }: AnalyticsChartProps) {
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

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-muted-foreground truncate">
                {item.label}
              </div>
              <div className="flex-1 h-8 bg-secondary rounded overflow-hidden relative">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
