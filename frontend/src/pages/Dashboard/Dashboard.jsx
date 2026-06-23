import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import WeatherCard from '../../components/WeatherCard/WeatherCard.jsx';
import Forecast from '../../components/Forecast/Forecast.jsx';
import useWeather from '../../hooks/useWeather.js';
import './Dashboard.css';

function Dashboard({ selectedCity, setSelectedCity }) {
  const { 
    weather, 
    loading, 
    error, 
    favorites, 
    searchCity, 
    toggleFavorite 
  } = useWeather();

  const [searchTriggered, setSearchTriggered] = useState(false);

  // Sync with selected city navigation from Favorites screen
  useEffect(() => {
    if (selectedCity) {
      searchCity(selectedCity);
      setSelectedCity(''); // Reset selection after search
    }
  }, [selectedCity, searchCity, setSelectedCity]);

  // Initial search on mount if no weather exists
  useEffect(() => {
    if (!weather && !loading && !error && !searchTriggered) {
      setSearchTriggered(true);
      searchCity('New York');
    }
  }, [weather, loading, error, searchCity, searchTriggered]);

  const handleSearch = (city) => {
    searchCity(city);
  };

  const isCurrentFavorite = () => {
    if (!weather || !weather.current) return false;
    return favorites.some(fav => fav.name.toLowerCase() === weather.current.name.toLowerCase());
  };

  const handleToggleFavorite = () => {
    if (weather && weather.current) {
      toggleFavorite(weather.current.name);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="dashboard-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching forecast...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state glass-panel">
            <p className="error-message">⚠️ {error}</p>
            <p className="error-tip">Please check the city name and try again.</p>
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-display-area fade-in">
            <WeatherCard 
              weather={weather} 
              isFavorite={isCurrentFavorite()} 
              onToggleFavorite={handleToggleFavorite} 
            />
            
            {weather.forecast && weather.forecast.length > 0 && (
              <Forecast forecast={weather.forecast} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
