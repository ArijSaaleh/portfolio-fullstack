import { useEffect, useState } from "react"
import { Cpu, Cloud, Hammer, GitBranch, Code2, Zap, Award, Lightbulb, Target } from "lucide-react"
import FadeIn from "./animations/FadeIn"
import axios from "axios"

interface Project {
  id: number
  technologies: string[]
  published: boolean
}

interface Experience {
  id: number
  startDate: string
  endDate?: string
  current: boolean
}

export default function About() {
  const [stats, setStats] = useState({
    yearsExperience: 2,
    projectsCount: 15,
    technologiesCount: 10
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [projectsRes, experiencesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/projects'),
        axios.get('http://localhost:3000/api/experiences')
      ])

      const projects: Project[] = projectsRes.data.filter((p: Project) => p.published)
      const experiences: Experience[] = experiencesRes.data

      // Calculate years of experience
      let yearsExp = 0
      if (experiences.length > 0) {
        const sortedExperiences = experiences.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        const firstStartDate = new Date(sortedExperiences[0].startDate)
        const now = new Date()
        yearsExp = Math.max(1, Math.floor((now.getTime() - firstStartDate.getTime()) / (1000 * 60 * 60 * 24 * 365)))
      }

      // Count unique technologies
      const techSet = new Set<string>()
      projects.forEach(project => {
        project.technologies?.forEach(tech => techSet.add(tech.toLowerCase().trim()))
      })

      setStats({
        yearsExperience: yearsExp,
        projectsCount: projects.length,
        technologiesCount: techSet.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const skills = [
    { icon: Cpu, name: "Embedded C/C++, RTOS", description: "Low-level programming & real-time systems" },
    { icon: Cloud, name: "Cloud Platforms", description: "AWS IoT, Azure IoT Hub integration" },
    { icon: Hammer, name: "Hardware Design", description: "PCB design & circuit prototyping" },
    { icon: GitBranch, name: "Firmware Development", description: "Bootloaders, drivers, & protocols" },
    { icon: Code2, name: "Full-Stack Development", description: "React, Node.js, TypeScript, PostgreSQL" },
    { icon: Zap, name: "IoT Protocols", description: "MQTT, CoAP, LoRaWAN, BLE" },
  ]

  const highlights = [
    { icon: Target, title: "Strategic Thinker", description: "Chess-inspired approach to problem-solving" },
    { icon: Lightbulb, title: "Innovation Driven", description: "Turning ideas into impactful solutions" },
    { icon: Award, title: "Results Focused", description: "Delivering quality with precision" },
  ]

  return (
    <section id="about" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
        </FadeIn>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Bio */}
          <FadeIn direction="left" delay={200}>
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Creative. Visionary. Strategic.
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  I'm an <span className="text-foreground font-semibold">IoT & Embedded Software Engineer</span> with 
                  a unique background in competitive chess. This strategic mindset fuels my approach to engineering thinking 
                  several steps ahead, anticipating challenges, and architecting elegant solutions.
                </p>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                My passion lies in bridging the physical and digital worlds through innovative embedded systems. 
                From low-level firmware to cloud-connected IoT platforms, I architect complete solutions that 
                transform ideas into reality.
              </p>

              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                <p className="text-foreground italic">
                  "Like a chess grandmaster visualizes moves ahead, I design systems with foresight, 
                  scalability, and precision—ensuring every component works in perfect harmony."
                </p>
              </div>

              {/* Highlights */}
              <div className="grid gap-4 mt-8">
                {highlights.map((highlight, index) => (
                  <FadeIn key={index} delay={400 + index * 100} direction="up">
                    <div className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <highlight.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{highlight.title}</h4>
                        <p className="text-muted-foreground text-sm">{highlight.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: Skills */}
          <FadeIn direction="right" delay={200}>
            <div>
              <h4 className="text-2xl font-bold mb-6">Technical Expertise</h4>
              <div className="grid gap-4">
                {skills.map((skill, index) => (
                  <FadeIn key={index} delay={400 + index * 100} direction="up">
                    <div className="group p-5 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <skill.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {skill.name}
                          </h5>
                          <p className="text-muted-foreground text-sm">{skill.description}</p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom Stats/Info */}
        <FadeIn delay={600}>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-background border border-border rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{stats.yearsExperience}+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-background border border-border rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{stats.projectsCount}+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center p-6 bg-background border border-border rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{stats.technologiesCount}+</div>
              <div className="text-muted-foreground">Technologies Mastered</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
