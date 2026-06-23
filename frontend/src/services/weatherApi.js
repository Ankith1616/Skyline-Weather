// Front-end API Service for Weather App

/**
 * Generate high-fidelity weather metrics for any query type
 * (City, Zipcode, Coordinates, Landmark) to mock live API behavior.
 */
const generateWeatherData = (searchType, query, coords = null) => {
  let locationName = '';
  let lat = 0;
  let lon = 0;

  // 1. Resolve Location label and coordinates
  if (searchType === 'coords' && coords) {
    locationName = `Location (${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)})`;
    lat = coords.lat;
    lon = coords.lon;
  } else if (searchType === 'zipcode') {
    locationName = `Zipcode ${query}`;
    lat = 40.7128;
    lon = -74.0060;
  } else if (searchType === 'landmark') {
    locationName = `${query} (Landmark)`;
    lat = 48.8584;
    lon = 2.2945;
  } else {
    // default City search
    locationName = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
    lat = 34.0522;
    lon = -118.2437;
  }

  // Deterministic seed based on location name
  let seed = 0;
  for (let i = 0; i < locationName.length; i++) {
    seed += locationName.charCodeAt(i);
  }

  const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Snow', 'Thunderstorm'];
  const condition = conditions[seed % conditions.length];
  const tempBase = 10 + (seed % 25); // Between 10 and 35
  
  let description = 'clear sky';
  let icon = '01d';
  switch (condition) {
    case 'Clear': description = 'clear sky'; icon = '01d'; break;
    case 'Clouds': description = 'broken clouds'; icon = '03d'; break;
    case 'Rain': description = 'moderate rain'; icon = '10d'; break;
    case 'Drizzle': description = 'drizzle rain'; icon = '09d'; break;
    case 'Snow': description = 'light snow'; icon = '13d'; break;
    case 'Thunderstorm': description = 'thunderstorm'; icon = '11d'; break;
  }

  const today = new Date();
  
  // Build current weather matching all requirement details
  const current = {
    location: locationName,
    latitude: lat,
    longitude: lon,
    temperature: Math.round(tempBase),
    feelsLike: Math.round(tempBase - (seed % 3)),
    humidity: 45 + (seed % 45), // between 45% and 90%
    windSpeed: parseFloat((2 + (seed % 10) * 0.8).toFixed(1)),
    pressure: 1008 + (seed % 15), // standard hPa around 1013
    visibility: 8000 + (seed % 4) * 1000, // visibility in meters
    sunrise: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 12 + (seed % 20)).toISOString(),
    sunset: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 45 - (seed % 20)).toISOString(),
    condition,
    icon
  };

  // Build 5-day forecast
  const forecast = [];
  for (let i = 1; i <= 5; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const daySeed = seed + i;
    const dayTemp = tempBase + (daySeed % 6) - 3;
    const dayCondition = ['Clear', 'Clouds', 'Rain', 'Clouds'][daySeed % 4];
    
    let dayIcon = '01d';
    if (dayCondition === 'Clouds') dayIcon = '03d';
    if (dayCondition === 'Rain') dayIcon = '10d';

    forecast.push({
      date: nextDay.toISOString().split('T')[0],
      tempMin: Math.round(dayTemp - 4),
      tempMax: Math.round(dayTemp + 4),
      condition: dayCondition,
      icon: dayIcon
    });
  }

  return { current, forecast };
};

export const fetchWeatherAndLog = async (searchType, query, coords = null) => {
  let url = `/api/weather/search?type=${searchType}&query=${encodeURIComponent(query)}`;
  if (searchType === 'coords' && coords) {
    url += `&lat=${coords.lat}&lon=${coords.lon}`;
  }

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch weather data from server.');
  }

  const data = result.data;

  // Normalize backend current weather structure to frontend state keys
  const current = {
    location: data.current.name,
    latitude: data.current.lat,
    longitude: data.current.lon,
    temperature: data.current.temp,
    feelsLike: data.current.feelsLike,
    humidity: data.current.humidity,
    windSpeed: data.current.windSpeed,
    pressure: data.current.pressure || 1013,
    visibility: data.current.visibility || 10000,
    sunrise: data.current.sunrise,
    sunset: data.current.sunset,
    condition: data.current.condition,
    icon: data.current.icon
  };

  // Normalize forecast structure to match cards rendering requirements
  const forecast = (data.forecast || []).map(day => ({
    date: day.date,
    tempMin: day.tempMin !== undefined ? day.tempMin : day.temp - 3,
    tempMax: day.tempMax !== undefined ? day.tempMax : day.temp + 3,
    condition: day.condition,
    icon: day.icon
  }));

  return { current, forecast };
};

/**
 * Fetch history from MongoDB
 * GET /api/weather
 */
export const getSearchHistory = async () => {
  const response = await fetch('/api/weather');
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to retrieve search history');
  }
  
  return result.data;
};

/**
 * Delete history item from database
 * DELETE /api/weather/:id
 */
export const deleteHistoryItem = async (id) => {
  const response = await fetch(`/api/weather/${id}`, {
    method: 'DELETE',
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete history item');
  }
  
  return result;
};
