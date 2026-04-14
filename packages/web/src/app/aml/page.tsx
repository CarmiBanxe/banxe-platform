'use client'

/**
 * packages/web/src/app/aml/page.tsx
 * BANXE AI Bank — AML Monitor Page
 * S15-09 | FCA MLR 2017 / JMLSG Part II | banxe-platform
 *
 * Displays real-time AML transaction monitoring alerts.
 * Data source: GET /v1/monitor/alerts (banxe-emi-stack)
 *
 * FCA MLR 2017 Reg.28: MLRO must review and investigate all HIGH/CRITICAL alerts.
 * JMLSG Part II: Velocity and pattern-based transaction monitoring.
 */

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, apiFetch } from '@banxe/shared'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type AlertStatus = 'OPEN' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED'

interface AMLAlert {
  alert_id: string
  severity: Severity
  status: AlertStatus
  customer_id: string
  transaction_id?: string
  description: string
  rule_name?: string
  score?: number
  created_at: string
}

interface AlertsResponse {
  alerts: AMLAlert[]
  total: number
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; label: string }> = {
  LOW: { bg: '#F3F4F6', text: '#6B7280', label: 'Low' },
  MEDIUM: { bg: '#FEF9C3', text: '#B45309', label: 'Medium' },
  HIGH: { bg: '#FEF2F2', text: '#DC2626', label: 'High' },
  CRITICAL: { bg: '#7F1D1D', text: '#FFFFFF', label: 'Critical' },
}

const STATUS_CONFIG: Record<AlertStatus, { bg: string; text: string }> = {
  OPEN: { bg: '#DBEAFE', text: '#1D4ED8' },
  UNDER_REVIEW: { bg: '#FEF9C3', text: '#B45309' },
  ESCALATED: { bg: '#FEE2E2', text: '#DC2626' },
  RESOLVED: { bg: '#DCFCE7', text: '#16A34A' },
  DISMISSED: { bg: '#F3F4F6', text: '#9CA3AF' },
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const c = SEVERITY_CONFIG[severity]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: c.bg, color: c.text }}
      aria-label={`Severity: ${c.label}`}
    >
      {c.label}
    </span>
  )
}

function StatusBadge({ status }: { status: AlertStatus }) {
  const c = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function AlertRow({ alert }: { alert: AMLAlert }) {
  const createdAt = new Date(alert.created_at)
  const timeAgo = Math.round((Date.now() - createdAt.getTime()) / 60_000)

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-xs font-mono" style={{ color: '#6B7280' }}>
        {alert.alert_id.slice(0, 16)}
      </td>
      <td className="px-4 py-3">
        <SeverityBadge severity={alert.severity} />
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: '#1A1A2E' }}>
        {alert.description}
      </td>
      <td className="px-4 py-3 text-xs font-mono" style={{ color: '#6B7280' }}>
        {alert.customer_id.slice(0, 16)}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>
        {alert.rule_name ?? '—'}
      </td>
      <td className="px-4 py-3">
        {alert.score !== undefined && (
          <span
            className="text-xs font-bold"
            style={{ color: alert.score >= 0.8 ? '#DC2626' : alert.score >= 0.5 ? '#B45309' : '#16A34A' }}
          >
            {(alert.score * 100).toFixed(0)}%
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={alert.status} />
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: '#9CA3AF' }}>
        {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`}
      </td>
    </tr>
  )
}

export default function AMLMonitorPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()

  const [alerts, setAlerts] = useState<AMLAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  if (!isAuthenticated) {
    router.replace('/auth/login')
    return null
  }

  const loadAlerts = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)

    const params = severityFilter !== 'ALL' ? `?severity=${severityFilter}&limit=50` : '?limit=50'
    const result = await apiFetch<AlertsResponse>(`/v1/monitor/alerts${params}`, { token })

    if (result.ok) {
      setAlerts(result.data.alerts ?? [])
      setLastRefresh(new Date())
    } else {
      setError(result.error.detail ?? 'Failed to load AML alerts')
    }
    setIsLoading(false)
  }, [token, severityFilter])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  // Count by severity
  const counts = alerts.reduce<Record<string, number>>(
    (acc, a) => ({ ...acc, [a.severity]: (acc[a.severity] ?? 0) + 1 }),
    {},
  )

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm mb-2 flex items-center gap-1"
              style={{ color: '#1A2B6B' }}
            >
              ← Dashboard
            </button>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
              AML Transaction Monitor
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
              FCA MLR 2017 Reg.28 · JMLSG Part II · Real-time transaction monitoring
            </p>
          </div>
          <button
            onClick={loadAlerts}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: '#1A2B6B' }}
            aria-label="Refresh AML alerts"
          >
            {isLoading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Severity[]).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev === severityFilter ? 'ALL' : sev)}
              className="rounded-xl p-4 text-left shadow-card transition-all border-2"
              style={{
                backgroundColor: SEVERITY_CONFIG[sev].bg,
                borderColor: severityFilter === sev ? SEVERITY_CONFIG[sev].text : 'transparent',
              }}
              aria-pressed={severityFilter === sev}
              aria-label={`Filter by ${sev} severity — ${counts[sev] ?? 0} alerts`}
            >
              <p className="text-xs font-medium" style={{ color: SEVERITY_CONFIG[sev].text }}>
                {SEVERITY_CONFIG[sev].label}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: SEVERITY_CONFIG[sev].text }}>
                {counts[sev] ?? 0}
              </p>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            API error: {error}. Ensure banxe-emi-stack is running on :8000.
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm" style={{ color: '#6B7280' }}>
            Showing {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            {severityFilter !== 'ALL' ? ` (${severityFilter})` : ''}
          </span>
          {severityFilter !== 'ALL' && (
            <button
              onClick={() => setSeverityFilter('ALL')}
              className="text-xs underline"
              style={{ color: '#1A2B6B' }}
            >
              Clear filter
            </button>
          )}
          <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>

        {/* Alerts table */}
        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border" style={{ borderTopColor: '#1A2B6B' }} aria-hidden="true" />
              <p className="text-sm mt-3" style={{ color: '#6B7280' }}>Loading AML alerts…</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-2xl mb-2" aria-hidden="true">✓</p>
              <p className="text-sm font-medium" style={{ color: '#16A34A' }}>No alerts</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                {severityFilter !== 'ALL' ? `No ${severityFilter} alerts at this time.` : 'All clear — no active AML alerts.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="AML alerts table">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: '#F9FAFB' }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Alert ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Rule</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B7280' }}>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <AlertRow key={alert.alert_id} alert={alert} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs mt-4" style={{ color: '#9CA3AF' }}>
          AML monitoring — FCA MLR 2017 Reg.28 · JMLSG Part II · Data: banxe-emi-stack /v1/monitor
        </p>
      </div>
    </main>
  )
}
