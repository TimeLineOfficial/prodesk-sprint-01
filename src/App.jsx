import React, { useState, useEffect } from 'react';
import './styles/main.css';
import { useWebSocketEngine } from './hooks/useWebSocketEngine';
import { usePushNotifications } from './hooks/usePushNotifications';
import { useCompanyWorkspace } from './hooks/useCompanyWorkspace';
import { useStaffAuth } from './hooks/useStaffAuth';
import { useChannelManager } from './hooks/useChannelManager';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SimulatorModal } from './components/SimulatorModal';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { StaffLoginModal } from './components/StaffLoginModal';
import { DispatchPortal } from './views/DispatchPortal';
import { ManagementDashboard } from './views/ManagementDashboard';
import { ExecutiveAdmin } from './views/ExecutiveAdmin';
import { AuditPortal } from './views/AuditPortal';

export default function App() {
  // Light Mode default for new visitors
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('omnirelay_theme');
    if (saved) return saved;
    return 'light';
  });

  const [activeView, setActiveView] = useState('dispatch');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);

  const wsEngine = useWebSocketEngine();
  const pushNotifications = usePushNotifications();
  const companyWorkspace = useCompanyWorkspace();
  const staffAuth = useStaffAuth();
  const channelManager = useChannelManager();
  const auth = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('omnirelay_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-root">
      {/* Header Navigation */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        connectionStatus={wsEngine.connectionStatus}
        activeTheme={theme}
        onToggleTheme={toggleTheme}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        pushNotifications={pushNotifications}
        staffAuth={staffAuth}
        auth={auth}
      />

      {/* Main Views */}
      <main role="main">
        {activeView === 'dispatch' && (
          <DispatchPortal
            wsEngine={wsEngine}
            pushNotifications={pushNotifications}
            companyWorkspace={companyWorkspace}
            staffAuth={staffAuth}
            channelManager={channelManager}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenStaffLogin={() => setIsStaffLoginOpen(true)}
          />
        )}

        {activeView === 'management' && <ManagementDashboard />}

        {activeView === 'admin' && (
          <ExecutiveAdmin
            auth={auth}
            staffAuth={staffAuth}
            channelManager={channelManager}
            companyWorkspace={companyWorkspace}
          />
        )}

        {activeView === 'audit' && <AuditPortal />}
      </main>

      {/* Footer */}
      <Footer onSelectView={setActiveView} />

      {/* Modals */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        wsEngine={wsEngine}
      />

      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />

      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        staffAuth={staffAuth}
      />
    </div>
  );
}
