import { existsSync, readFileSync, writeFileSync } from 'fs';
import {
  generateWeather,
  Precipitation,
  Saturation,
  Temperature,
  Weather,
} from './generateWeather';

export function getWeather(): Weather {
  if (!existsSync('./weather.json')) {
    writeFileSync('./weather.json', JSON.stringify(generateWeather()));
  }
  return JSON.parse(readFileSync('./weather.json', 'utf8'));
}

export function updateWeather(weather: Weather) {
  saveWeather(generateWeather(weather));
}

export function saveWeather(weather: Weather) {
  writeFileSync('./weather.json', JSON.stringify(weather));
}

export function updatePrecipitation(precipitation: Precipitation) {
  saveWeather({ ...getWeather(), precipitation });
}

export function updateSaturation(saturation: Saturation) {
  saveWeather({ ...getWeather(), saturation });
}
export function updateTemperature(temperature: Temperature) {
  saveWeather({ ...getWeather(), temperature });
}
