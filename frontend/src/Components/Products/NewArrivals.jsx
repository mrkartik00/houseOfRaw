import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const newArrivals = [...Array(8)].map((_, i) => ({
    _id: String(i + 1),
    name: "Stylish Jacket",
    price: 1200,
    images: [
      {
        url: `https://picsum.photos/500/500?random=${i + 1}`,
        altText: "Stylish Jacket",
      },
    ],
  }));

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto mb-10 relative">
        <div className="text-center relative">
          <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
          <p className="text-lg text-gray-600 mb-8">
            Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
          </p>

          {/* Scroll Buttons */}
          <div className="hidden md:flex absolute right-4 top-16 space-x-2 z-10">
            <button
              className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            <button
              className={`p-2 rounded border ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      </div>


      <div
        ref={scrollRef}
        className={`container mx-auto flex space-x-6 overflow-x-auto scrollbar-hide px-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[280px] sm:min-w-[320px] bg-white shadow-md rounded-lg overflow-hidden relative"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-[320px] object-cover rounded-lg hover:opacity-90 transition"
                draggable="false"
              />
            </Link>

            <div className="bg-white p-4 text-left">
              <Link to={`/product/${product._id}`}>
                <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                <p className="mt-1 text-gray-600">₹{product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
