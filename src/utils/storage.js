/**
 * Safe localStorage wrapper.
 * Handles corruption, quota errors, and missing APIs gracefully.
 */

const STORAGE_PREFIX = 'weather-app-';

export function safeGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw, (k, v) => {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        return undefined;
      }
      return v;
    });
  } catch {
    return defaultValue;
  }
}

export function safeSet(key, value) {
  try {
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key;
    localStorage.setItem(fullKey, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key);
  } catch {
    // Ignore
  }
}

/**
 * Get a raw string value (for backward compatibility with theme storage).
 */
export function safeGetRaw(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeSetRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
