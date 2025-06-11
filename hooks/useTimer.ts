import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TimerSession } from '@/types';
import { useSettings } from './useSettings';
import { useNotifications } from './useNotifications';

export function useTimer(initialDuration: number = 0) {
  const { soundEnabled, vibrationEnabled } = useSettings();
  const { triggerTimerAlert } = useNotifications();
  const [session, setSession] = useState<TimerSession>({
    id: Date.now().toString(),
    mode: 'countdown',
    durationInSeconds: initialDuration,
    elapsedInSeconds: 0,
    isRunning: false,
    isPaused: false,
    createdAt: new Date().toISOString(),
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerAlert = useCallback(async () => {
    // 通知アラート
    await triggerTimerAlert();
  }, [triggerTimerAlert]);

  const tick = useCallback(() => {
    setSession(prev => {
      if (!prev.isRunning || prev.isPaused) return prev;

      const newElapsed = prev.elapsedInSeconds + 1;
      
      // For countdown mode, check if time is up
      if (prev.mode === 'countdown') {
        if (newElapsed >= prev.durationInSeconds) {
          triggerAlert();
          return {
            ...prev,
            elapsedInSeconds: prev.durationInSeconds,
            isRunning: false,
            isPaused: false,
          };
        }
      }

      return {
        ...prev,
        elapsedInSeconds: newElapsed,
      };
    });
  }, [triggerAlert]);

  useEffect(() => {
    if (session.isRunning && !session.isPaused) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session.isRunning, session.isPaused, tick]);

  const start = useCallback(() => {
    setSession(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
  }, []);

  const pause = useCallback(() => {
    setSession(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resume = useCallback(() => {
    setSession(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setSession(prev => ({
      ...prev,
      elapsedInSeconds: 0,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setSession(prev => ({
      ...prev,
      durationInSeconds: duration,
      elapsedInSeconds: 0,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  const setMode = useCallback((mode: 'countdown' | 'stopwatch') => {
    setSession(prev => ({
      ...prev,
      mode,
      elapsedInSeconds: 0,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  return {
    session,
    start,
    pause,
    resume,
    reset,
    setDuration,
    setMode,
  };
}