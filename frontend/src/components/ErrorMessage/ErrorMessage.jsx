import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './ErrorMessage.css';

function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-panel glass-panel">
      <div className="error-header">
        <AlertCircle size={28} className="error-icon" />
        <h4>Search Failed</h4>
        {onClose && (
          <button className="error-close-btn" onClick={onClose} aria-label="Dismiss error">
            <X size={18} />
          </button>
        )}
      </div>
      <div className="error-body">
        <p>{message}</p>
      </div>
      {onClose && (
        <button className="error-back-btn btn-primary" onClick={onClose}>
          Go Back Home
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
