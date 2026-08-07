import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, AlertTriangle, ShieldAlert, Sparkles, Check, CheckCheck, RefreshCw, MessageSquareOff, Radio } from 'lucide-react';
import { CONNECTION_STATUS } from '../hooks/useWebSocketEngine';

export function LiveFeedEngine({ wsEngine, onOpenSimulator }) {
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

  const [inputMessage, setInputMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [channel, setChannel] = useState('ALPHA');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const feedRef = useRef(null);
  const inputRef = useRef(null);

  // Quick Dispatch Canned Templates for Floor Staff
  const cannedTemplates = [
    '✅ Handoff Confirmed - Sector B Clear',
    '🚨 Emergency: Floor Staff Needed in Bay 3',
    '📦 Inventory Stock Shift Complete',
    '⌛ Delay Alert: Waiting on Dispatch Approval',
  ];

  // AC3 Requirement: Auto-scroll feed to bottom within 50ms of receiving new payload
  useEffect(() => {
    if (!feedRef.current) return;
    const timer = setTimeout(() => {
      const { scrollHeight, scrollTop, clientHeight } = feedRef.current;
      // Auto-scroll if user is close to bottom or if user just sent a message
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom || messageLog.length > 0) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    }, 40); // <50ms threshold

    return () => clearTimeout(timer);
  }, [messageLog]);

  // Handle message submission (AC4)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage || !inputMessage.trim()) return;

    const success = sendMessage(inputMessage, priority, channel);
    if (success) {
      setInputMessage('');
      if (inputRef.current) inputRef.current.focus();

      // Play audio chime if enabled
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch {
          // Audio context silent fallback
        }
      }
    }
  };

  const isDisconnected = connectionStatus === CONNECTION_STATUS.DISCONNECTED || connectionStatus === CONNECTION_STATUS.RECONNECTING;
  const isConnecting = connectionStatus === CONNECTION_STATUS.CONNECTING;
  const isInputEmpty = !inputMessage || !inputMessage.trim();

  return (
    <section className="portal-section" id="portal" aria-labelledby="portal-heading">
      <div className="container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="features__title" id="portal-heading" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
              Real-Time Dispatch Communication Portal
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Stateful React WebSocket core. Sub-50ms DOM updates. Zero page refreshes required.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--secondary" onClick={onOpenSimulator} aria-label="Open Network Simulator">
              <ShieldAlert size={16} aria-hidden="true" />
              Network Simulator
            </button>
            <button className="btn btn--secondary" onClick={clearMessageLog} aria-label="Clear Feed Log" style={{ padding: '0.4rem 0.8rem' }}>
              Clear Log
            </button>
          </div>
        </div>

        {/* Portal Feed Window */}
        <div className="portal-wrapper">
          {/* Header Bar */}
          <div className="portal-header">
            <div className="portal-header__info">
              <span className="portal-header__title">
                <Radio size={20} style={{ color: 'var(--color-accent-primary)' }} aria-hidden="true" />
                Live Stream Engine
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Ping: <strong style={{ color: 'var(--color-accent-success)' }}>{pingLatency}ms</strong>
                {isMockMode && <span style={{ color: 'var(--color-accent-warning)', fontWeight: 600 }}>(MOCK FALLBACK)</span>}
              </span>
            </div>

            <div className="portal-header__controls">
              <label htmlFor="channel-select" className="visually-hidden" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                Select Dispatch Channel
              </label>
              <select
                id="channel-select"
                className="channel-select"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                aria-label="Dispatch Channel Selector"
              >
                <option value="ALPHA">Channel Alpha (General)</option>
                <option value="LOGISTICS">Channel Logistics</option>
                <option value="FLOOR_STAFF">Channel Floor Team 1</option>
                <option value="EMERGENCY">Channel Emergency</option>
              </select>

              <button
                className="header__toggle-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={soundEnabled ? 'Mute incoming notification sound' : 'Enable incoming notification sound'}
                title={soundEnabled ? 'Audio Chime Enabled' : 'Audio Chime Muted'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </div>

          {/* Phase 3 Unhappy Path: Non-blocking Connection Lost Toast Banner */}
          {isDisconnected && (
            <div className="toast-banner" role="alert" aria-live="assertive">
              <div className="toast-banner__left">
                <AlertTriangle size={20} aria-hidden="true" />
                <span>
                  <strong>Connection Lost.</strong> Attempting to reconnect...
                  {reconnectAttempt > 0 && ` (Attempt ${reconnectAttempt} in ${Math.ceil(nextReconnectDelay)}s)`}
                </span>
              </div>
              <button
                className="btn btn--primary"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: '#ffffff', color: '#ef4444' }}
                onClick={manualReconnect}
                aria-label="Force immediate reconnection"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Reconnect Now
              </button>
            </div>
          )}

          {/* Main Feed Log Container (a11y: role="log", aria-live="polite") */}
          <div
            className="feed-container"
            ref={feedRef}
            role="log"
            aria-live="polite"
            aria-label="Real-time message feed"
            tabIndex={0}
          >
            {/* Phase 3 Edge Case: Bad Connectivity Visual Loading Indicator */}
            {isConnecting && messageLog.length === 0 && (
              <div className="empty-state">
                <RefreshCw className="empty-state__icon status-dot--pulse" aria-hidden="true" />
                <h3 className="empty-state__title">Establishing Persistent Socket Connection...</h3>
                <p style={{ fontSize: '0.85rem' }}>Handshaking with wss://echo.websocket.events endpoint</p>
              </div>
            )}

            {/* Phase 3 Edge Case: Empty State Illustration & Message */}
            {!isConnecting && messageLog.length === 0 && (
              <div className="empty-state">
                <MessageSquareOff className="empty-state__icon" aria-hidden="true" />
                <h3 className="empty-state__title">No Active Messages in Feed</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '24rem', margin: '0 auto 1rem auto' }}>
                  Floor staff communications pipeline initialized. Type a dispatch message below or select a quick template to start.
                </p>
                <button
                  className="btn btn--secondary"
                  onClick={() => sendMessage('Hello floor team, system check online.', 'NORMAL', channel)}
                  style={{ fontSize: '0.8rem' }}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Emit System Check Message
                </button>
              </div>
            )}

            {/* Message Log Renderer */}
            {messageLog.map((msg) => {
              const isUser = msg.isUser;
              const isSystem = msg.isSystem;
              const isEcho = msg.isEcho;

              let bubbleClass = 'msg-bubble--echo';
              if (isUser) bubbleClass = 'msg-bubble--user';
              if (isSystem) bubbleClass = 'msg-bubble--system';

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
                    {isUser && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCheck size={14} style={{ color: 'var(--color-accent-primary)' }} aria-hidden="true" />
                        {msg.status || 'DELIVERED'}
                      </span>
                    )}
                    {isEcho && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Check size={14} aria-hidden="true" /> Echoed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form & Controls */}
          <div className="portal-input-area">
            {/* Quick Canned Dispatch Templates */}
            <div className="canned-templates" aria-label="Quick response templates">
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                Quick Dispatch:
              </span>
              {cannedTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="canned-chip"
                  onClick={() => setInputMessage(template)}
                  aria-label={`Insert template: ${template}`}
                >
                  {template}
                </button>
              ))}
            </div>

            {/* Controlled Form Submission */}
            <form onSubmit={handleSubmit} className="portal-form">
              <label htmlFor="priority-select" className="visually-hidden" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                Priority Level
              </label>
              <select
                id="priority-select"
                className="channel-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: 'auto' }}
                aria-label="Message Priority Level"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High Priority</option>
                <option value="EMERGENCY">Emergency</option>
              </select>

              <label htmlFor="dispatch-input" className="visually-hidden" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                Type message for dispatch stream
              </label>
              <input
                ref={inputRef}
                id="dispatch-input"
                type="text"
                className="portal-input"
                placeholder={isDisconnected ? 'Connection lost... Reconnecting...' : 'Type dispatch message for floor staff (Press Enter to Send)...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isDisconnected}
                aria-label="Dispatch message input"
                maxLength={500}
              />

              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {inputMessage.length}/500
              </span>

              {/* Phase 3 Constraint: Disabled send button when input is empty/whitespace */}
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isInputEmpty || isDisconnected}
                aria-label="Send dispatch message"
              >
                <Send size={16} aria-hidden="true" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
