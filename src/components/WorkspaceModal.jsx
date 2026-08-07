import React, { useState } from 'react';
import { X, Building, Check, Sparkles } from 'lucide-react';

export function WorkspaceModal({ isOpen, onClose, companyWorkspace }) {
  const { workspace, updateWorkspace } = companyWorkspace;
  const [companyNameInput, setCompanyNameInput] = useState(workspace.companyName);
  const [teamNameInput, setTeamNameInput] = useState(workspace.teamName);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateWorkspace(companyNameInput, teamNameInput);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ws-modal-title">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <h3 id="ws-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building style={{ color: 'var(--color-accent-primary)' }} size={20} />
            Company Branding & Workspace Personalization
          </h3>
          <button className="header__toggle-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Enter your organization name and floor team below. This isolates your workspace and applies your company branding to the dispatch stream.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Company / Enterprise Name
            </label>
            <input
              type="text"
              className="portal-input"
              style={{ width: '100%' }}
              placeholder="e.g. Acme Logistics Corp"
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Team or Department Name
            </label>
            <input
              type="text"
              className="portal-input"
              style={{ width: '100%' }}
              placeholder="e.g. Warehouse Floor Operations"
              value={teamNameInput}
              onChange={(e) => setTeamNameInput(e.target.value)}
              required
            />
          </div>

          <div style={{ padding: '0.6rem 0.8rem', background: 'var(--color-bg-primary)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            🔑 Isolated Workspace Key: <code style={{ color: 'var(--color-accent-primary)' }}>{workspace.workspaceKey}</code>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              <Check size={16} />
              Save Company Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
