/**
 * Cache service with TTL and stale-while-revalidate support.
 * Uses localStorage with in-memory caching for speed.
 */

import { safeGet, safeSet, safeRemove } from '../../utils/storage';

const memoryCache = new Map();

export const CACHE_TTL = {
  WEATHER: 15 * 60 * 1000,       // 15 minutes
  GEOCODING: 24 * 60 * 60 * 1000, // 24 hours
  AIR_QUALITY: 30 * 60 * 1000,   // 30 minutes
};

/**
 * Build a cache key.
 */
export function getCacheKey(type, identifier) {
  return `cache_${type}_${identifier}`.toLowerCase();
}

/**
 * Read from cache. Returns { data, isStale } or null if expired beyond stale window or missing.
 * 
 * @param {string} key 
 * @param {number} ttl 
 * @param {number} [maxStaleTtl=2 * ttl] Max time stale data can still be used as fallback
 */
export function getCached(key, ttl, maxStaleTtl = ttl * 2) {
  const now = Date.now();

  // Check in-memory first
  let entry = memoryCache.get(key);

  // Fallback to localStorage
  if (!entry) {
    entry = safeGet(key, null);
    if (entry) {
      memoryCache.set(key, entry);
    }
  }

  if (!entry || !entry.timestamp || !entry.data) {
    return null;
  }

  const age = now - entry.timestamp;

  if (age <= ttl) {
    return { data: entry.data, isStale: false, timestamp: entry.timestamp };
  }

  if (age <= maxStaleTtl) {
    return { data: entry.data, isStale: true, timestamp: entry.timestamp };
  }

  // Too old, invalidate
  invalidateCache(key);
  return null;
}

/**
 * Store data in cache.
 */
export function setCached(key, data) {
  const entry = {
    data,
    timestamp: Date.now(),
  };

  memoryCache.set(key, entry);
  safeSet(key, entry);
}

/**
 * Remove an item from cache.
 */
export function invalidateCache(key) {
  memoryCache.delete(key);
  safeRemove(key);
}

/**
 * Clear all cache entries.
 */
export function clearAllCache() {
  memoryCache.clear();
}
