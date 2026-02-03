import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/categories')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
    setFilterOpen(false);
  };

  const getFilteredProducts = () => {
    let filtered = products;

    // Filter by search query first
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }

    // Then filter by category if selected
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category?._id === selectedCategory);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getCategoryName = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (selectedCategory === 'all') return 'All Products';
    const category = categories.find((cat) => cat._id === selectedCategory);
    return category ? category.name : 'Products';
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div>
            <h1 className="products-title">{getCategoryName()}</h1>
            <p className="products-subtitle">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}{' '}
              available
            </p>
          </div>
          <Button
            variant="outline"
            icon={<Filter size={20} />}
            onClick={() => setFilterOpen(!filterOpen)}
            className="mobile-filter-toggle"
          >
            Filter
          </Button>
        </div>

        <div className="products-layout">
          {/* Sidebar Filter */}
          <aside className={`products-sidebar ${filterOpen ? 'products-sidebar-open' : ''}`}>
            <div className="filter-header">
              <h2 className="filter-title">Categories</h2>
            </div>
            <div className="filter-list">
              <button
                className={`filter-item ${selectedCategory === 'all' ? 'filter-item-active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`filter-item ${
                    selectedCategory === category._id ? 'filter-item-active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <h3>No products found</h3>
                <p>Try selecting a different category</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
