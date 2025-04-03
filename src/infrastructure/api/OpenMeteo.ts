import type { Location } from "@/domain/entities/Location";
import type { OpenMeteoCurrentWeatherResponse, OpenMeteoRangeWeatherResponse } from '@/infrastructure/api/OpenMeteo.transform'

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchCurrentWeather = async (location: Location): Promise<OpenMeteoCurrentWeatherResponse> => {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current_weather: "true",
    timezone: "auto",
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current_weather) {
      throw new Error("Missing current weather data in API response.");
    }

    // Map API response to Weather entity
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

export async function fetchWeatherHistoryAndForecast(location: Location, date: Date): Promise<OpenMeteoRangeWeatherResponse[]> {
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - 7); // 7 days before

  const endDate = new Date(date);
  endDate.setDate(date.getDate() + 7); // 7 days after

  const url = `${BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,wind_speed_10m_max,weather_code&timezone=auto&start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    return data.daily.time.map((time: string, i: number) => ({
      location,
      temperature: data.daily.temperature_2m_max[i],
      wind_speed: data.daily.wind_speed_10m_max[i],
      weather_code: data.daily.weather_code[i],
      date: new Date(time),
    }));
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return [];
  }
}
