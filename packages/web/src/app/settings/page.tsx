'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@banxe/shared'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const [biometricEnabled, setBiometricEnabled] = useState(user?.mfa_enabled ?? false)
  const [saved, setSaved] = useState(false)

  if (!isAuthenticated) { router.replace('/auth/login'); return null }

  const handleSave = () => {
    // In production: PATCH /v1/profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-lg mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-sm mb-6" style={{ color: '#1A2B6B' }}>← Dashboard</button>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>Settings</h1>

        {/* Profile section */}
        <section className="bg-surface rounded-xl shadow-card p-6 mb-4" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="text-sm font-semibold mb-4" style={{ color: '#6B7280' }}>PROFILE</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#6B7280' }}>Name</span>
              <span className="font-medium">{user?.full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#6B7280' }}>Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#6B7280' }}>KYC Status</span>
              <span className="font-medium" style={{ color: user?.kyc_status === 'VERIFIED' ? '#16A34A' : '#F59E0B' }}>
                {user?.kyc_status}
              </span>
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="bg-surface rounded-xl shadow-card p-6 mb-4" aria-labelledby="security-heading">
          <h2 id="security-heading" className="text-sm font-semibold mb-4" style={{ color: '#6B7280' }}>SECURITY</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Biometric authentication</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Use Face ID or fingerprint to log in</p>
            </div>
            <button
              role="switch"
              aria-checked={biometricEnabled}
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ backgroundColor: biometricEnabled ? '#00C6AE' : '#D1D5DB' }}
              aria-label="Toggle biometric authentication"
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: biometricEnabled ? 'translateX(24px)' : 'translateX(0)' }}
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="pt-3 border-t mt-2" style={{ borderColor: '#F3F4F6' }}>
            <button className="text-sm font-medium" style={{ color: '#1A2B6B' }}>
              Change PIN →
            </button>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg text-white font-semibold transition-colors mb-3"
          style={{ backgroundColor: saved ? '#16A34A' : '#1A2B6B' }}
        >
          {saved ? '✓ Saved' : 'Save settings'}
        </button>

        <button
          onClick={() => { clearAuth(); router.replace('/auth/login') }}
          className="w-full py-3 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          aria-label="Sign out of account"
        >
          Sign out
        </button>
      </div>
    </main>
  )
}
