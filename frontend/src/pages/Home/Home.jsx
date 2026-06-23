import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import { CloudSun, ArrowRight } from 'lucide-react';
import './Home.css';

function Home({ onSearch, onDetectLocation }) {
  const quickCities = ['London', 'Tokyo', 'Sydney', 'New York'];

  return (
    <div className="home-page-container fade-in">
      <div className="home-hero">
        <div className="home-logo-circle">
          <CloudSun className="home-hero-icon" size={60} />
        </div>
        <h1 className="home-title">Experience the Skies</h1>
        <p className="home-subtitle">
          Retrieve instantaneous, high-fidelity current forecasts and 5-day weather conditions using City name, Zipcode, Landmarks, or Coordinates.
        </p>
      </div>

      <div className="home-search-section">
        <SearchBar onSearch={onSearch} onDetectLocation={onDetectLocation} />
      </div>

      <div className="home-quick-cities">
        <h3 className="quick-cities-title">Quick Lookups</h3>
        <div className="quick-cities-grid">
          {quickCities.map((city) => (
            <button 
              key={city} 
              className="quick-city-card glass-panel"
              onClick={() => onSearch('city', city)}
            >
              <span>{city}</span>
              <ArrowRight size={16} className="quick-city-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
