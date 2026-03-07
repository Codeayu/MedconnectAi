import { useState, useEffect, useRef } from 'react'
import { Sparkles, Check, ChevronDown } from '../ui/icons/Icon'

const THEMES = [
  {
    id: 'default',
    label: 'Clinical Blue',
    className: '',
    colors: ['#3366FF', '#7C3AED', '#06B6D4']
  },
  {
    id: 'sage',
    label: 'Sage Green',
    className: 'theme-sage',
    colors: ['#059669', '#10B981', '#34D399']
  },
  {
    id: 'indigo',
    label: 'Midnight Indigo',
    className: 'theme-indigo',
    colors: ['#6366F1', '#818CF8', '#A78BFA']
  }
]

export default function McThemeSwitcher({ compact = false }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mc-theme') || 'default'
    }
    return 'default'
  })
  const ref = useRef(null)

  // Apply theme on mount and change
  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach(t => {
      if (t.className) root.classList.remove(t.className)
    })
    const theme = THEMES.find(t => t.id === current)
    if (theme?.className) {
      root.classList.add(theme.className)
    }
    localStorage.setItem('mc-theme', current)
  }, [current])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const currentTheme = THEMES.find(t => t.id === current)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch theme"
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? '6px' : '8px',
          padding: compact ? '8px 12px' : '10px 16px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          borderRadius: 'var(--mc-radius-lg, 12px)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          fontSize: compact ? '0.8rem' : '0.85rem',
          fontWeight: 600,
          color: 'var(--mc-neutral-700, #374151)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: open
            ? '0 8px 25px rgba(0, 0, 0, 0.12)'
            : '0 2px 8px rgba(0, 0, 0, 0.04)',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = open
            ? '0 8px 25px rgba(0, 0, 0, 0.12)'
            : '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Color dots preview */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {currentTheme.colors.map((c, i) => (
            <span
              key={i}
              style={{
                width: compact ? '8px' : '10px',
                height: compact ? '8px' : '10px',
                borderRadius: '50%',
                background: c,
                border: '1.5px solid rgba(255,255,255,0.8)',
                boxShadow: `0 1px 3px ${c}40`
              }}
            />
          ))}
        </div>
        {!compact && <span>{currentTheme.label}</span>}
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Theme options"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '220px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--mc-radius-xl, 16px)',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)',
            padding: '8px',
            zIndex: 2000,
            animation: 'fadeInScale 0.2s ease-out'
          }}
        >
          <div style={{
            padding: '8px 12px 10px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--mc-neutral-400, #9CA3AF)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={12} />
            Choose Theme
          </div>
          {THEMES.map(theme => {
            const isActive = theme.id === current
            return (
              <button
                key={theme.id}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setCurrent(theme.id)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  borderRadius: 'var(--mc-radius-md, 10px)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? 'var(--mc-primary-700, #1E40AF)'
                    : 'var(--mc-neutral-700, #374151)',
                  background: isActive
                    ? 'var(--mc-primary-50, #EFF6FF)'
                    : 'transparent',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(243, 244, 246, 0.8)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {/* Color swatch */}
                <div style={{
                  display: 'flex',
                  gap: '3px',
                  padding: '4px 6px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  border: isActive
                    ? `2px solid ${theme.colors[0]}`
                    : '2px solid rgba(229, 231, 235, 0.5)',
                  transition: 'border-color 0.2s ease'
                }}>
                  {theme.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '4px',
                        background: c,
                        boxShadow: `0 1px 3px ${c}30`
                      }}
                    />
                  ))}
                </div>
                <span style={{ flex: 1, textAlign: 'left' }}>{theme.label}</span>
                {isActive && (
                  <Check size={16} color={theme.colors[0]} strokeWidth={2.5} />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Keyframe for dropdown animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
