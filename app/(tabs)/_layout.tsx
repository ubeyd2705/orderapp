import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'rgba(239, 68, 68, 0.9)', // Setzt einen halbtransparenten Hintergrund auf iOS
            backdropFilter: 'blur(10px)',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bestellen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="fork.knife" color={color} style={{ padding: 8 }} />,
        }}
      />
       <Tabs.Screen
        name="einkaufswagen"
        options={{
          title: 'Einkaufswagen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color}  />,
        }}
      />
        <Tabs.Screen
        name="status"
        options={{
          title: 'Bestellstatus',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="hourglass" color={color} />,
        }}
      />
       <Tabs.Screen
        name="zahlen"
        options={{
          title: 'Bestellstatus',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}
