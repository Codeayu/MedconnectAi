/**
 * MedConnect AI — Premium Button (v2)
 *
 * Visual spec:
 *  - border-radius: --mc-radius-lg (16 px)
 *  - padding:       sm 10/20  |  md 14/28  |  lg 18/36
 *  - font:          --mc-font-semibold, --mc-text-sm / base
 *  - shadow:        --mc-shadow-sm → md on hover
 *  - transition:    200 ms ease-default, scale 120 ms ease-spring on press
 *
 * Accessibility:
 *  - Meets WCAG AA contrast on every variant
 *  - role="button" when rendered as non-<button>
 *  - Disabled state announced via aria-disabled
 *  - Loading spinner wrapped in aria-live="polite"
 */

import { useState } from 'react'
import { Loader } from '../ui/icons/Icon'

const sizeMap = {
  sm: {
    padding: 'var(--mc-space-3) var(--mc-space-5)',
    fontSize: 'var(--mc-text-sm)',
    borderRadius: 'var(--mc-radius-md)',
    gap: 'var(--mc-space-2)',
    iconSize: 16,
  },
  md: {
    padding: 'var(--mc-space-4) var(--mc-space-6)',
    fontSize: 'var(--mc-text-sm)',
    borderRadius: 'var(--mc-radius-lg)',
    gap: 'var(--mc-space-2)',
    iconSize: 18,
  },
  lg: {
    padding: 'var(--mc-space-5) var(--mc-space-8)',
    fontSize: 'var(--mc-text-base)',
    borderRadius: 'var(--mc-radius-lg)',
    gap: 'var(--mc-space-3)',
    iconSize: 20,
  },
}

const variantStyles = (isHovered, isPressed) => ({
  primary: {
    background: 'var(--mc-primary-500)',
    color: 'var(--mc-neutral-0)',
    border: 'none',
    boxShadow: isHovered
      ? 'var(--mc-shadow-md), var(--mc-shadow-primary)'
      : 'var(--mc-shadow-sm)',
  },
  secondary: {
    background: 'var(--mc-neutral-0)',
    color: 'var(--mc-primary-500)',
    border: '1.5px solid var(--mc-primary-200)',
    boxShadow: isHovered ? 'var(--mc-shadow-md)' : 'var(--mc-shadow-xs)',
  },
  ghost: {
    background: isHovered ? 'var(--mc-neutral-100)' : 'transparent',
    color: 'var(--mc-neutral-700)',
    border: 'none',
    boxShadow: 'none',
  },
  outline: {
    background: isHovered ? 'var(--mc-primary-50)' : 'transparent',
    color: 'var(--mc-primary-600)',
    border: '1.5px solid var(--mc-border-default)',
    boxShadow: isHovered ? 'var(--mc-shadow-sm)' : 'none',
  },
  danger: {
    background: 'var(--mc-error-500)',
    color: 'var(--mc-neutral-0)',
    border: 'none',
    boxShadow: isHovered ? 'var(--mc-shadow-md), var(--mc-shadow-error)' : 'var(--mc-shadow-sm)',
  },
  success: {
    background: 'var(--mc-success-500)',
    color: 'var(--mc-neutral-0)',
    border: 'none',
    boxShadow: isHovered ? 'var(--mc-shadow-md), var(--mc-shadow-success)' : 'var(--mc-shadow-sm)',
  },
})

export default function McButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: IconComponent,
  iconRight: IconRightComponent,
  loading = false,
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const sz = sizeMap[size] || sizeMap.md
  const vs = variantStyles(isHovered, isPressed)[variant] || variantStyles(isHovered, isPressed).primary

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sz.gap,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontFamily: 'var(--mc-font-sans)',
    fontWeight: 'var(--mc-font-semibold)',
    lineHeight: 'var(--mc-leading-tight)',
    letterSpacing: 'var(--mc-tracking-normal)',
    borderRadius: sz.borderRadius,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: `all var(--mc-duration-normal) var(--mc-ease-default)`,
    transform: isPressed && !disabled
      ? 'scale(0.97)'
      : isHovered && !disabled
        ? 'translateY(-1px)'
        : 'translateY(0)',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    ...vs,
    ...style,
  }

  return (
    <button
      type={type}
      style={baseStyle}
      className={`mc-btn ${className}`.trim()}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...rest}
    >
      {loading ? (
        <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: sz.gap }}>
          <Loader
            size={sz.iconSize}
            style={{ animation: 'mc-spin 0.8s linear infinite' }}
          />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {IconComponent && <IconComponent size={sz.iconSize} aria-hidden="true" />}
          {children}
          {IconRightComponent && <IconRightComponent size={sz.iconSize} aria-hidden="true" />}
        </>
      )}

      {/* Keyframe for spinner — injected once */}
      <style>{`
        @keyframes mc-spin { to { transform: rotate(360deg) } }
      `}</style>
    </button>
  )
}
