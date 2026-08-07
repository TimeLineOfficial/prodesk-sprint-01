import React from 'react';
import { Network, RefreshCw, AlertTriangle, ShieldCheck, Eye, Terminal } from 'lucide-react';

export function Features() {
  const featureList = [
    {
      icon: <Network size={24} />,
      title: 'Persistent WebSocket Core',
      desc: 'Instantly establishes a persistent wss:// connection to mock and production endpoints with automatic lifecycle management and unmount cleanup.',
    },
    {
      icon: <RefreshCw size={24} />,
      title: 'Sub-50ms Feed Synchronization',
      desc: 'Listens for incoming JSON payloads, updates state via functional immutability, and auto-scrolls to the feed bottom within 50ms.',
    },
    {
      icon: <AlertTriangle size={24} />,
      title: 'Exponential Backoff Retry',
      desc: 'Gracefully handles Wi-Fi dropouts. Retries connections with 1s, 2s, 4s, 8s backoff capped at 10s with non-blocking toast notifications.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'XSS Input Sanitization',
      desc: 'All user submissions are strictly sanitized against HTML/JS injection attacks before rendering in the DOM. Zero dangerouslySetInnerHTML.',
    },
    {
      icon: <Eye size={24} />,
      title: '100% Lighthouse a11y',
      desc: 'Feed container implements role="log" and aria-live="polite". Full keyboard navigation and high-contrast accessibility compliance.',
    },
    {
      icon: <Terminal size={24} />,
      title: 'Real-Time Telemetry Audit',
      desc: 'Custom useAnalytics() hook logs [Analytics] telemetry events to the console and feeds a live visual audit drawer for dispatchers.',
    },
  ];

  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="container">
        <div className="features__header">
          <h2 className="features__title" id="features-title">
            Enterprise Architectural Spec
          </h2>
          <p className="features__subtitle">
            Built to strict corporate standards to eliminate lost handoffs and maintain operational efficiency under peak floor stress.
          </p>
        </div>

        {/* 3-Column Grid collapsing to 1-column on mobile */}
        <div className="features__grid">
          {featureList.map((item, idx) => (
            <article key={idx} className="feature-card">
              <div className="feature-card__icon-wrapper">{item.icon}</div>
              <h3 className="feature-card__title">{item.title}</h3>
              <p className="feature-card__desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
