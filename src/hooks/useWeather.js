import { useState, useEffect, useCallback, useRef } from 'react';
import { getWeatherData } from '../services/weather/weatherService';

/**
 * Main weather data hook.
 * Handles fetching, caching, race condition prevention via AbortController,
 * periodic refresh, and visibility-change revalidation.
 * 
 * @param {object} location { lat, lon, name, region, country, timezone }
 * @param {object} [options]
 * @param {number} [options.autoRefreshInterval=900000] - 15 minutes
 */
export function useWeather(location, options = {}) {
  const { autoRefreshInterval = 15 * 60 * 1000 } = options;

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const abortControllerRef = useRef(null);
  const lastFetchedLocationRef = useRef(null);

  const fetchWeather = useCallback(async (loc, bypassCache = false, isBackground = false) => {
    if (!loc || loc.lat == null || loc.lon == null) {
      setLoading(false);
      return;
    }

    // Cancel in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!isBackground) {
      if (bypassCache) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
    }
    setError(null);

    try {
      const data = await getWeatherData(loc, {
        bypassCache,
        signal: controller.signal,
      });

      setWeather(data);
      lastFetchedLocationRef.current = loc;
      setError(null);
    } catch (err) {
      if (err.code === 'ABORTED' || controller.signal.aborted) {
        return; // Ignore aborted requests
      }
      console.error('Failed to fetch weather:', err);
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch when location changes
  useEffect(() => {
    if (location && (location.lat != null && location.lon != null)) {
      fetchWeather(location, false, false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location?.lat, location?.lon, location?.name, fetchWeather]);

  // Periodic refresh & revalidate on tab focus
  useEffect(() => {
    if (!location) return;

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchWeather(location, true, true);
      }
    }, autoRefreshInterval);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && weather?.fetchedAt) {
        const age = Date.now() - weather.fetchedAt;
        if (age > autoRefreshInterval) {
          fetchWeather(location, true, true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location, weather?.fetchedAt, autoRefreshInterval, fetchWeather]);

  const refresh = useCallback(() => {
    if (location) {
      return fetchWeather(location, true, false);
    }
  }, [location, fetchWeather]);

  return {
    weather,
    loading,
    error,
    isRefreshing,
    refresh,
  };
}
