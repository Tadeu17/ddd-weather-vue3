import { describe, it, expect } from "vitest";
import {
  mapCurrentWeatherResponse,
  mapRangeWeatherResponse,
  type OpenMeteoCurrentWeatherResponse,
  type OpenMeteoRangeWeatherResponse,
} from "./OpenMeteo.transform"; // Adjust the import path as needed

// Mock data for testing
const mockOpenMeteoCurrentWeatherResponse: OpenMeteoCurrentWeatherResponse = {
  current_weather: {
    temperature: 25,
    relative_humidity: 60,
    windspeed: 15,
    weathercode: 1,
    time: "2025-04-04T03:44:00Z",
  },
};

const mockOpenMeteoRangeWeatherResponse: OpenMeteoRangeWeatherResponse = {
  temperature: 18,
  wind_speed: 10,
  weather_code: 3,
  date: new Date("2025-04-03T00:00:00Z"),
};

// Expected outputs
const expectedMappedCurrentWeather = {
  temperature: 25,
  windSpeed: 15,
  description: "Mainly clear",
  date: new Date("2025-04-04T03:44:00Z"),
};

const expectedMappedRangeWeather = {
  temperature: 18,
  windSpeed: 10,
  description: "Overcast",
  date: new Date("2025-04-03T00:00:00Z"),
};

describe("OpenMeteo.transform", () => {
  describe("mapCurrentWeatherResponse", () => {
    it("should map current weather response correctly", () => {
      const result = mapCurrentWeatherResponse(mockOpenMeteoCurrentWeatherResponse);
      expect(result).toEqual(expectedMappedCurrentWeather);
    });

    it("should handle unexpected or missing fields gracefully", () => {
      const incompleteData = {
        current_weather: {
          temperature: undefined,
          relative_humidity: undefined,
          windspeed: undefined,
          weathercode: undefined,
          time: undefined,
        },
      } as unknown as OpenMeteoCurrentWeatherResponse;

      const result = mapCurrentWeatherResponse(incompleteData);
      expect(result).toEqual({
        temperature: undefined,
        windSpeed: undefined,
        description: "Unknown weather condition",
        date: new Date(NaN),
      });
    });
  });

  describe("mapRangeWeatherResponse", () => {
    it("should map range weather response correctly", () => {
      const result = mapRangeWeatherResponse(mockOpenMeteoRangeWeatherResponse);
      expect(result).toEqual(expectedMappedRangeWeather);
    });

    it("should handle unexpected or missing fields gracefully", () => {
      const incompleteData = {
        temperature: undefined, // Missing field
        wind_speed: undefined,
        weather_code: undefined,
        date: undefined,
      } as unknown as OpenMeteoRangeWeatherResponse;

      const result = mapRangeWeatherResponse(incompleteData);
      expect(result).toEqual({
        temperature: undefined,
        windSpeed: undefined,
        description: "Unknown weather condition",
        date: undefined, // No valid date provided
      });
    });
  });
});
