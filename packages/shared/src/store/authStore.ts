import { create } from 'zustand'
import type { AuthUser, TokenResponse } from '../types/auth.js'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setAuth: (user: AuthUser, tokenData: TokenResponse) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAuth: (user, tokenData) =>
    set({
      user,
      token: tokenData.access_token,
      isAuthenticated: true,
      error: null,
      isLoading: false,
    }),

  clearAuth: () =>
    set({ user: null, token: null, isAuthenticated: false, error: null }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
