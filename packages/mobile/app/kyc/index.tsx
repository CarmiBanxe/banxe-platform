import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

type Step = 'intro' | 'document' | 'selfie' | 'submitted'

export default function KYCScreen() {
  const [step, setStep] = useState<Step>('intro')
  const [docType, setDocType] = useState('PASSPORT')

  const advance = async (next: Step) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStep(next)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A2E' }}>Identity verification</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={{ fontSize: 22, color: '#6B7280' }}>×</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        {step === 'intro' && (
          <>
            <Text style={{ fontSize: 56, marginBottom: 20 }}>🪪</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, textAlign: 'center' }}>Verify your identity</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28, lineHeight: 22 }}>
              Required by FCA MLR 2017. Takes about 3 minutes. You&apos;ll need a government-issued ID and camera access.
            </Text>
            <Pressable onPress={() => advance('document')} style={{ backgroundColor: '#1A2B6B', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 }} accessibilityRole="button">
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Start →</Text>
            </Pressable>
          </>
        )}

        {step === 'document' && (
          <>
            <Text style={{ fontSize: 56, marginBottom: 20 }}>📎</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 20 }}>Upload document</Text>
            {['PASSPORT', 'DRIVING_LICENCE', 'NATIONAL_ID'].map((d) => (
              <Pressable
                key={d}
                onPress={() => setDocType(d)}
                style={{ borderWidth: 2, borderColor: docType === d ? '#1A2B6B' : '#E5E7EB', borderRadius: 12, padding: 16, width: '100%', marginBottom: 10 }}
                accessibilityRole="radio"
                accessibilityState={{ selected: docType === d }}
                accessibilityLabel={d.replace('_', ' ').toLowerCase()}
              >
                <Text style={{ fontWeight: '600', color: docType === d ? '#1A2B6B' : '#1A1A2E' }}>
                  {d.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={() => advance('selfie')} style={{ backgroundColor: '#1A2B6B', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48, marginTop: 12 }} accessibilityRole="button">
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Continue →</Text>
            </Pressable>
          </>
        )}

        {step === 'selfie' && (
          <>
            <Text style={{ fontSize: 56, marginBottom: 20 }}>🤳</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, textAlign: 'center' }}>Take a selfie</Text>
            <View style={{ width: '100%', height: 200, backgroundColor: '#1A1A2E', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}
              accessible accessibilityLabel="Camera viewfinder">
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Camera preview</Text>
            </View>
            <Pressable
              onPress={async () => { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); advance('submitted') }}
              style={{ backgroundColor: '#00C6AE', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 }}
              accessibilityRole="button"
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Capture →</Text>
            </Pressable>
          </>
        )}

        {step === 'submitted' && (
          <>
            <Text style={{ fontSize: 56, marginBottom: 20 }}>⏳</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, textAlign: 'center' }}>Under review</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28 }}>
              Your KYC submission is being reviewed. Usually takes 1–2 business days.
            </Text>
            <Pressable onPress={() => router.back()} style={{ backgroundColor: '#1A2B6B', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 }} accessibilityRole="button">
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Done</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
