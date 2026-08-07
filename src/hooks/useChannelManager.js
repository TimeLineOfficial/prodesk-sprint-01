import { useState, useEffect, useCallback } from 'react';

const CHANNELS_STORAGE_KEY = 'omnirelay_channels_list';

const INITIAL_CHANNELS = [
  { id: 'ALPHA', name: 'Channel Alpha (General)', description: 'General floor staff communications', isDefault: true },
  { id: 'LOGISTICS', name: 'Channel Logistics', description: 'Inventory stock & warehouse shifts', isDefault: false },
  { id: 'FLOOR_STAFF', name: 'Channel Floor Team 1', description: 'Assembly line & floor staff', isDefault: false },
  { id: 'EMERGENCY', name: 'Channel Emergency', description: 'Critical operational escalations', isDefault: false },
];

export function useChannelManager() {
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem(CHANNELS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CHANNELS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
    } catch {
      // Storage fallback
    }
  }, [channels]);

  const addChannel = useCallback((id, name, description) => {
    if (!id || !name) return false;
    const cleanId = id.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setChannels((prev) => {
      if (prev.some((c) => c.id === cleanId)) return prev;
      return [...prev, { id: cleanId, name: name.trim(), description: description.trim(), isDefault: false }];
    });
    return true;
  }, []);

  const editChannel = useCallback((id, newName, newDescription) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName.trim(), description: newDescription.trim() } : c))
    );
  }, []);

  const deleteChannel = useCallback((id) => {
    setChannels((prev) => prev.filter((c) => c.id !== id && !c.isDefault));
  }, []);

  return {
    channels,
    addChannel,
    editChannel,
    deleteChannel,
  };
}
