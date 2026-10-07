/**
 * Air Quality service using Open-Meteo Air Quality API (free, no API key).
 */

import { fetchJson } from './apiClient';
import { getCached, setCached, getCacheKey, CACHE_TTL } from './cacheService';

const AQI_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Interpret US AQI value into category, description, and status color.
 */
export function interpretAqi(aqi) {
  if (aqi == null) {
    return { label: 'Unknown', color: '#9ca3af', description: 'Air quality data unavailable' };
  }
  if (aqi <= 50) {
    return { label: 'Good', color: '#10b981', description: 'Air quality is satisfactory and poses little or no risk.' };
  }
  if (aqi <= 100) {
    return { label: 'Moderate', color: '#f59e0b', description: 'Acceptable; sensitive individuals may experience mild symptoms.' };
  }
  if (aqi <= 150) {
    return { label: 'Unhealthy for Sensitive', color: '#f97316', description: 'Members of sensitive groups may experience health effects.' };
  }
  if (aqi <= 200) {
    return { label: 'Unhealthy', color: '#ef4444', description: 'Everyone may begin to experience adverse health effects.' };
  }
  if (aqi <= 300) {
    return { label: 'Very Unhealthy', color: '#8b5cf6', description: 'Health alert: increased risk for everyone.' };
  }
  return { label: 'Hazardous', color: '#881337', description: 'Health warnings of emergency conditions. The entire population is affected.' };
}

/**
 * Fetch air quality for given latitude and longitude.
 * 
 * @param {number} lat 
 * @param {number} lon 
 * @param {AbortSignal} [signal] 
 */
export async function fetchAirQuality(lat, lon, signal = null) {
  if (lat == null || lon == null) return null;

  const key = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cacheKey = getCacheKey('aqi', key);
  const cached = getCached(cacheKey, CACHE_TTL.AIR_QUALITY);
  if (cached) {
    return cached.data;
  }

  const url = `${AQI_BASE_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide`;

  try {
    const data = await fetchJson(url, { signal, timeout: 6000, retries: 1 });
    const current = data?.current || {};

    const aqi = current.us_aqi != null ? Math.round(current.us_aqi) : null;
    const interpretation = interpretAqi(aqi);

    const result = {
      aqi,
      label: interpretation.label,
      color: interpretation.color,
      description: interpretation.description,
      pm25: current.pm2_5 != null ? Math.round(current.pm2_5 * 10) / 10 : null,
      pm10: current.pm10 != null ? Math.round(current.pm10 * 10) / 10 : null,
      no2: current.nitrogen_dioxide != null ? Math.round(current.nitrogen_dioxide * 10) / 10 : null,
      o3: current.ozone != null ? Math.round(current.ozone * 10) / 10 : null,
      so2: current.sulphur_dioxide != null ? Math.round(current.sulphur_dioxide * 10) / 10 : null,
      co: current.carbon_monoxide != null ? Math.round(current.carbon_monoxide * 10) / 10 : null,
      fetchedAt: Date.now(),
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    if (err.code === 'ABORTED') throw err;
    console.warn('Air quality fetch failed:', err.message);
    return null; // Return null so weather continues to render
  }
}
