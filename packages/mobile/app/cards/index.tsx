import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

/** Masked card number — NEVER show full PAN (FCA requirement) */
function maskPAN(last4: string) {
  return `•••• •••• •••• ${last4}`
}

const MOCK_CARDS = [
  { id: 'c1', last4: '4321', scheme: 'Visa Debit', status: 'ACTIVE', expiry: '04/28' },
  { id: 'c2', last4: '8765', scheme: 'Mastercard', status: 'FROZEN', expiry: '12/27' },
]

export default function CardsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A2E' }}>Cards</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={{ fontSize: 22, color: '#6B7280' }}>×</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {MOCK_CARDS.map((card) => (
          <View
            key={card.id}
            style={{
              backgroundColor: card.status === 'FROZEN' ? '#6B7280' : '#1A2B6B',
              borderRadius: 20,
              padding: 24,
              aspectRatio: 1.586,
            }}
            accessible
            accessibilityLabel={`${card.scheme} card ending ${card.last4}, ${card.status}`}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 'auto' }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>BANXE AI Bank</Text>
              <Text style={{ color: '#00C6AE', fontSize: 12, fontWeight: '700' }}>{card.status}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Courier', letterSpacing: 2, marginVertical: 16 }}>
              {maskPAN(card.last4)}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>EXPIRES</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{card.expiry}</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' }}>{card.scheme}</Text>
            </View>
          </View>
        ))}

        <View style={{ backgroundColor: '#F5F7FA', borderRadius: 14, padding: 14 }}>
          <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
            Full card numbers are never displayed for security.{'\n'}
            FCA PCI DSS compliance: masked PAN only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
