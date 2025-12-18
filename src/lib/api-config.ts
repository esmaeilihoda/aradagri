// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to build API URLs
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If API_BASE_URL already ends with /api, don't add it again
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  return `${API_BASE_URL}/api/${cleanPath}`;
};
