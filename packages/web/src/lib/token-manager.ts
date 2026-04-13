/**
 * packages/web/src/lib/token-manager.ts
 * BANXE AI Bank — Token Lifecycle Manager
 * S15-05 | PSD2 RTS Art.4 | banxe-platform
 *
 * Responsibilities:
 *   1. Silent token refresh — silently refreshes access token before expiry
 *   2. Inactivity detection — forces re-auth after 5 min inactivity (PSD2 RTS)
 *   3. Activity tracking — user interactions reset the inactivity timer
 *
 * PSD2 RTS requirements:
 *   - Max inactivity before re-auth: 5 minutes (PSR 2017 / PSD2 RTS Art.4)
 *   - Silent refresh window: refresh 60s before access token expiry
 *   - Refresh token validity: 7 days (configurable via backend)
 *
 * Usage:
 *   import { tokenManager } from '@/lib/token-manager'
 *   tokenManager.start(onRefresh, onExpiry)   // call after login
 *   tokenManager.stop()                        // call on logout
 *   tokenManager.resetActivity()               // call on user interaction
 */

import { authApi } from '@banxe/shared'

// ── Constants ─────────────────────────────────────────────────────────────────

/** PSD2 RTS — inactivity limit before requiring re-auth (5 minutes in ms) */
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000

/** Refresh access token this many ms before it expires */
const REFRESH_BEFORE_EXPIRY_MS = 60 * 1000  // 60 seconds

/** How often to check for refresh/inactivity (every 30 seconds) */
const CHECK_INTERVAL_MS = 30 * 1000

/** Activity events that reset the inactivity timer */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
]

// ── Token Manager ─────────────────────────────────────────────────────────────

interface TokenManagerCallbacks {
  /** Called when token has been silently refreshed — update store with new token/refreshToken */
  onRefresh: (newToken: string, newRefreshToken: string, expiresAt: Date) => void
  /** Called when session expires (inactivity timeout OR refresh fails) — redirect to login */
  onExpiry: (reason: 'inactivity' | 'refresh_failed') => void
}

class TokenManager {
  private _checkTimer: ReturnType<typeof setInterval> | null = null
  private _callbacks: TokenManagerCallbacks | null = null
  private _accessToken: string | null = null
  private _refreshToken: string | null = null
  private _tokenExpiresAt: Date | null = null
  private _lastActivityAt: Date = new Date()
  private _isRefreshing = false

  /** Start the token manager after a successful login. */
  start(
    accessToken: string,
    refreshToken: string,
    tokenExpiresAt: Date,
    callbacks: TokenManagerCallbacks,
  ): void {
    this.stop()  // Clear any existing timers

    this._accessToken = accessToken
    this._refreshToken = refreshToken
    this._tokenExpiresAt = tokenExpiresAt
    this._callbacks = callbacks
    this._lastActivityAt = new Date()
    this._isRefreshing = false

    // Register activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, this._handleActivity, { passive: true })
    })

    // Start periodic check
    this._checkTimer = setInterval(() => this._check(), CHECK_INTERVAL_MS)

    // Also check on visibility change (tab becomes active again)
    document.addEventListener('visibilitychange', this._handleVisibilityChange)
  }

  /** Stop the token manager (call on logout). */
  stop(): void {
    if (this._checkTimer) {
      clearInterval(this._checkTimer)
      this._checkTimer = null
    }

    ACTIVITY_EVENTS.forEach((event) => {
      window.removeEventListener(event, this._handleActivity)
    })

    document.removeEventListener('visibilitychange', this._handleVisibilityChange)

    this._callbacks = null
    this._accessToken = null
    this._refreshToken = null
    this._tokenExpiresAt = null
    this._isRefreshing = false
  }

  /** Manually signal user activity (e.g., from API calls). */
  resetActivity(): void {
    this._lastActivityAt = new Date()
  }

  /** Update token state after an external refresh (e.g., from another tab). */
  updateTokens(accessToken: string, refreshToken: string, tokenExpiresAt: Date): void {
    this._accessToken = accessToken
    this._refreshToken = refreshToken
    this._tokenExpiresAt = tokenExpiresAt
  }

  // ── Private ──────────────────────────────────────────────────────────────────

  private _handleActivity = (): void => {
    this._lastActivityAt = new Date()
  }

  private _handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      // Tab became visible — run immediate check
      this._check()
    }
  }

  private async _check(): Promise<void> {
    if (!this._callbacks || !this._accessToken || !this._tokenExpiresAt) return

    const now = new Date()

    // 1. Check inactivity (PSD2 RTS — 5 min limit)
    const inactiveMs = now.getTime() - this._lastActivityAt.getTime()
    if (inactiveMs >= INACTIVITY_TIMEOUT_MS) {
      this.stop()
      this._callbacks.onExpiry('inactivity')
      return
    }

    // 2. Silent refresh: if access token expires within REFRESH_BEFORE_EXPIRY_MS
    const msUntilExpiry = this._tokenExpiresAt.getTime() - now.getTime()
    if (msUntilExpiry <= REFRESH_BEFORE_EXPIRY_MS && !this._isRefreshing) {
      await this._silentRefresh()
    }
  }

  private async _silentRefresh(): Promise<void> {
    if (!this._refreshToken || !this._callbacks || this._isRefreshing) return

    this._isRefreshing = true

    try {
      const result = await authApi.refresh(this._refreshToken)

      if (!result.ok) {
        this.stop()
        this._callbacks.onExpiry('refresh_failed')
        return
      }

      const { token: newToken, refresh_token: newRefreshToken, expires_at } = result.data
      const newExpiresAt = new Date(expires_at)

      this._accessToken = newToken
      this._refreshToken = newRefreshToken
      this._tokenExpiresAt = newExpiresAt

      this._callbacks.onRefresh(newToken, newRefreshToken, newExpiresAt)
    } catch {
      // Network error — don't log out immediately, retry on next check
    } finally {
      this._isRefreshing = false
    }
  }
}

/** Singleton token manager — one instance per browser tab. */
export const tokenManager = new TokenManager()

/** PSD2 inactivity timeout in seconds (for UI countdown display). */
export const INACTIVITY_TIMEOUT_SEC = INACTIVITY_TIMEOUT_MS / 1000
