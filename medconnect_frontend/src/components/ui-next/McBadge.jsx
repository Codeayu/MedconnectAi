/**
 * McBadge — Compact status indicator / label chip.
 * Pairs beautifully with McCard and McButton.
 *
 * Variants: default | success | warning | danger | info | neutral
 * Sizes: sm | md
 */
export default function McBadge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  pill = true,
  glow = false,
  dot = false,
  style: extraStyle,
  ...rest
}) {
  const VARIANT_STYLES = {
    default: {
      bg: 'var(--mc-primary-50, #EFF6FF)',
      color: 'var(--mc-primary-700, #1D4ED8)',
      border: 'var(--mc-primary-100, #DBEAFE)',
      glowColor: 'var(--mc-primary-500, #3366FF)'
    },
    success: {
      bg: '#F0FDF4',
      color: '#15803D',
      border: '#BBF7D0',
      glowColor: '#22C55E'
    },
    warning: {
      bg: '#FFFBEB',
      color: '#A16207',
      border: '#FDE68A',
      glowColor: '#F59E0B'
    },
    danger: {
      bg: '#FEF2F2',
      color: '#B91C1C',
      border: '#FECACA',
      glowColor: '#EF4444'
    },
    info: {
      bg: '#F0F9FF',
      color: '#0369A1',
      border: '#BAE6FD',
      glowColor: '#0EA5E9'
    },
    neutral: {
      bg: 'var(--mc-neutral-100, #F3F4F6)',
      color: 'var(--mc-neutral-600, #4B5563)',
      border: 'var(--mc-neutral-200, #E5E7EB)',
      glowColor: 'var(--mc-neutral-400, #9CA3AF)'
    }
  }

  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const isSmall = size === 'sm'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '6px',
        padding: isSmall ? '2px 8px' : '4px 12px',
        fontSize: isSmall ? '0.7rem' : '0.78rem',
        fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        letterSpacing: '0.01em',
        lineHeight: 1.4,
        borderRadius: pill ? '9999px' : 'var(--mc-radius-sm, 6px)',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        boxShadow: glow ? `0 0 12px ${v.glowColor}25` : 'none',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        ...extraStyle
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: isSmall ? '5px' : '6px',
            height: isSmall ? '5px' : '6px',
            borderRadius: '50%',
            background: v.color,
            flexShrink: 0
          }}
        />
      )}
      {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      {children}
    </span>
  )
}
