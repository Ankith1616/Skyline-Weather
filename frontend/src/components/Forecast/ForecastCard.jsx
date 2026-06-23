import React from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, Snowflake, CloudLightning } from 'lucide-react';
import { getDayName } from '../../utils/formatters.js';
import './ForecastCard.css';

function ForecastCard({ dayData }) {
  const { date, tempMin, tempMax, condition, icon } = dayData;

  const getWeatherIcon = (weatherCondition) => {
    const size = 36;
    switch (weatherCondition) {
      case 'Clear':
        return <Sun className="forecast-card-icon clear" size={size} />;
      case 'Clouds':
        return <Cloud className="forecast-card-icon clouds" size={size} />;
      case 'Rain':
        return <CloudRain className="forecast-card-icon rain" size={size} />;
      case 'Drizzle':
        return <CloudDrizzle className="forecast-card-icon drizzle" size={size} />;
      case 'Snow':
        return <Snowflake className="forecast-card-icon snow" size={size} />;
      case 'Thunderstorm':
        return <CloudLightning className="forecast-card-icon storm" size={size} />;
      default:
        return <Cloud className="forecast-card-icon" size={size} />;
    }
  };

  return (
    <div className="forecast-card-item glass-panel">
      <span className="forecast-card-day">{getDayName(date)}</span>
      <div className="forecast-card-icon-container">
        {getWeatherIcon(condition)}
      </div>
      <span className="forecast-card-condition">{condition}</span>
      <div className="forecast-card-temps">
        <span className="forecast-card-temp-max">{tempMax}°C</span>
        <span className="forecast-card-temp-min">{tempMin}°C</span>
      </div>
    </div>
  );
}

export default ForecastCard;
