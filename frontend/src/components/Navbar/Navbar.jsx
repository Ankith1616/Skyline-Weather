import React from 'react';
import { Sun, Moon, CloudSun, History, Home } from 'lucide-react';
import './Navbar.css';

function Navbar({ activePage, setActivePage, theme, toggleTheme }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container glass-panel">
        <div className="navbar-brand" onClick={() => setActivePage('home')}>
          <CloudSun className="navbar-logo" />
          <span className="navbar-title">Skyline Weather</span>
        </div>
        
        <nav className="navbar-links">
          <button 
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => setActivePage('history')}
          >
            <History size={18} />
            <span>History</span>
          </button>
        </nav>
        
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
