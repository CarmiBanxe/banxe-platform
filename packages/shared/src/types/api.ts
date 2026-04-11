/**
 * API response envelope types — matches banxe-emi-stack Pydantic models
 */

export interface ApiResponse<T> {
  data: T
  status: 'ok' | 'error'
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

export interface ApiError {
  detail: string
  code?: string
  field?: string
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

/** ISO-8601 date string */
export type ISODateString = string

/** Decimal amount as string — NEVER float (FCA I-01) */
export type DecimalString = string

export type Currency = 'GBP' | 'EUR' | 'USD' | 'CHF' | string
