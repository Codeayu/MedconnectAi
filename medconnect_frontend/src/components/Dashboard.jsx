import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import { getUserName } from '../auth'
import { Activity, FileText, BookOpen, Ambulance, UserDoctor, TestTube, MessageCircle, Star, BarChart, Calendar, Pill, TrendingUp } from './ui/icons/Icon'

export default function Dashboard({ onService }) {
  const userName = getUserName()
  
  const freeServices = [
    {
      IconComp: Activity,
      title: 'AI Symptom Checker',
      desc: 'Analyze your symptoms with AI',
      action: 'checker',
      color: '#2563EB'
    },
    {
      IconComp: MessageCircle,
      title: 'AI Health Chatbot',
      desc: '24/7 health assistant',
      action: 'chatbot',
      color: '#06B6D4'
    },
    {
      IconComp: UserDoctor,
      title: 'Find Doctors',
      desc: 'Browse and book appointments',
      action: 'doctors',
      color: '#8B5CF6'
    },
    {
      IconComp: FileText,
      title: 'My Consultations',
      desc: 'View your consultation history',
      action: 'consultations',
      color: '#F97316'
    },
    {
      IconComp: BookOpen,
      title: 'Health Awareness',
      desc: 'Read health articles & tips',
      action: 'awareness',
      color: '#10B981'
    },
    {
      IconComp: Ambulance,
      title: 'Emergency Help',
      desc: 'Access emergency resources',
      action: 'emergency',
      color: '#EF4444'
    }
  ]

  const premiumServices = [
    {
      IconComp: UserDoctor,
      title: 'Doctor Consultation',
      desc: 'Video call with specialists',
      action: 'consult',
      color: '#7C3AED',
      premium: true
    },
    {
      IconComp: TestTube,
      title: 'Lab Tests',
      desc: 'Book diagnostic tests',
      action: 'lab',
      color: '#2563EB',
      premium: true
    }
  ]

  return (
    <div style={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        color: 'white',
        padding: '3.5rem 0',
        borderBottom: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <p style={{ 
                fontSize: '1.05rem',
                color: 'rgba(255,255,255,0.75)',
                margin: '0 0 0.75rem 0',
                fontWeight: 500
              }}>
                Welcome back,
              </p>
              <h1 style={{ 
                marginBottom: '0.75rem',
                color: 'white',
                fontSize: '2.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                {userName}!
              </h1>
              <p style={{ 
                fontSize: '1.15rem',
                color: 'rgba(255,255,255,0.85)',
                margin: 0
              }}>
                How can we help you today?
              </p>
            </div>
            <McButton 
              style={{
                background: 'white',
                color: '#7C3AED',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '16px 28px',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
            >
              <Star size={18} color="#7C3AED" /> Upgrade to Premium
            </McButton>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '1.5rem' }}>
            {[
              { IconComp: BarChart, label: 'Health Score', value: '85/100', color: '#2563EB' },
              { IconComp: Calendar, label: 'Last Checkup', value: '2 weeks ago', color: '#10B981' },
              { IconComp: Pill, label: 'Medications', value: '3 active', color: '#8B5CF6' },
              { IconComp: TrendingUp, label: 'Activity', value: 'Good', color: '#F97316' }
            ].map((stat, i) => (
              <McCard key={i} style={{ 
                textAlign: 'center', 
                padding: '1.75rem',
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <div style={{ 
                  width: '56px', height: '56px', margin: '0 auto 0.75rem',
                  borderRadius: '16px',
                  background: `${stat.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><stat.IconComp size={28} color={stat.color} /></div>
                <div style={{ 
                  fontSize: '1.65rem', 
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: '0.35rem',
                  letterSpacing: '-0.01em'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* Free Services */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 style={{ 
                marginBottom: '0.4rem',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.01em'
              }}>Free Services</h2>
              <p style={{ margin: 0, fontSize: '1rem', color: '#6B7280' }}>
                Access these services anytime
              </p>
            </div>
            <Badge variant="success" style={{
              background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
              color: '#059669',
              border: 'none',
              fontWeight: 700
            }}>Always Free</Badge>
          </div>

          <div className="grid grid-4">
            {freeServices.map((service, i) => (
              <McCard 
                key={i}
                hover
                onClick={() => onService(service.action)}
                style={{
                  textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.25rem',
                  background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${service.color}15`
                }}>
                  <service.IconComp size={36} color={service.color} />
                </div>
                <h3 style={{ 
                  marginBottom: '0.6rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#111827'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.925rem',
                  marginBottom: '1.25rem',
                  color: '#6B7280',
                  lineHeight: 1.5
                }}>
                  {service.desc}
                </p>
                <McButton variant="outline" size="sm" style={{ 
                  width: '100%',
                  borderColor: `${service.color}30`,
                  color: service.color,
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Access Now
                </McButton>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section style={{ padding: '2.5rem 0 5rem' }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 style={{ 
                marginBottom: '0.4rem',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.01em'
              }}>Premium Services</h2>
              <p style={{ margin: 0, fontSize: '1rem', color: '#6B7280' }}>
                Unlock advanced healthcare features
              </p>
            </div>
            <Badge variant="warning" style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#D97706',
              border: 'none',
              fontWeight: 700
            }}><Star size={14} color="#D97706" /> Premium</Badge>
          </div>

          <div className="grid grid-3">
            {premiumServices.map((service, i) => (
              <McCard 
                key={i}
                hover
                onClick={() => onService(service.action)}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem',
                  border: '1px solid rgba(124, 58, 237, 0.1)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem'
                }}>
                  <Badge variant="purple" style={{
                    background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                    color: '#7C3AED',
                    border: 'none',
                    fontWeight: 600
                  }}>Premium</Badge>
                </div>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.25rem',
                  background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${service.color}15`
                }}>
                  <service.IconComp size={36} color={service.color} />
                </div>
                <h3 style={{ 
                  marginBottom: '0.6rem',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#111827'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.925rem',
                  marginBottom: '1.25rem',
                  color: '#6B7280',
                  lineHeight: 1.5
                }}>
                  {service.desc}
                </p>
                <McButton variant="primary" size="sm" style={{ 
                  width: '100%',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)'
                }}>
                  Unlock Now
                </McButton>
              </McCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
