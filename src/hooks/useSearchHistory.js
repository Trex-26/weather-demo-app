import { useState, useCallback, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storage';

const HISTORY_STORAGE_KEY = 'search-history';
const MAX_HISTORY = 6;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    return safeGet(HISTORY_STORAGE_KEY, []);
  });

  useEffect(() => {
    safeSet(HISTORY_STORAGE_KEY, history);
  }, [history]);

  const addSearch = useCallback((location) => {
    if (!location || !location.name) return;

    setHistory((prev) => {
      // Filter out duplicates
      const filtered = prev.filter((item) => {
        if (item.lat != null && location.lat != null && item.lon != null && location.lon != null) {
          return !(Math.abs(item.lat - location.lat) < 0.05 && Math.abs(item.lon - location.lon) < 0.05);
        }
        return item.name?.toLowerCase() !== location.name?.toLowerCase();
      });

      const entry = {
        name: location.name,
        region: location.region || '',
        country: location.country || '',
        countryCode: location.countryCode || '',
        lat: location.lat,
        lon: location.lon,
        timezone: location.timezone,
        displayName: location.displayName || [location.name, location.region, location.country].filter(Boolean).join(', '),
        searchedAt: Date.now(),
      };

      return [entry, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeSearch = useCallback((nameOrLocation) => {
    const targetName = typeof nameOrLocation === 'string' ? nameOrLocation : nameOrLocation?.name;
    setHistory((prev) => prev.filter((item) => item.name.toLowerCase() !== targetName.toLowerCase()));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
  };
}
