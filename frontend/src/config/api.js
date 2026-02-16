// API Configuration
// IMPORTANT: Environment-based API URL configuration
//
// Vercel does NOT use .env.production from git!
// You MUST set VITE_API_URL in Vercel dashboard:
// Settings → Environment Variables → Add VITE_API_URL
//
// For now, using fallback to Railway URL in production mode

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://aaz-inter-production.up.railway.app"
    : "http://localhost:5000");

export const API_URL = API_BASE_URL;

// In-memory cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const api = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Cached fetch for GET requests
export const cachedFetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  
  // Only cache GET requests
  if (method !== 'GET') {
    return fetch(url, options);
  }
  
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return Promise.resolve({
      ok: true,
      json: async () => cached.data,
      clone: () => ({ json: async () => cached.data })
    });
  }
  
  const response = await fetch(url, options);
  if (response.ok) {
    const data = await response.clone().json();
    cache.set(url, { data, timestamp: Date.now() });
  }
  return response;
};

// Clear cache (useful after mutations)
export const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
};

export default API_URL;
