import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import CountdownTimer from '@/components/CountdownTimer';
import Stopwatch from '@/components/Stopwatch';

export default function HomeScreen() {
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const { theme, isHeaderVisible } = useSettings();
  
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {isHeaderVisible && (
        <View style={styles.header}>
          <Text style={styles.title}>TimeFlex</Text>
          
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'countdown' && styles.activeModeButton
              ]}
              onPress={() => setMode('countdown')}
            >
              <Text style={[
                styles.modeButtonText,
                mode === 'countdown' && styles.activeModeButtonText
              ]}>
                Timer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'stopwatch' && styles.activeModeButton
              ]}
              onPress={() => setMode('stopwatch')}
            >
              <Text style={[
                styles.modeButtonText,
                mode === 'stopwatch' && styles.activeModeButtonText
              ]}>
                Stopwatch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.content}>
        {mode === 'countdown' ? <CountdownTimer /> : <Stopwatch />}
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 24,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#6366f1',
  },
  modeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  activeModeButtonText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});