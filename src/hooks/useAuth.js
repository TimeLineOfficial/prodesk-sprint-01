import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

const ADMIN_AUTH_KEY = 'omnirelay_admin_session';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return null;
  });

  const [authError, setAuthError] = useState('');
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (user) {
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }, [user]);

  const login = useCallback((username, password) => {
    setAuthError('');
    if (!username || !password) {
      setAuthError('Please provide User ID and Password.');
      return false;
    }

    // Exact requested admin credentials: admin / 124@h
    if (username.trim() === 'admin' && password === '124@h') {
      const authUser = {
        username: 'admin',
        role: 'SYSTEM_ADMINISTRATOR',
        name: 'Chief Systems Administrator',
        loginTime: new Date().toISOString(),
        token: `adm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      };
      setUser(authUser);
      trackEvent('Admin Vault Login Successful', { user: 'admin' });
      return true;
    } else {
      setAuthError('Invalid Credentials. Access restricted to System Administrator.');
      trackEvent('Admin Vault Login Failed', { user: username });
      return false;
    }
  }, [trackEvent]);

  const logout = useCallback(() => {
    trackEvent('Admin Session Logout', { user: user?.username });
    setUser(null);
    setAuthError('');
  }, [user, trackEvent]);

  return {
    user,
    isAuthenticated: !!user,
    authError,
    login,
    logout,
  };
}
