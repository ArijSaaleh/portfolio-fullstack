import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Eye } from "lucide-react"

interface ContentItem {
  id: number
  title: string
  thumbnail: string
  views: number
}

interface PopularContentProps {
  title: string
  description?: string
  items: ContentItem[]
}

export default function PopularContent({ title, description, items }: PopularContentProps) {
  if (!items || items.length === 0) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
