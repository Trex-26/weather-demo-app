/**
 * Geocoding service for search autocompletion and reverse geocoding.
 * Uses Open-Meteo Geocoding API (free, no API key).
 */

import { fetchJson } from './apiClient';
import { getCached, setCached, getCacheKey, CACHE_TTL } from './cacheService';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Search locations by name/query.
 * 
 * @param {string} query 
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Array>} List of matched locations
 */
export async function searchLocations(query, signal = null) {
  const cleanQuery = (query || '').trim();
  if (cleanQuery.length < 2) return [];

  const cacheKey = getCacheKey('geo_search', cleanQuery);
  const cached = getCached(cacheKey, CACHE_TTL.GEOCODING);
  if (cached) {
    return cached.data;
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(cleanQuery)}&count=5&language=en&format=json`;

  try {
    const data = await fetchJson(url, { signal, timeout: 5000 });
    const results = (data?.results || []).map((item) => ({
      id: `${item.id || item.latitude + '_' + item.longitude}`,
      name: item.name,
      region: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone || 'UTC',
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    }));

    setCached(cacheKey, results);
    return results;
  } catch (err) {
    if (err.code === 'ABORTED') throw err;
    console.warn('Geocoding search failed:', err.message);
    return [];
  }
}

/**
 * Reverse geocode latitude and longitude to a human-readable location name.
 * 
 * @param {number} lat 
 * @param {number} lon 
 * @param {AbortSignal} [signal] 
 */
export async function reverseGeocode(lat, lon, signal = null) {
  if (lat == null || lon == null) return null;

  const key = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cacheKey = getCacheKey('geo_reverse', key);
  const cached = getCached(cacheKey, CACHE_TTL.GEOCODING);
  if (cached) {
    return cached.data;
  }

  // Use BigDataCloud client reverse geocoding API (free, fast, no key)
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

  try {
    const data = await fetchJson(url, { signal, timeout: 5000, retries: 1 });
    const name = data.locality || data.city || data.principalSubdivision || 'Current Location';
    const region = data.principalSubdivision || '';
    const country = data.countryName || '';
    const countryCode = data.countryCode || '';

    const location = {
      name,
      region,
      country,
      countryCode,
      lat,
      lon,
      displayName: [name, region, country].filter(Boolean).join(', '),
    };

    setCached(cacheKey, location);
    return location;
  } catch {
    // Graceful fallback to formatted coordinates
    const fallback = {
      name: `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`,
      region: '',
      country: '',
      countryCode: '',
      lat,
      lon,
      displayName: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    };
    return fallback;
  }
}
