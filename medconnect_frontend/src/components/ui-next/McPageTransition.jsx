import { useState, useEffect } from 'react'

/**
 * Wraps page content with a fade+slide entrance animation.
 * Triggers on mount (or when `pageKey` changes).
 * Includes a safety timeout to guarantee visibility even if rAF is blocked.
 */
export default function McPageTransition({ children, pageKey, duration = 300 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)

    // Use double-rAF for smooth transition start
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })

    // Safety net: guarantee visibility after a short delay
    const timer = setTimeout(() => setVisible(true), 50)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pageKey])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'opacity, transform',
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      {children}
    </div>
  )
}
