import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Smartphone, Moon, Sun, Bell } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/contexts/ThemeContext';

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f0f0f' : '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  settingsContainer: {
    flex: 0,
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#e5e7eb' : '#374151',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  about: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  testButton: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#ffffff' : '#1f2937',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#ffffff' : '#1f2937',
  },
});

// 独立した設定項目コンポーネント
const SettingItem = memo(({ 
  icon, 
  title, 
  description, 
  value, 
  onToggle,
  isDark 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  isDark: boolean;
}) => {
  const styles = createStyles(isDark);
  
  const handleToggle = () => {
    console.log(`Toggling ${title}: ${value} -> ${!value}`);
    onToggle();
  };

  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#6366f1' }}
        thumbColor={value ? '#ffffff' : isDark ? '#9ca3af' : '#f3f4f6'}
      />
    </View>
  );
});

// Dark Mode設定コンポーネント
const DarkModeSetting = memo(() => {
  const { isDark, toggleTheme, isLoaded } = useTheme();
  
  if (!isLoaded) return null;
  
  return (
    <SettingItem
      icon={isDark ? <Moon size={24} color="#6366f1" /> : <Sun size={24} color="#6366f1" />}
      title="Dark Mode"
      description="Use dark theme throughout the app"
      value={isDark}
      onToggle={toggleTheme}
      isDark={isDark}
    />
  );
});

// Sound Alerts設定コンポーネント
const SoundAlertsSetting = memo(() => {
  const { soundEnabled, toggleSound, isLoaded } = useSettings();
  const { isDark } = useTheme();
  
  if (!isLoaded) return null;
  
  return (
    <SettingItem
      icon={soundEnabled ? <Volume2 size={24} color="#6366f1" /> : <VolumeX size={24} color="#6366f1" />}
      title="Sound Alerts"
      description="Play sound when timer ends"
      value={soundEnabled}
      onToggle={toggleSound}
      isDark={isDark}
    />
  );
});

// Vibration設定コンポーネント
const VibrationSetting = memo(() => {
  const { vibrationEnabled, toggleVibration, isLoaded } = useSettings();
  const { isDark } = useTheme();
  
  if (!isLoaded) return null;
  
  return (
    <SettingItem
      icon={<Smartphone size={24} color="#6366f1" />}
      title="Vibration"
      description="Vibrate when timer ends"
      value={vibrationEnabled}
      onToggle={toggleVibration}
      isDark={isDark}
    />
  );
});

export default function SettingsScreen() {
  const { isDark, isLoaded: themeLoaded } = useTheme();
  const { isLoaded: settingsLoaded } = useSettings();
  const { triggerTimerAlert } = useNotifications();
  
  const styles = createStyles(isDark);
  const isLoaded = themeLoaded && settingsLoaded;

  const handleTestNotification = async () => {
    try {
      await triggerTimerAlert('Test notification from TimeFlex!');
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.settingsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <DarkModeSetting />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <SoundAlertsSetting />
            <VibrationSetting />
            
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <View style={styles.testButtonContent}>
                <Bell size={20} color="#6366f1" />
                <Text style={styles.testButtonText}>Test Notification</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.about}>
          <Text style={styles.aboutTitle}>About TimeFlex</Text>
          <Text style={styles.aboutText}>
            A simple and intuitive timer app for better time management. 
            Perfect for Pomodoro sessions, workouts, cooking, and meditation.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}