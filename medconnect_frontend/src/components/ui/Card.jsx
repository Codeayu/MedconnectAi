import { useState } from 'react'

export default function Card({ 
  children, 
  hover = false, 
  glass = false,
  gradient = false,
  glow = false,
  className = '',
  onClick,
  padding = '1.5rem',
  style = {},
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyle = {
    background: glass 
      ? 'rgba(255, 255, 255, 0.8)'
      : gradient 
        ? 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)'
        : 'white',
    backdropFilter: glass ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: glass ? 'blur(20px)' : 'none',
    borderRadius: '20px',
    border: glass 
      ? '1px solid rgba(255, 255, 255, 0.4)'
      : '1px solid rgba(0, 0, 0, 0.06)',
    padding: padding,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isHovered && hover
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 102, 204, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    transform: isHovered && hover ? 'translateY(-8px)' : 'translateY(0)',
    ...(glow && isHovered && {
      boxShadow: '0 25px 50px -12px rgba(0, 102, 204, 0.25), 0 0 30px rgba(0, 102, 204, 0.15)'
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
          background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.03) 0%, rgba(0, 191, 165, 0.03) 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          borderRadius: '20px'
        }} />
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
