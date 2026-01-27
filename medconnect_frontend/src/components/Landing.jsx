import { useState } from 'react'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Footer from './Footer'

const EMOJI = {
  sparkles: String.fromCodePoint(0x2728),
  robot: String.fromCodePoint(0x1F916),
  doctor: String.fromCodePoint(0x1F468, 0x200D, 0x2695, 0xFE0F),
  testTube: String.fromCodePoint(0x1F9EA),
  chat: String.fromCodePoint(0x1F4AC),
  shield: String.fromCodePoint(0x1F6E1, 0xFE0F),
  lightning: String.fromCodePoint(0x26A1),
  phone: String.fromCodePoint(0x1F4F1),
  check: String.fromCodePoint(0x2705),
  star: String.fromCodePoint(0x2B50),
  heart: String.fromCodePoint(0x2764, 0xFE0F),
  clock: String.fromCodePoint(0x23F0),
  globe: String.fromCodePoint(0x1F310),
  rocket: String.fromCodePoint(0x1F680),
  trophy: String.fromCodePoint(0x1F3C6),
  bulb: String.fromCodePoint(0x1F4A1),
  ambulance: String.fromCodePoint(0x1F691),
  stethoscope: String.fromCodePoint(0x1FA7A)
}

export default function Landing({ onStart }) {
  const [hoveredService, setHoveredService] = useState(null)

  const stats = [
    { value: '50K+', label: 'Active Users', icon: EMOJI.heart },
    { value: '500+', label: 'Verified Doctors', icon: EMOJI.doctor },
    { value: '98%', label: 'Accuracy Rate', icon: EMOJI.trophy },
    { value: '24/7', label: 'Available', icon: EMOJI.clock }
  ]

  const services = [
    { 
      icon: EMOJI.robot, 
      title: 'AI Symptom Analysis', 
      desc: 'Advanced machine learning analyzes your symptoms and provides accurate health insights within seconds',
      color: '#0066CC',
      gradient: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)'
    },
    { 
      icon: EMOJI.doctor, 
      title: 'Expert Consultations', 
      desc: 'Connect with verified specialists through HD video calls for personalized medical advice',
      color: '#00BFA5',
      gradient: 'linear-gradient(135deg, #00BFA5 0%, #00A391 100%)'
    },
    { 
      icon: EMOJI.testTube, 
      title: 'Lab Test Booking', 
      desc: 'Book diagnostic tests at NABL certified labs near you with home sample collection',
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)'
    },
    { 
      icon: EMOJI.chat, 
      title: 'AI Health Assistant', 
      desc: 'Get instant answers to your health queries from our intelligent 24/7 chatbot',
      color: '#FF6B35',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)'
    }
  ]

  const features = [
    { icon: EMOJI.shield, title: 'Bank-Grade Security', desc: 'Your health data is encrypted with AES-256' },
    { icon: EMOJI.lightning, title: 'Instant Results', desc: 'Get AI analysis in under 30 seconds' },
    { icon: EMOJI.phone, title: 'Mobile First', desc: 'Seamless experience on any device' },
    { icon: EMOJI.globe, title: 'Multi-Language', desc: 'Available in 10+ regional languages' }
  ]

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Cardiologist, Apollo Hospital',
      text: 'MedConnect AI has revolutionized how I connect with patients. The AI symptom checker accurately pre-screens cases, saving valuable consultation time.',
      avatar: 'PS'
    },
    {
      name: 'Rahul Verma',
      role: 'Software Engineer, Pune',
      text: 'I was skeptical at first, but the accuracy of the symptom analysis amazed me. Got connected to the right specialist within minutes!',
      avatar: 'RV'
    },
    {
      name: 'Anjali Deshmukh',
      role: 'Teacher, Amravati',
      text: 'As a busy professional, booking lab tests with home collection has been a game-changer. Highly recommend this platform!',
      avatar: 'AD'
    }
  ]

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0, 191, 165, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '30%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(156, 39, 176, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.5
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto',
            textAlign: 'center',
            padding: '4rem 0'
          }}>
            <Badge variant="glass" size="lg" icon={EMOJI.sparkles} style={{ marginBottom: '2rem' }}>
              Powered by Advanced AI Technology
            </Badge>
            
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'white',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Your Health, 
              <span style={{ 
                display: 'block',
                background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Reimagined
              </span>
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '650px',
              margin: '0 auto 3rem',
              fontWeight: 400
            }}>
              Experience the future of healthcare with AI-powered diagnostics, instant doctor consultations, 
              and comprehensive health management - all in one beautiful platform.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              <Button 
                variant="gradient" 
                size="lg"
                onClick={onStart}
                glow
                style={{
                  padding: '18px 40px',
                  fontSize: '1.1rem'
                }}
              >
                {EMOJI.rocket} Get Started Free
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  padding: '18px 40px'
                }}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              flexWrap: 'wrap'
            }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 500
                  }}>
                    {stat.icon} {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{
            width: '30px',
            height: '50px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px'
          }}>
            <div style={{
              width: '6px',
              height: '12px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '3px',
              animation: 'scrollDown 2s infinite'
            }} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ 
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #f8fafb 0%, white 100%)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Badge variant="primary" size="lg">Our Services</Badge>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: 700,
              marginTop: '1.5rem',
              marginBottom: '1rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Everything You Need for
              <span style={{ 
                display: 'block',
                background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Better Health
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive healthcare solutions designed to make your life easier and healthier
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, i) => (
              <Card 
                key={i}
                hover
                glow
                onClick={() => onStart()}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  border: hoveredService === i ? `2px solid ${service.color}30` : '2px solid transparent'
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 1.5rem',
                  background: service.gradient,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: `0 15px 35px ${service.color}30`,
                  transform: hoveredService === i ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem'
                }}>
                  {service.desc}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  style={{ 
                    width: '100%',
                    borderColor: service.color,
                    color: service.color
                  }}
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ 
        padding: '8rem 0',
        background: 'white'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Badge variant="secondary" size="lg">Testimonials</Badge>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: 700,
              marginTop: '1.5rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Loved by Thousands
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((t, i) => (
              <Card key={i} hover style={{ padding: '2rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 style={{ 
                      fontWeight: 600,
                      marginBottom: '0.25rem',
                      color: 'var(--text-primary)'
                    }}>
                      {t.name}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)'
                    }}>
                      {t.role}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic'
                }}>
                  "{t.text}"
                </p>
                <div style={{ 
                  marginTop: '1rem',
                  color: '#FFB300'
                }}>
                  {EMOJI.star}{EMOJI.star}{EMOJI.star}{EMOJI.star}{EMOJI.star}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: 700,
              color: 'white',
              marginBottom: '1.5rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p style={{ 
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '2.5rem'
            }}>
              Join thousands of users who trust MedConnect AI for their healthcare needs
            </p>
            <Button 
              variant="white" 
              size="lg"
              onClick={onStart}
              style={{
                padding: '20px 50px',
                fontSize: '1.1rem',
                fontWeight: 700
              }}
            >
              {EMOJI.rocket} Start Free Today
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes scrollDown {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 102, 204, 0.4); }
          50% { box-shadow: 0 0 40px rgba(0, 102, 204, 0.6); }
        }
      `}</style>
    </div>
  )
}
