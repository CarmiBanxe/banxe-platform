import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A2B6B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home',         tabBarIcon: ({ color }) => <TabIcon label="⌂" color={color} /> }} />
      <Tabs.Screen name="transfers" options={{ title: 'Send',         tabBarIcon: ({ color }) => <TabIcon label="→" color={color} /> }} />
      <Tabs.Screen name="transactions" options={{ title: 'History',   tabBarIcon: ({ color }) => <TabIcon label="≡" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings',      tabBarIcon: ({ color }) => <TabIcon label="⚙" color={color} /> }} />
    </Tabs>
  )
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native')
  return <Text style={{ fontSize: 20, color }}>{label}</Text>
}
