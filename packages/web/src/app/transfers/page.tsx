'use client'

/**
 * packages/web/src/app/transfers/page.tsx
 * BANXE AI Bank — Transfers page wired to PSD2 SCA
 * S15-02 | PSD2 Directive 2015/2366 Art.97 | banxe-platform
 *
 * Flow:
 *   1. Customer fills transfer form (IBAN, amount, reference)
 *   2. On submit: POST /v1/auth/sca/challenge → receive challenge_id
 *   3. SCAChallenge modal opens → customer enters OTP or uses biometric
 *   4. POST /v1/auth/sca/verify → receive sca_token (PSD2 RTS Art.10)
 *   5. POST /v1/payments with SCA-Token header (uses sca_token)
 *   6. Success screen
 *
 * PSD2 PSR 2017 Reg.71: SCA required for payments > £30.
 * Threshold check: if amount <= 30 → skip SCA (contactless exemption).
 * Note: For MVP, SCA is always applied regardless of amount.
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, scaApi, type SCAInitiateResponse } from '@banxe/shared'
import { SCAChallenge } from '@/components/molecules/SCAChallenge'

type Step = 'form' | 'sca' | 'submitting' | 'success'

interface TransferData {
  iban: string
  amount: string
  reference: string
}

export default function TransfersPage() {
  const router = useRouter()
  const { isAuthenticated, token, user } = useAuthStore()

  const [step, setStep] = useState<Step>('form')
  const [transfer, setTransfer] = useState<TransferData>({ iban: '', amount: '', reference: '' })
  const [scaChallenge, setScaChallenge] = useState<SCAInitiateResponse | null>(null)
  const [scaToken, setScaToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isAuthenticated) {
    router.replace('/auth/login')
    return null
  }

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // IBAN format check
    const ibanClean = transfer.iban.replace(/\s/g, '').toUpperCase()
    if (ibanClean.length < 15 || ibanClean.length > 34) {
      setError('Invalid IBAN format')
      return
    }
    const amountNum = Number(transfer.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount')
      return
    }

    // Initiate PSD2 SCA challenge
    setIsLoading(true)
    try {
      const customerId = user?.id ?? 'unknown'
      // Generate a client-side transaction_id — in production this comes from /v1/payments/initiate
      const transactionId = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      const result = await scaApi.initiate(token ?? '', {
        customer_id: customerId,
        transaction_id: transactionId,
        method: 'otp',
        amount: transfer.amount,
        payee: ibanClean,
      })

      if (!result.ok) {
        setError(result.error.detail ?? 'Failed to initiate security verification. Please try again.')
        return
      }

      setScaChallenge(result.data)
      setStep('sca')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [transfer, token, user])

  const handleSCAConfirm = useCallback(async (confirmation: { challenge_id: string; response: string }) => {
    if (!scaChallenge) return

    const method = scaChallenge.method
    const verifyReq =
      method === 'otp'
        ? { challenge_id: confirmation.challenge_id, otp_code: confirmation.response }
        : { challenge_id: confirmation.challenge_id, biometric_proof: confirmation.response }

    const result = await scaApi.verify(token ?? '', verifyReq)

    if (!result.ok) {
      throw new Error(result.error.detail ?? 'Verification failed')
    }

    if (!result.data.verified) {
      const remaining = result.data.attempts_remaining
      throw new Error(
        result.data.error ??
          (remaining !== undefined && remaining > 0
            ? `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            : 'Challenge locked. Please request a new transfer.'),
      )
    }

    // SCA verified — store token for payment auth (PSD2 RTS Art.10)
    setScaToken(result.data.sca_token ?? null)
    setStep('submitting')

    // In production: POST /v1/payments with SCA-Token header
    // For MVP: simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStep('success')
  }, [scaChallenge, token])

  const handleSCACancel = useCallback(() => {
    setScaChallenge(null)
    setStep('form')
    setError('SCA verification cancelled. Transfer not submitted.')
  }, [])

  // ── Success screen ───────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="w-full max-w-md rounded-2xl bg-surface p-10 text-center shadow-modal">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: '#DCFCE7' }}
            aria-hidden="true"
          >
            <svg className="h-8 w-8" style={{ color: '#16A34A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold" style={{ color: '#16A34A' }}>
            Transfer submitted
          </h2>
          <p className="mb-1 text-lg font-semibold" style={{ color: '#1A1A2E' }}>
            {transfer.amount} GBP
          </p>
          <p className="mb-6 font-mono text-sm" style={{ color: '#6B7280' }}>
            to {transfer.iban}
          </p>
          {transfer.reference && (
            <p className="mb-6 text-sm" style={{ color: '#6B7280' }}>
              Ref: {transfer.reference}
            </p>
          )}
          <p className="mb-6 text-xs" style={{ color: '#9CA3AF' }}>
            Processing via Faster Payments · PSD2 SCA verified
          </p>
          <button
            onClick={() => router.push('/transactions')}
            className="rounded-lg px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: '#1A2B6B' }}
          >
            View transactions
          </button>
        </div>
      </main>
    )
  }

  // ── Submitting screen ────────────────────────────────────────────────────────
  if (step === 'submitting') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-border"
            style={{ borderTopColor: '#1A2B6B' }}
            aria-hidden="true"
          />
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Submitting transfer…
          </p>
        </div>
      </main>
    )
  }

  // ── Transfer form + SCA modal ────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1 text-sm"
          style={{ color: '#1A2B6B' }}
          aria-label="Go back"
        >
          ← Back
        </button>

        <h1 className="mb-6 text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          Send money
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg p-3 text-sm"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4 rounded-2xl bg-surface p-6 shadow-card" noValidate>
          {/* IBAN */}
          <div>
            <label htmlFor="iban" className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Recipient IBAN
            </label>
            <input
              id="iban"
              type="text"
              value={transfer.iban}
              onChange={(e) => setTransfer((t) => ({ ...t, iban: e.target.value }))}
              placeholder="GB29 NWBK 6016 1331 9268 19"
              className="w-full rounded-lg border px-4 py-3 font-mono text-sm"
              style={{ borderColor: '#D1D5DB' }}
              required
              aria-label="IBAN of recipient"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Amount (GBP)
            </label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={transfer.amount}
              onChange={(e) => setTransfer((t) => ({ ...t, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: '#D1D5DB' }}
              required
              aria-label="Transfer amount in GBP"
              aria-describedby="amount-hint"
            />
            <p id="amount-hint" className="mt-1 text-xs" style={{ color: '#6B7280' }}>
              PSD2 SCA required for all transfers
            </p>
          </div>

          {/* Reference */}
          <div>
            <label htmlFor="reference" className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Reference{' '}
              <span className="font-normal" style={{ color: '#9CA3AF' }}>
                (optional)
              </span>
            </label>
            <input
              id="reference"
              type="text"
              value={transfer.reference}
              onChange={(e) => setTransfer((t) => ({ ...t, reference: e.target.value }))}
              maxLength={35}
              placeholder="Invoice 1234"
              className="w-full rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#1A2B6B' }}
          >
            {isLoading ? 'Initiating security check…' : 'Continue to confirmation →'}
          </button>
        </form>

        {/* Transfer summary (shown when SCA modal is open) */}
        {step === 'sca' && (
          <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: '#F5F7FA' }}>
            <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
              Transfer details
            </p>
            <p className="mt-1 text-lg font-bold" style={{ color: '#1A1A2E' }}>
              {transfer.amount} GBP
            </p>
            <p className="font-mono text-sm" style={{ color: '#6B7280' }}>
              to {transfer.iban}
            </p>
          </div>
        )}
      </div>

      {/* PSD2 SCA Modal — overlays the form */}
      {step === 'sca' && scaChallenge && (
        <SCAChallenge
          challenge={{
            challenge_id: scaChallenge.challenge_id,
            method: scaChallenge.method,
            expires_at: scaChallenge.expires_at,
          }}
          onConfirm={handleSCAConfirm}
          onCancel={handleSCACancel}
          paymentAmount={`£${transfer.amount}`}
        />
      )}
    </main>
  )
}
