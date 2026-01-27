export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  pill = true,
  glow = false,
  className = '',
  style = {}
}) {
  const sizes = {
    sm: { padding: '4px 10px', fontSize: '0.7rem' },
    md: { padding: '6px 14px', fontSize: '0.8rem' },
    lg: { padding: '8px 18px', fontSize: '0.9rem' }
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.1) 100%)',
      color: '#0066CC',
      border: '1px solid rgba(0, 102, 204, 0.2)'
    },
    secondary: {
      background: 'linear-gradient(135deg, rgba(0, 191, 165, 0.15) 0%, rgba(0, 191, 165, 0.1) 100%)',
      color: '#00A391',
      border: '1px solid rgba(0, 191, 165, 0.2)'
    },
    success: {
      background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.15) 0%, rgba(0, 200, 83, 0.1) 100%)',
      color: '#00A854',
      border: '1px solid rgba(0, 200, 83, 0.2)'
    },
    warning: {
      background: 'linear-gradient(135deg, rgba(255, 179, 0, 0.15) 0%, rgba(255, 179, 0, 0.1) 100%)',
      color: '#CC8F00',
      border: '1px solid rgba(255, 179, 0, 0.25)'
    },
    error: {
      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
      color: '#DC2626',
      border: '1px solid rgba(220, 38, 38, 0.2)'
    },
    gradient: {
      background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
      color: 'white',
      border: 'none'
    },
    dark: {
      background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
      color: 'white',
      border: 'none'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }
  }

  const currentSize = sizes[size] || sizes.md
  const currentVariant = variants[variant] || variants.primary

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...currentSize,
    ...currentVariant,
    borderRadius: pill ? '50px' : '8px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    ...(glow && {
      boxShadow: `0 0 20px ${currentVariant.color}40`
    }),
    ...style
  }

  return (
    <span style={badgeStyle} className={className}>
      {icon && <span style={{ fontSize: '1em' }}>{icon}</span>}
      {children}
    </span>
  )
}
