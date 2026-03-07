import { useState } from 'react'

export default function Card({ 
  children, 
  hover = false, 
  glass = false,
  gradient = false,
  glow = false,
  className = '',
  onClick,
  padding = '1.75rem',
  style = {},
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyle = {
    background: glass 
      ? 'rgba(255, 255, 255, 0.85)'
      : gradient 
        ? 'linear-gradient(135deg, #ffffff 0%, #F9FAFB 100%)'
        : 'white',
    backdropFilter: glass ? 'blur(24px)' : 'none',
    WebkitBackdropFilter: glass ? 'blur(24px)' : 'none',
    borderRadius: '24px',
    border: glass 
      ? '1px solid rgba(255, 255, 255, 0.5)'
      : '1px solid rgba(0, 0, 0, 0.04)',
    padding: padding,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isHovered && hover
      ? '0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(37, 99, 235, 0.08)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transform: isHovered && hover ? 'translateY(-6px)' : 'translateY(0)',
    ...(glow && isHovered && {
      boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.2), 0 0 40px rgba(37, 99, 235, 0.1)'
    }),
    ...style
  }

  return (
    <div 
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      {...props}
    >
      {/* Gradient overlay on hover */}
      {hover && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          borderRadius: '24px'
        }} />
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
