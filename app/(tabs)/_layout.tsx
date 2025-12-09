import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ee7711',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#78716c' : '#a8a29e',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1917' : '#fafaf9',
          borderTopColor: colorScheme === 'dark' ? '#292524' : '#e7e5e4',
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-primary-500/20 rounded-xl p-2' : 'p-2'}>
              <IconSymbol size={26} name="camera.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-primary-500/20 rounded-xl p-2' : 'p-2'}>
              <IconSymbol size={26} name="fork.knife" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-primary-500/20 rounded-xl p-2' : 'p-2'}>
              <IconSymbol size={26} name="bookmark.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-primary-500/20 rounded-xl p-2' : 'p-2'}>
              <IconSymbol size={26} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
