import { generateWeather } from "./generateWeather";

let weather = generateWeather();
for (let i = 0; i < 100; i++) {
  console.log(weather);
  weather = generateWeather(weather);
}
