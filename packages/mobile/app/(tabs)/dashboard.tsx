import { useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore, useAccountStore, accountsApi } from '@banxe/shared'

export default function DashboardScreen() {
  const { token, user, isAuthenticated } = useAuthStore()
  const { accounts, balances, setAccounts, setBalance } = useAccountStore()
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    if (!token) return
    const res = await accountsApi.list(token)
    if (res.ok) {
      setAccounts(res.data.accounts)
      for (const acc of res.data.accounts.slice(0, 2)) {
        const b = await accountsApi.getBalance(token, acc.account_id)
        if (b.ok) setBalance(acc.account_id, b.data)
      }
    }
  }

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/onboarding' as never); return }
    load()
  }, [isAuthenticated])

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }
  const primaryAccount = accounts[0]
  const balance = primaryAccount ? balances[primaryAccount.account_id] : null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }} accessibilityRole="main">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A2B6B" />}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1A2E' }}>
            Hi, {user?.full_name?.split(' ')[0] ?? 'there'}
          </Text>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A2B6B', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }} accessibilityLabel="Profile">{user?.full_name?.[0] ?? 'U'}</Text>
          </View>
        </View>

        {/* Balance card */}
        <View
          style={{ backgroundColor: '#1A2B6B', borderRadius: 20, padding: 24, marginBottom: 24 }}
          accessible
          accessibilityLabel={balance ? `Total balance ${balance.currency} ${balance.balance}` : 'Loading balance'}
        >
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 8 }}>Total balance</Text>
          {balance ? (
            <>
              <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '800' }}>
                {balance.currency} {balance.balance}
              </Text>
              <Text style={{ color: '#00C6AE', fontSize: 14, marginTop: 4 }}>
                Available: {balance.currency} {balance.available}
              </Text>
            </>
          ) : (
            <View style={{ height: 40, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }} accessibilityLabel="Loading" />
          )}
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 }}>Quick actions</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Send', icon: '→', route: '/(tabs)/transfers' },
            { label: 'History', icon: '≡', route: '/(tabs)/transactions' },
            { label: 'KYC', icon: '🪪', route: '/kyc' },
            { label: 'Cards', icon: '💳', route: '/cards' },
          ].map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.route as never)}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#E5E7EB' : '#FFFFFF',
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
              })}
              accessibilityRole="button"
              accessibilityLabel={a.label}
            >
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#1A1A2E' }}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
