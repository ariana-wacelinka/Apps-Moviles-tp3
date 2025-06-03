import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@/contexts/ThemeContext';
import { useTheme as useNavigationTheme } from '@react-navigation/native';

export default function TabLayout() {
  const { effectiveTheme } = useTheme();
  const navigationTheme = useNavigationTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: effectiveTheme === 'dark' ? '#FFFFFF' : '#DC2626',
        tabBarInactiveTintColor: effectiveTheme === 'dark' ? '#9CA3AF' : '#6B7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
        }),
        sceneStyle: { backgroundColor: navigationTheme.colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="compass" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
