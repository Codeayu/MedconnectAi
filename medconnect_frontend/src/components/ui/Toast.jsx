import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const colors = {
    success: { bg: '#10B981', border: '#059669' },
    error: { bg: '#EF4444', border: '#DC2626' },
    warning: { bg: '#F59E0B', border: '#D97706' },
    info: { bg: '#3B82F6', border: '#2563EB' }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '500px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      borderLeft: `4px solid ${colors[type].bg}`,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        fontSize: '1.5rem',
        flexShrink: 0
      }}>
        {icons[type]}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          fontSize: '0.95rem',
          color: 'var(--text-primary)',
          lineHeight: 1.5
        }}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.25rem',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: '0.25rem',
          lineHeight: 1
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
