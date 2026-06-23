import React from 'react';
import WeatherCard from '../../components/WeatherCard/WeatherCard.jsx';
import ForecastCard from '../../components/Forecast/ForecastCard.jsx';
import { 
  ArrowLeft, Umbrella, Zap, Snowflake, Flame, 
  Thermometer, Wind, Smile, Lightbulb, Map, Youtube 
} from 'lucide-react';
import './SearchResults.css';

function SearchResults({ weather, onBack }) {
  const { current, forecast } = weather;

  // Generate dynamic context-aware suggestions
  const getSuggestions = (currentData) => {
    const suggestionsList = [];
    const cond = (currentData.condition || '').toLowerCase();
    const temp = currentData.temperature;
    const wind = currentData.windSpeed;

    // 1. Condition alerts
    if (cond.includes('rain') || cond.includes('drizzle')) {
      suggestionsList.push({
        type: 'rain',
        text: 'Carry an umbrella! Expect wet conditions, keep bags dry, and walk carefully.',
        icon: 'umbrella'
      });
    } else if (cond.includes('storm') || cond.includes('thunderstorm') || cond.includes('lightning')) {
      suggestionsList.push({
        type: 'storm',
        text: 'Severe Storm: Stay indoors! Keep away from windows and charge important devices.',
        icon: 'zap'
      });
    } else if (cond.includes('snow')) {
      suggestionsList.push({
        type: 'snow',
        text: 'Winter Advisory: Dress in thick layers! Watch out for slippery roads and icy paths.',
        icon: 'snowflake'
      });
    }

    // 2. Temperature alerts
    if (temp > 30) {
      suggestionsList.push({
        type: 'hot',
        text: 'High Temp Alert: Stay hydrated! Apply SPF, wear sunglasses, and avoid heavy noon sun.',
        icon: 'flame'
      });
    } else if (temp < 10) {
      suggestionsList.push({
        type: 'cold',
        text: 'Chilly Weather: Bundle up! Wear a coat, thermal layers, and keep hands covered.',
        icon: 'cold'
      });
    }

    // 3. Wind speed alerts
    if (wind > 8) {
      suggestionsList.push({
        type: 'windy',
        text: 'Strong Winds: Watch for flying items, avoid tall trees, and secure lightweight belongings.',
        icon: 'windy'
      });
    }

    // 4. Default advisory if conditions are clear/mild
    if (suggestionsList.length === 0) {
      suggestionsList.push({
        type: 'moderate',
        text: 'Excellent weather! Great day to spend outdoors, take a walk, or go on a scenic drive.',
        icon: 'moderate'
      });
    }

    return suggestionsList;
  };

  const renderSuggestionIcon = (type) => {
    const size = 18;
    switch (type) {
      case 'rain': return <Umbrella size={size} className="suggestion-icon text-blue" />;
      case 'storm': return <Zap size={size} className="suggestion-icon text-yellow" />;
      case 'snow': return <Snowflake size={size} className="suggestion-icon text-sky" />;
      case 'hot': return <Flame size={size} className="suggestion-icon text-orange" />;
      case 'cold': return <Thermometer size={size} className="suggestion-icon text-cyan" />;
      case 'windy': return <Wind size={size} className="suggestion-icon text-teal" />;
      default: return <Smile size={size} className="suggestion-icon text-green" />;
    }
  };

  const curatedVideos = {
    'paris': 'AQ6GmpMu5L8',
    'new york': 'MtCMtC50gwY',
    'london': '45ETZ1xvHS0',
    'tokyo': 'cS-hFKC_RKI',
    'sydney': 'OrIDTJH2ZZM',
    'dubai': 'rBYpB-PnYfg',
    'rome': 'DEJx0CYrDHk'
  };

  const getYoutubeEmbedUrl = () => {
    const loc = (current.location || '').toLowerCase();
    for (const key of Object.keys(curatedVideos)) {
      if (loc.includes(key)) {
        return `https://www.youtube.com/embed/${curatedVideos[key]}`;
      }
    }
    // Fallback general travel video
    return 'https://www.youtube.com/embed/exI_hD_4jAM';
  };

  const suggestions = getSuggestions(current);
  const locationLabel = current.location || 'Searched Location';

  return (
    <div className="results-page-container fade-in">
      <div className="results-nav-header">
        <button 
          className="results-back-btn glass-panel" 
          onClick={onBack || (() => window.location.reload())}
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>
      </div>

      <div className="results-main-content">
        {/* Top Layout Grid: Left Side Weather, Right Side suggestions */}
        <div className="results-top-grid">
          <div className="results-weather-wrapper">
            <WeatherCard current={current} />
          </div>

          <div className="results-suggestions-card glass-panel">
            <div className="card-header-icon-row">
              <Lightbulb className="card-header-icon icon-glow-yellow" size={20} />
              <h3>Smart Weather Advisory</h3>
            </div>
            <div className="suggestions-list">
              {suggestions.map((s, idx) => (
                <div key={idx} className={`suggestion-item suggestion-type-${s.type}`}>
                  <div className="suggestion-icon-container">
                    {renderSuggestionIcon(s.type)}
                  </div>
                  <p className="suggestion-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Grid: Map (Google Maps) and Media (YouTube) */}
        <div className="results-integrations-grid">
          <div className="results-map-card glass-panel">
            <div className="card-header-icon-row">
              <Map className="card-header-icon icon-glow-blue" size={20} />
              <h3>Google Maps Integration</h3>
            </div>
            <div className="map-iframe-container">
              <iframe
                title="Google Maps Location View"
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${current.latitude || current.lat || 0},${current.longitude || current.lon || 0}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                className="map-iframe"
              ></iframe>
            </div>
          </div>

          <div className="results-youtube-card glass-panel">
            <div className="card-header-icon-row">
              <Youtube className="card-header-icon icon-glow-red" size={20} />
              <h3>YouTube Travel Guides</h3>
            </div>
            <div className="youtube-iframe-container">
              <iframe
                title="YouTube Location Travel Guides"
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                src={getYoutubeEmbedUrl()}
                className="youtube-iframe"
              ></iframe>
            </div>
            <div className="youtube-action-wrapper">
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(locationLabel + ' travel guide')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-search-link-btn"
              >
                <span>Watch "{locationLabel}" Guides on YouTube</span>
              </a>
            </div>
          </div>
        </div>
        
        {forecast && forecast.length > 0 && (
          <div className="results-forecast-section">
            <h3 className="results-forecast-title">5-Day Forecast</h3>
            <div className="results-forecast-grid">
              {forecast.map((day, idx) => (
                <ForecastCard key={day.date || idx} dayData={day} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
