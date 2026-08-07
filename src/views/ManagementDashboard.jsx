import React from 'react';
import { TrendingUp, Users, Zap, ShieldCheck, Activity, Clock, CheckCircle2 } from 'lucide-react';

export function ManagementDashboard() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero__badge">
          <TrendingUp size={14} /> Management Operational Intelligence
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Floor Operations & Efficiency Analytics
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '42rem' }}>
          Real-time metrics tracking communication efficiency recovery, dropped handoff elimination, and channel payload throughput across floor staff teams.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Operational Efficiency Gain</span>
            <TrendingUp size={20} style={{ color: 'var(--color-accent-success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-success)' }}>+15.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Recaptured from dropped handoffs</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Active Dispatchers & Staff</span>
            <Users size={20} style={{ color: 'var(--color-accent-primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>42 Live</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Spread across 4 active channels</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Average Pipeline Latency</span>
            <Zap size={20} style={{ color: 'var(--color-accent-primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>24 ms</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>DOM Refresh &lt; 50ms standard</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Wi-Fi Incident Recovery</span>
            <ShieldCheck size={20} style={{ color: 'var(--color-accent-success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>100%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Zero data loss via Backoff Engine</div>
        </div>
      </div>

      {/* Operations Breakdown Table */}
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--color-accent-primary)' }} /> Channel Load & Dispatch Performance
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>Channel Name</th>
                <th style={{ padding: '0.75rem' }}>Target Team</th>
                <th style={{ padding: '0.75rem' }}>Throughput (24h)</th>
                <th style={{ padding: '0.75rem' }}>Avg Latency</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Channel Alpha</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>General Dispatch</td>
                <td style={{ padding: '0.75rem' }}>1,420 pkts</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-accent-success)' }}>18ms</td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--color-accent-success)', fontWeight: 600 }}>● OPTIMAL</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Channel Logistics</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>Inventory & Warehousing</td>
                <td style={{ padding: '0.75rem' }}>890 pkts</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-accent-success)' }}>22ms</td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--color-accent-success)', fontWeight: 600 }}>● OPTIMAL</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Channel Floor Team 1</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>Assembly Staff</td>
                <td style={{ padding: '0.75rem' }}>640 pkts</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-accent-success)' }}>25ms</td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--color-accent-success)', fontWeight: 600 }}>● OPTIMAL</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Channel Emergency</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>High Priority Escalations</td>
                <td style={{ padding: '0.75rem' }}>140 pkts</td>
                <td style={{ padding: '0.75rem', color: 'var(--color-accent-success)' }}>12ms</td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--color-accent-success)', fontWeight: 600 }}>● OPTIMAL</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
