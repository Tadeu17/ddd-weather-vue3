import type { Weather } from "@/domain/entities/Weather";

export interface OpenMeteoCurrentWeatherResponse {
  current_weather: {
    temperature: number;
    relative_humidity: number;
    windspeed: number;
    weathercode: number; // Weather condition code (WMO)
    time: string;
  };
}

export interface OpenMeteoRangeWeatherResponse {
  temperature: number,
  wind_speed: number,
  weather_code: number,
  date: Date
}

/**
 *
 * @param data The type is supposed to simulate what we're expecting from the backend
 * @returns returns an object prepared for the frontend environment, decoupling backend variables from FE variables
 */
export const mapCurrentWeatherResponse = (data: OpenMeteoCurrentWeatherResponse): Weather => {
  return {
    temperature: data.current_weather.temperature,
    windSpeed: data.current_weather.windspeed,
    description: getWeatherDescription(data.current_weather.weathercode),
    date: new Date(data.current_weather.time),
  };
};

/**
 *
 * @param data The type is supposed to simulate what we're expecting from the backend
 * @returns returns an object prepared for the frontend environment, decoupling backend variables from FE variables
 */
export const mapRangeWeatherResponse = (data: OpenMeteoRangeWeatherResponse): Weather => {
  return {
    temperature: data.temperature,
    windSpeed: data.wind_speed,
    description: getWeatherDescription(data.weather_code), // Placeholder until description logic is implemented
    date: data.date,
  }
}

/**
 *
 * @param weatherCode it's a code standard defined by world meteo organizations
 * @returns we return a readable string that represents the weather code
 */
const getWeatherDescription = (weatherCode: number): string => {
  const weatherMap: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    // Fog
    45: "Fog",
    48: "Depositing rime fog",

    // Drizzle
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense intensity",

    // Rain
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy",

    // Snowfall
    71: "Snowfall: Slight",
    73: "Snowfall: Moderate",
    75: "Snowfall: Heavy",
    77: "Snow grains",

    // Showers
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",

    // Thunderstorms
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };


  return weatherMap[weatherCode] || "Unknown weather condition";
};
