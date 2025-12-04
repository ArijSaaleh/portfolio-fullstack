import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import About from "../components/About"
import Projects from "../components/Projects"
import Experience from "../components/Experience"
import Achievements from "../components/Achievements"
import Blog from "../components/Blog"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import SEOHead from "../components/SEOHead"
import StructuredData from "../components/StructuredData"

export default function HomePage() {

  
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Home"
        description="Arij SALEH - IoT & Embedded Software Engineer. Crafting Intelligent Systems. Driving Innovation. Explore projects, blogs, and professional achievements."
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
        tags={['IoT', 'Embedded Systems', 'Software Engineering', 'Hardware Design', 'Firmware Development']}
      />
      <StructuredData
        type="Person"
        data={{
          name: 'Arij SALEH',
          jobTitle: 'IoT & Embedded Software Engineer',
          description: 'IoT & Embedded Software Engineer specializing in intelligent systems, hardware design, and firmware development',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          socialLinks: ['https://linkedin.com/in/arijsaleh'],
          skills: ['Embedded C/C++', 'RTOS', 'Cloud Platforms (AWS IoT, Azure)', 'Hardware Design', 'Firmware Development']
        }}
      />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Blog />
      <Contact />
      <Footer />
    </div>
  )
}
