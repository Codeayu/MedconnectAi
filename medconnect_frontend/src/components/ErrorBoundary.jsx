import { Component } from 'react'
import McButton from './ui-next/McButton'
import McCard from './ui-next/McCard'
import { AlertCircle } from './ui/icons/Icon'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
          padding: '2rem'
        }}>
          <McCard style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.15)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertCircle size={32} color="#EF4444" />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Something went wrong
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: '#6B7280',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              An unexpected error occurred. Please try again or go back to the dashboard.
            </p>

            {this.state.error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  color: '#991B1B',
                  margin: 0,
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <McButton
                variant="outline"
                onClick={this.handleReset}
                style={{ borderRadius: '12px', padding: '12px 24px' }}
              >
                Try Again
              </McButton>
              <McButton
                variant="primary"
                onClick={() => {
                  this.handleReset()
                  window.location.reload()
                }}
                style={{ borderRadius: '12px', padding: '12px 24px' }}
              >
                Reload Page
              </McButton>
            </div>
          </McCard>
        </div>
      )
    }

    return this.props.children
  }
}
