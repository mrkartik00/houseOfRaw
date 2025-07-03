import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const FilterPopup = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [tempFilters, setTempFilters] = useState({
    category: '',
    color: '',
    size: [],
    material: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ['T-shirts', 'Shirts', 'Jeans', 'Shorts', 'Jumpsuits', 'Dresses'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'Yellow', 'Gray', 'White', 'Pink', 'Beige', 'Navy'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const materials = ['Cotton', 'Wool', 'Polyester', 'Crush', 'Nilon Terri'];

  // Initialize temp filters when popup opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters({
        category: currentFilters.category || '',
        color: currentFilters.color || '',
        size: currentFilters.size || [],
        material: currentFilters.material || [],
        minPrice: currentFilters.minPrice || 0,
        maxPrice: currentFilters.maxPrice || 100,
      });
      setPriceRange([currentFilters.minPrice || 0, currentFilters.maxPrice || 100]);
    }
  }, [isOpen, currentFilters]);

  // Handle filter update
  const updateTempFilter = (key, value, isMulti = false) => {
    const updated = { ...tempFilters };

    if (isMulti) {
      const set = new Set(updated[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      updated[key] = Array.from(set);
    } else {
      updated[key] = updated[key] === value ? '' : value;
    }

    setTempFilters(updated);
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const max = parseInt(e.target.value);
    setPriceRange([0, max]);
    setTempFilters(prev => ({ ...prev, minPrice: 0, maxPrice: max }));
  };

  // Reset temp filters
  const resetTempFilters = () => {
    setTempFilters({
      category: '',
      color: '',
      size: [],
      material: [],
      minPrice: 0,
      maxPrice: 100,
    });
    setPriceRange([0, 100]);
  };

  // Apply filters
  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  // Discard changes
  const handleDiscard = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors group"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(85vh-160px)]">
          {/* Category */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
                  <input
                    type="radio"
                    name="category"
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={tempFilters.category === cat}
                    onChange={() => updateTempFilter('category', cat)}
                  />
                  <span className="text-gray-700 text-sm font-medium group-hover:text-blue-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">Color</label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateTempFilter('color', color)}
                  className={`w-10 h-10 rounded-full border-3 transition-all duration-200 hover:scale-110 ${
                    tempFilters.color === color 
                      ? 'border-gray-800 shadow-lg scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                >
                  {tempFilters.color === color && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">Size</label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <label key={size} className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  tempFilters.size.includes(size)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={tempFilters.size.includes(size)}
                    onChange={() => updateTempFilter('size', size, true)}
                  />
                  <span className="font-medium text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">Material</label>
            <div className="space-y-2">
              {materials.map((mat) => (
                <label key={mat} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  tempFilters.material.includes(mat)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}>
                  <input
                    type="checkbox"
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={tempFilters.material.includes(mat)}
                    onChange={() => updateTempFilter('material', mat, true)}
                  />
                  <span className={`font-medium text-sm ${
                    tempFilters.material.includes(mat) ? 'text-blue-700' : 'text-gray-700'
                  }`}>{mat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">Price Range</label>
            <div className="px-2">
              <input
                type="range"
                min={0}
                max={100}
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #dbeafe 0%, #3b82f6 ${priceRange[1]}%, #e5e7eb ${priceRange[1]}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm font-medium text-gray-600 mt-3">
                <span className="bg-gray-100 px-2 py-1 rounded">$0</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetTempFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
          >
            Reset All Filters
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleDiscard}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors hover:border-gray-400"
          >
            Discard
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default FilterPopup;