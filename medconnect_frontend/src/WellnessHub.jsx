import McCard from './components/ui-next/McCard'
import McButton from './components/ui-next/McButton'
import { getUserRole } from './auth'
import {
  MessageCircle, BookOpen, TestTube, Ambulance, Activity,
  UserDoctor, Shield, Heart, Star, Sparkles, CheckCircle,
  ArrowRight, Pill, TrendingUp
} from './components/ui/icons/Icon'

export default function WellnessHub({ onBack, onNavigate }) {
  const role = getUserRole()
  const isDoctor = role === 'DOCTOR'

  // Services available based on role
  const services = [
    {
      IconComp: MessageCircle,
      title: 'AI Health Chatbot',
      desc: 'Get instant answers to your health questions 24/7 with our AI assistant',
      action: 'chatbot',
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      available: true,
      tag: 'Popular'
    },
    {
      IconComp: Activity,
      title: 'AI Symptom Checker',
      desc: 'Analyze your symptoms with advanced machine learning algorithms',
      action: 'checker',
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      available: !isDoctor,
      tag: 'AI Powered'
    },
    {
      IconComp: UserDoctor,
      title: 'Find Doctors',
      desc: 'Browse top-rated specialists and book appointments instantly',
      action: 'doctors',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      available: !isDoctor,
      tag: 'Book Now'
    },
    {
      IconComp: BookOpen,
      title: 'Health Awareness',
      desc: 'Expert articles on diseases, prevention and healthy living',
      action: 'awareness',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      available: true,
      tag: 'Learn'
    },
    {
      IconComp: Ambulance,
      title: 'Emergency Services',
      desc: '24/7 emergency support, helplines and critical care information',
      action: 'emergency',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      available: true,
      tag: 'Urgent'
    },
    {
      IconComp: TestTube,
      title: 'Lab Test Booking',
      desc: 'Book diagnostic tests at certified labs near you',
      action: 'lab-booking',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      available: !isDoctor,
      premium: true,
      tag: 'Premium'
    },
    {
      IconComp: Pill,
      title: 'My Consultations',
      desc: 'View and manage all your past and upcoming consultations',
      action: 'consultations',
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      available: !isDoctor,
      tag: 'History'
    },
    {
      IconComp: Shield,
      title: 'Preventive Health',
      desc: 'Personalized wellness plans and preventive health tips',
      action: 'awareness',
      color: '#14B8A6',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      available: true,
      tag: 'Wellness'
    }
  ].filter(s => s.available)

  const handleServiceClick = (service) => {
    if (service.premium) {
      // Premium features not yet available
      return
    }
    if (onNavigate) {
      onNavigate(service.action)
    }
  }

  return (
    <div className="wellness-hub-page" style={{
      background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
      minHeight: 'calc(100vh - 80px)'
    }}>
      {/* Hero Section */}
      <section className="wellness-hub-hero" style={{
        background: 'linear-gradient(135deg, var(--mc-primary-500, #2563EB) 0%, var(--mc-secondary-500, #7C3AED) 100%)',
        color: 'white',
        padding: '3rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '10%',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {onBack && (
            <McButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              style={{
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1.5rem',
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              ← Back to Dashboard
            </McButton>
          )}

          <div className="wellness-hub-hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Sparkles size={16} /> Explore All Services
            </div>

            <h1 style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: 'white',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.2
            }}>
              Wellness Hub
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7,
              margin: 0
            }}>
              Your one-stop destination for comprehensive health and wellness services.
              {isDoctor ? ' Access tools to support your practice.' : ' Everything you need for your healthcare journey.'}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="wellness-hub-services-section" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="wellness-hub-services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {services.map((service, i) => (
              <McCard
                key={i}
                hover
                onClick={() => handleServiceClick(service)}
                style={{
                  padding: '2rem 1.75rem',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: service.gradient,
                  opacity: 0.7
                }} />

                {/* Tag */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: service.premium
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                      : `${service.color}10`,
                    color: service.premium ? '#D97706' : service.color,
                    border: service.premium
                      ? '1px solid #FDE68A'
                      : `1px solid ${service.color}20`
                  }}>
                    {service.premium && <Star size={10} />}
                    {service.tag}
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: `0 4px 12px ${service.color}12`
                }}>
                  <service.IconComp size={28} color={service.color} />
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--mc-neutral-900, #111827)',
                  marginBottom: '0.5rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--mc-neutral-500, #6B7280)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                  minHeight: '2.8rem'
                }}>
                  {service.desc}
                </p>

                {/* Action link */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: service.color,
                  transition: 'gap 0.2s ease'
                }}>
                  {service.premium ? 'Unlock Feature' : 'Get Started'}
                  <ArrowRight size={16} />
                </div>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="wellness-hub-stats-section" style={{ padding: '2rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="wellness-hub-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { IconComp: Heart, value: '10K+', label: 'Patients Served', color: '#EF4444' },
              { IconComp: UserDoctor, value: '500+', label: 'Expert Doctors', color: '#8B5CF6' },
              { IconComp: CheckCircle, value: '95%', label: 'Satisfaction Rate', color: '#10B981' },
              { IconComp: TrendingUp, value: '24/7', label: 'AI Support', color: '#06B6D4' }
            ].map((stat, i) => (
              <McCard key={i} style={{
                textAlign: 'center',
                padding: '1.75rem',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '14px',
                  background: `${stat.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <stat.IconComp size={24} color={stat.color} />
                </div>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: '0.25rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--mc-neutral-500, #6B7280)',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      {!isDoctor && (
        <section className="wellness-hub-cta-section" style={{ padding: '0 0 4rem' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <McCard style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--mc-primary-500, #2563EB) 0%, var(--mc-secondary-500, #7C3AED) 100%)',
              color: 'white',
              padding: '3.5rem 2rem',
              border: 'none',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: '20%', right: '-30px',
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

              <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '64px', height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Star size={28} color="white" />
                </div>

                <h3 className="wellness-hub-cta-title" style={{
                  marginBottom: '1rem',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  Unlock Premium Features
                </h3>
                <p style={{
                  fontSize: '1.05rem',
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.7
                }}>
                  Get unlimited AI consultations, priority doctor bookings, and personalized health plans
                </p>

                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  flexWrap: 'wrap'
                }}>
                  {[
                    'Unlimited Consultations',
                    '24/7 AI Support',
                    'Priority Booking'
                  ].map((benefit, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.95rem',
                      color: 'white',
                      fontWeight: 500
                    }}>
                      <CheckCircle size={18} color="rgba(255,255,255,0.9)" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <McButton
                  style={{
                    background: 'white',
                    color: 'var(--mc-primary-700, #1D4ED8)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    padding: '16px 36px',
                    borderRadius: '14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    border: 'none'
                  }}
                >
                  <Sparkles size={18} /> Upgrade to Premium
                </McButton>
              </div>
            </McCard>
          </div>
        </section>
      )}
    </div>
  )
}
