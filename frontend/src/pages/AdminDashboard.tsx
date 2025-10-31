import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { API_URL } from "../config"
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Briefcase, 
  Award, 
  MessageSquare, 
  BarChart3, 
  Home,
  LogOut,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import RichTextEditor from "../components/RichTextEditor"
import axios from "axios"

interface Project {
  id: number
  title: string
  description: string
  challenge?: string
  contribution?: string
  technologies: string[]
  thumbnail: string
  heroImage?: string
  videoUrl?: string
  githubUrl?: string
  liveUrl?: string
  accuracy?: string
  speed?: string
  images?: string[]
  startDate?: string
  endDate?: string
  published: boolean
}

interface Blog {
  id: number
  title: string
  excerpt: string
  content: string
  published: boolean
  createdAt: string
}

interface Experience {
  id: number
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  description: string
}

interface Achievement {
  id: number
  title: string
  category: string
  date: string
  description: string
}

interface Message {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ projects: 0, blogs: 0, experiences: 0, achievements: 0, messages: 0 })
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [projectsRes, blogsRes, experiencesRes, achievementsRes, messagesRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects`, { headers }),
        axios.get(`${API_URL}/api/blogs`, { headers }),
        axios.get(`${API_URL}/api/experiences`, { headers }),
        axios.get(`${API_URL}/api/achievements`, { headers }),
        axios.get(`${API_URL}/api/contact`, { headers })
      ])

      setProjects(projectsRes.data)
      setBlogs(blogsRes.data)
      setExperiences(experiencesRes.data)
      setAchievements(achievementsRes.data)
      setMessages(messagesRes.data)

      setStats({
        projects: projectsRes.data.length,
        blogs: blogsRes.data.length,
        experiences: experiencesRes.data.length,
        achievements: achievementsRes.data.length,
        messages: messagesRes.data.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleAdd = (section: string) => {
    setModalType('add')
    setSelectedItem(null)
    // Initialize empty form based on section
    if (section === 'projects') {
      setFormData({ 
        title: '', 
        description: '', 
        challenge: '',
        contribution: '',
        technologies: '', 
        thumbnail: '',
        heroImage: '',
        videoUrl: '',
        githubUrl: '',
        liveUrl: '',
        accuracy: '',
        speed: '',
        images: '',
        startDate: '',
        endDate: '',
        published: true 
      })
    } else if (section === 'blogs') {
      setFormData({ 
        title: '', 
        slug: '', 
        thumbnail: '', 
        excerpt: '', 
        content: '', 
        type: 'article',
        readTime: '',
        videoUrl: '',
        pdfUrl: '',
        publishedAt: new Date().toISOString().split('T')[0], 
        published: true 
      })
    } else if (section === 'experiences') {
      setFormData({ company: '', companyLogo: '', position: '', location: '', startDate: '', endDate: '', description: '' })
    } else if (section === 'achievements') {
      setFormData({ title: '', category: 'award', date: '', description: '', images: '', videoUrl: '', link: '', published: true })
    }
    setShowModal(true)
  }

  const handleEdit = (item: any) => {
    setModalType('edit')
    setSelectedItem(item)
    // Pre-fill form with existing data
    if (activeSection === 'projects') {
      setFormData({ 
        title: item.title, 
        description: item.description,
        challenge: item.challenge || '',
        contribution: item.contribution || '',
        technologies: item.technologies?.join(', ') || '',
        thumbnail: item.thumbnail || '',
        heroImage: item.heroImage || '',
        videoUrl: item.videoUrl || '',
        githubUrl: item.githubUrl || '',
        liveUrl: item.liveUrl || '',
        accuracy: item.accuracy || '',
        speed: item.speed || '',
        images: item.images?.join(', ') || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        published: item.published 
      })
    } else if (activeSection === 'blogs') {
      setFormData({ 
        title: item.title,
        slug: item.slug || '',
        thumbnail: item.thumbnail || '',
        excerpt: item.excerpt, 
        content: item.content,
        type: item.type || 'article',
        readTime: item.readTime || '',
        videoUrl: item.videoUrl || '',
        pdfUrl: item.pdfUrl || '',
        publishedAt: item.publishedAt || new Date().toISOString().split('T')[0],
        published: item.published 
      })
    } else if (activeSection === 'experiences') {
      setFormData({ 
        company: item.company,
        companyLogo: item.companyLogo || '',
        position: item.position,
        location: item.location || '',
        startDate: item.startDate,
        endDate: item.endDate || '',
        description: item.description
      })
    } else if (activeSection === 'achievements') {
      setFormData({ 
        title: item.title, 
        category: item.category, 
        date: item.date,
        description: item.description,
        images: item.images?.join(', ') || '',
        videoUrl: item.videoUrl || '',
        link: item.link || '',
        published: item.published
      })
    }
    setShowModal(true)
  }

  const handleView = (item: any) => {
    setModalType('view')
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleDelete = async (section: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`${API_URL}/api/${section}/${id}`, { headers })
      fetchStats()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      // Prepare data based on section
      let dataToSend = { ...formData }
      
      // Convert comma-separated strings to arrays
      if (activeSection === 'projects') {
        if (formData.technologies) {
          dataToSend.technologies = formData.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        }
        if (formData.images) {
          dataToSend.images = formData.images.split(',').map((i: string) => i.trim()).filter((i: string) => i)
        } else {
          dataToSend.images = []
        }
      }
      
      if (activeSection === 'achievements' && formData.images) {
        dataToSend.images = formData.images.split(',').map((i: string) => i.trim()).filter((i: string) => i)
      }
      
      if (modalType === 'add') {
        await axios.post(`${API_URL}/api/${activeSection}`, dataToSend, { headers })
      } else {
        await axios.put(`${API_URL}/api/${activeSection}/${selectedItem.id}`, dataToSend, { headers })
      }
      
      setShowModal(false)
      fetchStats()
      alert(modalType === 'add' ? 'Item created successfully!' : 'Item updated successfully!')
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "experiences", label: "Experiences", icon: Briefcase },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: stats.messages },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("projects")}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium text-muted-foreground">Projects</CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{stats.projects}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FolderKanban className="w-4 h-4" />
                    <span>Total projects</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("blogs")}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium text-muted-foreground">Blog Posts</CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{stats.blogs}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Published articles</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("experiences")}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium text-muted-foreground">Experiences</CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{stats.experiences}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>Work history</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveSection("achievements")}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium text-muted-foreground">Achievements</CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{stats.achievements}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Awards & certs</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-primary/30 cursor-pointer" onClick={() => setActiveSection("messages")}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium text-muted-foreground">Messages</CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{stats.messages}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>New inquiries</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump to commonly used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-auto py-4 flex-col gap-2" onClick={() => setActiveSection("analytics")}>
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2" variant="outline" onClick={() => setActiveSection("projects")}>
                    <FolderKanban className="w-6 h-6" />
                    <span>Manage Projects</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2" variant="outline" onClick={() => setActiveSection("blogs")}>
                    <FileText className="w-6 h-6" />
                    <span>Manage Blogs</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2" variant="outline" onClick={() => setActiveSection("messages")}>
                    <MessageSquare className="w-6 h-6" />
                    <span>View Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )
      case "analytics":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Analytics Overview</h3>
              <p className="text-muted-foreground">View detailed insights and statistics</p>
            </div>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium">Total Content</CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">
                    {stats.projects + stats.blogs + stats.experiences + stats.achievements}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All portfolio items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium">Projects</CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">{stats.projects}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Total projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium">Blog Posts</CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">{stats.blogs}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Published articles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs font-medium">Messages</CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">{stats.messages}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Contact inquiries</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Breakdown</CardTitle>
                  <CardDescription>Distribution of your portfolio content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Projects</p>
                          <p className="text-xs text-muted-foreground">Portfolio showcases</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">{stats.projects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Blogs</p>
                          <p className="text-xs text-muted-foreground">Technical articles</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">{stats.blogs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">Experiences</p>
                          <p className="text-xs text-muted-foreground">Work history</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">{stats.experiences}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium">Achievements</p>
                          <p className="text-xs text-muted-foreground">Awards & certs</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">{stats.achievements}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates to your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Portfolio items updated</p>
                        <p className="text-xs text-muted-foreground">Total: {stats.projects + stats.blogs + stats.experiences + stats.achievements} items</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New messages received</p>
                        <p className="text-xs text-muted-foreground">{stats.messages} contact inquiries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Content published</p>
                        <p className="text-xs text-muted-foreground">
                          {projects.filter(p => p.published).length} projects, {blogs.filter(b => b.published).length} blogs
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "projects":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">Projects ({projects.length})</h3>
                <p className="text-muted-foreground">Manage your portfolio projects</p>
              </div>
              <Button onClick={() => handleAdd('projects')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            <div className="grid gap-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No projects yet. Click "Add Project" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {project.thumbnail && (
                          <img src={project.thumbnail} alt={project.title} className="w-24 h-24 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies?.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                            {project.technologies?.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{project.technologies.length - 3} more</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${project.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {project.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(project)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(project)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('projects', project.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )
      case "blogs":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">Blog Posts ({blogs.length})</h3>
                <p className="text-muted-foreground">Manage your blog articles</p>
              </div>
              <Button onClick={() => handleAdd('blogs')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </div>
            <div className="grid gap-4">
              {blogs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No blog posts yet. Click "Add Blog Post" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                blogs.map((blog) => (
                  <Card key={blog.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded ${blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(blog)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(blog)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('blogs', blog.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )
      case "experiences":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">Experiences ({experiences.length})</h3>
                <p className="text-muted-foreground">Manage your work history</p>
              </div>
              <Button onClick={() => handleAdd('experiences')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            <div className="grid gap-4">
              {experiences.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No experiences yet. Click "Add Experience" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                experiences.map((exp) => (
                  <Card key={exp.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-1">{exp.position}</h4>
                          <p className="text-sm text-primary mb-2">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(exp)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('experiences', exp.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )
      case "achievements":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">Achievements ({achievements.length})</h3>
                <p className="text-muted-foreground">Manage your awards and accomplishments</p>
              </div>
              <Button onClick={() => handleAdd('achievements')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>
            <div className="grid gap-4">
              {achievements.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No achievements yet. Click "Add Achievement" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                achievements.map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-1">{achievement.title}</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{achievement.category}</span>
                            <span className="text-xs text-muted-foreground">{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{achievement.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(achievement)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('achievements', achievement.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )
      case "messages":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Contact Messages ({messages.length})</h3>
              <p className="text-muted-foreground">View inquiries from your portfolio</p>
            </div>
            <div className="grid gap-4">
              {messages.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No messages yet.</p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{message.name}</h4>
                            <span className="text-sm text-muted-foreground">{message.email}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                          <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(message)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('contact', message.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )
      default:
        return null
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard": return { title: "Dashboard Overview", description: "Welcome back! Here's your portfolio summary." }
      case "analytics": return { title: "Analytics", description: "Detailed insights and statistics" }
      case "projects": return { title: "Projects", description: "Manage your portfolio projects" }
      case "blogs": return { title: "Blogs", description: "Manage your blog posts" }
      case "experiences": return { title: "Experiences", description: "Manage your work history" }
      case "achievements": return { title: "Achievements", description: "Manage your accomplishments" }
      case "messages": return { title: "Messages", description: "View contact inquiries" }
      default: return { title: "Dashboard", description: "" }
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-muted/10 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-background border-r border-border transition-all duration-300 flex flex-col fixed h-full z-20`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground mt-2 border-t border-border pt-4"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">View Portfolio</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-3xl font-bold">{getSectionTitle().title}</h1>
            <p className="text-muted-foreground">{getSectionTitle().description}</p>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Modal for Add/Edit/View */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent onClose={() => setShowModal(false)} size={modalType === 'view' || activeSection === 'blogs' ? 'xl' : 'lg'}>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'add' && `Add ${activeSection.slice(0, -1)}`}
              {modalType === 'edit' && `Edit ${activeSection.slice(0, -1)}`}
              {modalType === 'view' && `View Details`}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'add' && `Create a new ${activeSection.slice(0, -1)}`}
              {modalType === 'edit' && `Update ${activeSection.slice(0, -1)} information`}
              {modalType === 'view' && `View full details`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            {modalType === 'view' ? (
              <div className="space-y-4">
                {activeSection === 'projects' && selectedItem && (
                  <>
                    <div>
                      <label className="text-sm font-semibold">Title</label>
                      <p className="text-sm text-muted-foreground">{selectedItem.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Description</label>
                      <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Technologies</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedItem.technologies?.map((tech: string, idx: number) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeSection === 'blogs' && selectedItem && (
                  <>
                    <div>
                      <label className="text-sm font-semibold">Title</label>
                      <p className="text-sm text-muted-foreground">{selectedItem.title}</p>
                    </div>
                    {(selectedItem.thumbnail || selectedItem.pdfUrl) && (
                      <div>
                        <label className="text-sm font-semibold">Preview</label>
                        <div className="mt-2 rounded-lg overflow-hidden bg-muted">
                          {selectedItem.thumbnail ? (
                            <img 
                              src={selectedItem.thumbnail} 
                              alt={selectedItem.title}
                              className="w-full h-64 object-cover"
                            />
                          ) : selectedItem.pdfUrl ? (
                            <iframe
                              src={`${selectedItem.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              className="w-full h-64"
                              title={`${selectedItem.title} PDF preview`}
                              style={{ border: 'none' }}
                            />
                          ) : null}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold">Excerpt</label>
                      <p className="text-sm text-muted-foreground">{selectedItem.excerpt}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Content</label>
                      <div className="text-sm text-muted-foreground max-h-96 overflow-y-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
                    </div>
                    {selectedItem.pdfUrl && (
                      <div>
                        <label className="text-sm font-semibold">PDF Document</label>
                        <a
                          href={selectedItem.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block mt-1"
                        >
                          View PDF →
                        </a>
                      </div>
                    )}
                  </>
                )}
                {activeSection === 'messages' && selectedItem && (
                  <>
                    <div>
                      <label className="text-sm font-semibold">From</label>
                      <p className="text-sm text-muted-foreground">{selectedItem.name} ({selectedItem.email})</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Message</label>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedItem.message}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Received</label>
                      <p className="text-sm text-muted-foreground">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Projects Form */}
                {activeSection === 'projects' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title *</label>
                      <Input 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter project title"
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description *</label>
                      <RichTextEditor
                        value={formData.description || ''}
                        onChange={(value) => setFormData({...formData, description: value})}
                        placeholder="Enter detailed project description with formatting"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Challenge</label>
                      <Textarea 
                        value={formData.challenge || ''} 
                        onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                        placeholder="What problem did this project solve?"
                        rows={3}
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Contribution</label>
                      <Textarea 
                        value={formData.contribution || ''} 
                        onChange={(e) => setFormData({...formData, contribution: e.target.value})}
                        placeholder="What was your role and contribution to this project?"
                        rows={3}
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Technologies (comma-separated) *</label>
                      <Input 
                        value={formData.technologies || ''} 
                        onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                        placeholder="React, Node.js, TypeScript, PostgreSQL"
                        className="text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Thumbnail URL *</label>
                        <Input 
                          value={formData.thumbnail || ''} 
                          onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                          placeholder="https://example.com/thumbnail.jpg"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Hero Image URL</label>
                        <Input 
                          value={formData.heroImage || ''} 
                          onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
                          placeholder="https://example.com/hero.jpg"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                        <Input 
                          value={formData.githubUrl || ''} 
                          onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                          placeholder="https://github.com/user/repo"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Live URL</label>
                        <Input 
                          value={formData.liveUrl || ''} 
                          onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                          placeholder="https://project-demo.com"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Video URL</label>
                        <Input 
                          value={formData.videoUrl || ''} 
                          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                          placeholder="https://youtube.com/watch?v=..."
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Accuracy/Performance Metric</label>
                        <Input 
                          value={formData.accuracy || ''} 
                          onChange={(e) => setFormData({...formData, accuracy: e.target.value})}
                          placeholder="95% accuracy"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Speed/Efficiency Metric</label>
                        <Input 
                          value={formData.speed || ''} 
                          onChange={(e) => setFormData({...formData, speed: e.target.value})}
                          placeholder="2x faster"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Additional Images (comma-separated URLs)</label>
                      <Textarea 
                        value={formData.images || ''} 
                        onChange={(e) => setFormData({...formData, images: e.target.value})}
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        rows={2}
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Separate multiple image URLs with commas</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Date</label>
                        <Input 
                          type="date"
                          value={formData.startDate || ''} 
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Date</label>
                        <Input 
                          type="date"
                          value={formData.endDate || ''} 
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="published-project"
                        checked={formData.published || false}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="published-project" className="text-sm font-medium">Publish to portfolio</label>
                    </div>
                  </>
                )}

                {/* Blogs Form */}
                {activeSection === 'blogs' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title *</label>
                      <Input 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter blog title"
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Slug *</label>
                      <Input 
                        value={formData.slug || ''} 
                        onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        placeholder="blog-post-url-slug"
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-1">URL-friendly version of the title</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Thumbnail URL *</label>
                      <Input 
                        value={formData.thumbnail || ''} 
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Excerpt *</label>
                      <Textarea 
                        value={formData.excerpt || ''} 
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        placeholder="Short description for blog preview"
                        rows={3}
                        className="text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content *</label>
                      <RichTextEditor
                        value={formData.content || ''}
                        onChange={(value) => setFormData({...formData, content: value})}
                        placeholder="Write your blog post content here with full formatting options..."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Type *</label>
                        <select
                          value={formData.type || 'article'}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-base"
                        >
                          <option value="article">Article</option>
                          <option value="video">Video</option>
                          <option value="tutorial">Tutorial</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Read Time</label>
                        <Input 
                          value={formData.readTime || ''} 
                          onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                          placeholder="5 min read"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Video URL</label>
                        <Input 
                          value={formData.videoUrl || ''} 
                          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                          placeholder="https://youtube.com/..."
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">PDF URL</label>
                        <Input 
                          value={formData.pdfUrl || ''} 
                          onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                          placeholder="https://example.com/document.pdf"
                          className="text-base"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Link to PDF file or document</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Publish Date *</label>
                        <Input 
                          type="date"
                          value={formData.publishedAt || ''} 
                          onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="published-blog"
                        checked={formData.published !== false}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="published-blog" className="text-sm font-medium">Publish to blog</label>
                    </div>
                  </>
                )}

                {/* Experiences Form */}
                {activeSection === 'experiences' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company *</label>
                        <Input 
                          value={formData.company || ''} 
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Company name"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Logo URL</label>
                        <Input 
                          value={formData.companyLogo || ''} 
                          onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                          placeholder="https://example.com/logo.png"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Position *</label>
                        <Input 
                          value={formData.position || ''} 
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          placeholder="Job title"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input 
                          value={formData.location || ''} 
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="City, Country"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Date *</label>
                        <Input 
                          type="date"
                          value={formData.startDate || ''} 
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Date (Leave empty if current)</label>
                        <Input 
                          type="date"
                          value={formData.endDate || ''} 
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description *</label>
                      <RichTextEditor
                        value={formData.description || ''}
                        onChange={(value) => setFormData({...formData, description: value})}
                        placeholder="Describe your responsibilities, achievements, and key contributions..."
                      />
                    </div>
                  </>
                )}

                {/* Achievements Form */}
                {activeSection === 'achievements' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title *</label>
                      <Input 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Achievement title"
                        className="text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category *</label>
                        <select
                          value={formData.category || 'award'}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-base"
                        >
                          <option value="award">Award</option>
                          <option value="participation">Participation</option>
                          <option value="certification">Certification</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date *</label>
                        <Input 
                          type="date"
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description *</label>
                      <RichTextEditor
                        value={formData.description || ''}
                        onChange={(value) => setFormData({...formData, description: value})}
                        placeholder="Describe the achievement, its significance, and any notable details..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Image URLs (comma-separated)</label>
                      <Input 
                        value={formData.images || ''} 
                        onChange={(e) => setFormData({...formData, images: e.target.value})}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Add multiple image URLs separated by commas</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Video URL</label>
                        <Input 
                          value={formData.videoUrl || ''} 
                          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                          placeholder="https://youtube.com/watch?v=..."
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">External Link</label>
                        <Input 
                          value={formData.link || ''} 
                          onChange={(e) => setFormData({...formData, link: e.target.value})}
                          placeholder="https://certificate-url.com"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="published-achievement"
                        checked={formData.published !== false}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="published-achievement" className="text-sm font-medium">Publish to portfolio</label>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : (modalType === 'add' ? 'Create' : 'Update')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
