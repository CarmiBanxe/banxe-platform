'use client'

/**
 * packages/web/src/components/molecules/SCAChallenge.tsx
 * BANXE AI Bank — PSD2 SCA Challenge Modal (Web)
 * S14-08 | PSD2 Directive 2015/2366 Art.97 | banxe-platform
 *
 * PSD2 Article 97 requires Strong Customer Authentication (SCA) for:
 *   1. Login from a new device / location
 *   2. Payments above £30 (PSR 2017 Reg.71)
 *   3. Sensitive profile changes (email, phone, beneficiary)
 *
 * SCA methods supported (PSD2 Art.4(30)):
 *   - BIOMETRIC: WebAuthn / FIDO2 (possession + inherence)
 *   - OTP: TOTP via Authenticator App (knowledge + possession)
 *   - PUSH: in-app push notification (possession factor)
 *
 * STATUS: STUB — biometric uses WebAuthn API stub; OTP calls /auth/sca endpoint.
 */

import { useState, useCallback } from 'react'
import type { SCAChallenge as SCAModel, SCAConfirmation } from '@banxe/shared'

interface SCAProps {
  challenge: SCAModel
  onConfirm: (confirmation: SCAConfirmation) => Promise<void>
  onCancel: () => void
  paymentAmount?: string  // e.g. "£150.00" — for PSR 2017 Reg.71 context
}

type SCAStep = 'prompt' | 'otp_entry' | 'submitting' | 'error'

export function SCAChallenge({ challenge, onConfirm, onCancel, paymentAmount }: SCAProps) {
  const [step, setStep] = useState<SCAStep>('prompt')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleBiometric = useCallback(async () => {
    setStep('submitting')
    setError(null)
    try {
      // STUB: WebAuthn credential.get() would go here
      // In production: call navigator.credentials.get({ publicKey: ... })
      // For now, simulate with placeholder response
      await onConfirm({
        challenge_id: challenge.challenge_id,
        response: 'biometric:stub:approved',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Biometric authentication failed')
      setStep('error')
    }
  }, [challenge.challenge_id, onConfirm])

  const handleOTPSubmit = useCallback(async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }
    setStep('submitting')
    setError(null)
    try {
      await onConfirm({
        challenge_id: challenge.challenge_id,
        response: otp,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
      setStep('otp_entry')
    }
  }, [challenge.challenge_id, otp, onConfirm])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sca-title"
      aria-describedby="sca-desc"
      className="fixed inset-0 z-400 flex items-center justify-center bg-black/50"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-modal">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <span aria-hidden="true" className="text-2xl">🔐</span>
          </div>
          <h2 id="sca-title" className="text-xl font-semibold text-text">
            Security Verification Required
          </h2>
          <p id="sca-desc" className="mt-2 text-sm text-textMuted">
            {paymentAmount
              ? `PSD2 SCA required to authorise payment of ${paymentAmount}`
              : 'Two-factor authentication is required to continue.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-errorLight p-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Step: Prompt */}
        {step === 'prompt' && (
          <div className="space-y-3">
            {(challenge.method === 'biometric') && (
              <button
                onClick={handleBiometric}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span aria-hidden="true">👆</span>
                Use Biometric / Face ID
              </button>
            )}
            {(challenge.method === 'otp') && (
              <button
                onClick={() => setStep('otp_entry')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span aria-hidden="true">📱</span>
                Enter Authenticator Code
              </button>
            )}
            <button
              onClick={onCancel}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-text hover:bg-surfaceAlt"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Step: OTP entry */}
        {step === 'otp_entry' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="sca-otp" className="block text-sm font-medium text-text">
                Authenticator Code
              </label>
              <input
                id="sca-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] focus:border-borderFocus focus:outline-none"
                placeholder="000000"
                aria-label="6-digit authenticator code"
                autoComplete="one-time-code"
              />
              <p className="mt-1 text-xs text-textMuted">
                Open your authenticator app and enter the 6-digit code.
              </p>
            </div>
            <button
              onClick={handleOTPSubmit}
              disabled={otp.length !== 6}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-hover disabled:cursor-not-allowed disabled:bg-disabled"
            >
              Verify
            </button>
            <button onClick={() => setStep('prompt')} className="w-full text-sm text-textMuted hover:text-text">
              ← Back
            </button>
          </div>
        )}

        {/* Step: Submitting */}
        {step === 'submitting' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
            <p className="text-sm text-textMuted">Verifying…</p>
          </div>
        )}

        {/* Step: Error (retry) */}
        {step === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => setStep('prompt')}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white"
            >
              Try Again
            </button>
            <button onClick={onCancel} className="w-full text-sm text-textMuted hover:text-text">
              Cancel
            </button>
          </div>
        )}

        {/* Regulatory footer */}
        <p className="mt-6 text-center text-xs text-textMuted">
          PSD2 Art.97 SCA · Banxe EMI FRN 900000
        </p>
      </div>
    </div>
  )
}
