import { useState, useCallback, useEffect } from 'react';
import { displayTemp, unitLabel } from '../utils/units';

export function useShareWeather() {
  const [isCopied, setIsCopied] = useState(false);
  const [urlLocation, setUrlLocation] = useState(null);

  // Read URL query params on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const latParam = params.get('lat');
      const lonParam = params.get('lon');
      const cityParam = params.get('city');

      if (latParam != null && lonParam != null) {
        const parsedLat = parseFloat(latParam);
        const parsedLon = parseFloat(lonParam);

        // Strict coordinate range validation
        if (!isNaN(parsedLat) && !isNaN(parsedLon) && parsedLat >= -90 && parsedLat <= 90 && parsedLon >= -180 && parsedLon <= 180) {
          // Sanitize city name (strip control characters and limit length)
          const cleanCity = cityParam
            ? cityParam.replace(/[\x00-\x1F\x7F<>]/g, '').trim().slice(0, 80)
            : 'Shared Location';

          setUrlLocation({
            name: cleanCity || 'Shared Location',
            lat: parsedLat,
            lon: parsedLon,
          });
        }
      }
    } catch {
      // URL parsing failed
    }
  }, []);

  // Sync current location to URL query string
  const syncLocationToUrl = useCallback((location) => {
    if (!location || location.lat == null || location.lon == null) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lat', location.lat.toFixed(4));
      url.searchParams.set('lon', location.lon.toFixed(4));
      if (location.name) {
        url.searchParams.set('city', location.name);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // URL manipulation failed
    }
  }, []);

  const shareWeather = useCallback(async (weather, unit = 'C') => {
    if (!weather) return false;

    const locName = weather.location?.name || 'Weather Update';
    const temp = displayTemp(weather.current?.temp, unit);
    const cond = weather.current?.condition || '';
    const uLabel = unitLabel(unit);
    const text = `Current weather in ${locName}: ${temp}${uLabel}, ${cond}.`;
    const shareUrl = window.location.href;

    if (navigator?.share) {
      try {
        await navigator.share({
          title: `Weather in ${locName}`,
          text,
          url: shareUrl,
        });
        return true;
      } catch (err) {
        if (err.name === 'AbortError') return false;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text} Check it out: ${shareUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    urlLocation,
    syncLocationToUrl,
    shareWeather,
    isCopied,
  };
}
