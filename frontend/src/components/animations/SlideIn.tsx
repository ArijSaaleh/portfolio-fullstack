import { useEffect, useRef, useState, ReactNode } from 'react'

interface SlideInProps {
  children: ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
}

export default function SlideIn({ 
  children, 
  delay = 0,
  staggerDelay = 0,
  className = '' 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay + staggerDelay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, staggerDelay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 500ms ease-out, transform 500ms ease-out'
      }}
    >
      {children}
    </div>
  )
}
