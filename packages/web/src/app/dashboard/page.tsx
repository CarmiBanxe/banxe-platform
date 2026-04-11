'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useAccountStore, accountsApi } from '@banxe/shared'

function BalanceCard({ label, amount, currency }: { label: string; amount: string; currency: string }) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-card" role="region" aria-label={`${label} balance`}>
      <p className="text-sm font-medium mb-1" style={{ color: '#6B7280' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: '#1A1A2E' }}>
        {currency} {amount}
      </p>
    </div>
  )
}

function QuickAction({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface shadow-card hover:shadow-modal transition-shadow"
      aria-label={label}
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="text-xs font-medium" style={{ color: '#1A1A2E' }}>{label}</span>
    </button>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuthStore()
  const { accounts, balances, setAccounts, setBalance, isLoading, setLoading } = useAccountStore()

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login'); return }
    if (!token) return
    setLoading(true)
    accountsApi.list(token).then((res) => {
      if (res.ok) {
        setAccounts(res.data.accounts)
        res.data.accounts.slice(0, 3).forEach((acc) => {
          accountsApi.getBalance(token, acc.account_id).then((b) => {
            if (b.ok) setBalance(acc.account_id, b.data)
          })
        })
      }
      setLoading(false)
    })
  }, [token, isAuthenticated])

  const primaryAccount = accounts[0]
  const primaryBalance = primaryAccount ? balances[primaryAccount.account_id] : null

  return (
    <div className="min-h-screen bg-bg">
      {/* Top nav */}
      <header className="bg-surface border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1A2B6B' }}>BANXE AI Bank</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: '#6B7280' }}>
            {user?.full_name}
          </span>
          <button
            onClick={() => { useAuthStore.getState().clearAuth(); router.replace('/auth/login') }}
            className="text-sm underline"
            style={{ color: '#DC2626' }}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>
          Good morning, {user?.full_name?.split(' ')[0]}
        </h2>

        {/* Balance cards */}
        <section aria-label="Account balances" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl p-6 animate-pulse h-28" aria-hidden="true" />
            ))
          ) : primaryBalance ? (
            <>
              <BalanceCard label="Available" amount={primaryBalance.available} currency={primaryBalance.currency} />
              <BalanceCard label="Total Balance" amount={primaryBalance.balance} currency={primaryBalance.currency} />
              <BalanceCard label="Pending" amount={primaryBalance.pending} currency={primaryBalance.currency} />
            </>
          ) : (
            <p className="text-sm col-span-3" style={{ color: '#6B7280' }}>
              No account data. Ensure banxe-emi-stack API is running on :8000.
            </p>
          )}
        </section>

        {/* Quick actions */}
        <section aria-label="Quick actions" className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A2E' }}>Quick actions</h3>
          <div className="grid grid-cols-4 gap-3">
            <QuickAction label="Send" icon="→" onClick={() => router.push('/transfers')} />
            <QuickAction label="Transactions" icon="≡" onClick={() => router.push('/transactions')} />
            <QuickAction label="Statements" icon="📄" onClick={() => router.push('/statements')} />
            <QuickAction label="Compliance" icon="✓" onClick={() => router.push('/compliance')} />
          </div>
        </section>

        {/* Recent transactions placeholder */}
        <section aria-label="Recent transactions">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A2E' }}>Recent transactions</h3>
          <div className="bg-surface rounded-xl shadow-card divide-y">
            <p className="px-6 py-8 text-sm text-center" style={{ color: '#6B7280' }}>
              View full history in{' '}
              <button onClick={() => router.push('/transactions')} className="underline">Transactions</button>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
