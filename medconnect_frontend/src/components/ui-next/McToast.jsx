/**
 * MedConnect AI — Premium Toast (v2)
 *
 * Visual spec:
 *  - Border-radius: --mc-radius-xl (20 px)
 *  - Shadow:        --mc-shadow-xl
 *  - Left colored bar: 4 px, full height
 *  - Enter:         slideInRight 350 ms ease-out
 *  - Exit:          slideOutRight 200 ms ease-in (auto-dismiss after `duration`)
 *
 * Accessibility:
 *  - role="alert" for errors/warnings, role="status" for info/success
 *  - aria-live="assertive" for errors, "polite" for others
 *  - No emojis — uses SVG icons from the icon system
 */

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from '../ui/icons/Icon'

const iconMap = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}

const colorMap = {
  success: { bar: 'var(--mc-success-500)', bg: 'var(--mc-success-50)', icon: 'var(--mc-success-500)' },
  error:   { bar: 'var(--mc-error-500)',   bg: 'var(--mc-error-50)',   icon: 'var(--mc-error-500)' },
  warning: { bar: 'var(--mc-warning-500)', bg: 'var(--mc-warning-50)', icon: 'var(--mc-warning-500)' },
  info:    { bar: 'var(--mc-info-500)',    bg: 'var(--mc-info-50)',    icon: 'var(--mc-info-500)' },
}

export default function McToast({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onClose, 200)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = colorMap[type] || colorMap.info
  const IconComp = iconMap[type] || Info
  const isUrgent = type === 'error' || type === 'warning'

  const handleClose = () => {
    setExiting(true)
    setTimeout(onClose, 200)
  }

  return (
    <div
      role={isUrgent ? 'alert' : 'status'}
      aria-live={isUrgent ? 'assertive' : 'polite'}
      style={{
        position: 'fixed',
        top: 'var(--mc-space-6)',
        right: 'var(--mc-space-6)',
        zIndex: 'var(--mc-z-toast)',
        minWidth: '320px',
        maxWidth: '480px',
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--mc-bg-card)',
        borderRadius: 'var(--mc-radius-xl)',
        boxShadow: 'var(--mc-shadow-xl)',
        overflow: 'hidden',
        animation: exiting
          ? 'mc-toast-out var(--mc-duration-normal) var(--mc-ease-in) forwards'
          : 'mc-toast-in var(--mc-duration-slow) var(--mc-ease-out) forwards',
      }}
    >
      {/* Color bar */}
      <div style={{
        width: '4px',
        flexShrink: 0,
        background: colors.bar,
      }} />

      {/* Icon area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--mc-space-4)',
        paddingRight: 0,
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--mc-radius-md)',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconComp size={20} color={colors.icon} />
        </div>
      </div>

      {/* Message */}
      <div style={{
        flex: 1,
        padding: 'var(--mc-space-4)',
        fontSize: 'var(--mc-text-sm)',
        fontWeight: 'var(--mc-font-medium)',
        color: 'var(--mc-text-primary)',
        lineHeight: 'var(--mc-leading-normal)',
      }}>
        {message}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Dismiss notification"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          margin: 'var(--mc-space-2)',
          background: 'transparent',
          border: 'none',
          borderRadius: 'var(--mc-radius-sm)',
          cursor: 'pointer',
          color: 'var(--mc-text-muted)',
          transition: `all var(--mc-duration-fast) var(--mc-ease-default)`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--mc-neutral-100)'
          e.currentTarget.style.color = 'var(--mc-text-primary)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--mc-text-muted)'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes mc-toast-in {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mc-toast-out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
