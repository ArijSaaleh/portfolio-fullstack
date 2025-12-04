import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Linkedin, Mail, Github } from "lucide-react"
import { saveMessage } from "../services/dataService"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await saveMessage(formData)
      setSubmitStatus('success')
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Let's Connect & Build Something Amazing
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-16">
          I'm always open to collaboration on innovative projects or discussing new ideas.
        </p>
        
        <div className="grid md:grid-cols-5 gap-12 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
            <Input 
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <Input 
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Textarea 
              name="message"
              placeholder="Message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
            />
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            
            {submitStatus === 'success' && (
              <p className="text-primary font-semibold">Message sent successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-destructive font-semibold">Failed to send message. Please try again.</p>
            )}
          </form>
          
          <div className="md:col-span-2 space-y-4">
            <a 
              href="https://linkedin.com/in/arijsaleh" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-full border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all"
            >
              <Linkedin className="w-6 h-6" />
              <span className="font-semibold">Connect on LinkedIn</span>
            </a>
            
            <a 
              href="mailto:arij.saleh.pro@gmail.com"
              className="flex items-center gap-3 p-4 bg-white rounded-full border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all"
            >
              <Mail className="w-6 h-6" />
              <span className="font-semibold">Email Me</span>
            </a>
            
            <div className="flex gap-4 justify-start mt-6 pt-6 border-t">
              <a href="https://linkedin.com/in/arijsaleh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-7 h-7" />
              </a>
              <a href="https://github.com/arijsaaleh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
