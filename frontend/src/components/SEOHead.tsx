import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  tags?: string[]
}

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  tags = []
}: SEOHeadProps) {
  
  useEffect(() => {
    // Set page title
    document.title = `${title} | Arij SALEH - IoT & Embedded Engineer`

    // Get or create meta tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property'
      let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, property)
        document.head.appendChild(meta)
      }
      
      meta.content = content
    }

    // Basic meta tags
    setMetaTag('description', description, true)
    setMetaTag('author', author || 'Arij SALEH', true)
    if (tags.length > 0) {
      setMetaTag('keywords', tags.join(', '), true)
    }

    // Open Graph tags
    setMetaTag('og:title', title)
    setMetaTag('og:description', description)
    setMetaTag('og:type', type)
    if (url) setMetaTag('og:url', url)
    if (image) setMetaTag('og:image', image)
    setMetaTag('og:site_name', 'Arij SALEH Portfolio')

    // Twitter Card tags
    setMetaTag('twitter:card', image ? 'summary_large_image' : 'summary', true)
    setMetaTag('twitter:title', title, true)
    setMetaTag('twitter:description', description, true)
    if (image) setMetaTag('twitter:image', image, true)

    // Article specific tags
    if (type === 'article') {
      if (author) setMetaTag('article:author', author)
      if (publishedTime) setMetaTag('article:published_time', publishedTime)
      tags.forEach(tag => {
        const tagMeta = document.createElement('meta')
        tagMeta.setAttribute('property', 'article:tag')
        tagMeta.content = tag
        document.head.appendChild(tagMeta)
      })
    }
  }, [title, description, image, url, type, author, publishedTime, tags])

  return null
}
