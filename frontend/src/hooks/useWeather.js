import { useState, useEffect, useCallback } from 'react';
import { fetchWeather, getFavorites, saveFavorite, removeFavorite } from '../services/weatherApi.js';

function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Fetch all bookmarked cities from backend
  const loadFavorites = useCallback(async () => {
    try {
      const favList = await getFavorites();
      setFavorites(favList || []);
    } catch (err) {
      console.warn('Unable to load favorites on launch:', err.message);
    }
  }, []);

  // Fetch favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Main search function
  const searchCity = useCallback(async (city) => {
    if (!city) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to search for weather details.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle favorite city bookmark
  const toggleFavorite = useCallback(async (cityName) => {
    if (!cityName) return;
    
    const existing = favorites.find(fav => fav.name.toLowerCase() === cityName.toLowerCase());
    
    try {
      if (existing) {
        // Delete favorite
        await removeFavorite(existing._id);
        setFavorites(prev => prev.filter(fav => fav._id !== existing._id));
      } else {
        // Add favorite
        const newFav = await saveFavorite(cityName);
        setFavorites(prev => [...prev, newFav]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err.message);
      setError(err.message || 'Failed to update bookmarks.');
    }
  }, [favorites]);

  return {
    weather,
    loading,
    error,
    favorites,
    searchCity,
    toggleFavorite,
    reloadFavorites: loadFavorites
  };
}

export default useWeather;
