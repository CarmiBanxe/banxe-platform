import type { ISODateString } from './api.js'

export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EDD_REQUIRED'
export type DocumentType = 'PASSPORT' | 'DRIVING_LICENCE' | 'NATIONAL_ID' | 'UTILITY_BILL' | 'BANK_STATEMENT'

export interface KYCDocument {
  type: DocumentType
  file_name: string
  uploaded_at: ISODateString
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  rejection_reason?: string
}

export interface KYCSubmission {
  customer_id: string
  documents: KYCDocument[]
  selfie_captured: boolean
  liveness_passed: boolean
  submitted_at: ISODateString
}

export interface KYCStatusResponse {
  customer_id: string
  status: KYCStatus
  verification_level: 'BASIC' | 'ENHANCED' | 'FULL'
  documents_status: Record<DocumentType, 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'MISSING'>
  risk_rating: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEP'
  updated_at: ISODateString
  next_review_date?: ISODateString
}
