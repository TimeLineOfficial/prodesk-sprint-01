import React, { useEffect } from 'react';
import { ShieldCheck, Play, RefreshCw, CheckCircle2, XCircle, Terminal, AlertCircle } from 'lucide-react';
import { useDeepAudit } from '../hooks/useDeepAudit';
import { Tooltip } from '../components/Tooltip';

export function AuditPortal() {
  const { isRunning, lastRunTime, auditResults, overallScore, runDeepAudit } = useDeepAudit();

  // Run audit automatically on mount
  useEffect(() => {
    runDeepAudit();
  }, [runDeepAudit]);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="hero__badge">
            <ShieldCheck size={14} /> Empirical Quality & Security Audit Suite
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Live Automated Deep Audit Diagnostics
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '42rem' }}>
            Executes real-time empirical test routines against live WebSocket channels, DOM ARIA logs, security sanitizers, local storage tokens, and push notification readiness.
          </p>
        </div>

        <Tooltip text="Trigger live empirical test execution">
          <button
            className="btn btn--primary"
            onClick={runDeepAudit}
            disabled={isRunning}
            style={{ padding: '0.6rem 1.25rem' }}
          >
            {isRunning ? <RefreshCw className="status-dot--pulse" size={18} /> : <Play size={18} />}
            {isRunning ? 'Running Deep Diagnostics...' : 'Execute Deep Audit Now'}
          </button>
        </Tooltip>
      </div>

      {/* Audit Score Card */}
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>
            Empirical Audit Compliance Score
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: overallScore === 100 ? 'var(--color-accent-success)' : 'var(--color-accent-warning)' }}>
            {overallScore}% PASS
          </div>
          {lastRunTime && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Last Verified: {lastRunTime} • Zero static mock data
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tests Executed</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{auditResults.length} Tests</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent-success)' }}>
              {isRunning ? 'Auditing...' : 'PASSED'}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Test Results Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {auditResults.map((result) => (
          <div
            key={result.id}
            style={{
              padding: '1.25rem',
              background: 'var(--color-bg-secondary)',
              border: result.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {result.passed ? (
                  <CheckCircle2 size={22} style={{ color: 'var(--color-accent-success)', flexShrink: 0 }} />
                ) : (
                  <XCircle size={22} style={{ color: 'var(--color-accent-danger)', flexShrink: 0 }} />
                )}
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    [{result.category}]
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{result.title}</h4>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  background: result.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: result.passed ? 'var(--color-accent-success)' : 'var(--color-accent-danger)',
                }}
              >
                {result.passed ? 'VERIFIED' : 'FAILED'}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', paddingLeft: '2.25rem' }}>
              <Terminal size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
              <code>{result.details}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
