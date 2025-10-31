import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await axios.post(`${API_URL}/api/analytics/page-view`, {
          page: location.pathname,
          referrer: document.referrer || null
        })
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug('Analytics tracking failed:', error)
      }
    }

    trackPageView()
  }, [location])
}

export const trackContentView = async (contentType: 'project' | 'blog' | 'achievement', contentId: number) => {
  try {
    await axios.post(`${API_URL}/api/analytics/content-view`, {
      contentType,
      contentId
    })
  } catch (error) {
    // Silently fail
    console.debug('Content tracking failed:', error)
  }
}
