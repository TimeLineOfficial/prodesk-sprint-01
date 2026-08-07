import React from 'react';
import { Radio, ShieldCheck, Globe } from 'lucide-react';

export function Footer({ onSelectView }) {
  return (
    <footer style={{ backgroundColor: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', padding: '2.5rem 0 1.75rem 0' }} role="contentinfo">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ maxWidth: '24rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>
              <Radio size={22} style={{ color: 'var(--color-accent-primary)' }} aria-hidden="true" />
              <span>OMNIRELAY <span style={{ color: 'var(--color-accent-primary)' }}>DISPATCH</span></span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Universal Real-Time Dispatch System for floor staff communications. Instant synchronization, WhatsApp message status ticks, and empirical deep audit compliance.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Navigation Portals
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <li><button onClick={() => onSelectView('dispatch')} style={{ color: 'var(--color-text-secondary)' }}>Dispatch Feed</button></li>
                <li><button onClick={() => onSelectView('management')} style={{ color: 'var(--color-text-secondary)' }}>Dashboard & Stats</button></li>
                <li><button onClick={() => onSelectView('admin')} style={{ color: 'var(--color-text-secondary)' }}>Executive Vault (Password Protected)</button></li>
                <li><button onClick={() => onSelectView('audit')} style={{ color: 'var(--color-text-secondary)' }}>Empirical Deep Audit</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                System Standards
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <li style={{ color: 'var(--color-text-secondary)' }}>WhatsApp Delivery Ticks Active</li>
                <li style={{ color: 'var(--color-text-secondary)' }}>a11y ARIA 100% Compliant</li>
                <li style={{ color: 'var(--color-text-secondary)' }}>Multi-Tenant Workspace Isolated</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span>© {new Date().getFullYear()} OmniRelay Universal Systems. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-accent-success)' }}>
            <ShieldCheck size={15} /> Ready for Deployment
          </span>
        </div>
      </div>
    </footer>
  );
}
