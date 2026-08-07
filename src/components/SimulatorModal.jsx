import React from 'react';
import { X, WifiOff, AlertOctagon, RefreshCw, Zap } from 'lucide-react';
import { CONNECTION_STATUS } from '../hooks/useWebSocketEngine';

export function SimulatorModal({ isOpen, onClose, wsEngine }) {
  if (!isOpen) return null;

  const {
    connectionStatus,
    reconnectAttempt,
    nextReconnectDelay,
    simulateDropout,
    simulateEmergencyBroadcast,
    manualReconnect,
  } = wsEngine;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sim-modal-title">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <h3 id="sim-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap style={{ color: 'var(--color-accent-warning)' }} size={20} />
            Network Edge Case & Dropout Simulator
          </h3>
          <button className="header__toggle-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Use this panel to simulate Wi-Fi dropouts, force socket disconnects, and test the <strong>Exponential Backoff Reconnection Algorithm</strong> (1s $\rightarrow$ 2s $\rightarrow$ 4s $\rightarrow$ 8s $\rightarrow$ 10s max cap).
        </p>

        <div style={{ padding: '1rem', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Current Connection State:</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: connectionStatus === CONNECTION_STATUS.CONNECTED ? 'var(--color-accent-success)' : 'var(--color-accent-warning)' }}>
              {connectionStatus}
            </span>
            <span style={{ fontSize: '0.8rem' }}>
              Attempt Count: <strong>{reconnectAttempt}</strong>
            </span>
          </div>
          {nextReconnectDelay > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-accent-warning)' }}>
              Next Backoff Retry in: <strong>{Math.ceil(nextReconnectDelay)}s</strong>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn btn--secondary"
            onClick={() => { simulateDropout(); }}
            style={{ justifyContent: 'flex-start', color: 'var(--color-accent-danger)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            aria-label="Simulate instant Wi-Fi dropout"
          >
            <WifiOff size={18} />
            Simulate Wi-Fi Dropout (Trigger onclose)
          </button>

          <button
            className="btn btn--secondary"
            onClick={() => { simulateEmergencyBroadcast(); onClose(); }}
            style={{ justifyContent: 'flex-start' }}
            aria-label="Inject emergency payload"
          >
            <AlertOctagon size={18} style={{ color: 'var(--color-accent-warning)' }} />
            Push Emergency Dispatch Payload
          </button>

          <button
            className="btn btn--primary"
            onClick={() => { manualReconnect(); }}
            style={{ justifyContent: 'flex-start' }}
            aria-label="Force immediate reconnect"
          >
            <RefreshCw size={18} />
            Force Reconnect Socket Now
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn--secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
