import { useState, useCallback } from 'react';

const globalAnalyticsLogs = [];
const listeners = new Set();

export function useAnalytics() {
  const [logs, setLogs] = useState([...globalAnalyticsLogs]);

  const trackEvent = useCallback((eventName, metadata = {}) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Format technical metadata into human-readable business sentences
    let readableDescription = `${eventName} at ${timestamp}`;
    if (metadata.channel) {
      readableDescription = `Sent message to ${metadata.channel} channel at ${timestamp}`;
    } else if (metadata.url) {
      readableDescription = `Connected to live communication stream at ${timestamp}`;
    } else if (metadata.error) {
      readableDescription = `Connection interrupted. Retrying automatically at ${timestamp}`;
    }

    const logEntry = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      eventName,
      description: readableDescription,
      metadata,
    };

    console.log(`[Analytics Audit] ${readableDescription}`, metadata);

    globalAnalyticsLogs.unshift(logEntry);
    if (globalAnalyticsLogs.length > 100) {
      globalAnalyticsLogs.pop();
    }

    listeners.forEach((listener) => listener([...globalAnalyticsLogs]));
  }, []);

  const subscribe = useCallback((callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }, []);

  return {
    trackEvent,
    logs: globalAnalyticsLogs,
    subscribe,
  };
}
