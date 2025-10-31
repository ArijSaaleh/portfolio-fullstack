import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import PageLoader from "../components/loaders/PageLoader"
import FadeIn from "../components/animations/FadeIn"
import ShareButtons from "../components/ShareButtons"
import SEOHead from "../components/SEOHead"
import StructuredData from "../components/StructuredData"
import axios from "axios"
import { usePageTracking, trackContentView } from "../hooks/useAnalytics"
import { API_URL } from "../config"

interface ProjectDetail {
  id: number
  title: string
  description: string
  challenge: string
  contribution: string
  technologies: string[]
  heroImage: string
  videoUrl?: string
  githubUrl?: string
  liveUrl?: string
  accuracy?: string
  speed?: string
  images: string[]
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  
  usePageTracking()

  useEffect(() => {
    fetchProjectDetail()
  }, [id])
  
  useEffect(() => {
    if (project) {
      trackContentView('project', project.id)
    }
  }, [project])

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

  const fetchProjectDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${id}`)
      setProject(response.data)
    } catch (error) {
      console.error('Error fetching project detail:', error)
      // Fallback data
      setProject({
        id: Number(id),
        title: "Automated Drone Navigation",
        description: "Connected task planning in network",
        challenge: "The increasing demand for efficient and safe aerial inspections and deliveries highlighted a critical need for autonomous drone navigation in complex, dynamic environments. Traditional GPS-based systems often struggle with accuracy in urban canyons or indoor settings, while manual control is resource-intensive and prone to human error.",
        contribution: "As the lead embedded software engineer, I designed and implemented the core real-time operating system (RTOS) logic and the drone's flight control algorithms. My work focused on integrating sensor fusion (LiDAR, IMU, GPS, Vision) to achieve highly accurate localization and obstacle avoidance. I developed custom computer vision algorithms for visual odometry and object detection, enabling the drone to map its environment and plan optimal, collision-free paths in real-time.",
        technologies: ["C++", "FreeRTOS", "Computer Vision (OpenCV)", "LiDAR & GPS", "Custom PCB Design", "Embedded Linux"],
        heroImage: "/placeholder-project.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        accuracy: "98%",
        speed: "20x faster than manual",
        images: ["/placeholder-project.jpg", "/placeholder-project.jpg", "/placeholder-project.jpg"]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button asChild>
            <Link to="/#projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <SEOHead
        title={project.title}
        description={project.description}
        image={project.heroImage}
        url={currentUrl}
        type="article"
        tags={project.technologies}
      />
      <StructuredData
        type="Project"
        data={{
          title: project.title,
          description: project.description,
          image: project.heroImage,
          url: currentUrl,
          technologies: project.technologies
        }}
      />
      
      <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl py-4">
          <Link to="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Projects</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl py-12">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">{project.title}</h1>
        </FadeIn>
        
        <FadeIn delay={100}>
          <div className="flex justify-center mb-8">
            <ShareButtons
              url={currentUrl}
              title={project.title}
              description={project.description}
            />
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-muted rounded-3xl p-8 mb-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Arij SALEH</h3>
              <h4 className="text-lg font-semibold text-muted-foreground mb-4">IOT & Embedded Engineer</h4>
              <p className="italic text-muted-foreground mb-6">Crafting Intelligent Systems. Driving Innovation.</p>
              <div className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <Github className="w-4 h-4" />
                      VIEW SOURCE CODE
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      LIVE DEMO
                    </a>
                  </Button>
                )}
                {!project.githubUrl && !project.liveUrl && (
                  <Button asChild>
                    <a href="https://linkedin.com/in/arij-saleh" target="_blank" rel="noopener noreferrer">
                      CONNECT ON LINKEDIN
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <img src={getImageUrl(project.heroImage)} alt={project.title} className="w-full rounded-2xl shadow-md" />
            </div>
          </div>
        </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <FadeIn delay={400}>
              <section>
                <h4 className="text-2xl font-bold mb-4 border-b-2 border-border pb-2">The Challenge</h4>
              <div 
                className="text-foreground leading-relaxed text-lg prose max-w-none"
                dangerouslySetInnerHTML={{ __html: project.challenge }}
              />
              </section>
            </FadeIn>

            <FadeIn delay={500}>
              <section>
                <h4 className="text-2xl font-bold mb-4 border-b-2 border-border pb-2">My Contribution</h4>
                <div 
                  className="text-foreground leading-relaxed text-lg prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.contribution }}
                />
              </section>
            </FadeIn>

            <FadeIn delay={600}>
              <section>
                <h4 className="text-2xl font-bold mb-4 border-b-2 border-border pb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-muted rounded-full text-sm font-semibold text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            </FadeIn>
          </div>

          <div className="space-y-8">
            {project.videoUrl && (
              <div>
                <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={project.videoUrl}
                    title="Project demo video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Live demo
                </p>
              </div>
            )}

            {(project.accuracy || project.speed) && (
              <div className="grid grid-cols-2 gap-4">
                {project.accuracy && (
                  <Card className="p-6 text-center bg-primary text-white">
                    <div className="text-4xl font-bold mb-2">{project.accuracy}</div>
                    <div className="text-sm">Accuracy</div>
                  </Card>
                )}
                {project.speed && (
                  <Card className="p-6 text-center bg-primary text-white">
                    <div className="text-4xl font-bold mb-2">{project.speed.split(' ')[0]}</div>
                    <div className="text-sm">{project.speed.split(' ').slice(1).join(' ')}</div>
                  </Card>
                )}
              </div>
            )}

            {project.images && project.images.length > 0 && (
              <div>
                <h4 className="text-xl font-bold mb-4">Project Gallery</h4>
                <div className="grid grid-cols-2 gap-3">
                  {project.images.map((image, index) => (
                    <img 
                      key={index}
                      src={getImageUrl(image)} 
                      alt={`Project screenshot ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg shadow hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-background border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-muted-foreground text-sm">
            &copy; 2025 Arij SALEH. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
