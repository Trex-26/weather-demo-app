/**
 * Centralized temperature and unit conversion utilities.
 * All internal data is stored in Celsius / km/h / hPa / mm / km.
 */

import { safeGet } from './storage';

export function toFahrenheit(celsius) {
  if (celsius == null || isNaN(celsius)) return null;
  return Math.round(celsius * 9 / 5 + 32);
}

export function displayTemp(celsius, unit) {
  if (celsius == null || isNaN(celsius)) return '--';
  const value = unit === 'F' ? toFahrenheit(celsius) : Math.round(celsius);
  return value;
}

export function unitLabel(unit) {
  return unit === 'F' ? '°F' : '°C';
}

/**
 * Get initial unit based on saved preference or browser locale.
 * US locales default to Fahrenheit, everything else to Celsius.
 */
export function getInitialUnit() {
  const saved = safeGet('weather-unit');
  if (saved === 'C' || saved === 'F') return saved;
  try {
    const lang = navigator.language || '';
    // US, Liberia, Myanmar primarily use Fahrenheit
    if (lang === 'en-US' || lang.startsWith('en-US')) return 'F';
  } catch {
    // SSR or restricted environment
  }
  return 'C';
}

/**
 * Format wind speed with direction for display.
 */
export function formatWind(speedKmh, dirCompass, unit) {
  const speed = speedKmh != null ? Math.round(speedKmh) : '--';
  const dir = dirCompass || '';
  const unitStr = unit === 'F' ? 'mph' : 'km/h';
  const displaySpeed = unit === 'F' && speedKmh != null
    ? Math.round(speedKmh * 0.621371)
    : speed;
  return `${displaySpeed} ${unitStr} ${dir}`.trim();
}
