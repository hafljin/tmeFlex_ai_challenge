import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types';

const SETTINGS_STORAGE_KEY = '@timeflex_settings';

const defaultSettings: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // 設定の読み込み
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      // 非同期で保存（状態更新をブロックしない）
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prevSettings => {
      const newSoundEnabled = !prevSettings.soundEnabled;
      const newSettings = { ...prevSettings, soundEnabled: newSoundEnabled };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const toggleVibration = useCallback(() => {
    setSettings(prevSettings => {
      const newVibrationEnabled = !prevSettings.vibrationEnabled;
      const newSettings = { ...prevSettings, vibrationEnabled: newVibrationEnabled };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const setHeaderVisible = useCallback((visible: boolean) => {
    setIsHeaderVisible(visible);
  }, []);

  return {
    ...settings,
    isHeaderVisible,
    isLoaded,
    toggleSound,
    toggleVibration,
    setHeaderVisible,
  };
}