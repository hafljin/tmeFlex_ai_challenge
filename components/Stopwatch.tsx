import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { useTimer } from '@/hooks/useTimer';
import { useSettings } from '@/hooks/useSettings';
import { formatTime } from '@/utils/formatTime';

export default function Stopwatch() {
  const { theme } = useSettings();
  const { session, start, pause, resume, reset, setMode } = useTimer();
  
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  React.useEffect(() => {
    setMode('stopwatch');
  }, [setMode]);

  const getMainButtonIcon = () => {
    if (session.isRunning && !session.isPaused) {
      return <Pause size={32} color="#ffffff" />;
    }
    return <Play size={32} color="#ffffff" />;
  };

  const getMainButtonAction = () => {
    if (session.isRunning && !session.isPaused) {
      return pause;
    } else if (session.isPaused) {
      return resume;
    }
    return start;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {formatTime(session.elapsedInSeconds)}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={reset}
          disabled={session.elapsedInSeconds === 0 && !session.isRunning && !session.isPaused}
        >
          <RotateCcw size={24} color={isDark ? '#ffffff' : '#1f2937'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={getMainButtonAction()}
        >
          {getMainButtonIcon()}
        </TouchableOpacity>

        <View style={styles.spacer} />
      </View>

      {(session.isRunning || session.isPaused || session.elapsedInSeconds > 0) && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {session.isRunning && !session.isPaused && 'Running'}
            {session.isPaused && 'Paused'}
            {!session.isRunning && !session.isPaused && session.elapsedInSeconds > 0 && 'Stopped'}
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 80,
  },
  timeText: {
    fontSize: 72,
    fontFamily: 'Roboto-Bold',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  spacer: {
    width: 56,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});