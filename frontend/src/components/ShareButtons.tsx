import { useState } from 'react'
import { Button } from './ui/button'
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('twitter')}
        className="gap-1"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        <span className="sr-only">Twitter</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('facebook')}
        className="gap-1"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        <span className="sr-only">Facebook</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('linkedin')}
        className="gap-1"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        <span className="sr-only">LinkedIn</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleCopyLink}
        className="gap-1"
        title="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-xs">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span className="sr-only">Copy link</span>
          </>
        )}
      </Button>
    </div>
  )
}
