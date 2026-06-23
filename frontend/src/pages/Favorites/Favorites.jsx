import React, { useEffect, useState } from 'react';
import { Trash2, CloudSun, MapPin, ExternalLink } from 'lucide-react';
import { getFavorites, removeFavorite } from '../../services/weatherApi.js';
import './Favorites.css';

function Favorites({ onSelectCity }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getFavorites();
      setFavorites(data || []);
    } catch (err) {
      setError('Failed to fetch favorite cities. Ensure your backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent navigating to dashboard on delete click
    try {
      await removeFavorite(id);
      setFavorites(prev => prev.filter(fav => fav._id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h2>Your Bookmarked Cities</h2>
        <p>Click on any city to load its detailed forecast</p>
      </div>

      {loading && (
        <div className="favs-loading">
          <div className="spinner"></div>
          <p>Loading bookmarks...</p>
        </div>
      )}

      {error && !loading && (
        <div className="favs-error glass-panel">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="empty-favs glass-panel">
          <CloudSun className="empty-icon" size={60} />
          <h3>No bookmarked cities yet</h3>
          <p>Search for a city on the Dashboard and click the Heart icon to save it here.</p>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="favorites-grid">
          {favorites.map((city) => (
            <div 
              key={city._id} 
              className="favorite-card glass-panel"
              onClick={() => onSelectCity(city.name)}
            >
              <div className="fav-card-body">
                <div className="fav-city-meta">
                  <MapPin size={16} className="meta-icon" />
                  <h4>{city.name}</h4>
                  <span className="country-badge">{city.country}</span>
                </div>
                <div className="coords-detail">
                  Lat: {city.lat.toFixed(2)} | Lon: {city.lon.toFixed(2)}
                </div>
              </div>
              
              <div className="fav-card-actions">
                <div className="view-detail-hint">
                  <ExternalLink size={16} />
                </div>
                <button 
                  className="delete-fav-btn" 
                  onClick={(e) => handleDelete(e, city._id)}
                  aria-label={`Delete ${city.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
