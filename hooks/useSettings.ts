import { useState, useEffect } from 'react';
import { Settings } from '@/types';

const defaultSettings: Settings = {
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleTheme = () => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSound = () => {
    updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const toggleVibration = () => {
    updateSetting('vibrationEnabled', !settings.vibrationEnabled);
  };

  const setHeaderVisible = (visible: boolean) => {
    setIsHeaderVisible(visible);
  };

  return {
    ...settings,
    isHeaderVisible,
    toggleTheme,
    toggleSound,
    toggleVibration,
    setHeaderVisible,
  };
}