import { generateWeather, translateWeather } from "./generateWeather";

let weather = generateWeather();
for (let i = 0; i < 100; i++) {
  console.log(translateWeather(weather));
  weather = generateWeather(weather);
}
