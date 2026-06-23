import logger from '../utils/logger.js';

// OpenWeatherMap endpoints
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Generate mock weather data dynamically based on search parameters
 * to provide a high-fidelity offline mode.
 */
const generateMockWeatherData = (searchType, query, latVal = null, lonVal = null) => {
  let locationName = '';
  let lat = 0;
  let lon = 0;

  if (searchType === 'coords' && latVal !== null && lonVal !== null) {
    locationName = `Location (${parseFloat(latVal).toFixed(3)}, ${parseFloat(lonVal).toFixed(3)})`;
    lat = parseFloat(latVal);
    lon = parseFloat(lonVal);
  } else if (searchType === 'zipcode') {
    locationName = `Zipcode ${query}`;
    lat = 40.7128;
    lon = -74.0060;
  } else if (searchType === 'landmark') {
    locationName = `${query} (Landmark)`;
    lat = 48.8584;
    lon = 2.2945;
  } else {
    locationName = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
    lat = 34.0522;
    lon = -118.2437;
  }

  // Deterministic seed based on location name characters
  let seed = 0;
  for (let i = 0; i < locationName.length; i++) {
    seed += locationName.charCodeAt(i);
  }

  const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Snow', 'Thunderstorm'];
  const condition = conditions[seed % conditions.length];
  const tempBase = 10 + (seed % 25); // Temp between 10°C and 35°C
  
  let description = 'clear sky';
  switch (condition) {
    case 'Clear': description = 'clear sky'; break;
    case 'Clouds': description = 'scattered clouds'; break;
    case 'Rain': description = 'moderate rain'; break;
    case 'Drizzle': description = 'light intensity drizzle'; break;
    case 'Snow': description = 'light snow'; break;
    case 'Thunderstorm': description = 'thunderstorm with rain'; break;
  }

  // Build current weather
  const current = {
    name: locationName,
    country: seed % 2 === 0 ? 'US' : 'GB',
    lat: parseFloat(lat.toFixed(4)),
    lon: parseFloat(lon.toFixed(4)),
    temp: Math.round(tempBase),
    feelsLike: Math.round(tempBase - (seed % 3)),
    tempMin: Math.round(tempBase - 4),
    tempMax: Math.round(tempBase + 4),
    humidity: 40 + (seed % 50),
    windSpeed: parseFloat((1.5 + (seed % 12) * 0.7).toFixed(1)),
    pressure: 1008 + (seed % 15),
    visibility: 8000 + (seed % 4) * 1000,
    sunrise: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 12 + (seed % 20)).toISOString(),
    sunset: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 19, 45 - (seed % 20)).toISOString(),
    condition,
    description,
    icon: getIconCode(condition),
    timestamp: Date.now()
  };


  // Build 5-day forecast
  const forecast = [];
  const startDay = new Date();
  for (let i = 1; i <= 5; i++) {
    const forecastDay = new Date(startDay);
    forecastDay.setDate(startDay.getDate() + i);
    
    const daySeed = seed + i;
    const tempVar = (daySeed % 5) - 2;
    const dayTemp = current.temp + tempVar;
    const dayCondition = ['Clear', 'Clouds', 'Rain', 'Clouds'][daySeed % 4];
    
    forecast.push({
      date: forecastDay.toISOString().split('T')[0],
      temp: Math.round(dayTemp),
      tempMin: Math.round(dayTemp - 3),
      tempMax: Math.round(dayTemp + 3),
      condition: dayCondition,
      icon: getIconCode(dayCondition)
    });
  }

  return { current, forecast };
};

const getIconCode = (condition) => {
  switch (condition) {
    case 'Clear': return '01d';
    case 'Clouds': return '03d';
    case 'Rain': return '10d';
    case 'Drizzle': return '09d';
    case 'Snow': return '13d';
    case 'Thunderstorm': return '11d';
    default: return '02d';
  }
};

export const fetchWeatherData = async (searchType, query, latVal = null, lonVal = null) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'mock' || apiKey === '') {
    logger.info(`OpenWeather API Key not configured or set to mock. Returning mock data for searchType: ${searchType}, query: ${query}`);
    return generateMockWeatherData(searchType, query, latVal, lonVal);
  }

  try {
    let lat = 0;
    let lon = 0;
    let name = '';
    let country = '';

    // 1. Resolve coordinates based on searchType
    if (searchType === 'coords' && latVal !== null && lonVal !== null) {
      lat = parseFloat(latVal);
      lon = parseFloat(lonVal);
      name = `Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
      country = 'GPS';
    } else if (searchType === 'zipcode') {
      const zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(query)}&appid=${apiKey}`;
      const zipResponse = await fetch(zipUrl);
      if (!zipResponse.ok) {
        throw new Error(`Failed to fetch zipcode geocoding data: ${zipResponse.statusText}`);
      }
      const zipData = await zipResponse.json();
      if (!zipData || !zipData.lat) {
        throw new Error(`Zipcode "${query}" not found.`);
      }
      lat = zipData.lat;
      lon = zipData.lon;
      name = zipData.name;
      country = zipData.country;
    } else {
      const geoUrl = `${GEO_API_URL}?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error(`Failed to fetch geocoding data: ${geoResponse.statusText}`);
      }
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        throw new Error(`Location "${query}" not found.`);
      }
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      name = geoData[0].name;
      country = geoData[0].country;
    }

    // 2. Fetch Current Weather
    const weatherUrl = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch current weather: ${weatherResponse.statusText}`);
    }
    const weatherData = await weatherResponse.json();

    // 3. Fetch 5-Day Forecast
    const forecastUrl = `${FORECAST_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Failed to fetch forecast: ${forecastResponse.statusText}`);
    }
    const forecastData = await forecastResponse.json();

    // 4. Format Weather
    const current = {
      name,
      country,
      lat,
      lon,
      temp: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      tempMin: Math.round(weatherData.main.temp_min),
      tempMax: Math.round(weatherData.main.temp_max),
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      timestamp: Date.now()
    };

    // 5. Format Forecast (1 per day around noon)
    const dailyForecasts = [];
    const list = forecastData.list || [];
    
    const grouped = {};
    list.forEach(item => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(item);
    });

    Object.keys(grouped).slice(1, 6).forEach(date => {
      const dayItems = grouped[date];
      let bestItem = dayItems[0];
      dayItems.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
          bestItem = item;
        }
      });

      dailyForecasts.push({
        date,
        temp: Math.round(bestItem.main.temp),
        tempMin: Math.round(bestItem.main.temp_min),
        tempMax: Math.round(bestItem.main.temp_max),
        condition: bestItem.weather[0].main,
        icon: bestItem.weather[0].icon
      });
    });

    return { current, forecast: dailyForecasts };
  } catch (error) {
    logger.error(`Error in weatherService for type ${searchType}, query "${query}": ${error.message}`);
    throw error;
  }
};
