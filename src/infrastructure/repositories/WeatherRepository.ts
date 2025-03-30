import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";
import { LocationRepository } from "./LocationRepository";

import { fetchCurrentWeather as fetchOpenMeteoCurrentWeather } from '@/infrastructure/api/OpenMeteo';

const HARDCODED_WEATHER_DATA: Weather[] = [
  {
    location: LocationRepository.getLocationById('lisbon')!,
    temperature: 22,
    humidity: 60,
    windSpeed: 15,
    description: "Sunny",
    date: new Date("2025-03-30T12:00:00Z"),
  },
  {
    location: LocationRepository.getLocationById('funchal')!,
    temperature: 18,
    humidity: 70,
    windSpeed: 10,
    description: "Cloudy",
    date: new Date("2025-03-30T12:00:00Z"),
  },
];

export const WeatherRepository = {
  async fetchCurrentWeather(location: Location): Promise<Weather | null> {
    try {
      return await fetchOpenMeteoCurrentWeather(location);
    } catch (error) {
      console.error('WeatherRepository error:', error);
      return null;
    }
  },

  async fetchHistoricalWeather(location: Location, dateStart: Date, dateEnd: Date): Promise<Weather | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));


    return HARDCODED_WEATHER_DATA.find((weather) => weather.location.id === location.id) || null;
  },
};
