import React from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, Snowflake, CloudLightning } from 'lucide-react';
import { getDayName } from '../../utils/formatters.js';
import './Forecast.css';

function Forecast({ forecast }) {
  const getWeatherIcon = (condition) => {
    const size = 32;
    switch (condition) {
      case 'Clear':
        return <Sun className="forecast-icon clear" size={size} />;
      case 'Clouds':
        return <Cloud className="forecast-icon clouds" size={size} />;
      case 'Rain':
        return <CloudRain className="forecast-icon rain" size={size} />;
      case 'Drizzle':
        return <CloudDrizzle className="forecast-icon drizzle" size={size} />;
      case 'Snow':
        return <Snowflake className="forecast-icon snow" size={size} />;
      case 'Thunderstorm':
        return <CloudLightning className="forecast-icon storm" size={size} />;
      default:
        return <Cloud className="forecast-icon" size={size} />;
    }
  };

  return (
    <div className="forecast-wrapper">
      <h3 className="forecast-title">5-Day Forecast</h3>
      
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={day.date || index} className="forecast-item glass-panel">
            <span className="forecast-day">{getDayName(day.date)}</span>
            <div className="forecast-icon-wrapper">
              {getWeatherIcon(day.condition)}
            </div>
            <span className="forecast-desc">{day.condition}</span>
            <div className="forecast-temps">
              <span className="forecast-temp-max">{day.tempMax}°</span>
              <span className="forecast-temp-min">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
