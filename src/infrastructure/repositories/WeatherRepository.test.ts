import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { WeatherRepository } from './WeatherRepository';
import type { Location } from '@/domain/entities/Location';
import type { Weather } from '@/domain/entities/Weather';
import {
  fetchCurrentWeather as fetchOpenMeteoCurrentWeather,
  fetchWeatherHistoryAndForecast as fetchOpenMeteoRangeWeather
} from '@/infrastructure/api/OpenMeteo';
import {
  mapCurrentWeatherResponse,
  mapRangeWeatherResponse
} from '@/infrastructure/api/OpenMeteo.transform';

vi.mock('@/infrastructure/api/OpenMeteo', () => ({
  fetchCurrentWeather: vi.fn(),
  fetchWeatherHistoryAndForecast: vi.fn()
}));

vi.mock('@/infrastructure/api/OpenMeteo.transform', () => ({
  mapCurrentWeatherResponse: vi.fn(),
  mapRangeWeatherResponse: vi.fn()
}));

// Type-safe mock setup
const mockFetchCurrent = fetchOpenMeteoCurrentWeather as Mock;
const mockFetchRange = fetchOpenMeteoRangeWeather as Mock;
const mockMapCurrent = mapCurrentWeatherResponse as Mock;
const mockMapRange = mapRangeWeatherResponse as Mock;

const mockLocation: Location = {
  id: '1',
  name: 'Lisbon',
  country: 'Portugal',
  latitude: 38.7169,
  longitude: -9.1399,
};

const mockDate = new Date('2025-04-04T04:00:00Z');

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe('WeatherRepository', () => {
  describe('fetchCurrentWeather', () => {
    const mockApiResponse = { current_weather: { temperature: 13.6 } };
    const mockMappedWeather: Weather = {
      temperature: 13.6,
      windSpeed: 14.3,
      description: 'Clear sky',
      date: new Date()
    };

    it('should return mapped weather data on successful API call', async () => {
      mockFetchCurrent.mockResolvedValue(mockApiResponse);
      mockMapCurrent.mockReturnValue(mockMappedWeather);

      const result = await WeatherRepository.fetchCurrentWeather(mockLocation);

      expect(mockFetchCurrent).toHaveBeenCalledWith(mockLocation);
      expect(mockMapCurrent).toHaveBeenCalledWith(mockApiResponse);
      expect(result).toEqual(mockMappedWeather);
    });

    it('should return null and log error on API failure', async () => {
      const testError = new Error('API failure');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      mockFetchCurrent.mockRejectedValue(testError);

      const result = await WeatherRepository.fetchCurrentWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'WeatherRepository error:',
        testError
      );
    });

    it('should return null and log error on invalid API response', async () => {
      const testError = new Error('Invalid response');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      mockFetchCurrent.mockResolvedValue({ invalid: 'response' });
      mockMapCurrent.mockImplementation(() => {
        throw testError;
      });

      const result = await WeatherRepository.fetchCurrentWeather(mockLocation);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'WeatherRepository error:',
        testError
      );
    });
  });

  describe('fetchRangeWeather', () => {
    const mockApiResponse = [{
      temperature: 22.2,
      wind_speed: 15.5,
      weather_code: 1,
      date: new Date('2025-03-28')
    }];
    const mockMappedWeather: Weather = {
      temperature: 22.2,
      windSpeed: 15.5,
      description: 'Mainly clear',
      date: new Date('2025-03-28')
    };

    it('should return mapped weather array on successful API call', async () => {
      mockFetchRange.mockResolvedValue(mockApiResponse);
      mockMapRange.mockReturnValue(mockMappedWeather);

      const result = await WeatherRepository.fetchRangeWeather(mockLocation, mockDate);

      expect(mockFetchRange).toHaveBeenCalledWith(mockLocation, mockDate);
      expect(mockMapRange).toHaveBeenCalledWith(mockApiResponse[0]);
      expect(result).toEqual([mockMappedWeather]);
    });

    it('should return null and log error on API failure', async () => {
      const testError = new Error('API failure');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      mockFetchRange.mockRejectedValue(testError);

      const result = await WeatherRepository.fetchRangeWeather(mockLocation, mockDate);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'WeatherRepository error:',
        testError
      );
    });

    it('should return null and log error on invalid API response structure', async () => {
      const testError = new Error('Invalid data format');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      mockFetchRange.mockResolvedValue([{ invalid: 'data' }]);
      mockMapRange.mockImplementation(() => {
        throw testError;
      });

      const result = await WeatherRepository.fetchRangeWeather(mockLocation, mockDate);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'WeatherRepository error:',
        testError
      );
    });
  });
});
