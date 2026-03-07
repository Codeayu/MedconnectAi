/**
 * MedConnect AI — Premium Card (v2)
 *
 * Visual spec:
 *  - border-radius: --mc-radius-2xl (24 px)
 *  - padding:       default 24 px (--mc-space-6), compact 16 px
 *  - background:    white / glass / gradient
 *  - shadow:        --mc-shadow-sm, lifts to --mc-shadow-lg on hover
 *  - border:        1 px neutral-100 (nearly invisible)
 *  - transition:    all 350 ms ease-default; translateY(-4px) on hover
 *  - glass variant: backdrop-filter blur(16px), 72% white
 *
 * Accessibility:
 *  - Clickable cards get role="button" + tabIndex + keyboard handler
 */

import { useState } from 'react'

export default function McCard({
  children,
  variant = 'default',   // 'default' | 'glass' | 'gradient' | 'outlined'
  hover = false,
  compact = false,
  className = '',
  style = {},
  onClick,
  as: Tag = 'div',
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const isInteractive = !!onClick

  const variants = {
    default: {
      background: 'var(--mc-bg-card)',
      border: '1px solid var(--mc-border-subtle)',
      backdropFilter: 'none',
    },
    glass: {
      background: 'var(--mc-glass-bg)',
      border: '1px solid var(--mc-glass-border)',
      backdropFilter: `blur(var(--mc-glass-blur))`,
      WebkitBackdropFilter: `blur(var(--mc-glass-blur))`,
    },
    gradient: {
      background: 'linear-gradient(135deg, var(--mc-neutral-0) 0%, var(--mc-neutral-50) 100%)',
      border: '1px solid var(--mc-border-subtle)',
      backdropFilter: 'none',
    },
    outlined: {
      background: 'var(--mc-bg-card)',
      border: '1px solid var(--mc-border-default)',
      backdropFilter: 'none',
    },
  }

  const v = variants[variant] || variants.default

  const cardStyle = {
    borderRadius: 'var(--mc-radius-2xl)',
    padding: compact ? 'var(--mc-space-4)' : 'var(--mc-space-6)',
    transition: `all var(--mc-duration-slow) var(--mc-ease-default)`,
    cursor: isInteractive ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isHovered && hover
      ? 'var(--mc-shadow-lg)'
      : 'var(--mc-shadow-sm)',
    transform: isHovered && hover
      ? 'translateY(-4px)'
      : 'translateY(0)',
    ...v,
    ...style,
  }

  const handleKeyDown = (e) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <Tag
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
