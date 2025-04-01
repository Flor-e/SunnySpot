import React, { useState, useEffect, createContext, useContext } from 'react';
import { loadFavorites, saveFavorites } from '../utils/storage';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favoritePlants, setFavoritePlants] = useState([]);

  // Load favorites when the app starts
  useEffect(() => {
    const loadFavoritesData = async () => {
      const favorites = await loadFavorites();
      setFavoritePlants(favorites);
    };
    loadFavoritesData();
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    saveFavorites(favoritePlants);
  }, [favoritePlants]);

  return (
    <FavoriteContext.Provider value={{ favoritePlants, setFavoritePlants }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}