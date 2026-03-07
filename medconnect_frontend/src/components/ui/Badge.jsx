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
    sm: { padding: '5px 12px', fontSize: '0.7rem' },
    md: { padding: '7px 16px', fontSize: '0.8rem' },
    lg: { padding: '10px 22px', fontSize: '0.875rem' }
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%)',
      color: '#2563EB',
      border: '1px solid rgba(37, 99, 235, 0.15)'
    },
    secondary: {
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
      color: '#0891B2',
      border: '1px solid rgba(6, 182, 212, 0.15)'
    },
    success: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
      color: '#059669',
      border: '1px solid rgba(16, 185, 129, 0.15)'
    },
    warning: {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
      color: '#D97706',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    error: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)',
      color: '#DC2626',
      border: '1px solid rgba(239, 68, 68, 0.15)'
    },
    gradient: {
      background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
      color: 'white',
      border: 'none'
    },
    purple: {
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
      color: '#7C3AED',
      border: '1px solid rgba(124, 58, 237, 0.15)'
    },
    dark: {
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      color: 'white',
      border: 'none'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.25)'
    }
  }

  const currentSize = sizes[size] || sizes.md
  const currentVariant = variants[variant] || variants.primary

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    ...currentSize,
    ...currentVariant,
    borderRadius: pill ? '100px' : '10px',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...(glow && {
      boxShadow: `0 4px 20px ${currentVariant.color}30`
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
