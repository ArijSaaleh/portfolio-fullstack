import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { getEmbedUrl, getVideoThumbnail, compressImage } from "../utils/videoUtils"
import axios from "axios"
import { ArrowLeft, Plus, Trash2, X } from "lucide-react"

interface Project {
  id?: number
  title: string
  description: string
  challenge: string
  contribution: string
  technologies: string[]
  thumbnail: string
  heroImage: string
  videoUrl?: string
  githubUrl?: string
  liveUrl?: string
  accuracy?: string
  speed?: string
  images: string[]
  startDate?: string
  endDate?: string
  published: boolean
}

export default function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    challenge: "",
    contribution: "",
    technologies: [],
    thumbnail: "",
    heroImage: "",
    videoUrl: "",
    githubUrl: "",
    liveUrl: "",
    accuracy: "",
    speed: "",
    images: [],
    startDate: "",
    endDate: "",
    published: true
  })
  const [techInput, setTechInput] = useState("")
  const [imageInput, setImageInput] = useState("")
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingThumbnail(true)
    try {
      const base64 = await compressImage(file, 800, 600, 0.8)
      setFormData({ ...formData, thumbnail: base64 })
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      alert('Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHero(true)
    try {
      const base64 = await compressImage(file, 1920, 1080, 0.85)
      setFormData({ ...formData, heroImage: base64 })
    } catch (error) {
      console.error('Error uploading hero image:', error)
      alert('Failed to upload hero image')
    } finally {
      setUploadingHero(false)
    }
  }

  const handleVideoUrlChange = (url: string) => {
    const embedUrl = getEmbedUrl(url)
    const thumbnail = getVideoThumbnail(url)
    
    setFormData({ 
      ...formData, 
      videoUrl: embedUrl,
      ...(thumbnail && !formData.thumbnail ? { thumbnail } : {})
    })
  }

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingProject) {
        await axios.put(`http://localhost:3000/api/projects/${editingProject.id}`, formData, { headers })
      } else {
        await axios.post('http://localhost:3000/api/projects', formData, { headers })
      }

      fetchProjects()
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      challenge: "",
      contribution: "",
      technologies: [],
      thumbnail: "",
      heroImage: "",
      videoUrl: "",
      githubUrl: "",
      liveUrl: "",
      accuracy: "",
      speed: "",
      images: [],
      startDate: "",
      endDate: "",
      published: true
    })
    setEditingProject(null)
    setShowForm(false)
    setTechInput("")
    setImageInput("")
  }

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] })
      setTechInput("")
    }
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    })
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] })
      setImageInput("")
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
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
            <h1 className="text-2xl font-bold">Manage Projects</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
              <CardDescription>Fill in the project details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description *</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Challenge *</label>
                  <Textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Contribution *</label>
                  <Textarea
                    value={formData.contribution}
                    onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="e.g., React, Node.js"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {tech}
                        <button type="button" onClick={() => removeTechnology(index)} className="hover:text-destructive">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail Image *</label>
                    <div className="space-y-2">
                      <Input
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://example.com/image.jpg or upload below"
                      />
                      <div className="flex gap-2 items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="file:mr-2 file:px-4 file:py-1 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                        />
                        {uploadingThumbnail && <span className="text-sm text-muted-foreground">Uploading...</span>}
                      </div>
                      {formData.thumbnail && (
                        <div className="relative w-full h-32 border rounded overflow-hidden">
                          <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnail: '' })}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Image *</label>
                    <div className="space-y-2">
                      <Input
                        value={formData.heroImage}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                        placeholder="https://example.com/hero.jpg or upload below"
                      />
                      <div className="flex gap-2 items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroUpload}
                          className="file:mr-2 file:px-4 file:py-1 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                        />
                        {uploadingHero && <span className="text-sm text-muted-foreground">Uploading...</span>}
                      </div>
                      {formData.heroImage && (
                        <div className="relative w-full h-32 border rounded overflow-hidden">
                          <img src={formData.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, heroImage: '' })}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Video URL</label>
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="YouTube, Google Drive, Vimeo, or Dailymotion URL"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports YouTube, Google Drive, Vimeo, and Dailymotion. Auto-extracts thumbnail from YouTube.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <Input
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Live Demo URL</label>
                  <Input
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://live-demo.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Accuracy/Result</label>
                    <Input
                      value={formData.accuracy}
                      onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                      placeholder="e.g., 98% accuracy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Speed/Performance</label>
                    <Input
                      value={formData.speed}
                      onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                      placeholder="e.g., 20x faster"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gallery Images</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Image URL"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" onClick={addImage}>Add</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    {editingProject ? 'Update Project' : 'Create Project'}
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
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img src={project.thumbnail} alt={project.title} className="w-48 h-32 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 5).map((tech, i) => (
                          <span key={i} className="bg-muted px-2 py-1 rounded text-xs">{tech}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(project)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id!)}>
                          Delete
                        </Button>
                        {!project.published && <span className="text-sm text-muted-foreground">(Unpublished)</span>}
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
