/**
 * Maps Open-Meteo API response to the normalized internal weather model.
 */

import { getConditionFromCode, isSevereWeather } from './weatherCodes';
import { degreesToCompass, getDayName, formatHour } from '../../utils/timeUtils';

export function mapOpenMeteoToWeather(openMeteoData, location, airQualityData = null) {
  const current = openMeteoData.current || {};
  const hourly = openMeteoData.hourly || { time: [] };
  const daily = openMeteoData.daily || { time: [] };
  const timezone = openMeteoData.timezone || location?.timezone || 'UTC';

  // Find index in hourly matching current time (or closest)
  const currentTimeIso = current.time;
  let currentHourIdx = 0;
  if (currentTimeIso && hourly.time?.length) {
    const idx = hourly.time.findIndex(t => t >= currentTimeIso);
    currentHourIdx = idx !== -1 ? idx : 0;
  }

  const currentCondition = getConditionFromCode(current.weather_code);

  // Map 7-day forecast
  const mappedDaily = (daily.time || []).map((dateStr, idx) => {
    const code = daily.weather_code ? daily.weather_code[idx] : 0;
    const cond = getConditionFromCode(code);

    return {
      date: dateStr,
      dayName: getDayName(dateStr, timezone),
      conditionCode: code,
      condition: cond.condition,
      minTemp: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[idx]) : 0,
      maxTemp: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[idx]) : 0,
      precipProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0,
      precipitation: daily.precipitation_sum ? daily.precipitation_sum[idx] : 0,
      uv: daily.uv_index_max ? Math.round(daily.uv_index_max[idx]) : 0,
      windSpeed: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[idx]) : 0,
      sunrise: daily.sunrise ? daily.sunrise[idx] : null,
      sunset: daily.sunset ? daily.sunset[idx] : null,
    };
  });

  // Map hourly (first 24-48 hours from current)
  const mappedHourly = (hourly.time || []).map((timeStr, idx) => {
    const code = hourly.weather_code ? hourly.weather_code[idx] : 0;
    const cond = getConditionFromCode(code);
    const visibilityMeters = hourly.visibility ? hourly.visibility[idx] : null;

    return {
      time: timeStr,
      hourDisplay: formatHour(timeStr, timezone),
      temp: hourly.temperature_2m ? Math.round(hourly.temperature_2m[idx]) : 0,
      feelsLike: hourly.apparent_temperature ? Math.round(hourly.apparent_temperature[idx]) : 0,
      conditionCode: code,
      condition: cond.condition,
      humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : 0,
      precipProbability: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
      precipitation: hourly.precipitation ? hourly.precipitation[idx] : 0,
      windSpeed: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[idx]) : 0,
      uv: hourly.uv_index ? Math.round(hourly.uv_index[idx]) : 0,
      visibility: visibilityMeters != null ? Math.round(visibilityMeters / 1000) : 10,
      isDay: hourly.is_day ? Boolean(hourly.is_day[idx]) : true,
    };
  });

  // Extract UV and visibility for current from hourly
  const currentUv = hourly.uv_index ? Math.round(hourly.uv_index[currentHourIdx] || 0) : (daily.uv_index_max ? Math.round(daily.uv_index_max[0] || 0) : 0);
  const currentVisibilityMeters = hourly.visibility ? hourly.visibility[currentHourIdx] : null;
  const currentVisibility = currentVisibilityMeters != null ? Math.round(currentVisibilityMeters / 1000) : 10;
  const currentPrecipProb = hourly.precipitation_probability ? (hourly.precipitation_probability[currentHourIdx] ?? 0) : (daily.precipitation_probability_max ? daily.precipitation_probability_max[0] ?? 0 : 0);

  // Check severe weather conditions for alerts
  const alerts = [];
  const currentTemp = current.temperature_2m != null ? Math.round(current.temperature_2m) : 0;
  const currentWind = current.wind_speed_10m != null ? Math.round(current.wind_speed_10m) : 0;

  if (isSevereWeather(current.weather_code)) {
    alerts.push({
      id: `alert-severe-${current.weather_code}`,
      severity: 'severe',
      event: currentCondition.condition,
      headline: `Severe weather alert: ${currentCondition.condition}`,
      description: `${currentCondition.description} currently reported in ${location?.name || 'this area'}. Exercise caution if outdoors.`,
    });
  }

  if (currentWind >= 50) {
    alerts.push({
      id: 'alert-wind',
      severity: 'warning',
      event: 'High Wind Warning',
      headline: `High winds up to ${currentWind} km/h`,
      description: 'Strong gusts may cause minor damage or dangerous driving conditions.',
    });
  }

  if (currentTemp >= 40) {
    alerts.push({
      id: 'alert-heat',
      severity: 'warning',
      event: 'Excessive Heat',
      headline: `Extreme heat: ${currentTemp}°C`,
      description: 'Stay hydrated and avoid prolonged outdoor exposure during peak sun hours.',
    });
  }

  return {
    location: {
      name: location?.name || 'Unknown Location',
      region: location?.region || location?.admin1 || '',
      country: location?.country || '',
      countryCode: location?.country_code || location?.countryCode || '',
      lat: location?.latitude ?? location?.lat,
      lon: location?.longitude ?? location?.lon,
      timezone,
    },
    current: {
      temp: currentTemp,
      feelsLike: current.apparent_temperature != null ? Math.round(current.apparent_temperature) : currentTemp,
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: currentWind,
      windDir: current.wind_direction_10m ?? 0,
      windDirCompass: degreesToCompass(current.wind_direction_10m),
      condition: currentCondition.condition,
      conditionCode: current.weather_code ?? 0,
      uv: currentUv,
      visibility: currentVisibility,
      pressure: current.surface_pressure != null ? Math.round(current.surface_pressure) : 1013,
      precipitation: current.precipitation ?? 0,
      precipProbability: currentPrecipProb,
      sunrise: daily.sunrise ? daily.sunrise[0] : null,
      sunset: daily.sunset ? daily.sunset[0] : null,
      isDay: current.is_day != null ? Boolean(current.is_day) : true,
    },
    daily: mappedDaily,
    hourly: mappedHourly,
    airQuality: airQualityData || null,
    alerts,
    fetchedAt: Date.now(),
    timezone,
  };
}
