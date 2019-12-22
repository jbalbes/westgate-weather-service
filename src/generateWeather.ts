export enum Temperature {
  Scorching, // 100+
  Tropical, //  80 - 100
  Temperate, //  60 - 80
  Cold, // 40 - 60
  Freezing, // 10 - 40
  Arctic // 10-
}

export const TemperatureMap: Record<Temperature, string> = {
  [Temperature.Scorching]: "scorching (100°F+)",
  [Temperature.Tropical]: "tropical (80°F-100°F)",
  [Temperature.Temperate]: "temperate (60°F-80°F)",
  [Temperature.Cold]: "cold (30°F-60°F)",
  [Temperature.Freezing]: "freezing (0°F-30°F)",
  [Temperature.Arctic]: "arctic (0°F or below)"
};

export enum Precipitation {
  None,
  Light,
  Moderate,
  Heavy,
  Severe
}

export const PrecipitationMap: Record<Precipitation, string> = {
  [Precipitation.None]: "none",
  [Precipitation.Light]: "light",
  [Precipitation.Moderate]: "moderate",
  [Precipitation.Heavy]: "heavy",
  [Precipitation.Severe]: "severe"
};

export enum Saturation {
  SevereDrought,
  MildDrought,
  Normal,
  MildFlooding,
  SevereFlooding
}

export const saturationMap: Record<Saturation, string> = {
  [Saturation.SevereDrought]: "severe drought",
  [Saturation.MildDrought]: "mild drought",
  [Saturation.Normal]: "normal",
  [Saturation.MildFlooding]: "mild flooding",
  [Saturation.SevereFlooding]: "severe flooding"
};

export interface Weather {
  temperature: Temperature;
  precipitation: Precipitation;
  saturation: number;
}

const startingWeather: Weather = {
  temperature: Temperature.Freezing,
  precipitation: Precipitation.Heavy,
  saturation: Saturation.Normal
};

export function translateWeather(weather: Weather) {
  let message = "";
  message += `The temperature range is currently ${
    TemperatureMap[weather.temperature]
  }.`;
  const type = weather.temperature > Temperature.Cold ? "snow" : "rain";
  if (weather.precipitation === Precipitation.None) {
    message += ` Expect clear skies`;
  } else if (weather.precipitation < Precipitation.Heavy) {
    message += ` Expect ${PrecipitationMap[weather.precipitation]} ${type}.`;
  } else {
    message += ` Expect ${
      PrecipitationMap[weather.precipitation]
    } ${type} storms.`;
  }
  if (weather.saturation != Saturation.Normal) {
    const level =
      weather.saturation < Saturation.Normal ? "a lack" : "an excess";
    message += ` Due to ${level} of precipitation, we are currently experiencing ${
      saturationMap[weather.saturation]
    }.`;
  }
  return message;
}

function generateTempChange(prev: Temperature) {
  const result = Math.random();
  switch (prev) {
    case Temperature.Arctic:
      return result < 0.2 ? Temperature.Arctic : Temperature.Freezing;
    case Temperature.Freezing:
      if (result < 0.2) {
        return Temperature.Arctic;
      } else if (result < 0.6) {
        return Temperature.Freezing;
      } else {
        return Temperature.Cold;
      }
    case Temperature.Cold:
      if (result < 0.2) {
        return Temperature.Freezing;
      } else if (result < 0.8) {
        return Temperature.Cold;
      } else {
        return Temperature.Temperate;
      }
    case Temperature.Temperate:
      if (result < 0.2) {
        return Temperature.Cold;
      } else if (result < 0.8) {
        return Temperature.Temperate;
      } else {
        return Temperature.Tropical;
      }
    case Temperature.Tropical:
      if (result < 0.4) {
        return Temperature.Temperate;
      } else if (result < 0.8) {
        return Temperature.Tropical;
      } else {
        return Temperature.Scorching;
      }
    case Temperature.Scorching:
      return result < 0.2 ? Temperature.Scorching : Temperature.Tropical;
  }
}

function generatePrecipitation() {
  const result = Math.random();
  if (result < 0.1) {
    return Precipitation.None;
  } else if (result < 0.6) {
    return Precipitation.Light;
  } else if (result < 0.8) {
    return Precipitation.Moderate;
  } else if (result < 0.9) {
    return Precipitation.Heavy;
  } else {
    return Precipitation.Severe;
  }
}

export function generateWeather(weatherLastWeek?: Weather): Weather {
  if (!weatherLastWeek) {
    weatherLastWeek = startingWeather;
  }
  const newWeather: Weather = {
    ...weatherLastWeek,
    temperature: generateTempChange(weatherLastWeek.temperature),
    precipitation: generatePrecipitation()
  };
  if (
    weatherLastWeek.precipitation > Precipitation.Heavy &&
    newWeather.precipitation > Precipitation.Heavy &&
    newWeather.saturation < 4
  ) {
    newWeather.saturation++;
  } else if (
    weatherLastWeek.precipitation < Precipitation.Light &&
    newWeather.precipitation < Precipitation.Light &&
    newWeather.saturation > 0
  ) {
    newWeather.saturation--;
  } else if (newWeather.saturation > Saturation.Normal) {
    newWeather.saturation--;
  } else if (newWeather.saturation < Saturation.Normal) {
    newWeather.saturation++;
  }
  return newWeather;
}
