/**
 * MedConnect AI — Premium Search Bar (v2)
 *
 * Visual spec:
 *  - Radius: --mc-radius-full (pill shape)
 *  - Height: 48 px, icon left, clear button right
 *  - Glass variant with subtle blur backdrop
 *  - Focus ring: 4 px primary-100
 *
 * Accessibility:
 *  - role="search" on wrapper, aria-label on input
 *  - Clear button with aria-label
 *  - Keyboard: Escape clears and blurs
 */

import { useState, useRef } from 'react'
import { Search, X } from '../ui/icons/Icon'

export default function McSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  glass = false,
  className = '',
  style = {},
  ariaLabel = 'Search',
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
    if (e.key === 'Escape') {
      onChange('')
      inputRef.current?.blur()
    }
  }

  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    borderRadius: 'var(--mc-radius-full)',
    background: glass ? 'var(--mc-glass-bg)' : 'var(--mc-neutral-50)',
    backdropFilter: glass ? `blur(var(--mc-glass-blur))` : 'none',
    WebkitBackdropFilter: glass ? `blur(var(--mc-glass-blur))` : 'none',
    border: isFocused
      ? '2px solid var(--mc-primary-500)'
      : glass
        ? '1px solid var(--mc-glass-border)'
        : '2px solid transparent',
    boxShadow: isFocused
      ? '0 0 0 4px var(--mc-primary-100)'
      : 'var(--mc-shadow-xs)',
    transition: `all var(--mc-duration-normal) var(--mc-ease-default)`,
    ...style,
  }

  const inputStyle = {
    flex: 1,
    height: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '0 var(--mc-space-3)',
    fontSize: 'var(--mc-text-sm)',
    fontFamily: 'var(--mc-font-sans)',
    color: 'var(--mc-text-primary)',
  }

  const iconBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: 'var(--mc-radius-full)',
    color: 'var(--mc-text-muted)',
    transition: `all var(--mc-duration-fast) var(--mc-ease-default)`,
    flexShrink: 0,
  }

  return (
    <div
      role="search"
      className={className}
      style={containerStyle}
    >
      <span style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 'var(--mc-space-4)',
        color: isFocused ? 'var(--mc-primary-500)' : 'var(--mc-text-muted)',
        transition: `color var(--mc-duration-normal) var(--mc-ease-default)`,
      }}>
        <Search size={18} />
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        style={inputStyle}
        {...rest}
      />

      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          style={{ ...iconBtnStyle, marginRight: 'var(--mc-space-2)' }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
