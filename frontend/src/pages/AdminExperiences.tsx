import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import RichTextEditor from "../components/RichTextEditor"
import axios from "axios"
import { ArrowLeft, Plus } from "lucide-react"

interface Experience {
  id?: number
  company: string
  companyLogo?: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  skills: string[]
  location?: string
}

export default function AdminExperiences() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Experience>({
    company: "",
    companyLogo: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    skills: [],
    location: ""
  })
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/experiences', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExperiences(response.data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingExperience) {
        await axios.put(`http://localhost:3000/api/experiences/${editingExperience.id}`, formData, { headers })
      } else {
        await axios.post('http://localhost:3000/api/experiences', formData, { headers })
      }

      fetchExperiences()
      resetForm()
    } catch (error) {
      console.error('Error saving experience:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData(experience)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      company: "",
      companyLogo: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      skills: [],
      location: ""
    })
    setEditingExperience(null)
    setShowForm(false)
    setSkillInput("")
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
      setSkillInput("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
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
            <h1 className="text-2xl font-bold">Manage Experiences</h1>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Experience
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</CardTitle>
              <CardDescription>Add your work experience details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Position/Title *</label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Logo URL</label>
                  <Input
                    value={formData.companyLogo}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                    placeholder="https://example.com/logo.png or upload path"
                  />
                  {formData.companyLogo && (
                    <div className="mt-2">
                      <img src={formData.companyLogo} alt="Company logo preview" className="h-16 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value: string) => setFormData({ ...formData, description: value })}
                    placeholder="Describe your role, responsibilities, and achievements..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date *</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? "" : formData.endDate })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="current" className="text-sm font-medium">I currently work here</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills & Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g., JavaScript, React, Team Leadership"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => removeSkill(index)} className="hover:text-destructive">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingExperience ? 'Update Experience' : 'Create Experience'}
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
            {experiences.map((experience) => (
              <Card key={experience.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {experience.companyLogo && (
                      <img src={experience.companyLogo} alt={experience.company} className="w-16 h-16 object-contain" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{experience.position}</h3>
                      <p className="text-lg text-primary mb-2">{experience.company}</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                        {experience.location && ` • ${experience.location}`}
                      </p>
                      <div 
                        className="text-muted-foreground mb-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: experience.description }}
                      />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {experience.skills.slice(0, 6).map((skill, i) => (
                          <span key={i} className="bg-muted px-2 py-1 rounded text-xs">{skill}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(experience)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(experience.id!)}>
                          Delete
                        </Button>
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
