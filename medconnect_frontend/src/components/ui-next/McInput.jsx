/**
 * MedConnect AI — Premium Input (v2)
 *
 * Visual spec:
 *  - border-radius: --mc-radius-lg (16 px)
 *  - padding:       16 px vertical, 20 px horizontal (48 px icon spacing)
 *  - bg at rest:    --mc-neutral-50 (sunken look)
 *  - bg on focus:   white with 2 px primary border + 4 px focus ring
 *  - label:         --mc-font-medium, --mc-text-sm, 6 px bottom margin
 *  - error:         error-500 border, error text below
 *  - transition:    all 200 ms ease-default
 *
 * Accessibility:
 *  - <label> programmatically associated via htmlFor / id
 *  - aria-invalid on error
 *  - aria-describedby links to error message
 */

import { useState, useId } from 'react'
import { CheckCircle, XCircle } from '../ui/icons/Icon'

export default function McInput({
  label,
  error,
  success,
  hint,
  icon: IconComponent,
  className = '',
  style = {},
  id: externalId,
  required,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const autoId = useId()
  const inputId = externalId || autoId
  const errorId = `${inputId}-error`
  const hintId  = `${inputId}-hint`

  const hasIcon = !!IconComponent

  const wrapperStyle = {
    marginBottom: 'var(--mc-space-5)',
    ...style,
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 'var(--mc-space-2)',
    fontWeight: 'var(--mc-font-medium)',
    fontSize: 'var(--mc-text-sm)',
    color: 'var(--mc-text-primary)',
    letterSpacing: 'var(--mc-tracking-normal)',
  }

  const inputStyle = {
    width: '100%',
    padding: hasIcon
      ? 'var(--mc-space-4) var(--mc-space-5) var(--mc-space-4) 48px'
      : 'var(--mc-space-4) var(--mc-space-5)',
    fontSize: 'var(--mc-text-base)',
    fontFamily: 'var(--mc-font-sans)',
    fontWeight: 'var(--mc-font-regular)',
    lineHeight: 'var(--mc-leading-normal)',
    color: 'var(--mc-text-primary)',
    background: isFocused || isHovered
      ? 'var(--mc-neutral-0)'
      : 'var(--mc-neutral-50)',
    border: error
      ? '2px solid var(--mc-error-500)'
      : success
        ? '2px solid var(--mc-success-500)'
        : isFocused
          ? '2px solid var(--mc-primary-500)'
          : '2px solid transparent',
    borderRadius: 'var(--mc-radius-lg)',
    outline: 'none',
    boxShadow: isFocused
      ? '0 0 0 4px var(--mc-primary-100)'
      : isHovered
        ? 'var(--mc-shadow-sm)'
        : 'var(--mc-shadow-xs)',
    transition: `all var(--mc-duration-normal) var(--mc-ease-default)`,
  }

  const iconWrapperStyle = {
    position: 'absolute',
    left: 'var(--mc-space-4)',
    top: '50%',
    transform: 'translateY(-50%)',
    color: isFocused ? 'var(--mc-primary-500)' : 'var(--mc-text-muted)',
    transition: `color var(--mc-duration-normal) var(--mc-ease-default)`,
    display: 'flex',
    pointerEvents: 'none',
  }

  const trailingIconStyle = {
    position: 'absolute',
    right: 'var(--mc-space-4)',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
  }

  const helperStyle = (isError) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--mc-space-1)',
    marginTop: 'var(--mc-space-2)',
    fontSize: 'var(--mc-text-xs)',
    fontWeight: 'var(--mc-font-medium)',
    color: isError ? 'var(--mc-error-500)' : 'var(--mc-text-muted)',
  })

  return (
    <div className={className} style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: 'var(--mc-error-500)', marginLeft: '2px' }} aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {hasIcon && (
          <span style={iconWrapperStyle} aria-hidden="true">
            <IconComponent size={20} />
          </span>
        )}

        <input
          id={inputId}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          aria-required={required}
          {...rest}
        />

        {/* Trailing validation icon */}
        {(success || error) && (
          <span style={trailingIconStyle} aria-hidden="true">
            {success
              ? <CheckCircle size={18} color="var(--mc-success-500)" />
              : <XCircle size={18} color="var(--mc-error-500)" />}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" style={helperStyle(true)}>
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} style={helperStyle(false)}>
          {hint}
        </p>
      )}
    </div>
  )
}
