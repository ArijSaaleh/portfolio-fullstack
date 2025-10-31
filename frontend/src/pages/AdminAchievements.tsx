import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import RichTextEditor from "../components/RichTextEditor"
import axios from "axios"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface Achievement {
  id?: number
  title: string
  description: string
  category: string
  date: string
  images: string[]
  videoUrl?: string
  link?: string
  published: boolean
}

export default function AdminAchievements() {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    description: "",
    category: "award",
    date: "",
    images: [],
    videoUrl: "",
    link: "",
    published: true
  })
  const [imageInput, setImageInput] = useState("")

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAchievements(response.data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingAchievement) {
        await axios.put(`http://localhost:3000/api/achievements/${editingAchievement.id}`, formData, { headers })
      } else {
        await axios.post('http://localhost:3000/api/achievements', formData, { headers })
      }

      fetchAchievements()
      resetForm()
    } catch (error) {
      console.error('Error saving achievement:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/achievements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAchievements()
    } catch (error) {
      console.error('Error deleting achievement:', error)
    }
  }

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setFormData(achievement)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "award",
      date: "",
      images: [],
      videoUrl: "",
      link: "",
      published: true
    })
    setEditingAchievement(null)
    setShowForm(false)
    setImageInput("")
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

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      award: "Award",
      participation: "Event Participation",
      certification: "Certification",
      social: "Social/Community"
    }
    return labels[category] || category
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
            <h1 className="text-2xl font-bold">Manage Achievements</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Achievement
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</CardTitle>
              <CardDescription>Add awards, certifications, event participations, and social contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Best IoT Project Award 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Describe the achievement, what it means, and the impact..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                      required
                    >
                      <option value="award">Award/Recognition</option>
                      <option value="participation">Event Participation</option>
                      <option value="certification">Certification</option>
                      <option value="social">Social/Community Work</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">External Link</label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="Link to certificate, event page, or related content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Video URL (YouTube embed)</label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
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
                    {editingAchievement ? 'Update Achievement' : 'Create Achievement'}
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
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {achievement.images.length > 0 && (
                      <img src={achievement.images[0]} alt={achievement.title} className="w-32 h-32 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{achievement.title}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {getCategoryLabel(achievement.category)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.date}</p>
                      <div 
                        className="text-muted-foreground mb-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: achievement.description }}
                      />
                      {achievement.link && (
                        <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mb-2">
                          View Certificate/Link →
                        </a>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(achievement)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(achievement.id!)}>
                          Delete
                        </Button>
                        {!achievement.published && <span className="text-sm text-muted-foreground">(Unpublished)</span>}
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
