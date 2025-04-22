import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({
  isOn,
  brightness,
  colorTemperature,
  onPowerToggle,
  onBrightnessChange,
  onColorTemperatureChange
}) => {
  return (
    <div className="control-panel">
      <h2>Light Bulb Controls</h2>
      
      <div className="control">
        <label htmlFor="power">Power:</label>
        <button 
          id="power" 
          className={`power-button ${isOn ? 'on' : 'off'}`}
          onClick={onPowerToggle}
        >
          {isOn ? 'ON' : 'OFF'}
        </button>
      </div>
      
      <div className="control">
        <label htmlFor="brightness">Brightness: {brightness}%</label>
        <input
          id="brightness"
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={e => onBrightnessChange(Number(e.target.value))}
          disabled={!isOn}
        />
      </div>
      
      <div className="control">
        <label htmlFor="temperature">Color Temperature: {colorTemperature}K</label>
        <input
          id="temperature"
          type="range"
          min="2700"
          max="6500"
          step="100"
          value={colorTemperature}
          onChange={e => onColorTemperatureChange(Number(e.target.value))}
          disabled={!isOn}
        />
        <div className="temperature-scale">
          <span>Warm</span>
          <span>Cool</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 