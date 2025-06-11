import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { useSettings } from './useSettings';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const { soundEnabled, vibrationEnabled } = useSettings();
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // 通知権限の要求
  const requestPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // ExpoプロジェクトIDを設定
      })).data;
      setExpoPushToken(token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  };

  // バイブレーション
  const triggerVibration = () => {
    if (!vibrationEnabled) return;
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // ローカル通知の送信
  const scheduleNotification = async (title: string, body: string, seconds: number = 0) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: soundEnabled ? 'default' : undefined,
        },
        trigger: seconds > 0 ? { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds 
        } : null,
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  // 即座に通知を送信
  const sendNotification = async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: soundEnabled ? 'default' : undefined,
        },
        trigger: null, // 即座に送信
      });
    } catch (error) {
      console.log('Error sending notification:', error);
    }
  };

  // タイマー完了時のアラート
  const triggerTimerAlert = async (message: string = "Time's Up!") => {
    // バイブレーション
    triggerVibration();
    
    // 通知送信
    await sendNotification('TimeFlex', message);
  };

  // 通知のキャンセル
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  useEffect(() => {
    // 通知権限の要求
    requestPermissions();

    // 通知リスナーの設定
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      // クリーンアップ
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
    triggerTimerAlert,
    scheduleNotification,
    sendNotification,
    cancelAllNotifications,
    triggerVibration,
  };
} 