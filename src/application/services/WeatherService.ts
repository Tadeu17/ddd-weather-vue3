import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";
import { WeatherRepository } from "@/infrastructure/repositories/WeatherRepository";

export const getCurrentWeather = async (location: Location): Promise<Weather | null> => {
  try {
    const result = await WeatherRepository.fetchCurrentWeather(location);

    if (!result) {
      throw new Error('Weather data not available');
    }

    return result;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return null;
  }
};

export const get7daysBeforeAndAfterWeather = async (location: Location): Promise<Weather[] | null> => {
  try {
    return await WeatherRepository.fetchRangeWeather(location, new Date()); // we get the range considering today as the anchor date
  } catch (error) {
    console.error("Error fetching range weather:", error);
    return null;
  }
};
