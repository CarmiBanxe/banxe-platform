import { useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore, useTransactionStore, transactionsApi } from '@banxe/shared'
import type { Transaction } from '@banxe/shared'

function TxItem({ tx }: { tx: Transaction }) {
  const isDebit = tx.type === 'DEBIT'
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
      accessible
      accessibilityLabel={`${tx.description || 'Payment'}, ${isDebit ? 'debit' : 'credit'} ${tx.currency} ${tx.amount}, ${tx.status}`}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDebit ? '#FEF2F2' : '#DCFCE7', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: isDebit ? '#DC2626' : '#16A34A', fontWeight: '700' }}>{isDebit ? '↑' : '↓'}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A2E' }} numberOfLines={1}>
            {tx.description || tx.counterparty_name || 'Payment'}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
            {new Date(tx.created_at).toLocaleDateString('en-GB')}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: isDebit ? '#DC2626' : '#16A34A' }}>
          {isDebit ? '-' : '+'}{tx.currency} {tx.amount}
        </Text>
        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{tx.status}</Text>
      </View>
    </View>
  )
}

export default function TransactionsScreen() {
  const { token, isAuthenticated } = useAuthStore()
  const { transactions, total, page, isLoading, setTransactions, setPage, setLoading } = useTransactionStore()
  const [refreshing, setRefreshing] = useState(false)

  const load = async (p = 1) => {
    if (!token) return
    setLoading(true)
    const r = await transactionsApi.list(token, { page: p, page_size: 20 })
    if (r.ok) setTransactions(r.data.transactions, r.data.total)
    setLoading(false)
  }

  useEffect(() => { if (isAuthenticated) load(page) }, [isAuthenticated, page])

  const onRefresh = async () => { setRefreshing(true); await load(1); setPage(1); setRefreshing(false) }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1A2E' }}>Transactions</Text>
        <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{total} total</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(tx) => tx.id}
        renderItem={({ item }) => <TxItem tx={item} />}
        style={{ backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A2B6B" />}
        ListEmptyComponent={
          isLoading
            ? <ActivityIndicator style={{ padding: 40 }} color="#1A2B6B" />
            : <Text style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No transactions</Text>
        }
        accessibilityLabel="Transaction list"
      />
    </SafeAreaView>
  )
}
