import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, AlertTriangle, ShieldAlert, Sparkles, Check, CheckCheck, Clock, RefreshCw, MessageSquareOff, Radio, Bell, Maximize2, Minimize2, User, LogOut } from 'lucide-react';
import { CONNECTION_STATUS, MESSAGE_STATUS } from '../hooks/useWebSocketEngine';
import { Tooltip } from '../components/Tooltip';

export function DispatchPortal({ wsEngine, pushNotifications, companyWorkspace, staffAuth, channelManager, onOpenSimulator, onOpenStaffLogin }) {
  const {
    connectionStatus,
    messageLog,
    sendMessage,
    reconnectAttempt,
    nextReconnectDelay,
    pingLatency,
    isMockMode,
    manualReconnect,
    clearMessageLog,
  } = wsEngine;

  const { permission, requestPermission, sendNotification } = pushNotifications;
  const { workspace } = companyWorkspace;
  const { activeStaff, isStaffAuthenticated, staffLogout } = staffAuth;
  const { channels } = channelManager;

  const [inputMessage, setInputMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [selectedChannel, setSelectedChannel] = useState(activeStaff?.assignedChannel || 'ALPHA');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const feedRef = useRef(null);
  const inputRef = useRef(null);

  const cannedTemplates = [
    '✅ Task Finished - Area Clear',
    '🚨 Request: Team Needed in Sector 3',
    '📦 Stock Transfer Complete',
    '⌛ Waiting on Dispatch Approval',
  ];

  // Sync selected channel to staff assigned channel if staff is logged in
  useEffect(() => {
    if (activeStaff?.assignedChannel) {
      setSelectedChannel(activeStaff.assignedChannel);
    }
  }, [activeStaff]);

  useEffect(() => {
    if (!feedRef.current) return;
    const timer = setTimeout(() => {
      const { scrollHeight, scrollTop, clientHeight } = feedRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom || messageLog.length > 0) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [messageLog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage || !inputMessage.trim()) return;

    // Staff must log in before sending messages
    if (!isStaffAuthenticated) {
      onOpenStaffLogin();
      return;
    }

    // Sender details: Username and Channel
    const senderName = `${activeStaff.username} [${selectedChannel}]`;
    const success = sendMessage(inputMessage, priority, selectedChannel, senderName);
    if (success) {
      if (permission === 'granted') {
        sendNotification(`Message from ${activeStaff.username}`, inputMessage, selectedChannel);
      }

      setInputMessage('');
      if (inputRef.current) inputRef.current.focus();

      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch {
          // Audio fallback
        }
      }
    }
  };

  const renderWhatsAppTick = (status) => {
    switch (status) {
      case MESSAGE_STATUS.SENDING:
        return <Clock size={12} style={{ color: 'var(--color-text-muted)' }} title="Sending..." />;
      case MESSAGE_STATUS.SENT:
        return <Check size={13} style={{ color: 'var(--color-text-muted)' }} title="Sent" />;
      case MESSAGE_STATUS.DELIVERED:
        return <CheckCheck size={14} style={{ color: 'var(--color-text-muted)' }} title="Delivered to Channel" />;
      case MESSAGE_STATUS.READ:
      default:
        return <CheckCheck size={14} style={{ color: '#0284c7', fontWeight: 'bold' }} title="Read by Team Member" />;
    }
  };

  const isDisconnected = connectionStatus === CONNECTION_STATUS.DISCONNECTED || connectionStatus === CONNECTION_STATUS.RECONNECTING;
  const isConnecting = connectionStatus === CONNECTION_STATUS.CONNECTING;
  const isInputEmpty = !inputMessage || !inputMessage.trim();

  return (
    <div className="portal-section" id="portal">
      <div className="container">
        {/* Workspace Banner & Controls */}
        {!isFullscreen && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {workspace.companyName} — Dispatch Feed
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                {workspace.teamName} • Real-Time Channel Pipeline
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {isStaffAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0.6rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '20px', fontSize: '0.75rem' }}>
                  <User size={14} style={{ color: 'var(--color-accent-primary)' }} />
                  <span style={{ fontWeight: 600 }}>{activeStaff.username}</span>
                  <button onClick={staffLogout} title="Staff Logout" style={{ color: 'var(--color-accent-danger)', marginLeft: 4 }}>
                    <LogOut size={12} />
                  </button>
                </div>
              ) : (
                <Tooltip text="Log in with your staff account to send messages">
                  <button className="btn btn--primary" onClick={onOpenStaffLogin} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                    <User size={14} /> Staff Login
                  </button>
                </Tooltip>
              )}

              {permission !== 'granted' && (
                <Tooltip text="Turn on device notifications for new messages">
                  <button className="btn btn--secondary" onClick={requestPermission} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                    <Bell size={14} /> Alerts
                  </button>
                </Tooltip>
              )}

              <Tooltip text="Test network dropouts and retry timers">
                <button className="btn btn--secondary" onClick={onOpenSimulator} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  <ShieldAlert size={14} /> Wi-Fi Test
                </button>
              </Tooltip>

              <Tooltip text="Clear messages from screen view">
                <button className="btn btn--secondary" onClick={clearMessageLog} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  Clear
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Main Feed Box with WhatsApp Fullscreen Mode Option */}
        <div className={`portal-wrapper ${isFullscreen ? 'portal-wrapper--fullscreen' : ''}`}>
          {/* Header Bar */}
          <div className="portal-header">
            <div className="portal-header__info">
              <span className="portal-header__title">
                <Radio size={18} style={{ color: 'var(--color-accent-primary)' }} />
                Live Feed Stream
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Ping: <strong style={{ color: 'var(--color-accent-success)' }}>{pingLatency}ms</strong>
                {isMockMode && <span style={{ color: 'var(--color-accent-warning)', fontWeight: 600 }}>(MOCK RELAY)</span>}
              </span>
            </div>

            <div className="portal-header__controls">
              <Tooltip text={isStaffAuthenticated ? `Restricted to assigned channel: ${selectedChannel}` : 'Select active dispatch channel'}>
                <select
                  className="channel-select"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  disabled={isStaffAuthenticated && activeStaff?.assignedChannel}
                  aria-label="Channel Selector"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Tooltip>

              <Tooltip text={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}>
                <button
                  className="header__toggle-btn"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </Tooltip>

              <Tooltip text={isFullscreen ? 'Exit Fullscreen Mobile View' : 'Enter WhatsApp Fullscreen Mobile Chat'}>
                <button
                  className="header__toggle-btn"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  aria-label="Toggle Fullscreen Chat"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Connection Drop Alert */}
          {isDisconnected && (
            <div className="toast-banner" role="alert" aria-live="assertive">
              <div className="toast-banner__left">
                <AlertTriangle size={18} />
                <span>
                  <strong>Connection Interrupted.</strong> Reconnecting...
                  {reconnectAttempt > 0 && ` (Attempt ${reconnectAttempt} in ${Math.ceil(nextReconnectDelay)}s)`}
                </span>
              </div>
              <button
                className="btn btn--primary"
                style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', background: '#ffffff', color: '#dc2626' }}
                onClick={manualReconnect}
              >
                <RefreshCw size={12} />
                Reconnect Now
              </button>
            </div>
          )}

          {/* Feed Scroll Container */}
          <div
            className="feed-container"
            ref={feedRef}
            role="log"
            aria-live="polite"
            aria-label="Real-time message feed"
            tabIndex={0}
          >
            {isConnecting && messageLog.length === 0 && (
              <div className="empty-state">
                <RefreshCw className="empty-state__icon status-dot--pulse" />
                <h3 className="empty-state__title">Connecting to Channel {selectedChannel}...</h3>
                <p style={{ fontSize: '0.8rem' }}>Establishing encrypted stream connection</p>
              </div>
            )}

            {!isConnecting && messageLog.length === 0 && (
              <div className="empty-state">
                <MessageSquareOff className="empty-state__icon" />
                <h3 className="empty-state__title">No Messages in Channel {selectedChannel}</h3>
                <p style={{ fontSize: '0.8rem', maxWidth: '22rem', margin: '0 auto 0.75rem auto' }}>
                  Channel active. Type a message below or select a quick response chip.
                </p>
                <button
                  className="btn btn--secondary"
                  onClick={() => sendMessage('Channel verification active.', 'NORMAL', selectedChannel, isStaffAuthenticated ? `${activeStaff.username} [${selectedChannel}]` : 'GUEST DISPATCH')}
                  style={{ fontSize: '0.75rem' }}
                >
                  <Sparkles size={14} />
                  Send Verification Message
                </button>
              </div>
            )}

            {/* Render Messages with Urgency Color Coding */}
            {messageLog.map((msg) => {
              const isUser = msg.isUser;
              const isSystem = msg.isSystem;

              let bubbleClass = 'msg-bubble--received-normal';
              if (isUser) {
                bubbleClass = 'msg-bubble--user';
              } else if (msg.priority === 'EMERGENCY') {
                bubbleClass = 'msg-bubble--received-emergency';
              } else if (msg.priority === 'HIGH') {
                bubbleClass = 'msg-bubble--received-high';
              } else if (isSystem) {
                bubbleClass = 'msg-bubble--system';
              }

              return (
                <div key={msg.id} className={`msg-bubble ${bubbleClass}`}>
                  <div className="msg-bubble__header">
                    <span className="msg-bubble__sender">{msg.sender}</span>
                    <span>• {msg.timestamp}</span>
                    {msg.priority === 'EMERGENCY' && <span className="msg-bubble__tag msg-bubble__tag--emergency">EMERGENCY</span>}
                    {msg.priority === 'HIGH' && <span className="msg-bubble__tag msg-bubble__tag--high">HIGH</span>}
                  </div>

                  <div className="msg-bubble__content">
                    {msg.text}
                  </div>

                  <div className="msg-bubble__footer">
                    {isUser && renderWhatsAppTick(msg.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <div className="portal-input-area">
            <div className="canned-templates" aria-label="Quick response templates">
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                Quick Responses:
              </span>
              {cannedTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="canned-chip"
                  onClick={() => setInputMessage(template)}
                >
                  {template}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="portal-form">
              <Tooltip text="Set urgency level for message">
                <select
                  className="channel-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: 'auto' }}
                  aria-label="Message Urgency"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High Priority</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </Tooltip>

              <input
                ref={inputRef}
                type="text"
                className="portal-input"
                placeholder={
                  !isStaffAuthenticated
                    ? 'Staff login required to send messages (Click Staff Login above)...'
                    : isDisconnected
                    ? 'Reconnecting...'
                    : 'Type message here (Press Enter to Send)...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isDisconnected}
                aria-label="Message input"
                maxLength={500}
              />

              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {inputMessage.length}/500
              </span>

              <Tooltip text={isStaffAuthenticated ? 'Send message to channel' : 'Login required to send message'}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isInputEmpty || isDisconnected}
                  aria-label="Send message"
                >
                  <Send size={14} />
                  Send
                </button>
              </Tooltip>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
