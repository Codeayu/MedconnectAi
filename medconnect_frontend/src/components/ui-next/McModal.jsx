/**
 * MedConnect AI — Premium Modal (v2)
 *
 * Visual spec:
 *  - Overlay:      bg-overlay 55% dark + 20 px blur
 *  - Panel:        white, radius-3xl (32 px), shadow-2xl, max-w 520 px
 *  - Close btn:    top-right, ghost circle 36 px with X icon
 *  - Enter anim:   opacity 0→1 + scale(0.96)→(1), 350 ms ease-out
 *  - Exit anim:    reverse 200 ms ease-in
 *
 * Accessibility:
 *  - Traps focus inside the modal while open
 *  - role="dialog" + aria-modal="true"
 *  - aria-labelledby → title element
 *  - Close on Escape
 *  - Returns focus to trigger element on close
 */

import { useEffect, useRef, useCallback } from 'react'
import { X } from '../ui/icons/Icon'

export default function McModal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',         // 'sm' | 'md' | 'lg'
  className = '',
  ...rest
}) {
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)
  const triggerRef = useRef(null)

  const sizes = {
    sm: '400px',
    md: '520px',
    lg: '680px',
  }

  // Remember last focused element to restore later
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    // Focus first focusable element
    const focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length) focusable[0].focus()

    function handleTab(e) {
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    panel.addEventListener('keydown', handleTab)
    return () => panel.removeEventListener('keydown', handleTab)
  }, [open])

  // Escape to close
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      // Restore focus
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--mc-z-modal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--mc-space-6)',
    background: 'var(--mc-bg-overlay)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: 'mc-modal-overlay-in var(--mc-duration-slow) var(--mc-ease-out) forwards',
  }

  const panelStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: sizes[size] || sizes.md,
    maxHeight: 'calc(100vh - 3rem)',
    background: 'var(--mc-bg-card)',
    borderRadius: 'var(--mc-radius-3xl)',
    boxShadow: 'var(--mc-shadow-2xl)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'mc-modal-panel-in var(--mc-duration-slow) var(--mc-ease-out) forwards',
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--mc-space-6) var(--mc-space-6) var(--mc-space-4)',
  }

  const titleStyle = {
    fontSize: 'var(--mc-text-xl)',
    fontWeight: 'var(--mc-font-semibold)',
    color: 'var(--mc-text-primary)',
    margin: 0,
  }

  const closeBtnStyle = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'var(--mc-neutral-100)',
    borderRadius: 'var(--mc-radius-full)',
    cursor: 'pointer',
    color: 'var(--mc-text-secondary)',
    transition: `all var(--mc-duration-fast) var(--mc-ease-default)`,
    flexShrink: 0,
  }

  const bodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '0 var(--mc-space-6) var(--mc-space-6)',
    fontSize: 'var(--mc-text-base)',
    color: 'var(--mc-text-secondary)',
    lineHeight: 'var(--mc-leading-relaxed)',
  }

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--mc-space-3)',
    padding: 'var(--mc-space-4) var(--mc-space-6)',
    borderTop: '1px solid var(--mc-border-subtle)',
    background: 'var(--mc-neutral-25)',
  }

  return (
    <div
      ref={overlayRef}
      style={overlayStyle}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="presentation"
    >
      <div
        ref={panelRef}
        style={panelStyle}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mc-modal-title"
        {...rest}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2 id="mc-modal-title" style={titleStyle}>{title}</h2>
          <button
            style={closeBtnStyle}
            onClick={onClose}
            aria-label="Close dialog"
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--mc-neutral-200)'
              e.currentTarget.style.color = 'var(--mc-text-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--mc-neutral-100)'
              e.currentTarget.style.color = 'var(--mc-text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {children}
        </div>

        {/* Footer */}
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes mc-modal-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mc-modal-panel-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
