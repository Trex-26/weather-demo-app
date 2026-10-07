/**
 * WMO Weather Interpretation Codes → application condition mapping.
 * https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 *
 * This is the single source of truth for weather code interpretation.
 * Components should use getConditionFromCode() rather than parsing condition strings.
 */

const WMO_CODES = {
  0:  { condition: 'Clear',         category: 'clear',        description: 'Clear sky' },
  1:  { condition: 'Mainly Clear',  category: 'clear',        description: 'Mainly clear' },
  2:  { condition: 'Partly Cloudy', category: 'cloudy',       description: 'Partly cloudy' },
  3:  { condition: 'Overcast',      category: 'cloudy',       description: 'Overcast' },
  45: { condition: 'Fog',           category: 'fog',          description: 'Fog' },
  48: { condition: 'Fog',           category: 'fog',          description: 'Depositing rime fog' },
  51: { condition: 'Drizzle',       category: 'rain',         description: 'Light drizzle' },
  53: { condition: 'Drizzle',       category: 'rain',         description: 'Moderate drizzle' },
  55: { condition: 'Drizzle',       category: 'rain',         description: 'Dense drizzle' },
  56: { condition: 'Drizzle',       category: 'rain',         description: 'Light freezing drizzle' },
  57: { condition: 'Drizzle',       category: 'rain',         description: 'Dense freezing drizzle' },
  61: { condition: 'Light Rain',    category: 'rain',         description: 'Slight rain' },
  63: { condition: 'Rain',          category: 'rain',         description: 'Moderate rain' },
  65: { condition: 'Heavy Rain',    category: 'rain',         description: 'Heavy rain' },
  66: { condition: 'Rain',          category: 'rain',         description: 'Light freezing rain' },
  67: { condition: 'Heavy Rain',    category: 'rain',         description: 'Heavy freezing rain' },
  71: { condition: 'Snow',          category: 'snow',         description: 'Slight snow fall' },
  73: { condition: 'Snow',          category: 'snow',         description: 'Moderate snow fall' },
  75: { condition: 'Heavy Snow',    category: 'snow',         description: 'Heavy snow fall' },
  77: { condition: 'Snow',          category: 'snow',         description: 'Snow grains' },
  80: { condition: 'Rain',          category: 'rain',         description: 'Slight rain showers' },
  81: { condition: 'Rain',          category: 'rain',         description: 'Moderate rain showers' },
  82: { condition: 'Heavy Rain',    category: 'rain',         description: 'Violent rain showers' },
  85: { condition: 'Snow',          category: 'snow',         description: 'Slight snow showers' },
  86: { condition: 'Heavy Snow',    category: 'snow',         description: 'Heavy snow showers' },
  95: { condition: 'Thunderstorm',  category: 'thunderstorm', description: 'Thunderstorm' },
  96: { condition: 'Thunderstorm',  category: 'thunderstorm', description: 'Thunderstorm with slight hail' },
  99: { condition: 'Thunderstorm',  category: 'thunderstorm', description: 'Thunderstorm with heavy hail' },
};

const DEFAULT_CONDITION = { condition: 'Clear', category: 'clear', description: 'Unknown' };

/**
 * Get the normalized condition info for a WMO weather code.
 */
export function getConditionFromCode(code) {
  if (code == null || !(code in WMO_CODES)) return DEFAULT_CONDITION;
  return WMO_CODES[code];
}

/**
 * Get the background animation category, considering temperature and wind overrides.
 * For clear/cloudy skies, extreme heat or wind can override the base category.
 */
export function getBackgroundCategory(code, temp, windSpeed) {
  const wmo = getConditionFromCode(code);
  const base = wmo.category;

  if ((base === 'clear' || base === 'cloudy') && temp != null && temp >= 40) return 'hot';
  if ((base === 'clear' || base === 'cloudy') && windSpeed != null && windSpeed >= 40) return 'wind';

  return base;
}

/**
 * Check if a weather code represents severe/dangerous conditions.
 */
export function isSevereWeather(code) {
  return [65, 67, 75, 82, 86, 95, 96, 99].includes(code);
}

export { WMO_CODES };
