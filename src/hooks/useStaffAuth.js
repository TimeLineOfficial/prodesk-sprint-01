import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

const STAFF_ACCOUNTS_KEY = 'omnirelay_staff_accounts';
const STAFF_SESSION_KEY = 'omnirelay_staff_active_session';

const INITIAL_STAFF_ACCOUNTS = [
  { username: 'staff_john', password: 'user123', assignedChannel: 'ALPHA', name: 'John Dispatcher' },
  { username: 'logistics_lead', password: 'user123', assignedChannel: 'LOGISTICS', name: 'Sarah Logistics' },
  { username: 'floor_unit1', password: 'user123', assignedChannel: 'FLOOR_STAFF', name: 'Floor Unit 1' },
];

export function useStaffAuth() {
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STAFF_ACCOUNTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_STAFF_ACCOUNTS;
  });

  const [activeStaff, setActiveStaff] = useState(() => {
    try {
      const saved = localStorage.getItem(STAFF_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return null;
  });

  const [staffAuthError, setStaffAuthError] = useState('');
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    try {
      localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // Fallback
    }
  }, [accounts]);

  useEffect(() => {
    if (activeStaff) {
      localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(activeStaff));
    } else {
      localStorage.removeItem(STAFF_SESSION_KEY);
    }
  }, [activeStaff]);

  // Staff Login Verification
  const staffLogin = useCallback(
    (username, password) => {
      setStaffAuthError('');
      if (!username || !password) {
        setStaffAuthError('Please enter Staff Username and Password.');
        return false;
      }

      const found = accounts.find(
        (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase() && acc.password === password
      );

      if (found) {
        const session = {
          username: found.username,
          name: found.name || found.username,
          assignedChannel: found.assignedChannel,
          loginTime: new Date().toISOString(),
        };
        setActiveStaff(session);
        trackEvent('Staff Login Successful', { username: found.username, channel: found.assignedChannel });
        return true;
      } else {
        setStaffAuthError('Invalid Staff Credentials or unassigned account. Contact Admin.');
        trackEvent('Staff Login Failed', { username });
        return false;
      }
    },
    [accounts, trackEvent]
  );

  const staffLogout = useCallback(() => {
    trackEvent('Staff Session Logged Out', { username: activeStaff?.username });
    setActiveStaff(null);
    setStaffAuthError('');
  }, [activeStaff, trackEvent]);

  // Admin Management Functions for Staff Accounts
  const createStaffAccount = useCallback((username, password, assignedChannel, name) => {
    if (!username || !password) return false;
    const cleanUser = username.trim().toLowerCase();
    setAccounts((prev) => {
      if (prev.some((a) => a.username.toLowerCase() === cleanUser)) return prev;
      return [
        ...prev,
        {
          username: cleanUser,
          password,
          assignedChannel: assignedChannel || 'ALPHA',
          name: name.trim() || cleanUser,
        },
      ];
    });
    return true;
  }, []);

  const editStaffAccount = useCallback((username, newPassword, newAssignedChannel, newName) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.username.toLowerCase() === username.toLowerCase()
          ? {
              ...a,
              password: newPassword ? newPassword : a.password,
              assignedChannel: newAssignedChannel || a.assignedChannel,
              name: newName ? newName.trim() : a.name,
            }
          : a
      )
    );
  }, []);

  const deleteStaffAccount = useCallback((username) => {
    setAccounts((prev) => prev.filter((a) => a.username.toLowerCase() !== username.toLowerCase()));
  }, []);

  return {
    accounts,
    activeStaff,
    isStaffAuthenticated: !!activeStaff,
    staffAuthError,
    staffLogin,
    staffLogout,
    createStaffAccount,
    editStaffAccount,
    deleteStaffAccount,
  };
}
