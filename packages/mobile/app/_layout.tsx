import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kyc/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="cards/index" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  )
}
