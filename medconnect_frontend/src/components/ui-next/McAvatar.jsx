/**
 * McAvatar — User avatar with fallback initials.
 * Supports image, initials, gradient backgrounds, and online indicator.
 *
 * Sizes: xs(24) | sm(32) | md(40) | lg(48) | xl(56)
 */
export default function McAvatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  variant = 'gradient',
  online,
  style: extraStyle,
  ...rest
}) {
  const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 }
  const FONT = { xs: '0.6rem', sm: '0.75rem', md: '0.875rem', lg: '1rem', xl: '1.2rem' }

  const px = SIZES[size] || SIZES.md
  const fontSize = FONT[size] || FONT.md

  const getInitials = () => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent gradient from the name
  const getGradient = () => {
    if (!name) return 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
    const GRADIENTS = [
      'linear-gradient(135deg, #3366FF 0%, #7C3AED 100%)',
      'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
      'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      'linear-gradient(135deg, #F43F5E 0%, #FB923C 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      'linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${px}px`,
        height: `${px}px`,
        flexShrink: 0,
        ...extraStyle
      }}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: variant === 'gradient' ? getGradient() : 'var(--mc-neutral-200, #E5E7EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            fontWeight: 700,
            color: variant === 'gradient' ? 'white' : 'var(--mc-neutral-600, #4B5563)',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            letterSpacing: '0.02em',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            userSelect: 'none'
          }}
          aria-label={alt || name || 'Avatar'}
        >
          {getInitials()}
        </div>
      )}

      {/* Online indicator */}
      {online !== undefined && (
        <span
          style={{
            position: 'absolute',
            bottom: size === 'xs' ? '-1px' : '0',
            right: size === 'xs' ? '-1px' : '0',
            width: px > 32 ? '12px' : '8px',
            height: px > 32 ? '12px' : '8px',
            borderRadius: '50%',
            background: online
              ? 'var(--mc-semantic-success, #22C55E)'
              : 'var(--mc-neutral-300, #D1D5DB)',
            border: `2px solid white`,
            boxShadow: online ? '0 0 8px rgba(34, 197, 94, 0.4)' : 'none'
          }}
        />
      )}
    </div>
  )
}
