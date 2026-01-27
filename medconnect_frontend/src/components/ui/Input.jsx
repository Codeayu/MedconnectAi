import { useState } from 'react'

export default function Input({ 
  label, 
  error, 
  success,
  icon,
  className = '',
  style = {},
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const inputStyle = {
    width: '100%',
    padding: icon ? '16px 16px 16px 50px' : '16px 20px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: isHovered || isFocused ? 'white' : '#f8fafb',
    border: error 
      ? '2px solid #DC2626'
      : success 
        ? '2px solid #00C853'
        : isFocused 
          ? '2px solid #0066CC' 
          : '2px solid transparent',
    borderRadius: '14px',
    color: 'var(--text-primary)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isFocused 
      ? '0 0 0 4px rgba(0, 102, 204, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)'
      : isHovered 
        ? '0 4px 12px rgba(0, 0, 0, 0.06)'
        : '0 2px 4px rgba(0, 0, 0, 0.02)',
    outline: 'none',
    ...style
  }

  return (
    <div className={className} style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.6rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          letterSpacing: '0.01em'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? '#0066CC' : 'var(--text-muted)',
            fontSize: '1.2rem',
            transition: 'color 0.3s ease',
            zIndex: 1
          }}>
            {icon}
          </span>
        )}
        <input 
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props} 
        />
        
        {/* Success/Error Icon */}
        {(success || error) && (
          <span style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem'
          }}>
            {success ? String.fromCodePoint(0x2705) : String.fromCodePoint(0x274C)}
          </span>
        )}
      </div>
      
      {error && (
        <span style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '0.5rem',
          fontSize: '0.85rem',
          color: '#DC2626',
          fontWeight: 500
        }}>
          {error}
        </span>
      )}
      
      {success && typeof success === 'string' && (
        <span style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '0.5rem',
          fontSize: '0.85rem',
          color: '#00C853',
          fontWeight: 500
        }}>
          {success}
        </span>
      )}
    </div>
  )
}
