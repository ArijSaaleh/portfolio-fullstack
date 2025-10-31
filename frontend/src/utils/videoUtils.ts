/**
 * Converts various video URLs to embeddable formats and extracts thumbnails
 */

export const getEmbedUrl = (url: string): string => {
  if (!url) return ''

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Google Drive - handle various formats
  let driveId = ''
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const driveRegex1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const driveMatch1 = url.match(driveRegex1)
  if (driveMatch1) {
    driveId = driveMatch1[1]
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const driveRegex2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
  const driveMatch2 = url.match(driveRegex2)
  if (driveMatch2) {
    driveId = driveMatch2[1]
  }
  
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Dailymotion
  const dailymotionRegex = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/
  const dailymotionMatch = url.match(dailymotionRegex)
  if (dailymotionMatch) {
    return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`
  }

  // If already an embed URL, return as is
  return url
}

export const getVideoThumbnail = (url: string): string => {
  if (!url) return ''

  // YouTube thumbnail
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
  }

  // Google Drive - Can't get thumbnail directly, but we can show a placeholder
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const driveMatch = url.match(driveRegex)
  if (driveMatch) {
    // Google Drive doesn't provide direct thumbnail URLs without API
    // Return a placeholder or empty string
    return ''
  }

  // Vimeo thumbnail requires API call, return empty for now
  // Dailymotion thumbnail requires API call, return empty for now

  return ''
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
