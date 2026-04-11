/**
 * packages/shared/src/api-client.ts
 * Typed fetch wrapper for banxe-emi-stack API
 * IL-UI-01 | BANXE AI Bank
 */
import type { ApiResult, ApiError } from './types/api.js'
import type { LoginRequest, TokenResponse } from './types/auth.js'
import type { Account, Balance, Transaction, Statement } from './types/account.js'
import type { KYCSubmission, KYCStatusResponse } from './types/kyc.js'
import type { ComplianceDashboard, AMLScreening, ReconResult } from './types/compliance.js'

const DEFAULT_BASE_URL =
  typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL ?? process.env.BANXE_API_URL ?? 'http://localhost:8000')
    : 'http://localhost:8000'

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string; baseUrl?: string } = {},
): Promise<ApiResult<T>> {
  const { token, baseUrl = DEFAULT_BASE_URL, ...fetchOptions } = options
  const url = `${baseUrl}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers ?? {}),
  }

  try {
    const res = await fetch(url, { ...fetchOptions, headers })

    if (!res.ok) {
      let error: ApiError = { detail: `HTTP ${res.status}` }
      try {
        const body = await res.json() as Partial<ApiError>
        error = { detail: body.detail ?? error.detail, code: body.code }
      } catch {
        // body not JSON
      }
      return { ok: false, error }
    }

    const data = (await res.json()) as T
    return { ok: true, data }
  } catch (err) {
    return {
      ok: false,
      error: { detail: err instanceof Error ? err.message : 'Network error' },
    }
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (req: LoginRequest) =>
    apiFetch<TokenResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(req),
    }),

  logout: (token: string) =>
    apiFetch<void>('/v1/auth/logout', { method: 'POST', token }),
}

// ── Accounts ──────────────────────────────────────────────────────────────────

export const accountsApi = {
  list: (token: string) =>
    apiFetch<{ accounts: Account[] }>('/v1/ledger/accounts', { token }),

  getBalance: (token: string, accountId: string) =>
    apiFetch<Balance>(`/v1/ledger/accounts/${accountId}/balance`, { token }),

  getStatement: (token: string, accountId: string, period = 'current') =>
    apiFetch<Statement>(`/v1/statements/${accountId}?period=${period}`, { token }),
}

// ── Transactions ─────────────────────────────────────────────────────────────

export const transactionsApi = {
  list: (token: string, params?: { page?: number; page_size?: number; account_id?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ).toString()
    return apiFetch<{ transactions: Transaction[]; total: number }>(
      `/v1/transactions${qs ? `?${qs}` : ''}`,
      { token },
    )
  },

  approve: (token: string, transactionId: string) =>
    apiFetch<Transaction>(`/v1/transactions/${transactionId}/approve`, {
      method: 'POST',
      token,
    }),
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export const kycApi = {
  submit: (token: string, submission: KYCSubmission) =>
    apiFetch<KYCStatusResponse>('/v1/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
      token,
    }),

  getStatus: (token: string, customerId: string) =>
    apiFetch<KYCStatusResponse>(`/v1/kyc/${customerId}`, { token }),
}

// ── Compliance ────────────────────────────────────────────────────────────────

export const complianceApi = {
  getDashboard: (token: string) =>
    apiFetch<ComplianceDashboard>('/v1/compliance/dashboard', { token }),

  getAMLScreening: (token: string, customerId: string) =>
    apiFetch<AMLScreening>(`/v1/aml/screening/${customerId}`, { token }),

  getReconStatus: (token: string, date?: string) =>
    apiFetch<{ results: ReconResult[] }>(
      `/v1/recon/status${date ? `?date=${date}` : ''}`,
      { token },
    ),

  runRecon: (token: string, reconDate: string, dryRun = true) =>
    apiFetch<{ results: ReconResult[]; summary: Record<string, number> }>('/v1/recon/run', {
      method: 'POST',
      body: JSON.stringify({ recon_date: reconDate, dry_run: dryRun }),
      token,
    }),
}

export { apiFetch }
