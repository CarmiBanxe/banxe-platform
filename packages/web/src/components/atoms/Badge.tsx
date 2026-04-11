type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const styles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#DCFCE7', text: '#16A34A' },
  warning: { bg: '#FEF9C3', text: '#B45309' },
  error:   { bg: '#FEE2E2', text: '#DC2626' },
  info:    { bg: '#DBEAFE', text: '#1D4ED8' },
  neutral: { bg: '#F3F4F6', text: '#6B7280' },
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  'aria-label'?: string
}

export function Badge({ variant = 'neutral', children, 'aria-label': ariaLabel }: BadgeProps) {
  const s = styles[variant]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  )
}
