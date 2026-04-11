'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, complianceApi } from '@banxe/shared'
import type { ComplianceDashboard } from '@banxe/shared'

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    MATCHED: { bg: '#DCFCE7', text: '#16A34A' },
    DISCREPANCY: { bg: '#FEF9C3', text: '#B45309' },
    BREACH: { bg: '#FEE2E2', text: '#DC2626' },
    PENDING: { bg: '#F3F4F6', text: '#6B7280' },
  }
  const c = colors[status] ?? colors['PENDING']
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  )
}

export default function CompliancePage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()
  const [dashboard, setDashboard] = useState<ComplianceDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login'); return }
    if (!token) return
    complianceApi.getDashboard(token).then((r) => {
      if (r.ok) setDashboard(r.data)
      else setError(r.error.detail)
      setIsLoading(false)
    })
  }, [token, isAuthenticated])

  const metrics = dashboard
    ? [
        { label: 'Recon Status', value: <StatusBadge status={dashboard.recon_status} />, },
        { label: 'Open Breaches', value: <span style={{ color: dashboard.open_breaches > 0 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>{dashboard.open_breaches}</span> },
        { label: 'AML Alerts Today', value: <span style={{ fontWeight: 700 }}>{dashboard.aml_alerts_today}</span> },
        { label: 'KYC Pending', value: <span style={{ fontWeight: 700 }}>{dashboard.kyc_pending}</span> },
        { label: 'Safeguarding Ratio', value: <span style={{ fontWeight: 700 }}>{dashboard.safeguarding_ratio}</span> },
        { label: 'Last Recon', value: <span className="font-mono text-xs">{dashboard.last_recon_date}</span> },
      ]
    : []

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-sm mb-4" style={{ color: '#1A2B6B' }}>← Dashboard</button>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Compliance Dashboard</h1>

        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            API unavailable: {error}. Ensure banxe-emi-stack is running on :8000.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl p-6 h-24 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : dashboard ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {metrics.map((m) => (
                <div key={m.label} className="bg-surface rounded-xl p-5 shadow-card">
                  <p className="text-xs font-medium mb-2" style={{ color: '#6B7280' }}>{m.label}</p>
                  <div className="text-lg">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Recon action */}
            <div className="bg-surface rounded-xl p-5 shadow-card">
              <h2 className="text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>Reconciliation</h2>
              <button
                onClick={() => complianceApi.getReconStatus(token!, undefined).then(() => {})}
                className="px-4 py-2 rounded-lg text-sm text-white font-medium"
                style={{ backgroundColor: '#1A2B6B' }}
                aria-label="Refresh reconciliation status"
              >
                Refresh recon status
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm" style={{ color: '#6B7280' }}>
            No compliance data available. Start the backend at localhost:8000.
          </p>
        )}

        <p className="text-xs mt-6" style={{ color: '#9CA3AF' }}>
          FCA basis: CASS 7.15, CASS 15.12, MLR 2017 · Data from banxe-emi-stack
        </p>
      </div>
    </main>
  )
}
