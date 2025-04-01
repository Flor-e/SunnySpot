// measurementUtils.js - Utility functions for plant-related functionality

/**
 * Get the light level description based on lux value
 * @param {number} lux
 * @returns {string} 
 */
export const getLightLevel = (lux) => {
    if (lux === undefined || lux === null) return 'Unknown';
    if (lux < 500) return 'very low light';
    if (lux < 2000) return 'low light';
    if (lux < 10000) return 'medium light';
    if (lux < 20000) return 'bright light';
    return 'direct sunlight';
  };
  
  /**
   * Parse time of day from timestamp
   * @param {string} timestamp 
   * @returns {string} 
   */
  export const getTimeOfDay = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp);
        return 'unknown';
      }
      const hours = date.getHours();
      if (hours < 12) return 'morning';
      else if (hours < 16) return 'afternoon'; 
      else return 'evening';
    } catch (error) {
      console.error('Error parsing timestamp:', timestamp, error);
      return 'unknown';
    }
  };
  
  /**
   * Calculate the average lux value
   * @param {object} logbook 
   * @param {number} newLux 
   * @returns {number} 
   */
  export const calculateAverage = (logbook, newLux) => {
    const { measurements, average } = logbook;
    return measurements.length 
      ? Math.round((average * measurements.length + newLux) / (measurements.length + 1)) 
      : newLux;
  };