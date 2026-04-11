import { useState } from 'react'
import { View, Text, Switch, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useAuthStore } from '@banxe/shared'

export default function SettingsScreen() {
  const { user, clearAuth } = useAuthStore()
  const [biometric, setBiometric] = useState(user?.mfa_enabled ?? false)
  const [notifications, setNotifications] = useState(true)

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          clearAuth()
          router.replace('/auth/onboarding' as never)
        },
      },
    ])
  }

  const Row = ({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
      accessible accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }}>
      <Text style={{ fontSize: 15, color: '#1A1A2E' }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={async (v) => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onValueChange(v) }}
        trackColor={{ false: '#D1D5DB', true: '#00C6AE' }}
        thumbColor="#FFFFFF"
      />
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1A2E', marginBottom: 24 }}>Settings</Text>

        {/* Profile */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 12, letterSpacing: 1 }}>PROFILE</Text>
          {[{ label: 'Name', value: user?.full_name ?? '—' }, { label: 'Email', value: user?.email ?? '—' }, { label: 'KYC', value: user?.kyc_status ?? '—' }].map(item => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>{item.label}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A2E' }}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Security */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 12, letterSpacing: 1 }}>SECURITY</Text>
          <Row label="Biometric login (Face ID / Touch ID)" value={biometric} onValueChange={setBiometric} />
          <Row label="Push notifications" value={notifications} onValueChange={setNotifications} />
        </View>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => ({ backgroundColor: pressed ? '#FEE2E2' : '#FEF2F2', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 })}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 15 }}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
