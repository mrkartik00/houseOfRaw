// Updated ProductGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, Eye, Star, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const ProductGrid = ({ products, viewMode = 'grid' }) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const observerRef = useRef(null);
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // Fetch user's wishlist on component mount
  useEffect(() => {
    // No need to fetch wishlist here as it's handled by WishlistContext
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );
    
    observerRef.current = observer;
    
    // Re-observe all items when products change
    const items = document.querySelectorAll('[data-product-item]');
    items.forEach(item => observer.observe(item));
    
    return () => observer.disconnect();
  }, [products]);

  const toggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    await toggleWishlistItem(productId);
  };

  const formatPrice = price => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);

const renderStars = rating => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14}
        className={`stroke-yellow-900 ${
          i < Math.floor(rating) ? 'fill-yellow-400' : 'fill-transparent'
        }`}
      />
    ))}
    <span className="text-xs text-gray-500 ml-1">({rating?.toFixed(1) || '0.0'})</span>
  </div>
);


  const handleQuickView = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view functionality
    console.log('Quick view for product:', productId);
  };

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement add to cart functionality
    console.log('Add to cart:', productId);
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product._id}
            data-product-item
            data-index={index}
            className={`group bg-[#c9c9bfab] rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden ${
              visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <a href={`/product/${product._id}`} className="flex">
              <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden">
                <img
                  src={product.image?.[0]?.url || product.image?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button
                  onClick={(e) => toggleFavorite(e, product._id)}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Heart 
                    size={16} 
                    className={isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-white stroke-gray-400'} 
                  />
                </button>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mb-3">
                    {renderStars(product.ratings || 0)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleQuickView(e, product._id)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product._id)}
                      className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ">
      {products.map((product, index) => (
        <div
          key={product._id}
          data-product-item
          data-index={index}
          className={`group relative bg-[#c9c9bfab] rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden ${
            visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 50}ms` }}
          onMouseEnter={() => setHoveredProduct(product._id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <a href={`/product/${product._id}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
              <img
                src={product.image?.[0]?.url || product.image?.[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Heart button */}
              <button
                onClick={(e) => toggleFavorite(e, product._id)}
                className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full transition-all duration-200 ${
                  hoveredProduct === product._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <Heart 
                  size={16} 
                  className={isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-white stroke-gray-400'} 
                />
              </button>

              {/* Quick actions */}
              <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-200 ${
                hoveredProduct === product._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <button
                  onClick={(e) => handleQuickView(e, product._id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  title="Quick View"
                >
                  <Eye size={16} className="text-gray-700" />
                </button>
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  className="bg-gray-900/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-900 transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>

              {/* Sale badge */}
              {product.salePrice && product.salePrice < product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  SALE
                </div>
              )}

              {/* New badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  NEW
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="space-y-2">
                {renderStars(product.ratings || 0)}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {product.salePrice && product.salePrice < product.price ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <ArrowRight 
                    size={16} 
                    className={`text-gray-400 transition-all duration-200 ${
                      hoveredProduct === product._id ? 'text-gray-600 translate-x-1' : ''
                    }`} 
                  />
                </div>
              </div>

              {/* Additional product info */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {product.colors && product.colors.length > 1 && (
                  <span>{product.colors.length} colors</span>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <>
                    {product.colors && product.colors.length > 1 && <span>•</span>}
                    <span>{product.sizes.length} sizes</span>
                  </>
                )}
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;