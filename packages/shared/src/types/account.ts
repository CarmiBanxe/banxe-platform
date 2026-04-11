/**
 * Account + Transaction types — matches banxe-emi-stack ledger models
 * DecimalString: amounts always as strings (FCA I-01, never float)
 */
import type { Currency, DecimalString, ISODateString } from './api.js'

export type AccountType = 'OPERATIONAL' | 'SAFEGUARDING' | 'CLIENT' | 'FLOAT'
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED' | 'PENDING'

export interface Account {
  account_id: string
  display_name: string
  account_type: AccountType
  currency: Currency
  status: AccountStatus
  iban?: string
  sort_code?: string
  account_number?: string
  created_at: ISODateString
}

export interface Balance {
  account_id: string
  balance: DecimalString
  available: DecimalString
  pending: DecimalString
  currency: Currency
  as_of: ISODateString
}

export type TransactionStatus = 'PENDING' | 'SETTLED' | 'FAILED' | 'REVERSED' | 'CANCELLED'
export type TransactionType = 'CREDIT' | 'DEBIT' | 'INTERNAL' | 'FX'
export type PaymentRail = 'FASTER_PAYMENTS' | 'BACS' | 'CHAPS' | 'SWIFT' | 'SEPA' | 'INTERNAL'

export interface Transaction {
  id: string
  account_id: string
  amount: DecimalString
  currency: Currency
  type: TransactionType
  status: TransactionStatus
  rail: PaymentRail
  description: string
  reference?: string
  counterparty_name?: string
  counterparty_iban?: string  // never display raw to unverified users
  created_at: ISODateString
  settled_at?: ISODateString
  aml_score?: number
  fraud_score?: number
}

export interface Statement {
  account_id: string
  period: string
  opening_balance: DecimalString
  closing_balance: DecimalString
  transactions: Transaction[]
  currency: Currency
  generated_at: ISODateString
  pdf_url?: string  // presigned S3 URL or /v1/statements/{id}/pdf
}
