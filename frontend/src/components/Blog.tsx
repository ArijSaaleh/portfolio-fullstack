import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import SearchBar from "./SearchBar"
import FilterBar from "./FilterBar"
import SkeletonCard from "./loaders/SkeletonCard"
import FadeIn from "./animations/FadeIn"
import axios from "axios"
import { Calendar, Clock } from "lucide-react"
import { API_URL } from "../config"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  thumbnail: string
  pdfUrl?: string
  publishedAt: string
  readTime: string
  type: 'article' | 'video' | 'tutorial'
  published: boolean
}

export default function Blog() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Convert Google Drive URL to embeddable format (for PDFs)
  const getEmbedUrl = (url: string) => {
    if (!url) return url;
    
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    
    if (url.includes('drive.google.com') && url.includes('/preview')) {
      return url;
    }
    
    return url;
  };

  // Convert Google Drive URL to direct image URL (for thumbnails)
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

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs`)
      // Filter only published posts
      const publishedPosts = response.data.filter((post: BlogPost) => post.published)
      setPosts(publishedPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(post => post.type === selectedType)
    }

    // Sort posts
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } else if (sortBy === 'title') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    }

    return filtered
  }, [posts, searchQuery, selectedType, sortBy])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available'
    
    // Handle various date formats
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // If it's already a formatted string (like "2024-01-15"), display it as is
      return dateString
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const typeOptions = [
    { label: 'Article', value: 'article' },
    { label: 'Video', value: 'video' },
    { label: 'Tutorial', value: 'tutorial' }
  ]

  const sortOptions = [
    { label: 'Latest', value: 'date' },
    { label: 'Title', value: 'title' }
  ]

  return (
    <section id="blog" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Latest Insights & Creations
          </h2>
        </FadeIn>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search blog posts..."
            className="max-w-md mx-auto"
          />
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <FilterBar
              options={typeOptions}
              selected={selectedType}
              onChange={setSelectedType}
              label="Type"
            />
            <FilterBar
              options={sortOptions}
              selected={sortBy}
              onChange={setSortBy}
              label="Sort By"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            <>
              <SkeletonCard variant="blog" />
              <SkeletonCard variant="blog" />
              <SkeletonCard variant="blog" />
              <SkeletonCard variant="blog" />
            </>
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {posts.length === 0 ? 'No blog posts available yet.' : 'No blog posts match your search criteria.'}
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 100} direction="up">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => navigate(`/blog/${post.slug}`)}>
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    {post.thumbnail ? (
                      <img 
                        src={getImageUrl(post.thumbnail)} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : post.pdfUrl ? (
                      <div className="w-full h-full relative">
                        <iframe
                          src={getEmbedUrl(post.pdfUrl)}
                          className="w-full h-[120%] absolute -top-2 pointer-events-none scale-105"
                          title={`${post.title} PDF preview`}
                          style={{ border: 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm">No preview available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div 
                        className="line-clamp-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span className="capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {post.type}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button size="sm" variant="outline">
                      {post.type === 'video' ? 'Watch Now' : 'Read More'}
                    </Button>
                  </CardFooter>
                </Card>
              </FadeIn>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
