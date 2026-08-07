import React, { useEffect, useState } from 'react';
import { X, Activity, Terminal, ShieldCheck } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export function TelemetryDrawer({ isOpen, onClose }) {
  const { logs, subscribe } = useAnalytics();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, [subscribe]);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="telemetry-drawer-title">
      <div className="drawer-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <h3 id="telemetry-drawer-title" style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity style={{ color: 'var(--color-accent-primary)' }} size={20} />
            Telemetry & Audit Log
          </h3>
          <button className="header__toggle-btn" onClick={onClose} aria-label="Close telemetry drawer">
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Terminal size={14} />
          NFR Telemetry Hook (<code style={{ color: 'var(--color-accent-primary)' }}>useAnalytics()</code>) Active
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', paddingTop: '2rem' }}>
              No telemetry events recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} style={{ padding: '0.6rem 0.8rem', background: 'var(--color-bg-primary)', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-accent-primary)', marginBottom: '0.2rem' }}>
                  <span>[Analytics] {log.eventName}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                {Object.keys(log.metadata).length > 0 && (
                  <pre style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', overflowX: 'auto', background: 'var(--color-bg-tertiary)', padding: '0.3rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} /> Encrypted Stream
          </span>
          <button className="btn btn--secondary" onClick={onClose} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
