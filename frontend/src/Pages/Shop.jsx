// Updated Shop.jsx
import React, { useEffect, useState } from 'react';
import { FaFilter, FaTh, FaList } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import FilterPopup from '../Components/Products/FilterSidebar';
import ProductGrid from '../Components/Products/ProductGrid';
import { fetchAllProducts } from '../services/productService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentFilters, setCurrentFilters] = useState({
    category: '',
    color: '',
    size: [],
    material: [],
    minPrice: 0,
    maxPrice: 5000,
  });

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setCurrentFilters({
      category: params.category || '',
      color: params.color || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 5000,
    });
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProducts(Object.fromEntries([...searchParams]));
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  const handleApplyFilters = (filters) => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.color) params.color = filters.color;
    if (filters.size.length > 0) params.size = filters.size.join(',');
    if (filters.material.length > 0) params.material = filters.material.join(',');
    if (filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 5000) params.maxPrice = filters.maxPrice;

    setSearchParams(params);
  };

  const clearAllFilters = () => setSearchParams({});

  const hasActiveFilters = () =>
    currentFilters.category ||
    currentFilters.color ||
    currentFilters.size.length > 0 ||
    currentFilters.material.length > 0 ||
    currentFilters.minPrice > 0 ||
    currentFilters.maxPrice < 5000;

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.category) count++;
    if (currentFilters.color) count++;
    count += currentFilters.size.length;
    count += currentFilters.material.length;
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 5000) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-[#c9c9bf6b]">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium fashion pieces designed for the modern lifestyle
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterPopupOpen(true)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <FaFilter size={16} />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaTh size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaList size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${products.length} products`}
              </span>
              
              <select
                onChange={(e) => {
                  const sortBy = e.target.value;
                  const newParams = new URLSearchParams(searchParams);
                  if (sortBy) {
                    newParams.set('sortBy', sortBy);
                  } else {
                    newParams.delete('sortBy');
                  }
                  setSearchParams(newParams);
                }}
                value={searchParams.get('sortBy') || ''}
                className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
              >
                <option value="">Sort by: Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
              {currentFilters.category && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Category:</span> {currentFilters.category}
                </span>
              )}
              {currentFilters.color && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Color:</span> {currentFilters.color}
                </span>
              )}
              {currentFilters.size.map(size => (
                <span key={size} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Size:</span> {size}
                </span>
              ))}
              {currentFilters.material.map(material => (
                <span key={material} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Material:</span> {material}
                </span>
              ))}
              {(currentFilters.minPrice > 0 || currentFilters.maxPrice < 5000) && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Price:</span> ₹{currentFilters.minPrice} - ₹{currentFilters.maxPrice}
                </span>
              )}
              <button 
                onClick={clearAllFilters} 
                className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Products Section */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading our latest collection...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="py-20 text-center">
              <div className="text-6xl text-gray-300 mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              {hasActiveFilters() && (
                <button 
                  onClick={clearAllFilters}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <ProductGrid products={products} viewMode={viewMode} />
        )}
      </div>

      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={() => setIsFilterPopupOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default Shop;