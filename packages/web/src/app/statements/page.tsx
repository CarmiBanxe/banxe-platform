'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useAccountStore, accountsApi } from '@banxe/shared'
import type { Statement } from '@banxe/shared'

export default function StatementsPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const { accounts } = useAccountStore()
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [statement, setStatement] = useState<Statement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login') }
  }, [isAuthenticated])

  const primaryAccount = accounts[0]

  const fetchStatement = () => {
    if (!token || !primaryAccount) return
    setIsLoading(true)
    setError(null)
    accountsApi.getStatement(token, primaryAccount.account_id, selectedPeriod).then((r) => {
      if (r.ok) setStatement(r.data)
      else setError(r.error.detail)
      setIsLoading(false)
    })
  }

  const periods = [
    { value: 'current', label: 'Current month' },
    { value: '2026-03', label: 'March 2026' },
    { value: '2026-02', label: 'February 2026' },
    { value: '2026-01', label: 'January 2026' },
  ]

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-sm mb-4" style={{ color: '#1A2B6B' }}>← Dashboard</button>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Statements</h1>

        <div className="bg-surface rounded-xl shadow-card p-6 mb-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="period" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>Period</label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm"
                style={{ borderColor: '#D1D5DB' }}
              >
                {periods.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <button
              onClick={fetchStatement}
              disabled={!primaryAccount || isLoading}
              className="px-5 py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-40"
              style={{ backgroundColor: '#1A2B6B' }}
            >
              {isLoading ? 'Loading…' : 'Load'}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        {statement && (
          <div className="bg-surface rounded-xl shadow-card overflow-hidden">
            <div className="p-6 border-b flex justify-between items-start" style={{ borderColor: '#F3F4F6' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Period: {statement.period}</p>
                <p className="text-sm">Opening: <strong>{statement.currency} {statement.opening_balance}</strong></p>
                <p className="text-sm">Closing: <strong>{statement.currency} {statement.closing_balance}</strong></p>
              </div>
              {statement.pdf_url && (
                <a
                  href={statement.pdf_url}
                  download
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#00C6AE' }}
                  aria-label="Download statement PDF"
                >
                  Download PDF
                </a>
              )}
            </div>
            <ul role="list" className="divide-y" aria-label="Statement transactions">
              {statement.transactions.slice(0, 10).map((tx) => (
                <li key={tx.id} className="px-6 py-3 flex justify-between text-sm">
                  <span style={{ color: '#1A1A2E' }}>{tx.description}</span>
                  <span
                    className="font-medium"
                    style={{ color: tx.type === 'DEBIT' ? '#DC2626' : '#16A34A' }}
                  >
                    {tx.type === 'DEBIT' ? '-' : '+'}{tx.currency} {tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
