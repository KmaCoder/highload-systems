import { LightbulbServiceClient } from '../proto/lightbulb_grpc_web_pb';
import {
  GetStateRequest,
  SetPowerRequest,
  SetBrightnessRequest,
  SetColorTemperatureRequest
} from '../proto/lightbulb_pb';

// Create a client instance
const client = new LightbulbServiceClient('http://localhost:8080');

// Get the current state of the lightbulb
export const getState = () => {
  return new Promise((resolve, reject) => {
    const request = new GetStateRequest();
    client.getState(request, {}, (err, response) => {
      if (err) {
        console.error('Error getting lightbulb state:', err);
        reject(err);
      } else {
        const state = {
          isOn: response.getIsOn(),
          brightness: response.getBrightness(),
          colorTemperature: response.getColorTemperature()
        };
        resolve(state);
      }
    });
  });
};

// Set the power state of the lightbulb
export const setPower = (isOn) => {
  return new Promise((resolve, reject) => {
    const request = new SetPowerRequest();
    request.setIsOn(isOn);
    client.setPower(request, {}, (err, response) => {
      if (err) {
        console.error('Error setting lightbulb power:', err);
        reject(err);
      } else {
        const state = {
          isOn: response.getIsOn(),
          brightness: response.getBrightness(),
          colorTemperature: response.getColorTemperature()
        };
        resolve(state);
      }
    });
  });
};

// Set the brightness of the lightbulb
export const setBrightness = (brightness) => {
  return new Promise((resolve, reject) => {
    const request = new SetBrightnessRequest();
    request.setBrightness(brightness);
    client.setBrightness(request, {}, (err, response) => {
      if (err) {
        console.error('Error setting lightbulb brightness:', err);
        reject(err);
      } else {
        const state = {
          isOn: response.getIsOn(),
          brightness: response.getBrightness(),
          colorTemperature: response.getColorTemperature()
        };
        resolve(state);
      }
    });
  });
};

// Set the color temperature of the lightbulb
export const setColorTemperature = (temperature) => {
  return new Promise((resolve, reject) => {
    const request = new SetColorTemperatureRequest();
    request.setTemperature(temperature);
    client.setColorTemperature(request, {}, (err, response) => {
      if (err) {
        console.error('Error setting lightbulb color temperature:', err);
        reject(err);
      } else {
        const state = {
          isOn: response.getIsOn(),
          brightness: response.getBrightness(),
          colorTemperature: response.getColorTemperature()
        };
        resolve(state);
      }
    });
  });
}; 