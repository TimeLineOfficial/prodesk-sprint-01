import { useState, useEffect, useCallback } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [swRegistration, setSwRegistration] = useState(null);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[Push] Service Worker registered successfully:', reg);
          setSwRegistration(reg);
        })
        .catch((err) => {
          console.warn('[Push] Service Worker registration failed:', err);
        });
    }
  }, []);

  // Request Notification permission on entry
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported';
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch (err) {
      console.error('[Push] Notification permission request error:', err);
      return 'denied';
    }
  }, []);

  // Auto-request permission on mount if default
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      // Prompt user for notification permission
      requestPermission();
    }
  }, [requestPermission]);

  // Dispatch Native Notification (PC / Mobile OS)
  const sendNotification = useCallback(
    (title, body, channel = 'ALPHA') => {
      if (permission !== 'granted') return false;

      // Use Service Worker notification if active (works when tab is closed/backgrounded)
      if (swRegistration && swRegistration.showNotification) {
        swRegistration.showNotification(`[AegisFlow ${channel}] ${title}`, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2300e5ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
          tag: `aegisflow_${Date.now()}`,
          renotify: true,
        });
        return true;
      } else if ('Notification' in window) {
        // Fallback to standard Browser Notification
        new Notification(`[AegisFlow ${channel}] ${title}`, {
          body,
          tag: `aegisflow_${Date.now()}`,
        });
        return true;
      }
      return false;
    },
    [permission, swRegistration]
  );

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: permission !== 'unsupported',
  };
}
