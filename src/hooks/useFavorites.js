import { useState, useCallback, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storage';

const FAVORITES_STORAGE_KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    return safeGet(FAVORITES_STORAGE_KEY, []);
  });

  useEffect(() => {
    safeSet(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  const isFavorite = useCallback((location) => {
    if (!location) return false;
    return favorites.some((fav) => {
      if (fav.lat != null && location.lat != null && fav.lon != null && location.lon != null) {
        return Math.abs(fav.lat - location.lat) < 0.05 && Math.abs(fav.lon - location.lon) < 0.05;
      }
      return fav.name?.toLowerCase() === location.name?.toLowerCase();
    });
  }, [favorites]);

  const addFavorite = useCallback((location) => {
    if (!location) return;
    setFavorites((prev) => {
      const exists = prev.some((fav) => {
        if (fav.lat != null && location.lat != null && fav.lon != null && location.lon != null) {
          return Math.abs(fav.lat - location.lat) < 0.05 && Math.abs(fav.lon - location.lon) < 0.05;
        }
        return fav.name?.toLowerCase() === location.name?.toLowerCase();
      });
      if (exists) return prev;

      const newFav = {
        id: `${location.name}_${location.lat || 0}_${location.lon || 0}`,
        name: location.name,
        region: location.region || '',
        country: location.country || '',
        countryCode: location.countryCode || '',
        lat: location.lat,
        lon: location.lon,
        timezone: location.timezone,
        addedAt: Date.now(),
      };
      return [...prev, newFav];
    });
  }, []);

  const removeFavorite = useCallback((location) => {
    if (!location) return;
    setFavorites((prev) => prev.filter((fav) => {
      if (fav.lat != null && location.lat != null && fav.lon != null && location.lon != null) {
        return !(Math.abs(fav.lat - location.lat) < 0.05 && Math.abs(fav.lon - location.lon) < 0.05);
      }
      return fav.name?.toLowerCase() !== location.name?.toLowerCase();
    }));
  }, []);

  const toggleFavorite = useCallback((location) => {
    if (isFavorite(location)) {
      removeFavorite(location);
    } else {
      addFavorite(location);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    reorderFavorites: setFavorites,
  };
}
