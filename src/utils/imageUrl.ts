
/**
 * Helper to fix image URLs returned by the backend.
 * Specifically removes port 8000 if present and converts to relative or absolute URL with correct port.
 */
export const getImageUrl = (url?: string): string => {
  if (!url) return '';
  
  // If the URL contains the backend port 8000, replace it
  // This handles http://IP:8000/media/... -> /media/...
  if (url.includes(':8000/media/')) {
    return url.replace(/https?:\/\/[^/]+\/media\//, '/media/');
  }
  
  return url;
};
