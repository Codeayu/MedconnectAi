import { useState } from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  disabled, 
  className = '',
  icon,
  loading = false,
  glow = false,
  style = {},
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const sizes = {
    sm: { padding: '10px 20px', fontSize: '0.875rem', borderRadius: '10px' },
    md: { padding: '14px 28px', fontSize: '0.95rem', borderRadius: '12px' },
    lg: { padding: '18px 36px', fontSize: '1.05rem', borderRadius: '14px' }
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(0, 102, 204, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
        : '0 4px 15px rgba(0, 102, 204, 0.3)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #00BFA5 0%, #00A391 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(0, 191, 165, 0.4)'
        : '0 4px 15px rgba(0, 191, 165, 0.3)',
    },
    gradient: {
      background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 8px 30px rgba(0, 102, 204, 0.45)'
        : '0 4px 20px rgba(0, 102, 204, 0.35)',
    },
    outline: {
      background: isHovered ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
      color: '#0066CC',
      border: '2px solid #0066CC',
      boxShadow: 'none',
    },
    ghost: {
      background: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
      color: 'var(--text-primary)',
      border: 'none',
      boxShadow: 'none',
    },
    white: {
      background: 'white',
      color: '#0066CC',
      border: 'none',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(0, 0, 0, 0.15)'
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    danger: {
      background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(220, 38, 38, 0.4)'
        : '0 4px 15px rgba(220, 38, 38, 0.3)',
    }
  }

  const currentSize = sizes[size] || sizes.md
  const currentVariant = variants[variant] || variants.primary

  const buttonStyle = {
    ...currentSize,
    ...currentVariant,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
    position: 'relative',
    overflow: 'hidden',
    ...(glow && {
      animation: 'pulse-glow 2s infinite'
    }),
    ...style
  }

  return (
    <button 
      style={buttonStyle}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={className}
      {...props}
    >
      {loading ? (
        <>
          <span style={{
            width: '18px',
            height: '18px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          Loading...
        </>
      ) : (
        <>
          {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
