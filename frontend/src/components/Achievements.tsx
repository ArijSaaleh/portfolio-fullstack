import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Award, Calendar, ExternalLink, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { API_URL } from '../config'

interface Achievement {
  id: number
  title: string
  description: string
  category: 'award' | 'participation' | 'certification' | 'social'
  date: string
  images: string[]
  videoUrl?: string
  link?: string
  published: boolean
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    fetchAchievements()
  }, [])

  // Convert Google Drive URL to direct image URL
  const getImageUrl = (url: string) => {
    if (!url) return url;
    
    // Check if it's a Google Drive link
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      // Convert to direct image URL
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
    }
    
    // Check if it's already a direct link or thumbnail link
    if (url.includes('drive.google.com/thumbnail') || url.includes('drive.google.com/uc?')) {
      return url;
    }
    
    // Return original URL for other sources
    return url;
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/achievements`)
      const published = response.data.filter((a: Achievement) => a.published)
      setAchievements(published)
    } catch (error) {
      console.error('Error fetching achievements:', error)
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'award':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'certification':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'participation':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'social':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const categories = ['all', 'award', 'certification', 'participation', 'social']

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory)

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </section>
    )
  }

  if (achievements.length === 0) {
    return null
  }

  return (
    <section id="achievements" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Achievements & Participations
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Recognition, certifications, and community involvement
        </p>

        {/* Category filter */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card key={achievement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image gallery or video thumbnail */}
              {achievement.images && achievement.images.length > 0 && (
                <div className="aspect-video overflow-hidden bg-muted relative group">
                  <img
                    src={getImageUrl(achievement.images[currentImageIndex[achievement.id] || 0])}
                    alt={achievement.title}
                    className="w-full h-full object-cover transition-transform"
                  />
                  
                  {/* Navigation arrows for multiple images */}
                  {achievement.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIndex = currentImageIndex[achievement.id] || 0;
                          const newIndex = currentIndex === 0 ? achievement.images.length - 1 : currentIndex - 1;
                          setCurrentImageIndex(prev => ({ ...prev, [achievement.id]: newIndex }));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIndex = currentImageIndex[achievement.id] || 0;
                          const newIndex = (currentIndex + 1) % achievement.images.length;
                          setCurrentImageIndex(prev => ({ ...prev, [achievement.id]: newIndex }));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Dots indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {achievement.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({ ...prev, [achievement.id]: idx }));
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              (currentImageIndex[achievement.id] || 0) === idx
                                ? 'bg-white w-4'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)} flex items-center gap-1`}>
                    <Award className="w-3 h-3" />
                    {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(achievement.date)}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{achievement.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div 
                  className="mb-4 line-clamp-3 text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: achievement.description }}
                />

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  {achievement.videoUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={achievement.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-3 h-3" />
                        Watch
                      </a>
                    </Button>
                  )}
                  {achievement.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No {selectedCategory !== 'all' ? selectedCategory : ''} achievements found.
          </p>
        )}
      </div>
    </section>
  )
}
