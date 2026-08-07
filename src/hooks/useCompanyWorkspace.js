import { useState, useEffect, useCallback } from 'react';

const WORKSPACE_STORAGE_KEY = 'omnirelay_company_workspace';

export function useCompanyWorkspace() {
  const [workspace, setWorkspace] = useState(() => {
    try {
      const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      companyName: 'OmniRelay Dispatch System',
      workspaceKey: 'WORKSPACE_DEFAULT_GLOBAL',
      teamName: 'Global Operations Floor',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // Storage fallback
    }
  }, [workspace]);

  const updateWorkspace = useCallback((newCompanyName, newTeamName) => {
    const key = `WS_${newCompanyName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_${Date.now()}`;
    setWorkspace({
      companyName: newCompanyName.trim() || 'OmniRelay Dispatch System',
      workspaceKey: key,
      teamName: newTeamName.trim() || 'Floor Operations Team',
    });
  }, []);

  return {
    workspace,
    updateWorkspace,
  };
}
