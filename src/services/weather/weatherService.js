/**
 * Core weather service orchestrating forecast and air quality data fetching.
 */

import { fetchJson } from './apiClient';
import { getCached, setCached, getCacheKey, CACHE_TTL } from './cacheService';
import { fetchAirQuality } from './airQualityService';
import { mapOpenMeteoToWeather } from './weatherMapper';

const DEFAULT_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const CUSTOMER_BASE_URL = 'https://customer-api.open-meteo.com/v1/forecast';

/**
 * Fetch full weather data for given coordinates and location metadata.
 * 
 * @param {object} location { lat, lon, name, region, country, countryCode, timezone }
 * @param {object} [options]
 * @param {boolean} [options.bypassCache=false]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<object>} Normalized weather model
 */
export async function getWeatherData(location, options = {}) {
  const { bypassCache = false, signal = null } = options;
  const { lat, lon } = location;

  if (lat == null || lon == null) {
    throw new Error('Valid coordinates (lat, lon) are required to fetch weather');
  }

  const cacheKey = getCacheKey('weather', `${lat.toFixed(2)}_${lon.toFixed(2)}`);

  if (!bypassCache) {
    const cached = getCached(cacheKey, CACHE_TTL.WEATHER);
    if (cached && !cached.isStale) {
      return {
        ...cached.data,
        isFromCache: true,
        isStale: false,
      };
    }
  }

  const rawApiKey = (import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.VITE_OPEN_METEO_API_KEY || '').trim();
  const hasCustomKey = Boolean(rawApiKey && rawApiKey !== 'default' && !rawApiKey.startsWith('your_'));
  const baseUrl = hasCustomKey ? CUSTOMER_BASE_URL : DEFAULT_BASE_URL;

  const queryParams = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,uv_index,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: location.timezone || 'auto',
  });

  if (hasCustomKey) {
    queryParams.append('apikey', rawApiKey);
  }

  const url = `${baseUrl}?${queryParams.toString()}`;

  // Fetch forecast and air quality concurrently
  const [forecastRes, aqiRes] = await Promise.allSettled([
    fetchJson(url, { signal, timeout: 10000, retries: 2 }),
    fetchAirQuality(lat, lon, signal),
  ]);

  if (forecastRes.status === 'rejected') {
    // If request failed, check if we have stale cache to return
    const staleCached = getCached(cacheKey, CACHE_TTL.WEATHER, CACHE_TTL.WEATHER * 10);
    if (staleCached) {
      return {
        ...staleCached.data,
        isFromCache: true,
        isStale: true,
        errorWarning: 'Using offline cached data. Could not reach weather service.',
      };
    }
    throw forecastRes.reason;
  }

  const airQualityData = aqiRes.status === 'fulfilled' ? aqiRes.value : null;
  const mapped = mapOpenMeteoToWeather(forecastRes.value, location, airQualityData);

  setCached(cacheKey, mapped);

  return {
    ...mapped,
    isFromCache: false,
    isStale: false,
  };
}
