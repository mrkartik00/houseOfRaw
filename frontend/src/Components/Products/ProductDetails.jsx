// pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleProduct, fetchRelatedProducts } from '../../services/productService';
import { FaStar, FaTag, FaList, FaRulerCombined } from 'react-icons/fa';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const { addToCart, loading: cartLoading } = useCart();

  // Fetch product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchSingleProduct(id);
        setProduct(data);
        if (data.image?.[0]) setMainImage(data.image[0]);

        const related = await fetchRelatedProducts(id);
        setRelatedProducts(Array.isArray(related) ? related : []);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    loadProduct();
  }, [id]);

  // Auto image rotation
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

  const increment = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (product && quantity >= product.stock) {
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
      // Reset selections after successful add
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  if (!product) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='p-4 sm:p-6 lg:p-10 bg-[#c9c9bf4d] min-h-screen'>
      <div className='max-w-6xl mx-auto bg-[#c9c9bf46] p-6 sm:p-10 rounded-lg shadow-md'>
        <div className='flex flex-col md:flex-row'>

          {/* Side Thumbnails */}
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

          {/* Mobile Thumbnails */}
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
                onClick={toggleFavorite}
                className='p-2 border rounded-full hover:bg-gray-100 transition'
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={20}
                  className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} transition-colors duration-200`}
                />
              </button>
            </div>

            <p className='text-xl text-gray-700 font-semibold mb-1'>₹{product.price}</p>
            <div className='flex items-center gap-2 mb-3 text-yellow-500'>
              <FaStar />
              <span className='text-sm text-gray-700'>{product.ratings?.toFixed(1) || 0} / 5</span>
            </div>
            <p className='text-gray-600 mb-6'>{product.description}</p>

            {/* Stock Information */}
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

            {/* Quantity */}
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

            {/* Add to Cart */}
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

            {/* Details */}
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

      {/* You May Also Like */}
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