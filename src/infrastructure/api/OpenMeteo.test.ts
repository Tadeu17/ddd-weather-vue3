import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCurrentWeather, fetchWeatherHistoryAndForecast } from "./OpenMeteo";
import type { Location } from "@/domain/entities/Location";

const mockLocation: Location = {
  id: "1",
  name: "Lisbon",
  country: "Portugal",
  latitude: 38.7169,
  longitude: -9.1399,
};

const successResponse = {
  current_weather: {
    temperature: 13.6,
    relative_humidity: 60,
    windspeed: 14.3,
    weathercode: 80,
    time: "2025-04-04T04:00",
  },
};

const mockDate = new Date("2025-04-04T04:00:00Z");

// Mock data for successful response
const successRangeResponse = {
  daily: {
    temperature_2m_max: [22.2, 23.8],
    wind_speed_10m_max: [15.5, 14.0],
    weather_code: [1, 3],
    time: ["2025-03-28", "2025-03-29"],
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("OpenMeteo", () => {
  describe("fetchCurrentWeather", () => {
    it("should return weather data on successful API call", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => successResponse,
      });

      const result = await fetchCurrentWeather(mockLocation);

      expect(result).toEqual(successResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `latitude=${mockLocation.latitude}&longitude=${mockLocation.longitude}`
        )
      );
    });

    it("should throw error on non-OK response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(fetchCurrentWeather(mockLocation)).rejects.toThrow(
        "Failed to fetch weather data. Status: 500"
      );
    });

    it("should throw error when current_weather is missing", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await expect(fetchCurrentWeather(mockLocation)).rejects.toThrow(
        "Missing current weather data in API response."
      );
    });
  });

  describe("fetchWeatherHistoryAndForecast", () => {
    it("should fetch and map weather data correctly", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => successRangeResponse,
      });

      const result = await fetchWeatherHistoryAndForecast(mockLocation, mockDate);

      expect(result).toEqual([
        {
          location: mockLocation,
          temperature: 22.2,
          wind_speed: 15.5,
          weather_code: 1,
          date: new Date("2025-03-28"),
        },
        {
          location: mockLocation,
          temperature: 23.8,
          wind_speed: 14.0,
          weather_code: 3,
          date: new Date("2025-03-29"),
        },
      ]);
    });

    it("should return empty array on API failure", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

      const result = await fetchWeatherHistoryAndForecast(mockLocation, mockDate);

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching weather data:",
        expect.any(Error)
      );
    });

    it("should handle empty daily data gracefully", async () => {
      // Mock empty response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          daily: {
            temperature_2m_max: [],
            wind_speed_10m_max: [],
            weather_code: [],
            time: [],
          }
        }),
      });

      const result = await fetchWeatherHistoryAndForecast(mockLocation, mockDate);
      expect(result).toEqual([]);
    });

    it("should handle date month edge cases correctly", async () => {
      // Test month/year boundaries
      const edgeCaseDate = new Date("2025-03-01");
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => successRangeResponse });

      await fetchWeatherHistoryAndForecast(mockLocation, edgeCaseDate);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `start_date=2025-02-22&end_date=2025-03-08`
        )
      );
    });
  });
})
