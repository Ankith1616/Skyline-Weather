import React, { useState, useEffect } from 'react';
import { Trash2, Search, History, CloudRain, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import './SearchHistory.css';

function SearchHistory({ history, onSelectRecord, onDeleteRecord }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCondition, setFilterCondition] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterTempMin, setFilterTempMin] = useState('');
  const [filterTempMax, setFilterTempMax] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState(history);

  // Sync and filter local listings using all filtering states
  useEffect(() => {
    let result = [...history];

    // 1. Location text filter
    if (filterQuery.trim()) {
      const match = filterQuery.toLowerCase();
      result = result.filter(item => 
        item.location.toLowerCase().includes(match)
      );
    }

    // 2. Weather condition dropdown filter
    if (filterCondition && filterCondition !== 'All') {
      result = result.filter(item => 
        item.condition.toLowerCase() === filterCondition.toLowerCase()
      );
    }

    // 3. Date range filter
    if (filterDateFrom) {
      const fromTime = new Date(filterDateFrom).setHours(0, 0, 0, 0);
      result = result.filter(item => new Date(item.createdAt).getTime() >= fromTime);
    }
    if (filterDateTo) {
      const toTime = new Date(filterDateTo).setHours(23, 59, 59, 999);
      result = result.filter(item => new Date(item.createdAt).getTime() <= toTime);
    }

    // 4. Temperature range filter
    if (filterTempMin !== '') {
      result = result.filter(item => item.temperature >= parseFloat(filterTempMin));
    }
    if (filterTempMax !== '') {
      result = result.filter(item => item.temperature <= parseFloat(filterTempMax));
    }

    // 5. Sort logic
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'tempHigh':
          return b.temperature - a.temperature;
        case 'tempLow':
          return a.temperature - b.temperature;
        case 'nameAZ':
          return a.location.localeCompare(b.location);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredHistory(result);
  }, [filterQuery, filterCondition, filterDateFrom, filterDateTo, filterTempMin, filterTempMax, sortBy, history]);

  const clearFilters = () => {
    setFilterQuery('');
    setFilterCondition('All');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterTempMin('');
    setFilterTempMax('');
    setSortBy('newest');
  };

  const handleExport = (format) => {
    // Triggers file download by navigating to backend API endpoint
    window.location.href = `/api/export/${format}`;
  };

  return (
    <div className="history-page-container fade-in">
      <div className="history-header">
        <div className="history-header-title">
          <History className="history-title-icon" size={24} />
          <h2>Database Search Log</h2>
        </div>
        <p>A history of all searches stored in MongoDB</p>
      </div>

      <div className="history-toolbar">
        <div className="history-search-bar glass-panel">
          <Search className="history-search-icon" size={18} />
          <input
            type="text"
            placeholder="Filter history log by location..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="history-search-input"
          />
        </div>
        
        <button 
          className={`filter-toggle-btn glass-panel ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle advanced filters"
        >
          <SlidersHorizontal size={18} className="filter-toggle-icon" />
          <span>Filters</span>
        </button>

        <div className="export-buttons-group glass-panel">
          <span className="export-label">Export:</span>
          <button className="export-btn btn-json" onClick={() => handleExport('json')}>JSON</button>
          <button className="export-btn btn-csv" onClick={() => handleExport('csv')}>CSV</button>
          <button className="export-btn btn-pdf" onClick={() => handleExport('pdf')}>PDF</button>
        </div>
      </div>

      {showFilters && (
        <div className="history-advanced-filters-panel glass-panel fade-in">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Condition</label>
              <select 
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Conditions</option>
                <option value="Clear">Clear</option>
                <option value="Clouds">Clouds</option>
                <option value="Rain">Rain</option>
                <option value="Drizzle">Drizzle</option>
                <option value="Snow">Snow</option>
                <option value="Thunderstorm">Thunderstorm</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Date From</label>
              <input 
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Date To</label>
              <input 
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Min Temp (°C)</label>
              <input 
                type="number"
                placeholder="Min temp..."
                value={filterTempMin}
                onChange={(e) => setFilterTempMin(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Temp (°C)</label>
              <input 
                type="number"
                placeholder="Max temp..."
                value={filterTempMax}
                onChange={(e) => setFilterTempMax(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="tempHigh">Temp: High to Low</option>
                <option value="tempLow">Temp: Low to High</option>
                <option value="nameAZ">Location: A to Z</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>Reset Filters</button>
          </div>
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="history-empty-state glass-panel">
          <CloudRain size={48} className="empty-state-icon" />
          {filterQuery || filterCondition !== 'All' || filterDateFrom || filterDateTo || filterTempMin || filterTempMax ? (
            <p>No logged searches match your filter criteria.</p>
          ) : (
            <>
              <h3>History log is empty</h3>
              <p>Searches performed from the home page will be saved in MongoDB and displayed here.</p>
            </>
          )}
        </div>
      ) : (
        <div className="history-list glass-panel">
          <div className="history-table-header">
            <span className="col-location">Location</span>
            <span className="col-temp">Temp</span>
            <span className="col-humidity">Humidity</span>
            <span className="col-wind">Wind</span>
            <span className="col-condition font-display">Condition</span>
            <span className="col-date">Search Date</span>
            <span className="col-actions">Actions</span>
          </div>

          <div className="history-table-body">
            {filteredHistory.map((item) => (
              <div 
                key={item._id} 
                className="history-row"
                onClick={() => onSelectRecord(item)}
              >
                <span className="col-location font-semibold">
                  {item.location}
                </span>
                
                <span className="col-temp font-mono">
                  {Math.round(item.temperature)}°C
                </span>
                
                <span className="col-humidity">
                  {item.humidity}%
                </span>
                
                <span className="col-wind">
                  {item.windSpeed} m/s
                </span>
                
                <span className="col-condition">
                  <span className={`condition-tag condition-${item.condition.toLowerCase()}`}>
                    {item.condition}
                  </span>
                </span>
                
                <span className="col-date text-muted">
                  {formatDate(item.createdAt)}
                </span>
                
                <span className="col-actions">
                  <button 
                    className="history-view-btn"
                    title="Load Weather details"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRecord(item);
                    }}
                  >
                    <ExternalLink size={16} />
                  </button>
                  
                  <button 
                    className="history-delete-btn"
                    title="Delete log from database"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(item._id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchHistory;
