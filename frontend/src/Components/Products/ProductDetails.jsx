// pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleProduct, fetchRelatedProducts } from '../../services/productService';
import { useWishlist } from '../../context/WishlistContext';
import { FaStar, FaTag, FaList, FaRulerCombined } from 'react-icons/fa';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchSingleProduct(id);
        setProduct(data);
        if (data.image?.[0]) setMainImage(data.image[0]);

        const relatedRes = await fetchRelatedProducts(id);
        if (Array.isArray(relatedRes)) {
          setRelatedProducts(relatedRes);
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        toast.error("Failed to load product");
        console.error("Product loading error:", error);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.image?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % product.image.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [product]);

  useEffect(() => {
    if (product?.image?.[currentIndex]) {
      setMainImage(product.image[currentIndex]);
    }
  }, [currentIndex, product]);

  useEffect(() => {
    // Wishlist state is now handled by WishlistContext
    // No need to fetch separately
  }, [id]);

  const increment = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${product.stock} items available in stock`);
    }
  };

  const decrement = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    if (!product) {
      toast.error("Product information not available.");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    setIsButtonDisabled(true);

    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleWishlistItem(product._id);
  };

  if (!product) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='p-4 sm:p-6 lg:p-10 bg-[#c9c9bf4d] min-h-screen'>
      <div className='max-w-6xl mx-auto bg-[#c9c9bf46] p-6 sm:p-10 rounded-lg shadow-md'>
        <div className='flex flex-col md:flex-row'>
          {/* Thumbnails */}
          <div className='hidden md:flex flex-col space-y-4 mr-6'>
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${mainImage === img ? "border-black" : "border-gray-300"}`}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='md:w-1/2'>
            <img
              src={mainImage}
              alt='Main Product'
              className='w-full h-116 object-cover rounded-md mb-4 transition-all duration-500'
            />
          </div>

          {/* Mobile thumbnails */}
          <div className='md:hidden flex overflow-x-scroll gap-3 mb-4 scrollbar-hide'>
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-12 h-12 object-cover rounded-lg cursor-pointer border ${mainImage === img ? "border-black" : "border-gray-300"}`}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>

          {/* Product Info */}
          <div className='md:w-1/2 md:ml-10'>
            <div className='flex items-center justify-between mb-2'>
              <h1 className='text-3xl font-bold'>{product.name}</h1>
              <button
                onClick={handleToggleFavorite}
                className='p-2 border rounded-full hover:bg-gray-100 transition'
                title={isInWishlist(product._id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={20}
                  className={`${isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-white stroke-gray-400'} transition-colors duration-200`}
                />
              </button>
            </div>

            <p className='text-xl text-gray-700 font-semibold mb-1'>₹{product.price}</p>
            <div className='flex items-center gap-2 mb-3 text-yellow-500'>
              <FaStar />
              <span className='text-sm text-gray-700'>{product.ratings?.toFixed(1) || 0} / 5</span>
            </div>
            <p className='text-gray-600 mb-6'>{product.description}</p>

            <div className='mb-4'>
              <p className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left in stock` : 'Out of Stock'}
              </p>
            </div>

            {/* Color */}
            <div className='mb-4'>
              <p className='text-gray-700 font-medium'>Color</p>
              <div className='flex mt-2 gap-3'>
                {(Array.isArray(product.color)
                  ? product.color
                  : typeof product.color === 'string'
                    ? (() => {
                        try {
                          const parsed = JSON.parse(product.color);
                          return Array.isArray(parsed) ? parsed : product.color.split(',').map(c => c.trim());
                        } catch {
                          return product.color.split(',').map(c => c.trim());
                        }
                      })()
                    : []
                ).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black ring-2 ring-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.toLowerCase?.() || '#ccc' }}
                    title={color}
                  />
                ))}
              </div>
              {selectedColor && <p className='text-sm text-gray-500 mt-1'>Selected: {selectedColor}</p>}
            </div>

            {/* Size */}
            <div className='mb-4'>
              <p className='text-gray-700 font-medium'>Size</p>
              <div className='flex gap-2 mt-2'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-black text-white border-black' : 'hover:bg-gray-100'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Cart */}
            <div className='mb-6'>
              <p className='text-gray-700 font-medium'>Quantity</p>
              <div className='flex items-center space-x-4 mt-2'>
                <button 
                  onClick={decrement} 
                  className='px-3 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300 transition-colors'
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className='text-lg font-medium'>{quantity}</span>
                <button 
                  onClick={increment} 
                  className='px-3 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300 transition-colors'
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled || cartLoading || product.stock === 0}
              className={`w-full py-3 px-6 rounded font-medium transition-colors ${
                product.stock === 0 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                  : isButtonDisabled || cartLoading
                    ? "bg-gray-600 text-white cursor-not-allowed opacity-75"
                    : "bg-black text-white hover:bg-gray-900"
              } mb-4`}
            >
              {product.stock === 0 
                ? "OUT OF STOCK" 
                : isButtonDisabled || cartLoading 
                  ? "ADDING TO CART..." 
                  : "ADD TO CART"
              }
            </button>

            <div className='mt-6 space-y-4 text-gray-700'>
              <div className='flex items-center gap-3'>
                <FaTag className='text-gray-500' />
                <span><strong>Category:</strong> {product.category}</span>
              </div>
              <div className='flex items-center gap-3'>
                <FaList className='text-gray-500' />
                <span><strong>Subcategory:</strong> {product.subcategory}</span>
              </div>
              <div className='flex items-center gap-3'>
                <FaRulerCombined className='text-gray-500' />
                <span><strong>Material:</strong> {product.material}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='mt-6 sm:mt-12 max-w-6xl mx-auto bg-white p-3 sm:p-6 lg:p-8 rounded-lg shadow-md'>
        <h2 className='text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-1' id="reviews">Customer Reviews</h2>
        
        {/* Review Summary */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg'>
          <div className='text-center sm:text-left'>
            <div className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>
              {product?.ratings?.toFixed(1) || '0.0'}
            </div>
            <div className='flex items-center justify-center sm:justify-start gap-1 mb-1'>
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product?.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className='text-xs sm:text-sm text-gray-600'>
              Based on {(product?.reviews || []).length} reviews
            </p>
          </div>
          
          <div className='flex-1'>
            <h3 className='font-semibold text-gray-800 mb-2 sm:mb-3 text-center sm:text-left'>Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = (product?.reviews || []).filter(r => r.rating === rating).length;
              const percentage = (product?.reviews || []).length > 0 ? (count / (product?.reviews || []).length) * 100 : 0;
              return (
                <div key={rating} className='flex items-center gap-2 sm:gap-3 mb-1'>
                  <span className='text-xs sm:text-sm font-medium w-6 sm:w-8'>{rating}★</span>
                  <div className='flex-1 bg-gray-200 rounded-full h-2'>
                    <div 
                      className='bg-yellow-400 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className='text-xs sm:text-sm text-gray-600 w-6 sm:w-8'>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className='space-y-3 sm:space-y-4'>
          {(product?.reviews || []).length > 0 ? (
            <>
              {(showAllReviews ? (product?.reviews || []) : (product?.reviews || []).slice(0, 2)).map((review, index) => (
                <div key={index} className='border-b pb-3 sm:pb-4 last:border-b-0'>
                  <div className='flex items-start gap-3'>
                    {/* User Avatar */}
                    <div className='w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
                      <span className='text-xs sm:text-sm font-medium text-white'>
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    <div className='flex-1 min-w-0'>
                      {/* Review Header */}
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2'>
                        <h4 className='font-semibold text-sm sm:text-base text-gray-900 truncate'>
                          {review.user?.name || 'Anonymous User'}
                        </h4>
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full'>
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                size={10}
                                className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap'>
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Review Content */}
                      <p className='text-gray-700 text-sm sm:text-base mb-2 leading-relaxed'>
                        {review.comment}
                      </p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className='flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide'>
                          {review.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              className='w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0'
                              onClick={() => {
                                window.open(image, '_blank');
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* See More/See Less Text */}
              {(product?.reviews || []).length > 2 && (
                <div className='text-center pt-2 sm:pt-3'>
                  <span
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className='text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium underline hover:no-underline transition-colors duration-200'
                  >
                    {showAllReviews ? (
                      'Show Less Reviews ↑'
                    ) : (
                      `See More Reviews (${(product?.reviews || []).length - 2} more) ↓`
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-6 sm:py-8'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3'>
                <FaStar className='text-gray-300 text-lg sm:text-xl' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-gray-600 mb-1'>No reviews yet</h3>
              <p className='text-sm text-gray-500'>Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      <div className='mt-20'>
        <h2 className='text-2xl text-center font-medium mb-4'>You May Also Like</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 min-w-full px-1">
            {relatedProducts.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="min-w-[180px] sm:min-w-[200px] bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={p.image?.[0] || ""}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-t"
                />
                <div className="p-3 text-left">
                  <h4 className="font-semibold text-md text-gray-800 truncate">{p.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
