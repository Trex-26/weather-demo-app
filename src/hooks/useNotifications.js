import { useState, useCallback, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storage';

const NOTIFS_ENABLED_KEY = 'notifications-enabled';

export function useNotifications() {
  const [isSupported] = useState(() => typeof window !== 'undefined' && 'Notification' in window);
  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  const [isEnabled, setIsEnabled] = useState(() => {
    return safeGet(NOTIFS_ENABLED_KEY, false);
  });

  useEffect(() => {
    safeSet(NOTIFS_ENABLED_KEY, isEnabled && permission === 'granted');
  }, [isEnabled, permission]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        setIsEnabled(true);
        return true;
      } else {
        setIsEnabled(false);
        return false;
      }
    } catch {
      return false;
    }
  }, [isSupported]);

  const toggleNotifications = useCallback(async () => {
    if (!isEnabled) {
      if (permission === 'granted') {
        setIsEnabled(true);
      } else {
        await requestPermission();
      }
    } else {
      setIsEnabled(false);
    }
  }, [isEnabled, permission, requestPermission]);

  const sendNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted' || !isEnabled) return null;

    try {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (err) {
      console.warn('Failed to send notification:', err);
      return null;
    }
  }, [isSupported, permission, isEnabled]);

  return {
    isSupported,
    permission,
    isEnabled: isEnabled && permission === 'granted',
    toggleNotifications,
    requestPermission,
    sendNotification,
  };
}
