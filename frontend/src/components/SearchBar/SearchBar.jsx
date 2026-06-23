import React, { useState } from 'react';
import { Search, Navigation } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ onSearch, onDetectLocation }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('city');

  const getPlaceholder = () => {
    switch (searchType) {
      case 'zipcode': return 'Enter zipcode (e.g. 90210)...';
      case 'coords': return 'Enter lat, lon (e.g. 34.05, -118.24)...';
      case 'landmark': return 'Enter landmark (e.g. Eiffel Tower)...';
      default: return 'Enter city name (e.g. Seattle)...';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(searchType, query.trim());
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group glass-panel">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setQuery('');
            }}
          >
            <option value="city">City</option>
            <option value="zipcode">Zipcode</option>
            <option value="coords">Coordinates</option>
            <option value="landmark">Landmark</option>
          </select>
          
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            required
          />

          <button type="submit" className="search-submit-btn" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </form>

      {onDetectLocation && (
        <button 
          className="location-detect-btn glass-panel" 
          onClick={onDetectLocation}
          title="Use current location"
        >
          <Navigation size={18} className="location-icon" />
          <span>Locate Me</span>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
