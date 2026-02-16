// Cache Management Utility for Admin Panel
// Use this after product/category mutations to ensure fresh data

import { clearCache } from '../config/api';

/**
 * Hook to manage API cache clearing
 * Use in admin components after data mutations
 */
export const useCacheClear = () => {
  const clearProductCache = () => {
    clearCache('/api/products');
  };

  const clearCategoryCache = () => {
    clearCache('/api/categories');
  };

  const clearAllCache = () => {
    clearCache();
  };

  return {
    clearProductCache,
    clearCategoryCache,
    clearAllCache
  };
};

/**
 * Example Usage in Admin Components:
 * 
 * import { useCacheClear } from '../hooks/useCacheClear';
 * 
 * const ProductForm = () => {
 *   const { clearProductCache } = useCacheClear();
 * 
 *   const handleSubmit = async (data) => {
 *     await api.post('/api/products', data);
 *     clearProductCache(); // Clear cache after mutation
 *   };
 * };
 */

export default useCacheClear;
