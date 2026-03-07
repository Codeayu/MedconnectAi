import McCard from './McCard'

/**
 * McStat — Stat card with icon, value, label, and optional trend indicator.
 * Perfect for dashboard summary tiles.
 */
export default function McStat({
  icon,
  iconBg = 'var(--mc-primary-50, #EFF6FF)',
  iconColor = 'var(--mc-primary-500, #3366FF)',
  value,
  label,
  trend,
  trendUp,
  suffix,
  variant = 'default',
  onClick,
  style: extraStyle,
  ...rest
}) {
  return (
    <McCard
      variant={variant}
      hover
      onClick={onClick}
      style={{
        padding: '1.25rem 1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        ...extraStyle
      }}
      {...rest}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--mc-neutral-500, #6B7280)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 8px 0',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
          }}>
            {label}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--mc-neutral-900, #111827)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {value}
            </span>
            {suffix && (
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--mc-neutral-400, #9CA3AF)'
              }}>
                {suffix}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: trendUp ? 'var(--mc-semantic-success, #22C55E)' : 'var(--mc-semantic-error, #EF4444)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: trendUp ? 'rotate(0)' : 'rotate(180deg)' }}
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              {trend}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--mc-radius-lg, 12px)',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
            boxShadow: `0 4px 12px ${iconColor}15`
          }}>
            {icon}
          </div>
        )}
      </div>
    </McCard>
  )
}
