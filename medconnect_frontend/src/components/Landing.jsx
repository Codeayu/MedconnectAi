import { useState } from 'react'
import McButton from './ui-next/McButton'
import McCard from './ui-next/McCard'
import Badge from './ui/Badge'
import Footer from './Footer'
import { Sparkles, Activity, UserDoctor, TestTube, MessageCircle, Shield, Heart, Clock, Star, ArrowRight, Stethoscope, Phone } from './ui/icons/Icon'

export default function Landing({ onStart }) {
  const [hoveredService, setHoveredService] = useState(null)

  const stats = [
    { value: '50K+', label: 'Active Users', IconComp: Heart },
    { value: '500+', label: 'Verified Doctors', IconComp: UserDoctor },
    { value: '98%', label: 'Accuracy Rate', IconComp: Star },
    { value: '24/7', label: 'Available', IconComp: Clock }
  ]

  const services = [
    { 
      IconComp: Activity, 
      title: 'AI Symptom Analysis', 
      desc: 'Advanced machine learning analyzes your symptoms and provides accurate health insights within seconds',
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'
    },
    { 
      IconComp: UserDoctor, 
      title: 'Expert Consultations', 
      desc: 'Connect with verified specialists through HD video calls for personalized medical advice',
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
    },
    { 
      IconComp: TestTube, 
      title: 'Lab Test Booking', 
      desc: 'Book diagnostic tests at NABL certified labs near you with home sample collection',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    { 
      IconComp: MessageCircle, 
      title: 'AI Health Assistant', 
      desc: 'Get instant answers to your health queries from our intelligent 24/7 chatbot',
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
    }
  ]

  const features = [
    { IconComp: Shield, title: 'Bank-Grade Security', desc: 'Your health data is encrypted with AES-256' },
    { IconComp: Activity, title: 'Instant Results', desc: 'Get AI analysis in under 30 seconds' },
    { IconComp: Phone, title: 'Mobile First', desc: 'Seamless experience on any device' },
    { IconComp: Stethoscope, title: 'Multi-Language', desc: 'Available in 10+ regional languages' }
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
        background: 'linear-gradient(135deg, #030712 0%, #111827 50%, #030712 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '30%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.6
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            maxWidth: '950px', 
            margin: '0 auto',
            textAlign: 'center',
            padding: '5rem 0'
          }}>
            <Badge variant="glass" size="lg" style={{ 
              marginBottom: '2rem',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              backdropFilter: 'blur(10px)',
              padding: '10px 24px',
              borderRadius: '100px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={16} color="#93C5FD" /> Trusted by 50,000+ Healthcare Professionals
            </Badge>
            
            <h1 style={{ 
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '1.75rem',
              color: 'white',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em'
            }}>
              Healthcare Intelligence
              <span style={{ 
                display: 'block',
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Powered by AI
              </span>
            </h1>
            
            <p style={{ 
              fontSize: '1.3rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.65)',
              maxWidth: '680px',
              margin: '0 auto 3.5rem',
              fontWeight: 400,
              letterSpacing: '0.01em'
            }}>
              Experience the future of healthcare with AI-powered diagnostics, instant doctor consultations, 
              and comprehensive health management — all in one intelligent platform.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1.25rem', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4.5rem'
            }}>
              <McButton 
                variant="primary" 
                size="lg"
                onClick={onStart}
                style={{
                  padding: '20px 44px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)',
                  boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  borderRadius: '14px',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px'
                }}
              >
                <ArrowRight size={18} /> Start Free Trial
              </McButton>
              <McButton 
                variant="ghost" 
                size="lg"
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  padding: '20px 44px',
                  borderRadius: '14px',
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Watch Demo
              </McButton>
            </div>

            {/* Stats Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '4rem',
              flexWrap: 'wrap',
              padding: '2.5rem 3rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)'
            }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.75rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.55)',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'center'
                  }}>
                    <stat.IconComp size={16} color="rgba(255,255,255,0.55)" /> {stat.label}
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
        padding: '9rem 0',
        background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <Badge variant="primary" size="lg" style={{
              background: 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)',
              color: '#2563EB',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '100px',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>Our Services</Badge>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: 800,
              marginTop: '1.75rem',
              marginBottom: '1.25rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              color: '#111827'
            }}>
              Everything You Need for
              <span style={{ 
                display: 'block',
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Better Health
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#6B7280',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Comprehensive healthcare solutions designed to make your life easier and healthier
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            {services.map((service, i) => (
              <McCard 
                key={i}
                hover
                onClick={() => onStart()}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  textAlign: 'center',
                  padding: '3rem 2.5rem',
                  border: hoveredService === i ? `2px solid ${service.color}40` : '2px solid #F3F4F6',
                  borderRadius: '24px',
                  background: 'white',
                  boxShadow: hoveredService === i 
                    ? `0 25px 50px -12px ${service.color}20` 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 2rem',
                  background: service.gradient,
                  borderRadius: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.75rem',
                  boxShadow: `0 20px 40px ${service.color}30`,
                  transform: hoveredService === i ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <service.IconComp size={40} color="white" />
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#111827',
                  letterSpacing: '-0.01em'
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#6B7280',
                  marginBottom: '1.75rem'
                }}>
                  {service.desc}
                </p>
                <McButton 
                  variant="outline" 
                  size="sm"
                  style={{ 
                    width: '100%',
                    borderColor: `${service.color}40`,
                    color: service.color,
                    borderRadius: '12px',
                    fontWeight: 600,
                    padding: '14px 20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Learn More →
                </McButton>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '7rem 0',
        background: 'linear-gradient(135deg, #030712 0%, #111827 100%)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{
                  fontSize: '3.5rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <feature.IconComp size={48} color="rgba(255,255,255,0.9)" />
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.6
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
        padding: '9rem 0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <Badge variant="secondary" size="lg" style={{
              background: 'linear-gradient(135deg, #CFFAFE 0%, #DBEAFE 100%)',
              color: '#0891B2',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '100px',
              fontWeight: 600
            }}>Testimonials</Badge>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: 800,
              marginTop: '1.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              color: '#111827'
            }}>
              Loved by Thousands
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}>
            {testimonials.map((t, i) => (
              <McCard key={i} hover style={{ 
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid #F3F4F6',
                background: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '1.25rem',
                  marginBottom: '1.75rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 style={{ 
                      fontWeight: 700,
                      marginBottom: '0.35rem',
                      color: '#111827',
                      fontSize: '1.1rem'
                    }}>
                      {t.name}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#9CA3AF'
                    }}>
                      {t.role}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: '#4B5563',
                  fontStyle: 'italic'
                }}>
                  "{t.text}"
                </p>
                <div style={{ 
                  marginTop: '1.5rem',
                  display: 'flex',
                  gap: '4px'
                }}>
                  {[...Array(5)].map((_, si) => <Star key={si} size={18} color="#FBBF24" />)}
                </div>
              </McCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '7rem 0',
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ 
            textAlign: 'center',
            maxWidth: '750px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: 800,
              color: 'white',
              marginBottom: '1.75rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '3rem',
              lineHeight: 1.7
            }}>
              Join 50,000+ users who trust MedConnect AI for intelligent healthcare solutions
            </p>
            <McButton 
              variant="primary" 
              size="lg"
              onClick={onStart}
              style={{
                padding: '22px 56px',
                fontSize: '1.15rem',
                fontWeight: 700,
                borderRadius: '14px',
                background: 'white',
                color: '#2563EB',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              <ArrowRight size={18} /> Start Free Today
            </McButton>
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
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.4); }
          50% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.6); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
