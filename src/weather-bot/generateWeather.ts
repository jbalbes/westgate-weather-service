export enum Temperature {
  SCORCHING, // 100+
  TROPICAL, //  80 - 100
  TEMPERATE, //  60 - 80
  COLD, // 40 - 60
  FREEZING, // 10 - 40
  ARCTIC, // 10-
}

export const temperatureMap: Record<Temperature, string> = {
  [Temperature.SCORCHING]: 'scorching (100°F+)',
  [Temperature.TROPICAL]: 'tropical (80°F-100°F)',
  [Temperature.TEMPERATE]: 'temperate (60°F-80°F)',
  [Temperature.COLD]: 'cold (30°F-60°F)',
  [Temperature.FREEZING]: 'freezing (0°F-30°F)',
  [Temperature.ARCTIC]: 'arctic (0°F or below)',
};

export enum Precipitation {
  NONE,
  LIGHT,
  MODERATE,
  HEAVY,
  SEVERE,
}

export const precipitationMap: Record<Precipitation, string> = {
  [Precipitation.NONE]: 'none',
  [Precipitation.LIGHT]: 'light',
  [Precipitation.MODERATE]: 'moderate',
  [Precipitation.HEAVY]: 'heavy',
  [Precipitation.SEVERE]: 'severe',
};

export enum Saturation {
  SEVERE_DROUGHT,
  MILD_DROUGHT,
  NORMAL,
  MILD_FLOODING,
  SEVERE_FLOODING,
}

export const saturationMap: Record<Saturation, string> = {
  [Saturation.SEVERE_DROUGHT]: 'severe drought',
  [Saturation.MILD_DROUGHT]: 'mild drought',
  [Saturation.NORMAL]: 'normal',
  [Saturation.MILD_FLOODING]: 'mild flooding',
  [Saturation.SEVERE_FLOODING]: 'severe flooding',
};

export interface Weather {
  temperature: Temperature;
  precipitation: Precipitation;
  saturation: number;
}

const startingWeather: Weather = {
  temperature: Temperature.FREEZING,
  precipitation: Precipitation.HEAVY,
  saturation: Saturation.NORMAL,
};

export function translateWeather(weather: Weather) {
  let message = '';
  message += `The temperature range is currently ${
    temperatureMap[weather.temperature]
  }.`;
  const type = weather.temperature > Temperature.COLD ? 'snow' : 'rain';
  if (weather.precipitation === Precipitation.NONE) {
    message += ` Expect clear skies`;
  } else if (weather.precipitation < Precipitation.HEAVY) {
    message += ` Expect ${precipitationMap[weather.precipitation]} ${type}.`;
  } else {
    message += ` Expect ${
      precipitationMap[weather.precipitation]
    } ${type} storms.`;
  }
  if (weather.saturation != Saturation.NORMAL) {
    message += ` We are currently experiencing ${
      saturationMap[weather.saturation]
    }.`;
  }
  return message;
}

function generateTempChange(prev: Temperature) {
  const result = Math.random();
  switch (prev) {
    case Temperature.ARCTIC:
      return result < 0.1 ? Temperature.ARCTIC : Temperature.FREEZING;
    case Temperature.FREEZING:
      if (result < 0.2) {
        return Temperature.ARCTIC;
      } else if (result < 0.7) {
        return Temperature.FREEZING;
      } else {
        return Temperature.COLD;
      }
    case Temperature.COLD:
      if (result < 0.1) {
        return Temperature.FREEZING;
      } else if (result < 0.6) {
        return Temperature.COLD;
      } else {
        return Temperature.TEMPERATE;
      }
    case Temperature.TEMPERATE:
      if (result < 0.1) {
        return Temperature.COLD;
      } else if (result < 0.9) {
        return Temperature.TEMPERATE;
      } else {
        return Temperature.TROPICAL;
      }
    case Temperature.TROPICAL:
      if (result < 0.7) {
        return Temperature.TEMPERATE;
      } else if (result < 0.9) {
        return Temperature.TROPICAL;
      } else {
        return Temperature.SCORCHING;
      }
    case Temperature.SCORCHING:
      return result < 0.1 ? Temperature.SCORCHING : Temperature.TROPICAL;
  }
}

function generatePrecipitation() {
  const result = Math.random();
  if (result < 0.1) {
    return Precipitation.NONE;
  } else if (result < 0.6) {
    return Precipitation.LIGHT;
  } else if (result < 0.8) {
    return Precipitation.MODERATE;
  } else if (result < 0.9) {
    return Precipitation.HEAVY;
  } else {
    return Precipitation.SEVERE;
  }
}

export function generateWeather(weatherLastWeek?: Weather): Weather {
  if (!weatherLastWeek) {
    weatherLastWeek = startingWeather;
  }
  const newWeather: Weather = {
    ...weatherLastWeek,
    temperature: generateTempChange(weatherLastWeek.temperature),
    precipitation: generatePrecipitation(),
  };
  if (
    weatherLastWeek.precipitation > Precipitation.HEAVY &&
    newWeather.precipitation > Precipitation.HEAVY &&
    newWeather.saturation < 4
  ) {
    newWeather.saturation++;
  } else if (
    weatherLastWeek.precipitation < Precipitation.LIGHT &&
    newWeather.precipitation < Precipitation.LIGHT &&
    newWeather.saturation > 0
  ) {
    newWeather.saturation--;
  } else if (newWeather.saturation > Saturation.NORMAL) {
    newWeather.saturation--;
  } else if (newWeather.saturation < Saturation.NORMAL) {
    newWeather.saturation++;
  }
  return newWeather;
}
