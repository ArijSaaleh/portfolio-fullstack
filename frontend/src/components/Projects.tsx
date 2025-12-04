import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import SearchBar from "./SearchBar"
import FilterBar from "./FilterBar"
import SkeletonCard from "./loaders/SkeletonCard"
import FadeIn from "./animations/FadeIn"
import { Github, ExternalLink } from "lucide-react"
import { getProjects, type Project } from "../services/dataService"
import { resolveMediaUrl } from "../utils/mediaResolver"

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await getProjects(true) // Only published
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  // Get all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [projects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by technology
    if (selectedTech !== 'all') {
      filtered = filtered.filter(project => 
        project.technologies.includes(selectedTech)
      )
    }

    return filtered
  }, [projects, searchQuery, selectedTech])

  const techOptions = allTechnologies.map(tech => ({
    label: tech,
    value: tech
  }))

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Featured Projects</h2>
        </FadeIn>
        
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search projects..."
            className="max-w-md mx-auto"
          />
          
          {techOptions.length > 0 && (
            <div className="flex justify-center">
              <FilterBar
                options={techOptions}
                selected={selectedTech}
                onChange={setSelectedTech}
                label="Technology"
              />
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            <>
              <SkeletonCard variant="project" />
              <SkeletonCard variant="project" />
              <SkeletonCard variant="project" />
              <SkeletonCard variant="project" />
            </>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {projects.length === 0 ? 'No projects available yet.' : 'No projects match your search criteria.'}
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 100} direction="up">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-primary/50">
                  <div className="aspect-video overflow-hidden relative group">
                    <img 
                      src={resolveMediaUrl(project.thumbnail)} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <CardDescription 
                      className="line-clamp-3 text-sm prose prose-sm max-w-none dark:prose-invert [&>ul]:list-none [&>ul]:pl-0 [&>ol]:list-none [&>ol]:pl-0 [&>p]:m-0"
                      dangerouslySetInnerHTML={{ 
                        __html: project.description.replace(/<[^>]*>/g, (tag) => {
                          // Remove all HTML tags except basic text formatting
                          if (tag.match(/<\/?[uo]l>/)) return ''
                          if (tag.match(/<\/?li>/)) return ''
                          return tag
                        }).replace(/\n/g, ' ').substring(0, 150) + (project.description.length > 150 ? '...' : '')
                      }}
                    />
                    
                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardFooter className="flex gap-2 flex-wrap border-t pt-4">
                    <Button size="sm" variant="default" asChild className="flex-1">
                      <Link to={`/project/${project.id}`}>View Details</Link>
                    </Button>
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                          <ExternalLink className="w-4 h-4" />
                          Live
                        </a>
                      </Button>
                    )}
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
