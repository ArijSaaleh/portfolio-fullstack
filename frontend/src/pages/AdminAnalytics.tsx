import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import LineChart from "../components/analytics/LineChart"
import AnalyticsChart from "../components/analytics/AnalyticsChart"
import PopularContent from "../components/analytics/PopularContent"
import axios from "axios"
import { ArrowLeft, TrendingUp, Eye, FileText, MessageSquare } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalProjects: number
    totalBlogs: number
    totalExperiences: number
    totalAchievements: number
    totalMessages: number
    unreadMessages: number
    totalPageViews: number
    totalContentViews: number
    recentPageViews: number
    recentMessages: number
  }
  charts: {
    pageViewsByDay: Array<{ date: string; count: number }>
    topPages: Array<{ page: string; views: number }>
    topProjects: Array<{ id: number; title: string; thumbnail: string; views: number }>
    topBlogs: Array<{ id: number; title: string; thumbnail: string; views: number }>
  }
}

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.get('http://localhost:3000/api/analytics/dashboard', { headers })
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalPageViews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.overview.recentPageViews} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Content Views</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalContentViews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Projects, blogs & achievements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.overview.totalProjects + analytics.overview.totalBlogs + analytics.overview.totalAchievements}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.overview.totalProjects} projects, {analytics.overview.totalBlogs} blogs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalMessages}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.overview.unreadMessages} unread, {analytics.overview.recentMessages} this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <LineChart
            title="Page Views Trend"
            description="Daily page views over the last 30 days"
            data={analytics.charts.pageViewsByDay}
          />

          <AnalyticsChart
            title="Top Pages"
            description="Most visited pages"
            data={analytics.charts.topPages.map(p => ({
              label: p.page.length > 20 ? p.page.substring(0, 20) + '...' : p.page,
              value: p.views
            }))}
          />
        </div>

        {/* Popular Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PopularContent
            title="Most Viewed Projects"
            description="Top 5 projects by views"
            items={analytics.charts.topProjects}
          />

          <PopularContent
            title="Most Viewed Blogs"
            description="Top 5 blog posts by views"
            items={analytics.charts.topBlogs}
          />
        </div>
      </main>
    </div>
  )
}
