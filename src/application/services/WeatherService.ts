import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";
import { WeatherRepository } from "@/infrastructure/repositories/WeatherRepository";

export const getCurrentWeather = async (location: Location): Promise<Weather | null> => {
  try {
    return await WeatherRepository.fetchCurrentWeather(location);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return null;
  }
};

export const getHistoricalWeather = async (location: Location, dateEnd: Date): Promise<Weather | null> => {
  try {
    const dateStart = new Date(dateEnd);
    dateStart.setDate(dateEnd.getDate() - 7);

    return await WeatherRepository.fetchHistoricalWeather(location, dateStart, dateEnd);
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    return null;
  }
};
