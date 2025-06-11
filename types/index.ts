export interface TimerSession {
  id: string;
  mode: 'countdown' | 'stopwatch';
  durationInSeconds: number;
  elapsedInSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}