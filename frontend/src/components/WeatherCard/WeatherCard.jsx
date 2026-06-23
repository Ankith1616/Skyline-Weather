import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudDrizzle, Snowflake, CloudLightning, 
  Wind, Droplets, MapPin, Gauge, Eye, Sunrise, Sunset 
} from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters.js';
import './WeatherCard.css';

function WeatherCard({ current }) {
  const getWeatherIcon = (condition) => {
    const size = 64;
    switch (condition) {
      case 'Clear':
        return <Sun className="weather-icon icon-clear" size={size} />;
      case 'Clouds':
        return <Cloud className="weather-icon icon-clouds" size={size} />;
      case 'Rain':
        return <CloudRain className="weather-icon icon-rain" size={size} />;
      case 'Drizzle':
        return <CloudDrizzle className="weather-icon icon-drizzle" size={size} />;
      case 'Snow':
        return <Snowflake className="weather-icon icon-snow" size={size} />;
      case 'Thunderstorm':
        return <CloudLightning className="weather-icon icon-storm" size={size} />;
      default:
        return <Cloud className="weather-icon" size={size} />;
    }
  };

  // Convert visibility to km
  const formatVisibility = (meters) => {
    if (!meters) return 'N/A';
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="weather-card-container glass-panel">
      <div className="weather-card-header">
        <div className="weather-location-info">
          <div className="location-row">
            <MapPin size={20} className="pin-icon" />
            <h2>{current.location}</h2>
          </div>
          <span className="weather-date">{formatDate(new Date())}</span>
        </div>
        <div className="weather-main-badge">
          {current.condition}
        </div>
      </div>

      <div className="weather-card-body">
        <div className="weather-temp-row">
          {getWeatherIcon(current.condition)}
          <div>
            <div className="weather-temp-val">{current.temperature}°C</div>
            <p className="weather-feels">Feels like {current.feelsLike}°C</p>
          </div>
        </div>
      </div>

      <div className="weather-card-grid">
        <div className="weather-grid-item">
          <Droplets size={20} className="grid-item-icon color-blue" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Humidity</span>
            <span className="grid-item-val">{current.humidity}%</span>
          </div>
        </div>

        <div className="weather-grid-item">
          <Wind size={20} className="grid-item-icon color-teal" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Wind Speed</span>
            <span className="grid-item-val">{current.windSpeed} m/s</span>
          </div>
        </div>

        <div className="weather-grid-item">
          <Gauge size={20} className="grid-item-icon color-purple" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Pressure</span>
            <span className="grid-item-val">{current.pressure} hPa</span>
          </div>
        </div>

        <div className="weather-grid-item">
          <Eye size={20} className="grid-item-icon color-orange" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Visibility</span>
            <span className="grid-item-val">{formatVisibility(current.visibility)}</span>
          </div>
        </div>

        <div className="weather-grid-item">
          <Sunrise size={20} className="grid-item-icon color-yellow" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Sunrise</span>
            <span className="grid-item-val">{formatTime(current.sunrise)}</span>
          </div>
        </div>

        <div className="weather-grid-item">
          <Sunset size={20} className="grid-item-icon color-rose" />
          <div className="grid-item-meta">
            <span className="grid-item-label">Sunset</span>
            <span className="grid-item-val">{formatTime(current.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
