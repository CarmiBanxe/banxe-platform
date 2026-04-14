'use client'

/**
 * packages/web/src/app/safeguarding/page.tsx
 * BANXE AI Bank — Safeguarding Dashboard
 * S15-11 | FCA CASS 15 / PSR 2017 Reg.23 | banxe-platform
 *
 * Displays safeguarding compliance metrics and reconciliation status.
 * Data source: GET /v1/safeguarding/* (banxe-emi-stack)
 *
 * FCA CASS 15: E-money institutions must safeguard relevant funds.
 * Requirement: Safeguarding ratio ≥ 100% at all times.
 * FIN060 return: Monthly regulatory return to FCA.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, apiFetch } from '@banxe/shared'

interface SafeguardingAccount {
  account_id: string
  bank_name: string
  iban: string
  currency: string
  balance: string
  last_reconciled: string
  status: 'COMPLIANT' | 'AT_RISK' | 'BREACH'
}

interface SafeguardingStatus {
  total_relevant_funds: string
  total_safeguarded: string
  safeguarding_ratio: string
  status: 'COMPLIANT' | 'AT_RISK' | 'BREACH'
  accounts: SafeguardingAccount[]
  last_recon_date: string
  next_recon_date: string
  fin060_due: string | null
}

const STATUS_DISPLAY = {
  COMPLIANT: { bg: '#DCFCE7', text: '#16A34A', icon: '✓', label: 'Compliant' },
  AT_RISK: { bg: '#FEF9C3', text: '#B45309', icon: '⚠', label: 'At Risk' },
  BREACH: { bg: '#FEE2E2', text: '#DC2626', icon: '✗', label: 'Breach' },
}

function StatusBanner({ status, ratio }: { status: 'COMPLIANT' | 'AT_RISK' | 'BREACH'; ratio: string }) {
  const c = STATUS_DISPLAY[status]
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4 mb-6"
      style={{ backgroundColor: c.bg }}
      role="status"
      aria-label={`Safeguarding status: ${c.label}`}
    >
      <span className="text-3xl" aria-hidden="true">{c.icon}</span>
      <div>
        <p className="font-bold text-lg" style={{ color: c.text }}>
          {c.label} — Ratio: {ratio}%
        </p>
        <p className="text-sm" style={{ color: c.text }}>
          {status === 'COMPLIANT'
            ? 'Safeguarded funds meet or exceed relevant funds. CASS 15 compliant.'
            : status === 'AT_RISK'
              ? 'Safeguarding ratio approaching minimum. Review immediately.'
              : 'CRITICAL: Safeguarding ratio below 100%. Immediate action required — notify FCA.'}
        </p>
      </div>
    </div>
  )
}

function AccountRow({ account }: { account: SafeguardingAccount }) {
  const c = STATUS_DISPLAY[account.status]
  const lastRecon = new Date(account.last_reconciled)
  const staleHours = Math.round((Date.now() - lastRecon.getTime()) / 3_600_000)

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1A1A2E' }}>
        {account.bank_name}
      </td>
      <td className="px-4 py-3 text-xs font-mono" style={{ color: '#6B7280' }}>
        {account.iban}
      </td>
      <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: '#1A1A2E' }}>
        {account.currency} {Number(account.balance).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: staleHours > 24 ? '#DC2626' : '#6B7280' }}>
        {staleHours < 1 ? 'Just now' : `${staleHours}h ago`}
        {staleHours > 24 && ' ⚠ Stale'}
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold gap-1"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          {c.icon} {c.label}
        </span>
      </td>
    </tr>
  )
}

export default function SafeguardingPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const [status, setStatus] = useState<SafeguardingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) {
    router.replace('/auth/login')
    return null
  }

  useEffect(() => {
    if (!token) return
    setIsLoading(true)

    // Fetch safeguarding status from banxe-emi-stack
    apiFetch<SafeguardingStatus>('/v1/safeguarding/status', { token }).then((result) => {
      if (result.ok) {
        setStatus(result.data)
      } else {
        setError(result.error.detail ?? 'Failed to load safeguarding data')
      }
      setIsLoading(false)
    })
  }, [token])

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm mb-4 flex items-center gap-1"
          style={{ color: '#1A2B6B' }}
        >
          ← Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
              Safeguarding Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
              FCA CASS 15 · PSR 2017 Reg.23 · Relevant funds protection
            </p>
          </div>
          <button
            onClick={() => { setIsLoading(true); /* reload */ }}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: '#1A2B6B' }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            API error: {error}. Ensure banxe-emi-stack API is running on :8000.
          </div>
        )}

        {isLoading && !status && (
          <div className="flex flex-col items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border" style={{ borderTopColor: '#1A2B6B' }} aria-hidden="true" />
            <p className="text-sm mt-3" style={{ color: '#6B7280' }}>Loading safeguarding data…</p>
          </div>
        )}

        {status && (
          <>
            {/* Status banner */}
            <StatusBanner status={status.status} ratio={status.safeguarding_ratio} />

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Relevant Funds', value: `GBP ${Number(status.total_relevant_funds).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, note: 'Customer e-money outstanding' },
                { label: 'Safeguarded', value: `GBP ${Number(status.total_safeguarded).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, note: 'Funds in segregated accounts' },
                { label: 'Ratio', value: `${status.safeguarding_ratio}%`, note: 'Must be ≥ 100% (CASS 15)' },
                { label: 'Last Recon', value: new Date(status.last_recon_date).toLocaleDateString('en-GB'), note: 'Daily reconciliation' },
                { label: 'Next Recon', value: new Date(status.next_recon_date).toLocaleDateString('en-GB'), note: 'Scheduled' },
                { label: 'FIN060 Due', value: status.fin060_due ? new Date(status.fin060_due).toLocaleDateString('en-GB') : 'N/A', note: 'FCA monthly return' },
              ].map((m) => (
                <div key={m.label} className="bg-surface rounded-xl p-5 shadow-card">
                  <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>{m.label}</p>
                  <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{m.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{m.note}</p>
                </div>
              ))}
            </div>

            {/* Safeguarding accounts table */}
            <div className="bg-surface rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h2 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                  Safeguarding Accounts ({status.accounts.length})
                </h2>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Segregated bank accounts holding customer e-money (CASS 15.7)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Safeguarding accounts">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: '#F9FAFB' }}>
                      <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Bank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>IBAN</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#6B7280' }}>Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Last Recon</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.accounts.map((account) => (
                      <AccountRow key={account.account_id} account={account} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!status && !isLoading && !error && (
          <div className="bg-surface rounded-xl p-8 text-center shadow-card">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              No safeguarding data available. Start banxe-emi-stack on localhost:8000.
            </p>
          </div>
        )}

        <p className="text-xs mt-6" style={{ color: '#9CA3AF' }}>
          FCA CASS 15 · PSR 2017 Reg.23 · EMI safeguarding requirements · Data: banxe-emi-stack
        </p>
      </div>
    </main>
  )
}
