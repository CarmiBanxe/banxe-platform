import { create } from 'zustand'
import type { Transaction } from '../types/account.js'

interface TransactionState {
  transactions: Transaction[]
  total: number
  page: number
  isLoading: boolean
  filter: { accountId?: string; status?: string }
  setTransactions: (txns: Transaction[], total: number) => void
  setPage: (page: number) => void
  setFilter: (filter: Partial<TransactionState['filter']>) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  total: 0,
  page: 1,
  isLoading: false,
  filter: {},

  setTransactions: (transactions, total) => set({ transactions, total }),

  setPage: (page) => set({ page }),

  setFilter: (filter) =>
    set((s) => ({ filter: { ...s.filter, ...filter }, page: 1 })),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set({ transactions: [], total: 0, page: 1, filter: {} }),
}))
