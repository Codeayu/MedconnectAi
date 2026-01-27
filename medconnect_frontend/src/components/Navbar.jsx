import { useState } from 'react'
import Button from './ui/Button'
import { isAuthenticated, logout, getUserName, getEmail, getUserRole } from '../auth'

export default function Navbar({ onNavigate, currentPage }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const authenticated = isAuthenticated()
  const userName = getUserName()
  const userEmail = getEmail()
  const userRole = getUserRole()
  
  function handleLogout() {
    logout()
    setShowDropdown(false)
    onNavigate('landing')
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!userName) return '?'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0.75rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
          onClick={() => onNavigate(authenticated ? 'dashboard' : 'landing')}
        >
          <div style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 14px rgba(0, 102, 204, 0.35)',
            color: 'white'
          }}>
            🏥
          </div>
          <div>
            <h3 style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Poppins, sans-serif'
            }}>
              MedConnect AI
            </h3>
            <p style={{
              fontSize: '0.7rem',
              margin: 0,
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}>
              Smart Healthcare Platform
            </p>
          </div>
        </div>
        
        {/* Center Navigation - Only show when authenticated */}
        {authenticated && currentPage === 'dashboard' && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--gray-100)',
            padding: '4px',
            borderRadius: '10px'
          }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'checker', label: 'Symptoms', icon: '🔍' },
              { id: 'consultations', label: 'History', icon: '📋' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  background: currentPage === item.id ? 'white' : 'transparent',
                  color: currentPage === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: currentPage === item.id ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right Side - Auth Controls */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          {authenticated ? (
            <>
              {/* Notifications */}
              <button style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                position: 'relative',
                transition: 'all 0.2s'
              }}>
                🔔
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  background: '#FF6B35',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              </button>

              {/* User Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px 6px 6px',
                    border: '1px solid var(--border)',
                    borderRadius: '50px',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: showDropdown ? 'var(--shadow-md)' : 'none'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {getInitials()}
                  </div>
                  
                  {/* Name & Role */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {userName}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize'
                    }}>
                      {userRole?.toLowerCase() || 'Patient'}
                    </div>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    transition: 'transform 0.2s',
                    transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      onClick={() => setShowDropdown(false)}
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 998
                      }}
                    />
                    
                    {/* Menu */}
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '260px',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      zIndex: 999,
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      {/* User Info Header */}
                      <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        background: 'linear-gradient(135deg, #f8fafb 0%, #fff 100%)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }}>
                            {getInitials()}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              marginBottom: '2px'
                            }}>
                              {userName}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)'
                            }}>
                              {userEmail}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '8px' }}>
                        {[
                          { icon: '👤', label: 'My Profile', action: () => { onNavigate('profile'); setShowDropdown(false) } },
                          { icon: '📋', label: 'My Consultations', action: () => { onNavigate('consultations'); setShowDropdown(false) } },
                          { icon: '⚙️', label: 'Settings', action: () => { onNavigate('settings'); setShowDropdown(false) } },
                          { icon: '❓', label: 'Help & Support', action: () => {} }
                        ].map((item, i) => (
                          <button
                            key={i}
                            onClick={item.action}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              border: 'none',
                              borderRadius: '10px',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              color: 'var(--text-primary)',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.background = 'var(--gray-100)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                          >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Logout */}
                      <div style={{
                        padding: '8px',
                        borderTop: '1px solid var(--border)'
                      }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '10px',
                            background: '#FEE2E2',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#DC2626',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '1.1rem' }}>🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {currentPage !== 'landing' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('landing')}
                  style={{ fontWeight: 500 }}
                >
                  ← Back
                </Button>
              )}
              {currentPage === 'landing' && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('login')}
                    style={{ fontWeight: 500 }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onNavigate('register')}
                    style={{
                      background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                      border: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(0, 102, 204, 0.35)'
                    }}
                  >
                    Get Started Free
                  </Button>
                </>
              )}
              {currentPage === 'login' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate('register')}
                >
                  Create Account
                </Button>
              )}
              {currentPage === 'register' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate('login')}
                >
                  Sign In
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
