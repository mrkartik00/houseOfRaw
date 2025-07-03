import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    if (!favorites.some((item) => item._id === product._id)) {
      setFavorites((prev) => [...prev, product]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };

  const isFavorited = (id) => favorites.some((item) => item._id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorited }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
