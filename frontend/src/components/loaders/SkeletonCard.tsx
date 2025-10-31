import { Card } from "../ui/card"

interface SkeletonCardProps {
  variant?: 'project' | 'blog' | 'experience' | 'achievement'
}

export default function SkeletonCard({ variant = 'project' }: SkeletonCardProps) {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-muted" />
      
      <div className="p-6 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-muted rounded w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        
        {/* Tags/metadata skeleton */}
        {variant === 'project' && (
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-muted rounded w-16" />
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-6 bg-muted rounded w-14" />
          </div>
        )}
        
        {variant === 'blog' && (
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
        )}
        
        {variant === 'experience' && (
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-40" />
          </div>
        )}
      </div>
    </Card>
  )
}
