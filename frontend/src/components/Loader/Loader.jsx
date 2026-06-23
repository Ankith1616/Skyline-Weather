import React from 'react';
import './Loader.css';

function Loader({ message = "Gathering weather data..." }) {
  return (
    <div className="loader-container glass-panel">
      <div className="loader-spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
}

export default Loader;
