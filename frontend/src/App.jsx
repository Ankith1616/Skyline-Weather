import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Loader from './components/Loader/Loader.jsx';
import ErrorMessage from './components/ErrorMessage/ErrorMessage.jsx';
import Home from './pages/Home/Home.jsx';
import SearchResults from './pages/SearchResults/SearchResults.jsx';
import SearchHistory from './pages/SearchHistory/SearchHistory.jsx';
import { fetchWeatherAndLog, getSearchHistory, deleteHistoryItem } from './services/weatherApi.js';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Sync design theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load history from DB
  const loadHistory = useCallback(async () => {
    try {
      const data = await getSearchHistory();
      setHistory(data || []);
    } catch (err) {
      console.warn('Failed to load search history:', err.message);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Main search implementation coordinating loading & page redirection
  const performSearch = async (searchType, query, coords = null) => {
    setLoading(true);
    setError('');
    setWeatherData(null);
    setActivePage('results'); // navigate to results to show loader/error or data
    
    try {
      const data = await fetchWeatherAndLog(searchType, query, coords);
      setWeatherData(data);
      loadHistory(); // reload history database log entries
    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Get current position from browser geolocation API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setActivePage('results');
      return;
    }

    setLoading(true);
    setError('');
    setActivePage('results');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        performSearch('coords', '', coords);
      },
      (err) => {
        setLoading(false);
        setError(`Location access denied: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

  // Load item from history table
  const handleLoadFromHistory = (item) => {
    performSearch('city', item.location);
  };

  // Delete history entry
  const handleDeleteHistory = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="app-container">
        {loading && <Loader />}
        
        {error && !loading && (
          <ErrorMessage message={error} onClose={() => setActivePage('home')} />
        )}

        {!loading && !error && (
          <>
            {activePage === 'home' && (
              <Home 
                onSearch={performSearch} 
                onDetectLocation={handleDetectLocation} 
              />
            )}
            
            {activePage === 'results' && weatherData && (
              <SearchResults weather={weatherData} onBack={() => setActivePage('home')} />
            )}
            
            {activePage === 'history' && (
              <SearchHistory 
                history={history} 
                onSelectRecord={handleLoadFromHistory}
                onDeleteRecord={handleDeleteHistory}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
