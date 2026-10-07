import { useState, useCallback, useEffect } from 'react';
import { reverseGeocode } from '../services/weather/geocodingService';

/**
 * Hook for requesting and managing browser geolocation.
 */
export function useGeolocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt');

  // Monitor permission state if Permissions API is available
  useEffect(() => {
    if (navigator?.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state);
          result.onchange = () => setPermissionState(result.state);
        })
        .catch(() => {
          // Permissions API query not supported for geolocation
        });
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation) {
        const err = new Error('Geolocation is not supported by your browser.');
        setGeoError(err.message);
        reject(err);
        return;
      }

      setIsLocating(true);
      setGeoError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const locDetails = await reverseGeocode(lat, lon);
            setIsLocating(false);
            setGeoError(null);
            resolve({
              lat,
              lon,
              name: locDetails?.name || 'My Location',
              region: locDetails?.region || '',
              country: locDetails?.country || '',
              countryCode: locDetails?.countryCode || '',
              isCurrentLocation: true,
            });
          } catch {
            setIsLocating(false);
            // Even if reverse geocoding fails, return coordinates
            resolve({
              lat,
              lon,
              name: 'My Location',
              region: '',
              country: '',
              countryCode: '',
              isCurrentLocation: true,
            });
          }
        },
        (error) => {
          setIsLocating(false);
          let message = 'Unable to retrieve your location.';
          if (error.code === 1) {
            message = 'Location access was denied. Please allow location permissions in your browser.';
            setPermissionState('denied');
          } else if (error.code === 2) {
            message = 'Location information is currently unavailable.';
          } else if (error.code === 3) {
            message = 'Request to get location timed out.';
          }
          setGeoError(message);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000, // 1 minute cached position
        }
      );
    });
  }, []);

  return {
    getCurrentLocation,
    isLocating,
    geoError,
    permissionState,
    clearGeoError: () => setGeoError(null),
  };
}
