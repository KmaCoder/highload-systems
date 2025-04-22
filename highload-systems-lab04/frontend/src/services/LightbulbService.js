import { LightbulbServicePromiseClient } from '../proto/lightbulb_grpc_web_pb';
import {
  GetStateRequest,
  SetPowerRequest,
  SetBrightnessRequest,
  SetColorTemperatureRequest
} from '../proto/lightbulb_pb';

// Create a client instance
const client = new LightbulbServicePromiseClient('http://localhost:8080');

const responseToStateObject = (response) => {
  return {
    isOn: response.getIsOn(),
    brightness: response.getBrightness(),
    colorTemperature: response.getColorTemperature()
  };
};

// Get the current state of the lightbulb
export const getState = async () => {
  const response = await client.getState(new GetStateRequest());
  return responseToStateObject(response);
};

// Set the power state of the lightbulb
export const setPower = async (isOn) => {
  const request = new SetPowerRequest().setIsOn(isOn);
  const response = await client.setPower(request);
  return responseToStateObject(response);
};

// Set the brightness of the lightbulb
export const setBrightness = async (brightness) => {
  const request = new SetBrightnessRequest().setBrightness(brightness);
  const response = await client.setBrightness(request);
  return responseToStateObject(response);
};

// Set the color temperature of the lightbulb
export const setColorTemperature = async (temperature) => {
  const request = new SetColorTemperatureRequest().setTemperature(temperature);
  const response = await client.setColorTemperature(request);
  return responseToStateObject(response);
};
