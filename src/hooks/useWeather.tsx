import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, ForecastData, SearchLocation } from '../types/weather';

const API_KEY = "90d821ccc8254c168d770614252408" // Users will need to replace with their own API key
const BASE_URL = 'https://api.weatherapi.com/v1';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recentWeatherSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((city: string) => {
    setRecentSearches((prev) => {
      const updated = [city, ...prev.filter((item) => item !== city)].slice(0, 5);
      localStorage.setItem('recentWeatherSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Search for weather by city name
  const searchWeather = useCallback(async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather and forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`),
        fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        if (API_KEY.length < 10) {
          throw new Error('Please add your WeatherAPI.com API key to use this feature');
        }
        throw new Error('City not found. Please check the spelling and try again.');
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
      saveRecentSearch(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [saveRecentSearch]);

  // Search for location suggestions
  const searchLocations = useCallback(async (query: string): Promise<SearchLocation[]> => {
    if (!query.trim() || query.length < 2) return [];

    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) return [];

      return await response.json();
    } catch {
      return [];
    }
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    recentSearches,
    searchWeather,
    searchLocations,
  };
};