import Card from './components/ui/Card'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'

export default function WellnessHub({ onBack }) {
  const services = [
    { 
      icon: '🤖', 
      title: 'AI Health Chatbot', 
      desc: 'Get instant answers to your health questions 24/7',
      premium: true,
      color: '#0066CC'
    },
    { 
      icon: '📚', 
      title: 'Health Awareness', 
      desc: 'Read expert articles on diseases and prevention',
      premium: false,
      color: '#00BFA5'
    },
    { 
      icon: '🧪', 
      title: 'Lab Test Booking', 
      desc: 'Book diagnostic tests at certified labs near you',
      premium: true,
      color: '#2196F3'
    },
    { 
      icon: '🚑', 
      title: 'Emergency Services', 
      desc: '24/7 emergency support and critical care info',
      premium: false,
      color: '#FF6B35'
    },
    { 
      icon: '🌿', 
      title: 'Alternative Care', 
      desc: 'Explore holistic and complementary treatments',
      premium: true,
      color: '#00C853'
    },
    { 
      icon: '🧘', 
      title: 'Preventive Health', 
      desc: 'Get personalized wellness and fitness plans',
      premium: false,
      color: '#9C27B0'
    }
  ]

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            style={{ marginBottom: '2rem' }}
          >
            ← Back
          </Button>
        )}
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Badge variant="primary" icon="🏥">Complete Healthcare</Badge>
          <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '2.5rem' }}>
            Wellness Hub
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Your one-stop destination for comprehensive health and wellness services
          </p>
        </div>

        <div className="grid grid-3">
          {services.map((service, i) => (
            <Card 
              key={i} 
              hover
              className="fade-in"
              style={{ 
                textAlign: 'center',
                position: 'relative',
                animationDelay: `${i * 0.1}s`,
                border: `2px solid ${service.color}15`,
                padding: '2rem 1.5rem'
              }}
            >
              {service.premium && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <Badge variant="warning">Premium</Badge>
                </div>
              )}
              
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                background: `${service.color}10`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                {service.icon}
              </div>
              
              <h3 style={{ 
                marginBottom: '0.75rem',
                fontSize: '1.25rem',
                color: 'var(--gray-900)'
              }}>
                {service.title}
              </h3>
              
              <p style={{ 
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                minHeight: '3rem'
              }}>
                {service.desc}
              </p>
              
              <Button 
                variant={service.premium ? 'primary' : 'outline'}
                size="sm"
                style={{ width: '100%' }}
              >
                {service.premium ? '🔓 Unlock Premium' : '🚀 Explore Now'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Premium CTA */}
        <Card style={{
          marginTop: '4rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
          color: 'white',
          padding: '3rem 2rem',
          border: 'none'
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ 
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              ⭐
            </div>
            <h3 style={{ 
              marginBottom: '1rem',
              color: 'white',
              fontSize: '2rem'
            }}>
              Unlock Premium Features
            </h3>
            <p style={{ 
              fontSize: '1.1rem',
              marginBottom: '2rem',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.7
            }}>
              Get unlimited access to AI chatbot, lab bookings, doctor consultations, 
              and personalized health plans
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { icon: '✓', text: 'Unlimited Consultations' },
                { icon: '✓', text: '24/7 AI Support' },
                { icon: '✓', text: 'Priority Booking' }
              ].map((benefit, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  color: 'white'
                }}>
                  <span style={{ 
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}>
                    {benefit.icon}
                  </span>
                  {benefit.text}
                </div>
              ))}
            </div>

            <Button 
              style={{
                background: 'white',
                color: 'var(--primary)',
                fontSize: '1.1rem',
                padding: '14px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              ✨ Upgrade to Premium
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
