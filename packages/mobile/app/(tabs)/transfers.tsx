import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Haptics from 'expo-haptics'
import { useAuthStore } from '@banxe/shared'

type Step = 'form' | 'biometric' | 'success'

export default function TransfersScreen() {
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState<Step>('form')
  const [iban, setIban] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')

  const handleContinue = () => {
    if (!iban.trim() || !amount.trim()) {
      Alert.alert('Missing fields', 'Please enter IBAN and amount')
      return
    }
    setStep('biometric')
    triggerBiometric()
  }

  const triggerBiometric = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        // Fallback: PIN confirmation (not implemented in scaffold)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        Alert.alert('Biometric unavailable', 'Please use PIN confirmation (not available in demo)')
        setStep('form')
        return
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm transfer with biometric',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      })
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setStep('success')
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setStep('form')
        Alert.alert('Authentication failed', 'Transfer cancelled')
      }
    } catch {
      setStep('form')
    }
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>✅</Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#16A34A', marginBottom: 8 }}>Transfer sent!</Text>
        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
          GBP {amount} to {iban}
        </Text>
        <Pressable
          onPress={() => { setStep('form'); setIban(''); setAmount(''); setReference('') }}
          style={{ backgroundColor: '#1A2B6B', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 }}
          accessibilityRole="button"
          accessibilityLabel="Send another transfer"
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Send another</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1A2E', marginBottom: 24 }}>Send money</Text>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, gap: 16 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 }}>Recipient IBAN</Text>
            <TextInput
              value={iban}
              onChangeText={setIban}
              placeholder="GB29 NWBK 6016 1331 9268 19"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, fontSize: 13, fontFamily: 'Courier' }}
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel="Recipient IBAN"
            />
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 }}>Amount (GBP)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, fontSize: 20, fontWeight: '700' }}
              accessibilityLabel="Transfer amount in GBP"
            />
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 }}>Reference (optional)</Text>
            <TextInput
              value={reference}
              onChangeText={setReference}
              placeholder="Invoice 1234"
              maxLength={35}
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, fontSize: 13 }}
              accessibilityLabel="Payment reference"
            />
          </View>
        </View>

        <View style={{ backgroundColor: '#DBEAFE', borderRadius: 12, padding: 14, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text>🔒</Text>
          <Text style={{ fontSize: 12, color: '#1D4ED8', flex: 1 }}>
            PSD2 SCA: biometric authentication required to confirm this transfer.
          </Text>
        </View>

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#162460' : '#1A2B6B',
            borderRadius: 14,
            paddingVertical: 18,
            alignItems: 'center',
            marginTop: 24,
          })}
          accessibilityRole="button"
          accessibilityLabel="Continue to biometric confirmation"
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
            {step === 'biometric' ? 'Authenticating…' : 'Confirm with biometric →'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
