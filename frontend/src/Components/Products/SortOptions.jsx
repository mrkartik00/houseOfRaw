import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllProducts } from '../services/productService';
import ProductGrid from './ProductGrid';
import SortOptions from './SortOptions';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = Object.fromEntries([...searchParams]);
        const data = await fetchAllProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Shop</h2>
        <SortOptions />
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

export default ShopPage;
