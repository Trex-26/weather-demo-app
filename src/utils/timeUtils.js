/**
 * Timezone-aware date/time formatting utilities.
 */

/**
 * Format an ISO time string to a localized time (e.g., "6:05 AM").
 */
export function formatTime(isoString, timezone) {
  if (!isoString) return '--';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone || undefined,
      hour12: true,
    });
  } catch {
    return '--';
  }
}

/**
 * Format an ISO date string to a localized date (e.g., "Monday, October 7, 2026").
 */
export function formatDate(isoString, timezone) {
  if (!isoString) return '--';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone || undefined,
    });
  } catch {
    return '--';
  }
}

/**
 * Get a short day name from an ISO date string, with "Today"/"Tomorrow" support.
 */
export function getDayName(isoDateStr, timezone) {
  if (!isoDateStr) return '--';
  try {
    const date = new Date(isoDateStr + 'T12:00:00');
    const now = new Date();

    const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone || undefined });
    const nowStr = now.toLocaleDateString('en-CA', { timeZone: timezone || undefined });
    if (dateStr === nowStr) return 'Today';

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: timezone || undefined });
    if (dateStr === tomorrowStr) return 'Tmrw';

    return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone || undefined });
  } catch {
    return '--';
  }
}

/**
 * Format an ISO time string to just the hour (e.g., "6 AM").
 */
export function formatHour(isoString, timezone) {
  if (!isoString) return '--';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: timezone || undefined,
    });
  } catch {
    return '--';
  }
}

/**
 * Get relative time string from a timestamp (e.g., "2 min ago").
 */
export function getRelativeTime(timestamp) {
  if (!timestamp) return '';
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 30) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Convert wind direction in degrees to a compass string.
 */
export function degreesToCompass(degrees) {
  if (degrees == null || isNaN(degrees)) return '';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

/**
 * Format a date string as a short date (e.g., "Oct 7").
 */
export function formatShortDate(isoDateStr, timezone) {
  if (!isoDateStr) return '--';
  try {
    const date = new Date(isoDateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: timezone || undefined,
    });
  } catch {
    return '--';
  }
}

/**
 * Get the current time string for a timezone.
 */
export function getCurrentTimeForTimezone(timezone) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    });
  } catch {
    return '';
  }
}
