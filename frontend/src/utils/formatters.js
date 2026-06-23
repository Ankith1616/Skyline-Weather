/**
 * Formats a timestamp into a friendly date string (e.g. "Friday, Jun 19, 2026")
 * @param {number|string|Date} timestamp - Any valid timestamp or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Returns the short weekday name from an ISO date string (e.g. "Mon", "Tue")
 * @param {string} dateStr - Date string in format YYYY-MM-DD
 * @returns {string} Weekday name
 */
export const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00'); // append time to avoid timezone offset shifts
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Returns a formatted local time string (e.g. "6:12 AM")
 * @param {string|Date} timeString - UTC time string or Date object
 * @returns {string} Formatted clock time
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
