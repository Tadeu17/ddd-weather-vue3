import { describe, it, expect, vi, beforeEach, expectTypeOf, type Mock } from 'vitest'
import { WeatherRepository } from '@/infrastructure/repositories/WeatherRepository'
import type { Weather } from '@/domain/entities/Weather'
import { getCurrentWeather, get7daysBeforeAndAfterWeather } from './WeatherService';
import type { Location } from '@/domain/entities/Location';

// Improved mock setup with type safety
vi.mock("@/infrastructure/repositories/WeatherRepository", () => ({
  WeatherRepository: {
    fetchCurrentWeather: vi.fn<(location: Location) => Promise<Weather | null>>(),
    fetchRangeWeather: vi.fn<(location: Location) => Promise<Weather[] | null>>()
  },
}));

const mockLocation: Location = {
  id: 'Lisboa',
  name: 'Lisboa',
  country: 'Portugal',
  latitude: 43.44356,
  longitude: 34.30543
};

const mockWeather: Weather = {
  temperature: 30,
  windSpeed: 20,
  description: '3',
  date: new Date()
};

const mockFetchCurrent = WeatherRepository.fetchCurrentWeather as Mock<(location: Location) => Promise<Weather | null>>;
const mockFetchRange = WeatherRepository.fetchRangeWeather as Mock<(location: Location) => Promise<Weather[] | null>>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WeatherService", () => {
  describe("getCurrentWeather", () => {
    it("should return weather data when fetch succeeds", async () => {
      mockFetchCurrent.mockResolvedValue(mockWeather);
      const result = await getCurrentWeather(mockLocation);
      expect(result).toEqual(mockWeather);
      expect(mockFetchCurrent).toHaveBeenCalledWith(mockLocation);
    });

    it("should return null and log error when fetch fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      const testError = new Error("API failure");
      mockFetchCurrent.mockRejectedValue(testError);

      const result = await getCurrentWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching current weather:",
        testError
      );
    });

    it("should throw and log error when repository returns null", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      mockFetchCurrent.mockResolvedValue(null);

      const result = await getCurrentWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching current weather:",
        expect.any(Error)
      );
    });
  });

  describe("get7daysBeforeAndAfterWeather", () => {
    it("should return weather array with correct date parameter", async () => {
      const weatherArray = [mockWeather, mockWeather];
      const testDate = new Date("2024-01-01");
      vi.useFakeTimers().setSystemTime(testDate);

      mockFetchRange.mockResolvedValue(weatherArray);
      const result = await get7daysBeforeAndAfterWeather(mockLocation);

      expect(result).toEqual(weatherArray);
      expect(mockFetchRange).toHaveBeenCalledWith(
        mockLocation,
        testDate
      );
      vi.useRealTimers();
    });

    it("should return null without logging when repository returns null", async () => {
      const consoleSpy = vi.spyOn(console, "error");
      mockFetchRange.mockResolvedValue(null);

      const result = await get7daysBeforeAndAfterWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should return null and log error when fetch fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      const testError = new Error("Network error");
      mockFetchRange.mockRejectedValue(testError);

      const result = await get7daysBeforeAndAfterWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching range weather:",
        testError
      );
    });
  });

  // Very important to assure we're getting the expected result from the backend
  describe("Type Safety", () => {
    it("should maintain Weather type contract", async () => {
      // @ts-expect-error - Testing invalid response
      mockFetchCurrent.mockResolvedValue({ invalid: "data" });
      const result = await getCurrentWeather(mockLocation);
      expectTypeOf(result).toEqualTypeOf<Weather | null>();
    });

    it("should maintain Weather array type contract", async () => {
      // @ts-expect-error - Testing invalid array response
      mockFetchRange.mockResolvedValue([{ invalid: "data" }]);
      const result = await get7daysBeforeAndAfterWeather(mockLocation);
      expectTypeOf(result).toEqualTypeOf<Weather[] | null>();
    });
  });
});
