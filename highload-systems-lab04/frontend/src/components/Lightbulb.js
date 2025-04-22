import React from 'react';
import './Lightbulb.css';

const Lightbulb = ({ isOn, brightness, colorTemperature }) => {
  const getBulbColor = () => {
    // Convert color temperature to RGB approximate
    // This is a simplified calculation for visual effect
    const temp = colorTemperature / 100;
    
    // For warm to cool colors (yellow to white to blue)
    let r, g, b;
    
    if (temp <= 66) {
      r = 255;
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      g = Math.min(255, Math.max(0, g));
      
      if (temp <= 19) {
        b = 0;
      } else {
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
        b = Math.min(255, Math.max(0, b));
      }
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.min(255, Math.max(0, r));
      
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      g = Math.min(255, Math.max(0, g));
      
      b = 255;
    }
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const getBulbOpacity = () => {
    if (!isOn) return 0.2;
    return 0.3 + (brightness / 100) * 0.7; // Scale opacity based on brightness
  };

  const bulbStyle = {
    backgroundColor: getBulbColor(),
    opacity: getBulbOpacity(),
    boxShadow: isOn ? `0 0 ${20 + brightness}px ${getBulbColor()}` : 'none',
  };

  return (
    <div className="lightbulb-container">
      <div className="lightbulb-cap"></div>
      <div className="lightbulb" style={bulbStyle}></div>
    </div>
  );
};

export default Lightbulb; 