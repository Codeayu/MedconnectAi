import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { getUserName } from '../auth'

const EMOJI = {
  robot: String.fromCodePoint(0x1F916),
  clipboard: String.fromCodePoint(0x1F4CB),
  books: String.fromCodePoint(0x1F4DA),
  ambulance: String.fromCodePoint(0x1F691),
  doctor: String.fromCodePoint(0x1F468, 0x200D, 0x2695, 0xFE0F),
  testTube: String.fromCodePoint(0x1F9EA),
  speech: String.fromCodePoint(0x1F4AC),
  wave: String.fromCodePoint(0x1F44B),
  star: String.fromCodePoint(0x2B50),
  unlock: String.fromCodePoint(0x1F513),
  chart: String.fromCodePoint(0x1F4CA),
  calendar: String.fromCodePoint(0x1F4C5),
  pill: String.fromCodePoint(0x1F48A),
  runner: String.fromCodePoint(0x1F3C3)
}

export default function Dashboard({ onService }) {
  const userName = getUserName()
  
  const freeServices = [
    {
      icon: EMOJI.robot,
      title: 'AI Symptom Checker',
      desc: 'Analyze your symptoms with AI',
      action: 'checker',
      color: '#0066CC'
    },
    {
      icon: EMOJI.speech,
      title: 'AI Health Chatbot',
      desc: '24/7 health assistant',
      action: 'chatbot',
      color: '#00BFA5'
    },
    {
      icon: EMOJI.doctor,
      title: 'Find Doctors',
      desc: 'Browse and book appointments',
      action: 'doctors',
      color: '#9C27B0'
    },
    {
      icon: EMOJI.clipboard,
      title: 'My Consultations',
      desc: 'View your consultation history',
      action: 'consultations',
      color: '#FF9800'
    },
    {
      icon: EMOJI.books,
      title: 'Health Awareness',
      desc: 'Read health articles & tips',
      action: 'awareness',
      color: '#00BFA5'
    },
    {
      icon: EMOJI.ambulance,
      title: 'Emergency Help',
      desc: 'Access emergency resources',
      action: 'emergency',
      color: '#FF6B35'
    }
  ]

  const premiumServices = [
    {
      icon: EMOJI.doctor,
      title: 'Doctor Consultation',
      desc: 'Video call with specialists',
      action: 'consult',
      color: '#0066CC',
      premium: true
    },
    {
      icon: EMOJI.testTube,
      title: 'Lab Tests',
      desc: 'Book diagnostic tests',
      action: 'lab',
      color: '#2196F3',
      premium: true
    }
  ]

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
        color: 'white',
        padding: '3rem 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 0.5rem 0'
              }}>
                Welcome back,
              </p>
              <h1 style={{ 
                marginBottom: '0.5rem',
                color: 'white',
                fontSize: '2.5rem'
              }}>
                {userName}! {EMOJI.wave}
              </h1>
              <p style={{ 
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)',
                margin: 0
              }}>
                How can we help you today?
              </p>
            </div>
            <Button 
              style={{
                background: 'white',
                color: 'var(--primary)',
                fontSize: '1rem'
              }}
            >
              {EMOJI.star} Upgrade to Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '1rem' }}>
            {[
              { icon: EMOJI.chart, label: 'Health Score', value: '85/100' },
              { icon: EMOJI.calendar, label: 'Last Checkup', value: '2 weeks ago' },
              { icon: EMOJI.pill, label: 'Medications', value: '3 active' },
              { icon: EMOJI.runner, label: 'Activity', value: 'Good' }
            ].map((stat, i) => (
              <Card key={i} style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}>
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Services */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Free Services</h2>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Access these services anytime
              </p>
            </div>
            <Badge variant="success">Always Free</Badge>
          </div>

          <div className="grid grid-4">
            {freeServices.map((service, i) => (
              <Card 
                key={i}
                hover
                onClick={() => onService(service.action)}
                style={{
                  textAlign: 'center',
                  border: `2px solid ${service.color}15`,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 1rem',
                  background: `${service.color}10`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.15rem'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  {service.desc}
                </p>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  Access Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Premium Services</h2>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Unlock advanced healthcare features
              </p>
            </div>
            <Badge variant="warning" icon={EMOJI.star}>Premium</Badge>
          </div>

          <div className="grid grid-3">
            {premiumServices.map((service, i) => (
              <Card 
                key={i}
                hover
                onClick={() => onService(service.action)}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }}>
                  <Badge variant="warning">Premium</Badge>
                </div>
                <div style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 1rem',
                  background: `${service.color}10`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.15rem'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  {service.desc}
                </p>
                <Button variant="primary" size="sm" style={{ width: '100%' }}>
                  {EMOJI.unlock} Unlock Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
