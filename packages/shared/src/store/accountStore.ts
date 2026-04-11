import { create } from 'zustand'
import type { Account, Balance } from '../types/account.js'

interface AccountState {
  accounts: Account[]
  balances: Record<string, Balance>
  selectedAccountId: string | null
  isLoading: boolean
  setAccounts: (accounts: Account[]) => void
  setBalance: (accountId: string, balance: Balance) => void
  selectAccount: (accountId: string) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  balances: {},
  selectedAccountId: null,
  isLoading: false,

  setAccounts: (accounts) =>
    set({ accounts, selectedAccountId: accounts[0]?.account_id ?? null }),

  setBalance: (accountId, balance) =>
    set((s) => ({ balances: { ...s.balances, [accountId]: balance } })),

  selectAccount: (selectedAccountId) => set({ selectedAccountId }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set({ accounts: [], balances: {}, selectedAccountId: null }),
}))
