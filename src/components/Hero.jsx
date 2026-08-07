import React from 'react';
import { Zap, ShieldAlert, ArrowDown, Wifi, Server, CheckCircle2 } from 'lucide-react';

export function Hero({ onScrollToPortal, onOpenSimulator }) {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <div className="hero__badge">
            <Zap size={14} aria-hidden="true" />
            Enterprise Emergency Ticket #9042
          </div>
          <h1 className="hero__title" id="hero-title">
            Zero-Latency <span className="hero__highlight">Real-Time Messaging</span> Pipeline
          </h1>
          <p className="hero__subtitle">
            Eliminating fragmented emails, SMS dropouts, and stale legacy feeds. Stateful React WebSocket portal with sub-50ms DOM updates, exponential backoff reconnection, and full network edge case protection for floor staff.
          </p>

          <div className="hero__ctas">
            <button className="btn btn--primary" onClick={onScrollToPortal} aria-label="Launch Live Stream Portal">
              Launch Live Stream Engine
              <ArrowDown size={18} aria-hidden="true" />
            </button>
            <button className="btn btn--secondary" onClick={onOpenSimulator} aria-label="Test Wi-Fi Dropout Simulator">
              <ShieldAlert size={18} aria-hidden="true" />
              Test Dropout Resilience
            </button>
          </div>
        </div>

        {/* Hero Visual Architecture Card */}
        <div className="hero__visual" aria-hidden="true">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={16} style={{ color: 'var(--color-accent-success)' }} />
              Live WebSocket Pipeline Monitor
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-accent-success)', borderRadius: '4px' }}>
              wss:// 24ms
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Server size={18} style={{ color: 'var(--color-accent-primary)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>wss://echo.websocket.events</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Persistent Dual-Socket Handshake</div>
                </div>
              </div>
              <CheckCircle2 size={18} style={{ color: 'var(--color-accent-success)' }} />
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>DOM Refresh Threshold</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>&lt; 50 ms</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-success)' }}>Auto-Scroll Active</span>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Reconnection Backoff Scale</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['1s', '2s', '4s', '8s', '10s (cap)'].map((step, idx) => (
                  <span key={idx} style={{ flex: 1, padding: '0.2rem', textAlign: 'center', background: 'var(--color-bg-tertiary)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
