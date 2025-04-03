import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";

import { fetchCurrentWeather as fetchOpenMeteoCurrentWeather } from '@/infrastructure/api/OpenMeteo';
import { fetchWeatherHistoryAndForecast as fetchOpenMeteoRageWeather } from '@/infrastructure/api/OpenMeteo';
import { mapCurrentWeatherResponse, mapRangeWeatherResponse } from '@/infrastructure/api/OpenMeteo.transform'
import type { OpenMeteoCurrentWeatherResponse, OpenMeteoRangeWeatherResponse } from '@/infrastructure/api/OpenMeteo.transform'

export const WeatherRepository = {
  async fetchCurrentWeather(location: Location): Promise<Weather | null> {
    try {
      const data: OpenMeteoCurrentWeatherResponse = await fetchOpenMeteoCurrentWeather(location);

      return mapCurrentWeatherResponse(data)
    } catch (error) {
      console.error('WeatherRepository error:', error);
      return null;
    }
  },

  async fetchRangeWeather(location: Location, date: Date): Promise<Weather[] | null> {
    try {
      const data: OpenMeteoRangeWeatherResponse[] = await fetchOpenMeteoRageWeather(location, date);

      return data.map((weather) =>
        (mapRangeWeatherResponse(weather))
      )
    } catch (error) {
      console.error('WeatherRepository error:', error);
      return null;
    }
  },
};
