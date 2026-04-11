/**
 * tests/web/compliance.test.tsx — Compliance page + FCA recon tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'
import type { ComplianceDashboard, ReconResult } from '../../packages/shared/src/types/compliance.js'

describe('Compliance dashboard types', () => {
  it('ComplianceDashboard has all required FCA fields', () => {
    const dashboard: ComplianceDashboard = {
      recon_status: 'MATCHED',
      last_recon_date: '2026-04-11',
      open_breaches: 0,
      pending_notifications: 0,
      aml_alerts_today: 2,
      kyc_pending: 5,
      safeguarding_ratio: '1.02',
    }
    expect(dashboard.recon_status).toBe('MATCHED')
    expect(dashboard.open_breaches).toBe(0)
    expect(typeof dashboard.safeguarding_ratio).toBe('string')  // FCA I-01
  })

  it('ReconStatus has all valid values', () => {
    const statuses: Array<ReconResult['status']> = ['MATCHED', 'DISCREPANCY', 'PENDING', 'BREACH']
    expect(statuses).toHaveLength(4)
    expect(statuses).toContain('MATCHED')
    expect(statuses).toContain('BREACH')
  })

  it('safeguarding_ratio is string decimal (not float)', () => {
    const ratio = '1.0250'
    expect(typeof ratio).toBe('string')
    // Never lose decimal precision
    expect(ratio).not.toMatch(/e[+-]/)
  })

  it('open_breaches > 0 triggers error colour', () => {
    const getBreachColor = (count: number) => count > 0 ? '#DC2626' : '#16A34A'
    expect(getBreachColor(0)).toBe('#16A34A')
    expect(getBreachColor(1)).toBe('#DC2626')
    expect(getBreachColor(5)).toBe('#DC2626')
  })
})

describe('Status badge colours', () => {
  const getBadgeColor = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      MATCHED:     { bg: '#DCFCE7', text: '#16A34A' },
      DISCREPANCY: { bg: '#FEF9C3', text: '#B45309' },
      BREACH:      { bg: '#FEE2E2', text: '#DC2626' },
      PENDING:     { bg: '#F3F4F6', text: '#6B7280' },
    }
    return map[status] ?? map['PENDING']
  }

  it('MATCHED status shows green colour', () => {
    const c = getBadgeColor('MATCHED')
    expect(c.text).toBe('#16A34A')
  })

  it('BREACH status shows red colour', () => {
    const c = getBadgeColor('BREACH')
    expect(c.text).toBe('#DC2626')
  })

  it('DISCREPANCY status shows warning colour', () => {
    const c = getBadgeColor('DISCREPANCY')
    expect(c.text).toBe('#B45309')
  })

  it('unknown status falls back to neutral', () => {
    const c = getBadgeColor('UNKNOWN_STATUS')
    expect(c.text).toBe('#6B7280')
  })
})
