'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@banxe/shared'
import { useAuthStore } from '@banxe/shared'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { setAuth, setLoading } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      setLoading(true)
      const result = await authApi.login({ email, pin })
      setLoading(false)
      if (!result.ok) {
        setError(result.error.detail ?? 'Login failed')
        return
      }
      // In production: fetch user profile from /v1/auth/me
      setAuth(
        {
          id: 'demo',
          email,
          full_name: email.split('@')[0] ?? 'User',
          kyc_status: 'VERIFIED',
          risk_level: 'LOW',
          created_at: new Date().toISOString(),
          mfa_enabled: false,
        },
        result.data,
      )
      router.replace('/dashboard')
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: '#1A2B6B' }}
            aria-hidden="true"
          >
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#1A1A2E' }}>
            BANXE AI Bank
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            FCA-authorised EMI · Reg No. 123456
          </p>
        </div>

        {/* Login card */}
        <div className="bg-surface rounded-2xl shadow-card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1A1A2E' }}>
            Sign in to your account
          </h2>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm transition-colors"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                  color: '#1A1A2E',
                }}
                aria-describedby="email-hint"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="pin" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
                6-digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="current-password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-lg border text-sm tracking-widest transition-colors"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                  color: '#1A1A2E',
                }}
                placeholder="••••••"
                aria-describedby="pin-hint"
              />
              <p id="pin-hint" className="text-xs mt-1" style={{ color: '#6B7280' }}>
                PSD2 SCA: 6-digit security PIN
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending || !email || pin.length < 6}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white text-sm transition-all"
              style={{
                backgroundColor: isPending ? '#9CA3AF' : '#1A2B6B',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
              aria-busy={isPending}
            >
              {isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* GDPR / PSD2 consent notice */}
          <p className="text-xs text-center mt-6" style={{ color: '#6B7280' }}>
            By signing in you agree to our{' '}
            <a href="/legal/privacy" className="underline">Privacy Policy</a> and{' '}
            <a href="/legal/terms" className="underline">Terms of Service</a>.{' '}
            PSD2 SCA applies to all transactions.
          </p>
        </div>
      </div>
    </main>
  )
}
