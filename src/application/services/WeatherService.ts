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

export const getHistoricalWeather = async (location: Location, dateEnd: Date): Promise<Weather | null> => {
  const dateStart = new Date(dateEnd);
  dateStart.setDate(dateEnd.getDate() - 7);

  try {

    return await WeatherRepository.fetchHistoricalWeather(location, dateStart, dateEnd);
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    return null;
  }
};

export const getForecastedWeather = async (location: Location, dateStart: Date): Promise<Weather | null> => {
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + 7);

  try {

    return await WeatherRepository.fetchHistoricalWeather(location, dateStart, dateEnd);
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    return null;
  }
};
