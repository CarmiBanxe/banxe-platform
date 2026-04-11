interface SkeletonProps {
  className?: string
  height?: string
  width?: string
  'aria-label'?: string
}

export function Skeleton({ className = '', height = '1rem', width = '100%', 'aria-label': label = 'Loading…' }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      style={{ height, width }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm" role="status" aria-label="Loading card…">
      <Skeleton height="0.75rem" width="40%" className="mb-3" />
      <Skeleton height="2rem" width="60%" className="mb-2" />
      <Skeleton height="0.75rem" width="30%" />
    </div>
  )
}
