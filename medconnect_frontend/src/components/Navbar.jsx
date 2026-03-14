import { useState } from 'react'
import McButton from './ui-next/McButton'
import McThemeSwitcher from './ui-next/McThemeSwitcher'
import { Stethoscope, Home, Search, FileText, Bell, UserDoctor, Settings, Info, LogOut, ChevronDown, Sparkles, Calendar, MessageCircle, Activity, BarChart } from './ui/icons/Icon'
import { isAuthenticated, logout, getUserName, getEmail, getUserRole } from '../auth'

export default function Navbar({ onNavigate, currentPage, onLogout: externalLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const authenticated = isAuthenticated()
  const userName = getUserName()
  const userEmail = getEmail()
  const userRole = getUserRole()
  
  function handleLogout() {
    if (externalLogout) {
      externalLogout()
    } else {
      logout()
      onNavigate('landing')
    }
    setShowDropdown(false)
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!userName) return '?'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  
  // Role-aware home page
  const homePage = userRole === 'DOCTOR' ? 'doctor-dashboard' : (userRole === 'LAB_PROVIDER' ? 'lab-provider-dashboard' : (authenticated ? 'dashboard' : 'landing'))
  
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
      padding: '0.875rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
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
            gap: '14px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => onNavigate(homePage)}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '46px',
            height: '46px',
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Stethoscope size={22} color="white" style={{ position: 'relative', zIndex: 1 }} />
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 3s infinite'
            }} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              margin: 0,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              MedConnect AI
            </h3>
            <p style={{
              fontSize: '0.68rem',
              margin: 0,
              color: 'var(--gray-500)',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Intelligent Healthcare
            </p>
          </div>
        </div>
        
        {/* Center Navigation - Role-aware, always visible when authenticated */}
        {authenticated && (
          <div style={{
            display: 'flex',
            gap: '4px',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            padding: '5px',
            borderRadius: '14px',
            border: '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            {(userRole === 'DOCTOR'
              ? [
                  { id: 'doctor-dashboard', label: 'Dashboard', Icon: Home },
                  { id: 'doctor-consultations', label: 'Patients', Icon: Calendar },
                  { id: 'chatbot', label: 'AI Chat', Icon: MessageCircle }
                ]
              : userRole === 'LAB_PROVIDER'
              ? [
                  { id: 'lab-provider-dashboard', label: 'Dashboard', Icon: Home },
                ]
              : [
                  { id: 'dashboard', label: 'Dashboard', Icon: Home },
                  { id: 'checker', label: 'Symptoms', Icon: Activity },
                  { id: 'doctors', label: 'Doctors', Icon: UserDoctor },
                  { id: 'consultations', label: 'History', Icon: FileText }
                ]
            ).map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: currentPage === item.id 
                    ? 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' 
                    : 'transparent',
                  color: currentPage === item.id ? 'white' : '#6B7280',
                  boxShadow: currentPage === item.id 
                    ? '0 4px 15px rgba(37, 99, 235, 0.35)' 
                    : 'none',
                  transform: currentPage === item.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <item.Icon size={16} />
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
          {/* Design System Link — always visible for preview */}
          {authenticated ? (
            <>
              {/* Theme Switcher */}
              <McThemeSwitcher compact />
              {/* Notifications */}
              <button style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '1px solid rgba(229, 231, 235, 0.8)',
                background: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                position: 'relative',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#2563EB';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.8)';
              }}
              >
                <Bell size={20} color="#374151" />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '10px',
                  height: '10px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  animation: 'pulse 2s infinite'
                }} />
              </button>

              {/* User Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '7px 14px 7px 7px',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '60px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: showDropdown 
                      ? '0 8px 30px rgba(37, 99, 235, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={e => {
                    if (!showDropdown) {
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = '#2563EB';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!showDropdown) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.8)';
                    }
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}>
                    {getInitials()}
                  </div>
                  
                  {/* Name & Role */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#111827',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em'
                    }}>
                      {userName}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#9CA3AF',
                      textTransform: 'capitalize',
                      fontWeight: 500
                    }}>
                      {userRole === 'LAB_PROVIDER' ? 'Lab Provider' : userRole === 'DOCTOR' ? 'Doctor' : userRole?.toLowerCase() || 'Patient'}
                    </div>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown size={12} style={{
                    color: '#9CA3AF',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
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
                        zIndex: 998,
                        background: 'rgba(0, 0, 0, 0.02)'
                      }}
                    />
                    
                    {/* Menu */}
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '280px',
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      overflow: 'hidden',
                      zIndex: 999,
                      animation: 'slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      {/* User Info Header */}
                      <div style={{
                        padding: '20px',
                        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                        background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                          }}>
                            {getInitials()}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: 700,
                              color: '#111827',
                              marginBottom: '3px',
                              fontSize: '1rem'
                            }}>
                              {userName}
                            </div>
                            <div style={{
                              fontSize: '0.825rem',
                              color: '#6B7280'
                            }}>
                              {userEmail}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '10px' }}>
                        {[
                          ...(userRole === 'DOCTOR'
                            ? [
                                { icon: UserDoctor, label: 'My Profile', action: () => { onNavigate('profile'); setShowDropdown(false) } },
                                { icon: Calendar, label: 'My Patients', action: () => { onNavigate('doctor-consultations'); setShowDropdown(false) } },
                                { icon: BarChart, label: 'Dashboard', action: () => { onNavigate('doctor-dashboard'); setShowDropdown(false) } },
                              ]
                            : userRole === 'LAB_PROVIDER'
                            ? [
                                { icon: BarChart, label: 'Dashboard', action: () => { onNavigate('lab-provider-dashboard'); setShowDropdown(false) } },
                              ]
                            : [
                                { icon: UserDoctor, label: 'My Profile', action: () => { onNavigate('profile'); setShowDropdown(false) } },
                                { icon: FileText, label: 'My Consultations', action: () => { onNavigate('consultations'); setShowDropdown(false) } },
                                { icon: Activity, label: 'Symptom Checker', action: () => { onNavigate('checker'); setShowDropdown(false) } },
                              ]
                          ),
                          { icon: Settings, label: 'Settings', action: () => { onNavigate('profile'); setShowDropdown(false) } },
                          { icon: Info, label: 'Help & Support', action: () => {} }
                        ].map((item, i) => (
                          <button
                            key={i}
                            onClick={item.action}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '14px',
                              border: 'none',
                              borderRadius: '12px',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.925rem',
                              color: '#374151',
                              fontWeight: 500,
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={e => {
                              e.target.style.background = 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)';
                              e.target.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={e => {
                              e.target.style.background = 'transparent';
                              e.target.style.transform = 'translateX(0)';
                            }}
                          >
                            <span style={{ 
                              fontSize: '1.2rem',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                            }}><item.icon size={18} color="#374151" /></span>
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Logout */}
                      <div style={{
                        padding: '10px',
                        borderTop: '1px solid rgba(229, 231, 235, 0.5)'
                      }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px',
                            border: 'none',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                            cursor: 'pointer',
                            fontSize: '0.925rem',
                            color: '#DC2626',
                            fontWeight: 600,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span style={{ 
                            fontSize: '1.2rem',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.15)'
                          }}><LogOut size={18} color="#DC2626" /></span>
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
                <McButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('landing')}
                  style={{ 
                    fontWeight: 600,
                    color: '#6B7280'
                  }}
                >
                  ← Back
                </McButton>
              )}
              {currentPage === 'landing' && (
                <>
                  <McButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('login')}
                    style={{ 
                      fontWeight: 600,
                      color: '#374151',
                      padding: '10px 20px',
                      borderRadius: '12px'
                    }}
                  >
                    Sign In
                  </McButton>
                  <McButton 
                    variant="primary" 
                    size="sm"
                    onClick={() => onNavigate('register')}
                    style={{
                      background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)',
                      border: 'none',
                      fontWeight: 700,
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Get Started Free
                  </McButton>
                </>
              )}
              {currentPage === 'login' && (
                <McButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate('register')}
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    borderColor: '#E5E7EB'
                  }}
                >
                  Create Account
                </McButton>
              )}
              {currentPage === 'register' && (
                <McButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate('login')}
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    borderColor: '#E5E7EB'
                  }}
                >
                  Sign In
                </McButton>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
