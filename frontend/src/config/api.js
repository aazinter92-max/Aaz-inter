// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' 
    ? '' // Use same domain in production (Vercel)
    : 'http://localhost:5000' // Use localhost in development
);

export const API_URL = API_BASE_URL;

// Helper to build API endpoints
export const api = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default API_URL;

