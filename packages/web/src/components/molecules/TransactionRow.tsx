import type { Transaction } from '@banxe/shared'

interface TransactionRowProps {
  tx: Transaction
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const isDebit = tx.type === 'DEBIT'
  const statusColor = { SETTLED: '#16A34A', FAILED: '#DC2626', PENDING: '#F59E0B', REVERSED: '#6B7280', CANCELLED: '#9CA3AF' }[tx.status] ?? '#6B7280'

  return (
    <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors" role="listitem">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: isDebit ? '#FEF2F2' : '#DCFCE7', color: isDebit ? '#DC2626' : '#16A34A' }}
          aria-hidden="true"
        >
          {isDebit ? '↑' : '↓'}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
            {tx.description || tx.counterparty_name || 'Payment'}
          </p>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            {new Date(tx.created_at).toLocaleDateString('en-GB')} · {tx.rail}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold" style={{ color: isDebit ? '#DC2626' : '#16A34A' }}>
          {isDebit ? '-' : '+'}{tx.currency} {tx.amount}
        </p>
        <p className="text-xs" style={{ color: statusColor }}>{tx.status}</p>
      </div>
    </li>
  )
}
