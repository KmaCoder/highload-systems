import React, { useState, useEffect } from 'react';
import './App.css';
import Lightbulb from './components/Lightbulb';
import ControlPanel from './components/ControlPanel';
import * as LightbulbService from './services/LightbulbService';

function App() {
  const [state, setState] = useState({
    isOn: false,
    brightness: 50,
    colorTemperature: 4000
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial state when component mounts
  useEffect(() => {
    const fetchState = async () => {
      try {
        setLoading(true);
        const bulbState = await LightbulbService.getState();
        setState(bulbState);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bulb state:', err);
        setError('Failed to connect to the server. Make sure it is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, []);

  // Handle power toggle
  const handlePowerToggle = async () => {
    try {
      setLoading(true);
      const newState = await LightbulbService.setPower(!state.isOn);
      setState(newState);
      setError(null);
    } catch (err) {
      console.error('Failed to toggle power:', err);
      setError('Failed to toggle power. Server may be down.');
    } finally {
      setLoading(false);
    }
  };

  // Handle brightness change
  const handleBrightnessChange = async (brightness) => {
    try {
      setLoading(true);
      const newState = await LightbulbService.setBrightness(brightness);
      setState(newState);
      setError(null);
    } catch (err) {
      console.error('Failed to change brightness:', err);
      setError('Failed to change brightness. Server may be down.');
    } finally {
      setLoading(false);
    }
  };

  // Handle color temperature change
  const handleColorTemperatureChange = async (temperature) => {
    try {
      setLoading(true);
      const newState = await LightbulbService.setColorTemperature(temperature);
      setState(newState);
      setError(null);
    } catch (err) {
      console.error('Failed to change color temperature:', err);
      setError('Failed to change color temperature. Server may be down.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Lightbulb Control</h1>
      </header>

      <main>
        {error && <div className="error-message">{error}</div>}
        
        <div className={`lightbulb-display ${loading ? 'loading' : ''}`}>
          <Lightbulb
            isOn={state.isOn}
            brightness={state.brightness}
            colorTemperature={state.colorTemperature}
          />
        </div>

        <ControlPanel
          isOn={state.isOn}
          brightness={state.brightness}
          colorTemperature={state.colorTemperature}
          onPowerToggle={handlePowerToggle}
          onBrightnessChange={handleBrightnessChange}
          onColorTemperatureChange={handleColorTemperatureChange}
        />
      </main>

      <footer>
        <p>Built with React and gRPC</p>
      </footer>
    </div>
  );
}

export default App; 