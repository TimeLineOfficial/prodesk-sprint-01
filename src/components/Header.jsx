import React, { useState } from 'react';
import { Radio, Moon, Sun, Menu, X, Activity, ShieldCheck, FileCheck, Lock, Bell, User } from 'lucide-react';
import { CONNECTION_STATUS } from '../hooks/useWebSocketEngine';
import { Tooltip } from './Tooltip';

export function Header({
  activeView,
  onSelectView,
  connectionStatus,
  activeTheme,
  onToggleTheme,
  onOpenTelemetry,
  onOpenSimulator,
  pushNotifications,
  staffAuth,
  auth,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { permission, requestPermission } = pushNotifications;
  const { activeStaff, isStaffAuthenticated } = staffAuth;

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case CONNECTION_STATUS.CONNECTED:
        return (
          <span className="status-badge status-badge--connected" aria-label="Status: Connected">
            <span className="status-dot status-dot--pulse" style={{ backgroundColor: 'var(--color-accent-success)' }} />
            ONLINE
          </span>
        );
      case CONNECTION_STATUS.RECONNECTING:
        return (
          <span className="status-badge status-badge--reconnecting" aria-label="Status: Reconnecting">
            <span className="status-dot status-dot--pulse" style={{ backgroundColor: 'var(--color-accent-warning)' }} />
            RETRYING...
          </span>
        );
      case CONNECTION_STATUS.CONNECTING:
        return (
          <span className="status-badge status-badge--connecting" aria-label="Status: Connecting">
            <span className="status-dot status-dot--pulse" style={{ backgroundColor: 'var(--color-accent-warning)' }} />
            CONNECTING...
          </span>
        );
      case CONNECTION_STATUS.DISCONNECTED:
      default:
        return (
          <span className="status-badge status-badge--disconnected" aria-label="Status: Disconnected">
            <span className="status-dot" style={{ backgroundColor: 'var(--color-accent-danger)' }} />
            OFFLINE
          </span>
        );
    }
  };

  const navItems = [
    { id: 'dispatch', label: 'Dispatch Feed', icon: <Radio size={15} /> },
    { id: 'management', label: 'Dashboard & Stats', icon: <Activity size={15} /> },
    { id: 'admin', label: 'Admin Vault', icon: <Lock size={15} /> },
    { id: 'audit', label: 'Deep Audit', icon: <FileCheck size={15} /> },
  ];

  return (
    <header className="header" role="banner">
      <div className="container header__nav">
        {/* Brand Logo & Universal Name */}
        <div className="header__brand">
          <Radio className="header__logo-icon" aria-hidden="true" />
          <span>OMNI<span style={{ color: 'var(--color-accent-primary)' }}>RELAY</span></span>
          {getStatusBadge()}
        </div>

        {/* Navigation Tabs */}
        <ul className={`header__menu ${isMobileMenuOpen ? 'header__menu--open' : ''}`} role="navigation" aria-label="Main Navigation">
          {navItems.map((item) => (
            <li key={item.id}>
              <Tooltip text={`Open ${item.label}`}>
                <button
                  className={`header__link ${activeView === item.id ? 'header__link--active' : ''}`}
                  onClick={() => {
                    onSelectView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'admin' && auth.isAuthenticated && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-success)', marginLeft: 4 }} />
                  )}
                </button>
              </Tooltip>
            </li>
          ))}

          {auth.isAuthenticated && (
            <li>
              <Tooltip text="View telemetry & system audit logs">
                <button
                  className="header__link"
                  onClick={() => {
                    onOpenTelemetry();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Activity size={15} aria-hidden="true" />
                  Audit Logs
                </button>
              </Tooltip>
            </li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="header__actions">
          {isStaffAuthenticated && (
            <div style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(2, 132, 199, 0.12)', color: 'var(--color-accent-primary)', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={12} /> {activeStaff.username}
            </div>
          )}

          {permission !== 'granted' && (
            <Tooltip text="Enable device push alerts for new messages">
              <button
                className="btn btn--secondary"
                onClick={requestPermission}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                <Bell size={14} />
                Alerts
              </button>
            </Tooltip>
          )}

          <Tooltip text={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}>
            <button
              className="header__toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {activeTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </Tooltip>

          <button
            className="header__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
