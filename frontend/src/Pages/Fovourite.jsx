import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ProductGrid from '../Components/Products/ProductGrid';

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Favorites</h1>
      {favorites.length > 0 ? (
        <ProductGrid products={favorites} />
      ) : (
        <p className="text-gray-500">You haven’t added any favorites yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
