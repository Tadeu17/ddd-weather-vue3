import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";

const HARDCODED_WEATHER_DATA: Weather[] = [
  {
    location: {
      id: "lisbon",
      name: "Lisbon",
      country: "Portugal",
      latitude: 38.7169,
      longitude: -9.1399,
    },
    temperature: 22,
    humidity: 60,
    windSpeed: 15,
    description: "Sunny",
    date: new Date("2025-03-30T12:00:00Z"),
  },
  {
    location: {
      id: "funchal",
      name: "Funchal",
      country: "Portugal",
      latitude: 32.6496,
      longitude: -16.9086,
    },
    temperature: 18,
    humidity: 70,
    windSpeed: 10,
    description: "Cloudy",
    date: new Date("2025-03-30T12:00:00Z"),
  },
];

export const WeatherRepository = {
  async fetchCurrentWeather(location: Location): Promise<Weather | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HARDCODED_WEATHER_DATA.find((weather) => weather.location.id === location.id) || null;
  },

  async fetchHistoricalWeather(location: Location, dateStart: Date, dateEnd: Date): Promise<Weather | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HARDCODED_WEATHER_DATA.find((weather) => weather.location.id === location.id) || null;
  },
};
