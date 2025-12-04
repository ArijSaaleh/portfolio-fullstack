/**
 * Universal Media Resolver
 * Handles local files, Google Drive URLs, and direct URLs
 * 
 * URL Formats:
 * - Local: "local:/images/photo.jpg" -> "/images/photo.jpg"
 * - Drive (file ID): "drive://1ABC123DEF456" -> Google Drive thumbnail
 * - Drive (full URL): "https://drive.google.com/file/d/ABC123/view" -> Google Drive thumbnail
 * - Direct URL: "https://example.com/image.jpg" -> unchanged
 */

export type MediaType = 'image' | 'pdf' | 'video';

interface MediaOptions {
  type?: MediaType;
  size?: 'small' | 'medium' | 'large' | 'original';
}

/**
 * Resolves any media URL to its actual accessible URL
 */
export function resolveMediaUrl(url: string, options: MediaOptions = {}): string {
  if (!url) return '';

  const { type = 'image', size = 'large' } = options;

  // Handle local files (relative to public folder)
  if (url.startsWith('local:')) {
    return url.replace('local:', '');
  }

  // Handle Google Drive file IDs
  if (url.startsWith('drive://')) {
    const fileId = url.replace('drive://', '');
    return getDriveUrl(fileId, type, size);
  }

  // Handle full Google Drive URLs
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return getDriveUrl(driveMatch[1], type, size);
  }

  // Handle Google Drive sharing links (view?id= format)
  const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && url.includes('drive.google.com')) {
    return getDriveUrl(driveIdMatch[1], type, size);
  }

  // Return direct URLs as-is
  return url;
}

/**
 * Converts Google Drive file ID to accessible URL
 */
function getDriveUrl(fileId: string, type: MediaType, size: string): string {
  // For PDFs, use preview mode for embedding
  if (type === 'pdf') {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // For videos, use preview mode as well
  if (type === 'video') {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // For images, use the download URL that works in img tags
  // This URL directly serves the image file
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Batch resolve multiple URLs
 */
export function resolveMediaUrls(urls: string[], options: MediaOptions = {}): string[] {
  return urls.map(url => resolveMediaUrl(url, options));
}

/**
 * Check if URL is a local file
 */
export function isLocalFile(url: string): boolean {
  return url.startsWith('local:');
}

/**
 * Check if URL is a Google Drive file
 */
export function isDriveFile(url: string): boolean {
  return url.startsWith('drive://') || url.includes('drive.google.com');
}

/**
 * Get the original file ID from any Drive URL format
 */
export function extractDriveFileId(url: string): string | null {
  if (url.startsWith('drive://')) {
    return url.replace('drive://', '');
  }

  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
