'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@banxe/shared'

type Step = 'form' | 'sca' | 'success'

export default function TransfersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState<Step>('form')
  const [iban, setIban] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [scaCode, setScaCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) { router.replace('/auth/login'); return null }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    // Basic IBAN format check
    const ibanClean = iban.replace(/\s/g, '').toUpperCase()
    if (ibanClean.length < 15 || ibanClean.length > 34) {
      setError('Invalid IBAN format')
      return
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Invalid amount')
      return
    }
    // PSD2 SCA: step 2
    setStep('sca')
  }

  const handleSCA = (e: React.FormEvent) => {
    e.preventDefault()
    if (scaCode.length !== 6) { setError('Enter the 6-digit code from your authenticator'); return }
    // In production: POST /v1/payments with SCA token
    setStep('success')
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="bg-surface rounded-2xl shadow-modal p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4" aria-hidden="true">✓</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#16A34A' }}>Transfer submitted</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            {amount} GBP to {iban} — processing via Faster Payments.
          </p>
          <button
            onClick={() => router.push('/transactions')}
            className="px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: '#1A2B6B' }}
          >
            View transactions
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-lg mx-auto">
        <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-1" style={{ color: '#1A2B6B' }}>
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>
          {step === 'form' ? 'Send money' : 'PSD2 SCA confirmation'}
        </h1>

        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmitForm} className="bg-surface rounded-2xl shadow-card p-6 space-y-4">
            <div>
              <label htmlFor="iban" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Recipient IBAN
              </label>
              <input
                id="iban"
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="GB29 NWBK 6016 1331 9268 19"
                className="w-full px-4 py-3 rounded-lg border text-sm font-mono"
                style={{ borderColor: '#D1D5DB' }}
                required
                aria-label="IBAN of recipient"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Amount (GBP)
              </label>
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border text-sm"
                style={{ borderColor: '#D1D5DB' }}
                required
                aria-label="Transfer amount in GBP"
              />
            </div>
            <div>
              <label htmlFor="reference" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                Reference (optional)
              </label>
              <input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                maxLength={35}
                placeholder="Invoice 1234"
                className="w-full px-4 py-3 rounded-lg border text-sm"
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: '#1A2B6B' }}
            >
              Continue to confirmation →
            </button>
          </form>
        )}

        {step === 'sca' && (
          <form onSubmit={handleSCA} className="bg-surface rounded-2xl shadow-card p-6 space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F7FA' }}>
              <p className="text-sm font-medium mb-1">Transfer summary</p>
              <p className="text-lg font-bold">{amount} GBP</p>
              <p className="text-sm font-mono" style={{ color: '#6B7280' }}>{iban}</p>
            </div>
            <div>
              <label htmlFor="scaCode" className="block text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>
                PSD2 SCA Code (6 digits from authenticator app)
              </label>
              <input
                id="scaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={scaCode}
                onChange={(e) => setScaCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-lg border text-sm tracking-widest text-center"
                style={{ borderColor: '#D1D5DB' }}
                required
                autoFocus
                aria-describedby="sca-desc"
              />
              <p id="sca-desc" className="text-xs mt-1" style={{ color: '#6B7280' }}>
                Strong Customer Authentication — required by PSD2 for all transfers
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: '#00C6AE' }}
            >
              Confirm transfer
            </button>
            <button type="button" onClick={() => setStep('form')} className="w-full text-sm underline" style={{ color: '#6B7280' }}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
