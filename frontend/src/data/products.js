// Product Categories (To be fetched from Backend)
export const categories = [];

// Products Data (To be fetched from Backend)
export const products = [];

// Helper function to get products by category
export const getProductsByCategory = (categorySlug) => {
  return [];
};

// Helper function to get a single product by ID
export const getProductById = (productId) => {
  return null;
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug) => {
  return null;
};

// Format currency (PKR)
export const formatPrice = (price) => {
  if (!price) return 'PKR 0';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);
};
