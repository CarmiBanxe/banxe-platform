import type { DecimalString, ISODateString } from './api.js'

export type ReconStatus = 'MATCHED' | 'DISCREPANCY' | 'PENDING' | 'BREACH'

export interface ReconResult {
  account_id: string
  account_type: string
  status: ReconStatus
  discrepancy: DecimalString
  currency: string
  recon_date: string
}

export interface ComplianceDashboard {
  recon_status: ReconStatus
  last_recon_date: string
  open_breaches: number
  pending_notifications: number
  aml_alerts_today: number
  kyc_pending: number
  safeguarding_ratio: DecimalString
  fca_return_due?: string
}

export interface AMLScreening {
  customer_id: string
  screening_id: string
  status: 'CLEAR' | 'ALERT' | 'BLOCKED' | 'PEP' | 'SANCTIONS'
  risk_score: number
  screened_at: ISODateString
  details?: string
}

export interface BreachRecord {
  id: string
  account_id: string
  detected_at: ISODateString
  discrepancy: DecimalString
  days_outstanding: number
  reported_to_fca: boolean
  resolved_at?: ISODateString
}
