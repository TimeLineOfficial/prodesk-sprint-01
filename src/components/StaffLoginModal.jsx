import React, { useState } from 'react';
import { X, User, Lock, Key, AlertTriangle, ShieldCheck } from 'lucide-react';

export function StaffLoginModal({ isOpen, onClose, staffAuth }) {
  const { staffAuthError, staffLogin } = staffAuth;
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = staffLogin(usernameInput, passwordInput);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="staff-login-title">
      <div className="modal-content" style={{ maxWidth: '26rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <h3 id="staff-login-title" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User style={{ color: 'var(--color-accent-primary)' }} size={20} />
            Staff Portal Login Required
          </h3>
          <button className="header__toggle-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Please log in with your Admin-assigned Staff Username and Password to access your assigned dispatch channel and send messages.
        </p>

        {staffAuthError && (
          <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(220, 38, 38, 0.12)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '6px', color: '#dc2626', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={15} />
            {staffAuthError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
              Staff Username
            </label>
            <input
              type="text"
              className="portal-input"
              style={{ width: '100%' }}
              placeholder="e.g. staff_john"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
              Password
            </label>
            <input
              type="password"
              className="portal-input"
              style={{ width: '100%' }}
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              <Key size={16} />
              Staff Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
