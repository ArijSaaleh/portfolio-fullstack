import { useEffect } from 'react'

interface StructuredDataProps {
  type: 'Person' | 'Article' | 'WebSite' | 'Project'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const generateSchema = () => {
      switch (type) {
        case 'Person':
          return {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: data.name || 'Arij SALEH',
            jobTitle: data.jobTitle || 'IoT & Embedded Software Engineer',
            description: data.description,
            url: data.url,
            image: data.image,
            sameAs: data.socialLinks || [],
            knowsAbout: data.skills || [
              'Embedded C/C++',
              'RTOS',
              'IoT',
              'Hardware Design',
              'Firmware Development'
            ]
          }
        
        case 'Article':
          return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: data.description,
            image: data.image,
            datePublished: data.publishedAt,
            author: {
              '@type': 'Person',
              name: 'Arij SALEH',
              jobTitle: 'IoT & Embedded Software Engineer'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Arij SALEH Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: data.publisherLogo
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': data.url
            }
          }
        
        case 'WebSite':
          return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Arij SALEH Portfolio',
            description: 'IoT & Embedded Software Engineer Portfolio',
            url: data.url,
            author: {
              '@type': 'Person',
              name: 'Arij SALEH',
              jobTitle: 'IoT & Embedded Software Engineer'
            }
          }
        
        case 'Project':
          return {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: data.title,
            description: data.description,
            image: data.image,
            url: data.url,
            creator: {
              '@type': 'Person',
              name: 'Arij SALEH',
              jobTitle: 'IoT & Embedded Software Engineer'
            },
            keywords: data.technologies?.join(', ')
          }
        
        default:
          return {}
      }
    }

    const schema = generateSchema()
    
    // Remove existing schema script if any
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new schema script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [type, data])

  return null
}
