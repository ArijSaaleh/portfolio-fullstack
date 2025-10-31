import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import RichTextEditor from "../components/RichTextEditor"
import axios from "axios"
import { ArrowLeft, Plus } from "lucide-react"

interface Blog {
  id?: number
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  type: string
  readTime?: string
  videoUrl?: string
  published: boolean
  publishedAt: string
}

export default function AdminBlogs() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Blog>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    type: "article",
    readTime: "",
    videoUrl: "",
    published: true,
    publishedAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlogs(response.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auto-generate slug if not provided
    const dataToSubmit = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title)
    }

    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingBlog) {
        await axios.put(`http://localhost:3000/api/blogs/${editingBlog.id}`, dataToSubmit, { headers })
      } else {
        await axios.post('http://localhost:3000/api/blogs', dataToSubmit, { headers })
      }

      fetchBlogs()
      resetForm()
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Error saving blog. Slug might already exist.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData(blog)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      thumbnail: "",
      type: "article",
      readTime: "",
      videoUrl: "",
      published: true,
      publishedAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    })
    setEditingBlog(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Manage Blogs</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Blog
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</CardTitle>
              <CardDescription>Create engaging content for your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      if (!editingBlog) {
                        setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                      }
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug (URL-friendly)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL will be: /blog/{formData.slug || 'slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt/Summary *</label>
                  <RichTextEditor
                    value={formData.excerpt}
                    onChange={(value) => setFormData({ ...formData, excerpt: value })}
                    placeholder="A brief description shown on the blog listing page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Content *</label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Write your full blog post content here..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                      required
                    >
                      <option value="article">Article</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Read Time</label>
                    <Input
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL *</label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Video URL (YouTube embed)</label>
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Publish Date *</label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img src={blog.thumbnail} alt={blog.title} className="w-48 h-32 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{blog.title}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{blog.type}</span>
                      </div>
                      <div 
                        className="text-muted-foreground mb-2 prose prose-sm max-w-none line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                      />
                      <p className="text-sm text-muted-foreground mb-4">
                        {blog.publishedAt} {blog.readTime && `• ${blog.readTime}`}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(blog)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id!)}>
                          Delete
                        </Button>
                        {!blog.published && <span className="text-sm text-muted-foreground">(Unpublished)</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
