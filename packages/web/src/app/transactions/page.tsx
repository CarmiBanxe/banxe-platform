'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useTransactionStore, transactionsApi } from '@banxe/shared'
import type { Transaction } from '@banxe/shared'

function TxRow({ tx }: { tx: Transaction }) {
  const isDebit = tx.type === 'DEBIT'
  const statusColor = tx.status === 'SETTLED' ? '#16A34A' : tx.status === 'FAILED' ? '#DC2626' : '#F59E0B'
  return (
    <li className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div>
        <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
          {tx.description || tx.counterparty_name || 'Payment'}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
          {new Date(tx.created_at).toLocaleDateString('en-GB')} · {tx.rail}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold" style={{ color: isDebit ? '#DC2626' : '#16A34A' }}>
          {isDebit ? '-' : '+'}{tx.currency} {tx.amount}
        </p>
        <span className="text-xs" style={{ color: statusColor }}>{tx.status}</span>
      </div>
    </li>
  )
}

export default function TransactionsPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const { transactions, total, page, isLoading, filter, setTransactions, setPage, setLoading, setFilter } = useTransactionStore()
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login'); return }
    if (!token) return
    setLoading(true)
    transactionsApi.list(token, { page, page_size: 20, ...(filter.status ? { status: filter.status } : {}) })
      .then((r) => {
        if (r.ok) setTransactions(r.data.transactions, r.data.total)
        setLoading(false)
      })
  }, [token, isAuthenticated, page, filter.status])

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-sm mb-4" style={{ color: '#1A2B6B' }}>← Dashboard</button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Transactions</h1>
          <span className="text-sm" style={{ color: '#6B7280' }}>{total} total</span>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2">
          {(['', 'SETTLED', 'PENDING', 'FAILED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setFilter({ status: s || undefined }) }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: statusFilter === s ? '#1A2B6B' : '#F5F7FA',
                color: statusFilter === s ? '#FFFFFF' : '#1A1A2E',
              }}
              aria-pressed={statusFilter === s}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-sm" style={{ color: '#6B7280' }} aria-busy="true">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: '#6B7280' }}>No transactions found.</div>
          ) : (
            <ul role="list" aria-label="Transaction list">
              {transactions.map((tx) => <TxRow key={tx.id} tx={tx} />)}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg text-sm disabled:opacity-40"
              style={{ backgroundColor: '#F5F7FA' }}
              aria-label="Previous page"
            >←</button>
            <span className="px-4 py-2 text-sm">{page} / {Math.ceil(total / 20)}</span>
            <button
              disabled={page >= Math.ceil(total / 20)}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg text-sm disabled:opacity-40"
              style={{ backgroundColor: '#F5F7FA' }}
              aria-label="Next page"
            >→</button>
          </div>
        )}
      </div>
    </main>
  )
}
