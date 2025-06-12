import { Tabs } from 'expo-router';
import { Timer, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { isDark } = useTheme();
  
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const activeColor = '#6366f1';
  const inactiveColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          paddingHorizontal: 0,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 12,
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ size, color }) => (
            <Timer size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}