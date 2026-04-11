'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@banxe/shared'

type KYCStep = 'intro' | 'document' | 'selfie' | 'review' | 'submitted'

export default function KYCPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState<KYCStep>('intro')
  const [docType, setDocType] = useState('PASSPORT')

  if (!isAuthenticated) { router.replace('/auth/login'); return null }

  const steps: KYCStep[] = ['intro', 'document', 'selfie', 'review', 'submitted']
  const stepIndex = steps.indexOf(step)

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-lg mx-auto">
        <button onClick={() => router.back()} className="text-sm mb-6" style={{ color: '#1A2B6B' }}>← Back</button>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Identity verification</h1>

        {/* Progress */}
        <div className="flex gap-2 mb-8" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemax={4}>
          {['Intro', 'Document', 'Selfie', 'Review'].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: i <= stepIndex ? '#00C6AE' : '#E5E7EB' }}
                aria-hidden="true"
              />
              <p className="text-xs mt-1 text-center" style={{ color: i <= stepIndex ? '#1A1A2E' : '#9CA3AF' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-2xl shadow-card p-6">
          {step === 'intro' && (
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🪪</div>
              <h2 className="text-xl font-bold mb-3">Verify your identity</h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                We need to verify your identity to comply with FCA MLR 2017 KYC requirements.
                This takes about 3 minutes.
              </p>
              <ul className="text-left text-sm space-y-2 mb-6" style={{ color: '#1A1A2E' }}>
                {['Government-issued ID (passport, driving licence)', 'Selfie for liveness check', 'Takes approx 3 minutes'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span style={{ color: '#00C6AE' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep('document')}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#1A2B6B' }}
              >Start verification</button>
            </div>
          )}

          {step === 'document' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Upload document</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Document type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: '#D1D5DB' }}
                  aria-label="Select document type"
                >
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENCE">Driving licence</option>
                  <option value="NATIONAL_ID">National ID</option>
                </select>
              </div>
              {/* Document upload area */}
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center mb-4"
                style={{ borderColor: '#D1D5DB' }}
                role="button"
                tabIndex={0}
                aria-label="Upload document — click or drag to upload"
              >
                <div className="text-3xl mb-2" aria-hidden="true">📎</div>
                <p className="text-sm font-medium">Click to upload or drag &amp; drop</p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>PDF, JPG, PNG — max 10MB</p>
              </div>
              <button
                onClick={() => setStep('selfie')}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#1A2B6B' }}
              >Continue →</button>
            </div>
          )}

          {step === 'selfie' && (
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🤳</div>
              <h2 className="text-xl font-bold mb-3">Selfie &amp; liveness</h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Take a selfie for liveness check. Follow the on-screen instructions.</p>
              <div
                className="rounded-2xl bg-gray-900 h-64 flex items-center justify-center mb-6"
                role="img"
                aria-label="Camera viewfinder placeholder"
              >
                <p className="text-white text-sm">Camera access required</p>
              </div>
              <button onClick={() => setStep('review')} className="w-full py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: '#00C6AE' }}>
                Capture selfie
              </button>
            </div>
          )}

          {step === 'review' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Review &amp; submit</h2>
              <div className="space-y-3 mb-6">
                {[{ label: 'Document', value: docType }, { label: 'Selfie', value: 'Captured' }, { label: 'Liveness', value: 'Passed (simulated)' }].map(item => (
                  <div key={item.label} className="flex justify-between text-sm py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                    <span style={{ color: '#6B7280' }}>{item.label}</span>
                    <span className="font-medium" style={{ color: '#16A34A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
                By submitting you consent to identity verification per our Privacy Policy and FCA MLR 2017.
              </p>
              <button onClick={() => setStep('submitted')} className="w-full py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: '#1A2B6B' }}>
                Submit for review
              </button>
            </div>
          )}

          {step === 'submitted' && (
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">⏳</div>
              <h2 className="text-xl font-bold mb-3">Verification submitted</h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Your documents are under review. This usually takes 1–2 business days.
                You&apos;ll receive an email when verified.
              </p>
              <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: '#1A2B6B' }}>
                Back to dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
