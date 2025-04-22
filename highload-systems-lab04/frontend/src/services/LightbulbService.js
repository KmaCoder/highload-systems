import { LightbulbServicePromiseClient, LightbulbServiceClient } from '../proto/lightbulb_grpc_web_pb';
import {
  GetStateRequest,
  SetPowerRequest,
  SetBrightnessRequest,
  SetColorTemperatureRequest,
  StreamStateRequest
} from '../proto/lightbulb_pb';

// Create a client instance
const promiseClient = new LightbulbServicePromiseClient('http://localhost:8080');
const lightbulbClient = new LightbulbServiceClient('http://localhost:8080');

const responseToStateObject = (response) => {
  return {
    isOn: response.getIsOn(),
    brightness: response.getBrightness(),
    colorTemperature: response.getColorTemperature()
  };
};

// Get the current state of the lightbulb
export const getState = async () => {
  const response = await promiseClient.getState(new GetStateRequest());
  return responseToStateObject(response);
};

// Set the power state of the lightbulb
export const setPower = async (isOn) => {
  const request = new SetPowerRequest().setIsOn(isOn);
  const response = await promiseClient.setPower(request);
  return responseToStateObject(response);
};

// Set the brightness of the lightbulb
export const setBrightness = async (brightness) => {
  const request = new SetBrightnessRequest().setBrightness(brightness);
  const response = await promiseClient.setBrightness(request);
  return responseToStateObject(response);
};

// Set the color temperature of the lightbulb
export const setColorTemperature = async (temperature) => {
  const request = new SetColorTemperatureRequest().setTemperature(temperature);
  const response = await promiseClient.setColorTemperature(request);
  return responseToStateObject(response);
};


// Stream the lightbulb state
export const streamState = (intervalMs = 1000, onStateUpdate, onError) => {
  const request = new StreamStateRequest().setIntervalMs(intervalMs);
  const stream = lightbulbClient.streamState(request, {});
  
  stream.on('data', (response) => {
    onStateUpdate(responseToStateObject(response));
  });
  
  stream.on('error', (err) => {
    console.error('Error in state stream:', err);
    if (onError) onError(err);
  });
  
  stream.on('end', () => {
    console.log('State stream ended');
  });
  
  return () => {
    stream.cancel();
  };
};