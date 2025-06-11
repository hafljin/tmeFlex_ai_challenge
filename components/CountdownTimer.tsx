import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { useTimer } from '@/hooks/useTimer';
import { useSettings } from '@/hooks/useSettings';
import { formatTime } from '@/utils/formatTime';
import TimeInput from './TimeInput';

export default function CountdownTimer() {
  const { theme } = useSettings();
  const { session, start, pause, resume, reset, setDuration } = useTimer();
  const [flashAnim] = useState(new Animated.Value(0));
  
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  const timeRemaining = Math.max(0, session.durationInSeconds - session.elapsedInSeconds);
  const isCompleted = session.durationInSeconds > 0 && timeRemaining === 0;

  // Flash animation when timer completes
  useEffect(() => {
    if (isCompleted) {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isCompleted, flashAnim]);

  const handleTimeSet = (seconds: number) => {
    setDuration(seconds);
  };

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

  const canStart = session.durationInSeconds > 0 && !isCompleted;

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#0f0f0f' : '#f8fafc', '#ef4444'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {formatTime(timeRemaining)}
        </Text>
        {isCompleted && (
          <Text style={styles.completedText}>Time's Up!</Text>
        )}
      </View>

      {!session.isRunning && !session.isPaused && (
        <TimeInput onTimeSet={handleTimeSet} />
      )}

      <View style={styles.presetButtons}>
        {[
          { label: '5 min', seconds: 300 },
          { label: '10 min', seconds: 600 },
          { label: '15 min', seconds: 900 },
          { label: '25 min', seconds: 1500 },
        ].map((preset) => (
          <TouchableOpacity
            key={preset.seconds}
            style={styles.presetButton}
            onPress={() => handleTimeSet(preset.seconds)}
            disabled={session.isRunning || session.isPaused}
          >
            <Text style={[
              styles.presetButtonText,
              (session.isRunning || session.isPaused) && styles.disabledText
            ]}>
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={reset}
          disabled={!session.isRunning && !session.isPaused && session.elapsedInSeconds === 0}
        >
          <RotateCcw size={24} color={isDark ? '#ffffff' : '#1f2937'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainButton,
            !canStart && !session.isPaused && styles.disabledButton
          ]}
          onPress={getMainButtonAction()}
          disabled={!canStart && !session.isPaused}
        >
          {getMainButtonIcon()}
        </TouchableOpacity>

        <View style={styles.spacer} />
      </View>

      {session.isRunning && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${((session.durationInSeconds - timeRemaining) / session.durationInSeconds) * 100}%` 
                }
              ]} 
            />
          </View>
        </View>
      )}
    </Animated.View>
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
    marginBottom: 40,
  },
  timeText: {
    fontSize: 72,
    fontFamily: 'Roboto-Bold',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  completedText: {
    fontSize: 24,
    fontFamily: 'Roboto-Medium',
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  presetButton: {
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 6,
  },
  presetButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  disabledText: {
    opacity: 0.5,
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
  disabledButton: {
    backgroundColor: isDark ? '#4b5563' : '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  spacer: {
    width: 56,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
});