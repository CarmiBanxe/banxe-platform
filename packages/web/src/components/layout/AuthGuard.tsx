'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@banxe/shared'

/** Session timeout: warn at 5min, auto-logout at 10min of inactivity */
const WARN_MS = 5 * 60 * 1000
const LOGOUT_MS = 10 * 60 * 1000

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, clearAuth } = useAuthStore()
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login'); return }

    const reset = () => {
      if (warnTimer.current) clearTimeout(warnTimer.current)
      if (logoutTimer.current) clearTimeout(logoutTimer.current)
      warnTimer.current = setTimeout(() => {
        // In production: show a modal warning the user
        console.warn('[AuthGuard] Session timeout warning — 5 minutes inactive')
      }, WARN_MS)
      logoutTimer.current = setTimeout(() => {
        clearAuth()
        router.replace('/auth/login?reason=timeout')
      }, LOGOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset))
    reset()

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (warnTimer.current) clearTimeout(warnTimer.current)
      if (logoutTimer.current) clearTimeout(logoutTimer.current)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null
  return <>{children}</>
}
