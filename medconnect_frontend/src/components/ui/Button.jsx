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
    sm: { padding: '10px 22px', fontSize: '0.875rem', borderRadius: '12px' },
    md: { padding: '14px 30px', fontSize: '0.95rem', borderRadius: '14px' },
    lg: { padding: '18px 40px', fontSize: '1.05rem', borderRadius: '16px' }
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 30px rgba(37, 99, 235, 0.45), inset 0 1px 0 rgba(255,255,255,0.15)'
        : '0 6px 20px rgba(37, 99, 235, 0.35)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 30px rgba(6, 182, 212, 0.45)'
        : '0 6px 20px rgba(6, 182, 212, 0.35)',
    },
    gradient: {
      background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 35px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
        : '0 8px 25px rgba(37, 99, 235, 0.4)',
    },
    outline: {
      background: isHovered ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
      color: '#2563EB',
      border: '2px solid rgba(37, 99, 235, 0.3)',
      boxShadow: isHovered ? '0 4px 15px rgba(37, 99, 235, 0.1)' : 'none',
    },
    ghost: {
      background: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
      color: '#374151',
      border: 'none',
      boxShadow: 'none',
    },
    white: {
      background: 'white',
      color: '#2563EB',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 30px rgba(0, 0, 0, 0.12)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 30px rgba(239, 68, 68, 0.45)'
        : '0 6px 20px rgba(239, 68, 68, 0.35)',
    },
    success: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      boxShadow: isHovered 
        ? '0 12px 30px rgba(16, 185, 129, 0.45)'
        : '0 6px 20px rgba(16, 185, 129, 0.35)',
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
