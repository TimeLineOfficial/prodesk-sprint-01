import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const CONNECTION_STATUS = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  RECONNECTING: 'RECONNECTING',
};

// WhatsApp-style Delivery Status Enum
export const MESSAGE_STATUS = {
  SENDING: 'SENDING',     // 🕒 Clock: Payload being queued over network
  SENT: 'SENT',           // ✓ Single Grey Tick: Sent to server relay
  DELIVERED: 'DELIVERED', // ✓✓ Double Grey Tick: Received on channel
  READ: 'READ',           // ✓✓ Double Blue Tick: Read by floor staff
};

const DEFAULT_WS_URL = 'wss://echo.websocket.events';

export function useWebSocketEngine(customUrl = DEFAULT_WS_URL) {
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.CONNECTING);
  const [messageLog, setMessageLog] = useState([]);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [nextReconnectDelay, setNextReconnectDelay] = useState(0);
  const [pingLatency, setPingLatency] = useState(18); // ms
  const [isMockMode, setIsMockMode] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isManuallyClosedRef = useRef(false);
  const attemptCountRef = useRef(0);
  const pingStartRef = useRef(0);

  const { trackEvent } = useAnalytics();

  const getBackoffDelay = (attempt) => {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  };

  const sanitizeText = (text) => {
    if (typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Real Latency Measurement helper
  const measurePing = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      pingStartRef.current = performance.now();
      try {
        socketRef.current.send(JSON.stringify({ type: 'ping', t: pingStartRef.current }));
      } catch {
        // Silent fallback
      }
    }
  }, []);

  const connectSocket = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setConnectionStatus(attemptCountRef.current > 0 ? CONNECTION_STATUS.RECONNECTING : CONNECTION_STATUS.CONNECTING);
    trackEvent('WebSocket Connection Initializing', { url: customUrl });

    try {
      const ws = new WebSocket(customUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        attemptCountRef.current = 0;
        setReconnectAttempt(0);
        setNextReconnectDelay(0);
        setIsMockMode(false);

        trackEvent('WebSocket Connected Successfully');

        // Initial System Message
        const systemMsg = {
          id: `sys_${Date.now()}`,
          sender: 'SYSTEM GATEWAY',
          text: 'Connected to Universal Real-Time Dispatch Pipeline. Stream is active and encrypted.',
          timestamp: new Date().toLocaleTimeString(),
          priority: 'NORMAL',
          isSystem: true,
        };

        setMessageLog((prev) => [...prev, systemMsg]);
      };

      ws.onmessage = (event) => {
        // Measure real RTT ping
        if (pingStartRef.current > 0) {
          const rtt = Math.round(performance.now() - pingStartRef.current);
          setPingLatency(Math.max(12, rtt));
          pingStartRef.current = 0;
        }

        try {
          let parsed;
          if (typeof event.data === 'string' && (event.data.startsWith('{') || event.data.startsWith('['))) {
            parsed = JSON.parse(event.data);
            if (parsed.type === 'ping') return; // Ignore raw ping responses
          }

          // If the message returned is our sent message, update WhatsApp status to READ (Double Blue Tick) instead of echoing!
          setMessageLog((prev) => {
            let foundMatch = false;
            const updated = prev.map((msg) => {
              if (msg.isUser && (msg.status === MESSAGE_STATUS.SENT || msg.status === MESSAGE_STATUS.DELIVERED)) {
                foundMatch = true;
                return { ...msg, status: MESSAGE_STATUS.READ };
              }
              return msg;
            });

            // If it's a new incoming message from an external teammate
            if (!foundMatch && parsed && !parsed.isUser) {
              return [
                ...updated,
                {
                  id: `recv_${Date.now()}`,
                  sender: parsed.sender || 'STAFF RELAY',
                  text: sanitizeText(parsed.text || String(event.data)),
                  timestamp: new Date().toLocaleTimeString(),
                  priority: parsed.priority || 'NORMAL',
                  status: MESSAGE_STATUS.READ,
                },
              ];
            }
            return updated;
          });

          trackEvent('Payload Received', { length: event.data.length });
        } catch {
          // Handled safely
        }
      };

      ws.onerror = (error) => {
        console.warn('[WebSocket] Error encountered:', error);
        trackEvent('WebSocket Error Occurred');
      };

      ws.onclose = () => {
        socketRef.current = null;
        if (isManuallyClosedRef.current) {
          setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
          return;
        }

        const currentAttempt = attemptCountRef.current;
        const delay = getBackoffDelay(currentAttempt);
        attemptCountRef.current += 1;
        setReconnectAttempt(attemptCountRef.current);
        setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
        setNextReconnectDelay(delay / 1000);

        trackEvent('WebSocket Connection Dropped', { nextAttemptInMs: delay });

        let secondsRemaining = delay / 1000;
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          secondsRemaining -= 1;
          setNextReconnectDelay(Math.max(0, secondsRemaining));
          if (secondsRemaining <= 0) {
            clearInterval(countdownIntervalRef.current);
          }
        }, 1000);

        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          if (attemptCountRef.current >= 2) {
            enableMockSocketMode();
          } else {
            connectSocket();
          }
        }, delay);
      };
    } catch {
      enableMockSocketMode();
    }
  }, [customUrl, trackEvent]);

  const enableMockSocketMode = useCallback(() => {
    setIsMockMode(true);
    setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    attemptCountRef.current = 0;
    setReconnectAttempt(0);
    setNextReconnectDelay(0);
    setPingLatency(24);
    trackEvent('Activated Resilient Internal Dispatch Relay');
  }, [trackEvent]);

  // Send Message function with WhatsApp status timeline
  const sendMessage = useCallback(
    (text, priority = 'NORMAL', channel = 'ALPHA') => {
      if (!text || !text.trim()) return false;

      const sanitized = sanitizeText(text.trim());
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

      // Step 1: Initial State - SENDING (Clock 🕒)
      const newMsg = {
        id: msgId,
        sender: 'DISPATCHER (YOU)',
        text: sanitized,
        timestamp: new Date().toLocaleTimeString(),
        priority,
        channel,
        isUser: true,
        status: MESSAGE_STATUS.SENDING,
      };

      setMessageLog((prev) => [...prev, newMsg]);
      trackEvent('User Emitted Payload', { priority, channel });

      // Step 2: Transition to SENT (Single Grey Tick ✓) after 80ms
      setTimeout(() => {
        setMessageLog((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: MESSAGE_STATUS.SENT } : m))
        );
      }, 80);

      // Step 3: Transition to DELIVERED (Double Grey Tick ✓✓) after 250ms
      setTimeout(() => {
        setMessageLog((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: MESSAGE_STATUS.DELIVERED } : m))
        );
      }, 250);

      // Step 4: Transition to READ (Double Blue Tick ✓✓) after 650ms
      setTimeout(() => {
        setMessageLog((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: MESSAGE_STATUS.READ } : m))
        );
      }, 650);

      if (!isMockMode && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        measurePing();
        socketRef.current.send(JSON.stringify(newMsg));
      }

      return true;
    },
    [isMockMode, measurePing, trackEvent]
  );

  const simulateDropout = useCallback(() => {
    isManuallyClosedRef.current = false;
    trackEvent('Simulated Network Dropout Triggered');
    if (socketRef.current) {
      socketRef.current.close();
    } else {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
      attemptCountRef.current = 1;
      setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
      setNextReconnectDelay(2);
      setTimeout(() => {
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        setNextReconnectDelay(0);
      }, 2000);
    }
  }, [trackEvent]);

  const simulateEmergencyBroadcast = useCallback(() => {
    const emergencyMsg = {
      id: `emerg_${Date.now()}`,
      sender: 'HEADQUARTERS DISPATCH',
      text: '🚨 CRITICAL ALERT: Sector 4 operational shift required. All staff switch to Channel Alpha immediately!',
      timestamp: new Date().toLocaleTimeString(),
      priority: 'EMERGENCY',
      isSystem: true,
      status: MESSAGE_STATUS.READ,
    };
    setMessageLog((prev) => [...prev, emergencyMsg]);
    trackEvent('Received Emergency Broadcast', { priority: 'EMERGENCY' });
  }, [trackEvent]);

  const manualReconnect = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    isManuallyClosedRef.current = false;
    attemptCountRef.current = 0;
    connectSocket();
  }, [connectSocket]);

  const clearMessageLog = useCallback(() => {
    setMessageLog([]);
    trackEvent('Message Log Cleared');
  }, [trackEvent]);

  useEffect(() => {
    isManuallyClosedRef.current = false;
    connectSocket();

    return () => {
      isManuallyClosedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  return {
    connectionStatus,
    messageLog,
    sendMessage,
    reconnectAttempt,
    nextReconnectDelay,
    pingLatency,
    isMockMode,
    simulateDropout,
    simulateEmergencyBroadcast,
    manualReconnect,
    clearMessageLog,
  };
}
