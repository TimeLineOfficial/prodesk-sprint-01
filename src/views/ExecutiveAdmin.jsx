import React, { useState } from 'react';
import { Lock, LogOut, ShieldCheck, Key, FileText, Server, AlertTriangle, Eye, EyeOff, UserCheck, Plus, Trash2, Edit3, Building, Radio, Users } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

export function ExecutiveAdmin({ auth, staffAuth, channelManager, companyWorkspace }) {
  const { user, isAuthenticated, authError, login, logout } = auth;
  const { accounts, createStaffAccount, editStaffAccount, deleteStaffAccount } = staffAuth;
  const { channels, addChannel, editChannel, deleteChannel } = channelManager;
  const { workspace, updateWorkspace } = companyWorkspace;

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('staff'); // 'staff' | 'channels' | 'branding' | 'security'

  // Staff creation form state
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffChannel, setNewStaffChannel] = useState('ALPHA');
  const [newStaffName, setNewStaffName] = useState('');

  // Channel creation form state
  const [newChanId, setNewChanId] = useState('');
  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');

  // Company Branding Form State
  const [brandCompany, setBrandCompany] = useState(workspace.companyName);
  const [brandTeam, setBrandTeam] = useState(workspace.teamName);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(usernameInput, passwordInput);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (createStaffAccount(newStaffUser, newStaffPass, newStaffChannel, newStaffName)) {
      setNewStaffUser('');
      setNewStaffPass('');
      setNewStaffName('');
    }
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (addChannel(newChanId, newChanName, newChanDesc)) {
      setNewChanId('');
      setNewChanName('');
      setNewChanDesc('');
    }
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateWorkspace(brandCompany, brandTeam);
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '28rem' }}>
        <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--color-accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>System Administrator Vault</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Restricted area for System Administrator only.
            </p>
          </div>

          {authError && (
            <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(220, 38, 38, 0.12)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '8px', color: '#dc2626', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} />
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                Admin User ID
              </label>
              <input
                type="text"
                className="portal-input"
                style={{ width: '100%' }}
                placeholder="Enter Admin User ID"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="portal-input"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  placeholder="Enter Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primary" style={{ marginTop: '0.5rem', width: '100%' }}>
              <Key size={18} />
              Authenticate Administrator
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Active Admin Session Bar */}
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', color: 'var(--color-accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(22, 163, 74, 0.3)' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.name}
              <span className="status-badge status-badge--connected">ADMIN ACTIVE</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Logged in as <strong>{user.username}</strong> • Token: {user.token.substring(0, 16)}...
            </div>
          </div>
        </div>

        <Tooltip text="Log out of System Administrator Vault">
          <button className="btn btn--secondary" onClick={logout} style={{ color: 'var(--color-accent-danger)', borderColor: 'rgba(220, 38, 38, 0.3)' }}>
            <LogOut size={16} />
            Logout Admin Session
          </button>
        </Tooltip>
      </div>

      {/* Admin Control Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeAdminTab === 'staff' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setActiveAdminTab('staff')}
        >
          <Users size={16} /> Staff Account Manager ({accounts.length})
        </button>
        <button
          className={`btn ${activeAdminTab === 'channels' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setActiveAdminTab('channels')}
        >
          <Radio size={16} /> Channel Manager ({channels.length})
        </button>
        <button
          className={`btn ${activeAdminTab === 'branding' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setActiveAdminTab('branding')}
        >
          <Building size={16} /> Company & Workspace Branding
        </button>
        <button
          className={`btn ${activeAdminTab === 'security' ? 'btn--primary' : 'btn--secondary'}`}
          onClick={() => setActiveAdminTab('security')}
        >
          <ShieldCheck size={16} /> Confidential Vault
        </button>
      </div>

      {/* TAB 1: Staff Account Manager */}
      {activeAdminTab === 'staff' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} style={{ color: 'var(--color-accent-primary)' }} /> Create New Staff User Account
            </h3>
            <form onSubmit={handleCreateStaff} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Full Name / Identifier
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. John Dispatcher"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. staff_john"
                  value={newStaffUser}
                  onChange={(e) => setNewStaffUser(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Password
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="Enter password"
                  value={newStaffPass}
                  onChange={(e) => setNewStaffPass(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Assigned Channel
                </label>
                <select
                  className="channel-select"
                  style={{ width: '100%', padding: '0.5rem' }}
                  value={newStaffChannel}
                  onChange={(e) => setNewStaffChannel(e.target.value)}
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn--primary">
                <Plus size={16} /> Add Staff Account
              </button>
            </form>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Registered Staff Accounts</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    <th style={{ padding: '0.6rem' }}>Staff Name</th>
                    <th style={{ padding: '0.6rem' }}>Username</th>
                    <th style={{ padding: '0.6rem' }}>Assigned Channel</th>
                    <th style={{ padding: '0.6rem' }}>Password</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.username} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{acc.name}</td>
                      <td style={{ padding: '0.6rem', fontFamily: 'var(--font-family-mono)' }}>{acc.username}</td>
                      <td style={{ padding: '0.6rem' }}>
                        <span className="status-badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: 'var(--color-accent-primary)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                          {acc.assignedChannel}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>••••••••</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            const newP = prompt(`Enter new password for ${acc.username}:`);
                            if (newP) editStaffAccount(acc.username, newP, acc.assignedChannel, acc.name);
                          }}
                          style={{ color: 'var(--color-accent-primary)', marginRight: '0.75rem' }}
                          title="Reset Password"
                        >
                          <Edit3 size={15} /> Reset Pass
                        </button>
                        <button
                          onClick={() => deleteStaffAccount(acc.username)}
                          style={{ color: 'var(--color-accent-danger)' }}
                          title="Delete Account"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Channel Manager */}
      {activeAdminTab === 'channels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} style={{ color: 'var(--color-accent-primary)' }} /> Add New Dispatch Channel
            </h3>
            <form onSubmit={handleCreateChannel} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Channel Code (ID)
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. WAREHOUSE_B"
                  value={newChanId}
                  onChange={(e) => setNewChanId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Channel Warehouse B"
                  value={newChanName}
                  onChange={(e) => setNewChanName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Description
                </label>
                <input
                  type="text"
                  className="portal-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Warehouse shift staff"
                  value={newChanDesc}
                  onChange={(e) => setNewChanDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn--primary">
                <Plus size={16} /> Create Channel
              </button>
            </form>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Dispatch Channels</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {channels.map((chan) => (
                <div key={chan.id} style={{ padding: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{chan.name}</span>
                    {!chan.isDefault && (
                      <button onClick={() => deleteChannel(chan.id)} style={{ color: 'var(--color-accent-danger)' }}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Code: {chan.id}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{chan.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Company & Workspace Branding */}
      {activeAdminTab === 'branding' && (
        <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', maxWidth: '32rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} style={{ color: 'var(--color-accent-primary)' }} /> Admin Company Branding Settings
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
            Only System Administrators can customize company name and floor team branding across all website views.
          </p>
          <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                Company / Enterprise Name
              </label>
              <input
                type="text"
                className="portal-input"
                style={{ width: '100%' }}
                value={brandCompany}
                onChange={(e) => setBrandCompany(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                Team / Department Name
              </label>
              <input
                type="text"
                className="portal-input"
                style={{ width: '100%' }}
                value={brandTeam}
                onChange={(e) => setBrandTeam(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn--primary" style={{ marginTop: '0.5rem' }}>
              Save Company Branding
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Confidential Vault */}
      {activeAdminTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-accent-primary)' }}>
              <Server size={18} /> System Override API Keys
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Production encryption keys for WebSocket cluster relays.
            </p>
            <div style={{ padding: '0.6rem 0.8rem', background: 'var(--color-bg-primary)', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-success)' }}>
              WSS_PROD_KEY=omnirelay_live_sec_9042_token
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-accent-primary)' }}>
              <FileText size={18} /> Emergency Access Protocols
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Automated backoff limits and emergency channel overrides.
            </p>
            <div style={{ padding: '0.6rem 0.8rem', background: 'var(--color-bg-primary)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Backoff: 1s, 2s, 4s, 8s, 10s (cap) • Encryption: SSL/TLS WSS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
