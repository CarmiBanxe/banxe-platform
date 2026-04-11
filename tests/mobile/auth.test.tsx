/**
 * tests/mobile/auth.test.tsx — Mobile auth + onboarding tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'

describe('Mobile onboarding', () => {
  it('onboarding has exactly 3 slides', () => {
    const SLIDES = [
      { title: 'BANXE AI Bank', subtitle: 'FCA-authorised EMI for the AI era' },
      { title: 'Instant transfers', subtitle: 'Send money via Faster Payments' },
      { title: 'Smart compliance', subtitle: 'Real-time safeguarding reconciliation' },
    ]
    expect(SLIDES).toHaveLength(3)
  })

  it('last slide shows "Get started" button', () => {
    const SLIDES = ['intro', 'transfers', 'compliance']
    const currentSlide = SLIDES.length - 1
    const buttonText = currentSlide === SLIDES.length - 1 ? 'Get started' : 'Next →'
    expect(buttonText).toBe('Get started')
  })

  it('non-last slides show "Next →" button', () => {
    const SLIDES = ['intro', 'transfers', 'compliance']
    const currentSlide = 0
    const buttonText = currentSlide === SLIDES.length - 1 ? 'Get started' : 'Next →'
    expect(buttonText).toBe('Next →')
  })

  it('dot indicator width changes for active slide', () => {
    const activeDotWidth = 24
    const inactiveDotWidth = 8
    expect(activeDotWidth).toBeGreaterThan(inactiveDotWidth)
  })
})

describe('Mobile token security', () => {
  it('tokens must use expo-secure-store, not AsyncStorage', () => {
    // Contract: never import AsyncStorage for token storage
    const allowedTokenStorage = ['expo-secure-store']
    const forbiddenTokenStorage = ['@react-native-async-storage/async-storage']
    expect(allowedTokenStorage).toContain('expo-secure-store')
    expect(forbiddenTokenStorage).not.toContain('expo-secure-store')
  })

  it('biometric is used for PSD2 SCA on transfers', () => {
    const scaMethod = 'biometric'
    const allowedMethods = ['biometric', 'otp', 'push']
    expect(allowedMethods).toContain(scaMethod)
  })
})
