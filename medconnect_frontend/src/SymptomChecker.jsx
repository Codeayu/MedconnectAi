import { useState } from "react"
import WellnessHub from "./WellnessHub"
import SymptomSelector from "./components/SymptomSelector"
import { api } from "./api"

// Modern styles object for reusable styling
const styles = {
  pageWrapper: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
    minHeight: 'calc(100vh - 80px)',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: '-150px',
    right: '-150px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(0, 102, 204, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none'
  },
  backgroundDecoration2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(0, 191, 165, 0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    position: 'relative',
    zIndex: 1
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 102, 204, 0.05)',
    padding: '2.5rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative'
  },
  heroIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    boxShadow: '0 20px 40px -10px rgba(0, 102, 204, 0.3)',
    transform: 'rotate(-5deg)'
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  step: (active, completed) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '100px',
    background: completed ? 'linear-gradient(135deg, #00C853 0%, #00BFA5 100%)' : 
                active ? 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)' : 
                'var(--gray-100)',
    color: active || completed ? 'white' : 'var(--gray-500)',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    boxShadow: active || completed ? '0 4px 15px -3px rgba(0, 102, 204, 0.3)' : 'none'
  }),
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  featureItem: {
    textAlign: 'center',
    padding: '1.25rem 1rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    borderRadius: '16px',
    border: '1px solid var(--gray-100)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  resultCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  resultCardTop: {
    background: 'linear-gradient(135deg, #ffffff 0%, #E6F2FF 100%)',
    border: '2px solid var(--primary)',
    boxShadow: '0 10px 40px -10px rgba(0, 102, 204, 0.2)'
  },
  doctorCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '1.75rem',
    marginBottom: '1rem',
    border: '1px solid var(--gray-100)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }
}

// Loading Animation Component
function LoadingAnimation() {
  return (
    <div style={styles.loadingOverlay}>
      <div style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        marginBottom: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid var(--gray-200)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.75rem'
        }}>
          🔬
        </div>
      </div>
      <h3 style={{ 
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Analyzing Your Symptoms
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Our AI is processing your information...
      </p>
    </div>
  )
}

// Progress Ring Component
function ProgressRing({ progress, size = 60, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--gray-200)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          fill: color
        }}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  )
}

export default function SymptomChecker({ onBack, onNavigate }) {
  const [symptoms, setSymptoms] = useState([])
  const [result, setResult] = useState(null)
  const [route, setRoute] = useState("diagnose")
  const [loading, setLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [hoveredDoctor, setHoveredDoctor] = useState(null)

  async function analyze() {
    if (symptoms.length === 0) return
    
    setLoading(true)
    try {
      const data = await api.predictSymptoms(symptoms)
      setResult(data)
    } catch (error) {
      console.error('Error analyzing symptoms:', error)
      alert('Failed to analyze symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function bookConsultation(doctor) {
    setLoading(true)
    try {
      const consultation = await api.createConsultation({
        top_diseases: result.predictions.map(p => p.disease),
        confidence: result.predictions.map(p => p.prob)
      })
      
      setBookingSuccess(true)
      setTimeout(() => {
        alert(`Consultation booked successfully! ID: ${consultation.id}`)
      }, 500)
    } catch (error) {
      console.error('Error booking consultation:', error)
      alert('Failed to book consultation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate current step
  const currentStep = result ? 3 : symptoms.length > 0 ? 2 : 1

  // CONSULT FLOW
  if (route === "consult" && result) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.backgroundDecoration} />
        <div style={styles.backgroundDecoration2} />
        
        <div style={styles.container}>
          <button 
            onClick={() => setRoute("diagnose")}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'white',
              border: '1px solid var(--gray-200)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--gray-50)'
              e.currentTarget.style.transform = 'translateX(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            ← Back to Results
          </button>
          
          <div style={styles.heroSection}>
            <div style={{
              ...styles.heroIcon,
              background: 'linear-gradient(135deg, #00BFA5 0%, #00C853 100%)'
            }}>
              👨‍⚕️
            </div>
            <h1 style={{ 
              fontSize: '2.25rem',
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Recommended Specialists
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Book a consultation with verified healthcare professionals
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {result.recommended_doctors?.map((doc, i) => (
              <div 
                key={i}
                style={{
                  ...styles.doctorCard,
                  transform: hoveredDoctor === i ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredDoctor === i 
                    ? '0 20px 40px -10px rgba(0, 0, 0, 0.12)' 
                    : '0 4px 20px -5px rgba(0, 0, 0, 0.06)',
                  animationDelay: `${i * 0.1}s`
                }}
                className="fade-in"
                onMouseEnter={() => setHoveredDoctor(i)}
                onMouseLeave={() => setHoveredDoctor(null)}
              >
                <div style={{ 
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      right: '-5px',
                      width: '30px',
                      height: '30px',
                      background: 'var(--success)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.9rem',
                      border: '3px solid white'
                    }}>
                      ✓
                    </div>
                    👨‍⚕️
                  </div>
                  
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ marginBottom: '0.25rem', fontSize: '1.35rem', fontWeight: 700 }}>
                      {doc.name}
                    </h3>
                    <p style={{ 
                      margin: '0 0 0.75rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      {doc.specialization}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFFDE7 100%)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#F57C00'
                      }}>
                        ⭐ {doc.rating}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        background: 'var(--gray-100)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)'
                      }}>
                        💰 ₹{doc.consultation_fee}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#2E7D32'
                      }}>
                        ● Available Now
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => bookConsultation(doc)}
                    disabled={loading || bookingSuccess}
                    style={{
                      padding: '1rem 2rem',
                      background: bookingSuccess 
                        ? 'linear-gradient(135deg, #00C853 0%, #00BFA5 100%)' 
                        : 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: loading || bookingSuccess ? 'default' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px -5px rgba(0, 102, 204, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {bookingSuccess ? '✅ Booked!' : '📅 Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // WELLNESS FLOW
  if (route === "wellness") {
    return <WellnessHub onBack={() => setRoute("diagnose")} onNavigate={onNavigate} />
  }

  // DIAGNOSIS FLOW
  return (
    <div style={styles.pageWrapper}>
      {loading && <LoadingAnimation />}
      
      <div style={styles.backgroundDecoration} />
      <div style={styles.backgroundDecoration2} />
      
      <div style={styles.container}>
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              marginBottom: '1.5rem',
              border: '1px solid var(--gray-200)',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--gray-600)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)' }}
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          <div style={styles.step(currentStep === 1, currentStep > 1)}>
            {currentStep > 1 ? '✓' : '1'} Select Symptoms
          </div>
          <div style={{ 
            width: '40px', 
            height: '2px', 
            background: currentStep >= 2 ? 'var(--primary)' : 'var(--gray-300)',
            alignSelf: 'center',
            borderRadius: '2px',
            transition: 'background 0.3s ease'
          }} />
          <div style={styles.step(currentStep === 2, currentStep > 2)}>
            {currentStep > 2 ? '✓' : '2'} Analyze
          </div>
          <div style={{ 
            width: '40px', 
            height: '2px', 
            background: currentStep >= 3 ? 'var(--primary)' : 'var(--gray-300)',
            alignSelf: 'center',
            borderRadius: '2px',
            transition: 'background 0.3s ease'
          }} />
          <div style={styles.step(currentStep === 3, false)}>
            3 Results
          </div>
        </div>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroIcon}>🩺</div>
          <h1 style={{ 
            fontSize: '2.5rem',
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800
          }}>
            AI Symptom Analysis
          </h1>
          <p style={{ 
            fontSize: '1.15rem', 
            color: 'var(--text-secondary)',
            maxWidth: '550px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Get instant health insights powered by advanced machine learning algorithms
          </p>
        </div>

        {/* Features Grid */}
        <div style={styles.featureGrid}>
          {[
            { icon: '🔒', title: 'Private & Secure', desc: 'Your data is encrypted' },
            { icon: '⚡', title: 'Instant Results', desc: 'Analysis in seconds' },
            { icon: '🎯', title: '95% Accuracy', desc: 'AI-powered precision' }
          ].map((feature, i) => (
            <div 
              key={i} 
              style={styles.featureItem}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
                {feature.icon}
              </span>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                {feature.title}
              </h4>
              <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-muted)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Main Input Card */}
        <div style={styles.glassCard} className="scale-in">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--gray-100)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📝
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                Describe Your Symptoms
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Search and select all symptoms you're experiencing
              </p>
            </div>
          </div>
          
          <SymptomSelector 
            selectedSymptoms={symptoms}
            onSymptomsChange={setSymptoms}
          />

          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={analyze}
              disabled={loading || symptoms.length === 0}
              style={{
                width: '100%',
                padding: '1.25rem 2rem',
                background: symptoms.length === 0 
                  ? 'var(--gray-300)' 
                  : 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: symptoms.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                boxShadow: symptoms.length > 0 
                  ? '0 15px 35px -10px rgba(0, 102, 204, 0.4)' 
                  : 'none',
                transform: 'translateY(0)'
              }}
              onMouseEnter={e => {
                if (symptoms.length > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 102, 204, 0.5)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = symptoms.length > 0 
                  ? '0 15px 35px -10px rgba(0, 102, 204, 0.4)' 
                  : 'none'
              }}
            >
              {loading ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite' 
                  }}>⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.25rem' }}>🔬</span>
                  Analyze {symptoms.length > 0 ? `${symptoms.length} Symptom${symptoms.length > 1 ? 's' : ''}` : 'Symptoms'}
                </>
              )}
            </button>
          </div>

          {/* Quick Tips */}
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E6F2FF 100%)',
            borderRadius: '14px',
            border: '1px solid rgba(0, 102, 204, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>💡</span>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                Pro Tips
              </h4>
            </div>
            <ul style={{
              margin: 0,
              paddingLeft: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8
            }}>
              <li>Add at least 3-5 symptoms for better accuracy</li>
              <li>Include duration (e.g., "headache for 3 days")</li>
              <li>Mention any related symptoms, even minor ones</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div style={{ ...styles.glassCard, marginTop: '2rem' }} className="fade-in">
            {/* Results Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--gray-100)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #00C853 0%, #00BFA5 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  boxShadow: '0 8px 20px -5px rgba(0, 200, 83, 0.3)'
                }}>
                  ✨
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                    Analysis Complete
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {result.predictions?.length || 0} possible conditions identified
                  </p>
                </div>
              </div>
              <span style={{
                padding: '0.5rem 1rem',
                background: result.confidence_level === 'high_confidence_disease_match' 
                  ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                  : result.confidence_level === 'medium_confidence_gp_priority'
                  ? 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)'
                  : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: result.confidence_level === 'high_confidence_disease_match' 
                  ? '#2E7D32'
                  : result.confidence_level === 'medium_confidence_gp_priority'
                  ? '#F57C00'
                  : '#C62828'
              }}>
                {result.confidence_level === 'high_confidence_disease_match' 
                  ? '🎯 High Confidence'
                  : result.confidence_level === 'medium_confidence_gp_priority'
                  ? '⚠️ Medium Confidence'
                  : '📋 Consult GP'}
              </span>
            </div>

            {/* Predictions Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {result.predictions?.map((prediction, index) => {
                const confidence = (prediction.prob * 100)
                const isTop = index === 0
                const confidenceColor = prediction.prob >= 0.6 ? '#00C853' : 
                                       prediction.prob >= 0.4 ? '#FFB300' : '#FF5252'
                
                return (
                  <div 
                    key={index}
                    style={{
                      ...styles.resultCard,
                      ...(isTop ? styles.resultCardTop : {}),
                      animation: `slideUp 0.5s ease ${index * 0.1}s both`
                    }}
                  >
                    {isTop && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)',
                        color: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '0 18px 0 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        🏆 Most Likely
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {/* Circular Progress */}
                      <ProgressRing 
                        progress={confidence} 
                        size={isTop ? 70 : 56} 
                        strokeWidth={isTop ? 7 : 5}
                        color={confidenceColor}
                      />
                      
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h4 style={{ 
                          margin: '0 0 0.5rem',
                          fontSize: isTop ? '1.4rem' : '1.15rem',
                          fontWeight: isTop ? 800 : 600,
                          color: isTop ? 'var(--primary)' : 'var(--text-primary)',
                          textTransform: 'capitalize'
                        }}>
                          {prediction.disease?.replace(/_/g, ' ')}
                        </h4>
                        
                        {/* Progress Bar */}
                        <div style={{
                          height: isTop ? '10px' : '6px',
                          background: 'var(--gray-100)',
                          borderRadius: '5px',
                          overflow: 'hidden',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            width: `${confidence}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${confidenceColor} 0%, ${confidenceColor}88 100%)`,
                            borderRadius: '5px',
                            transition: 'width 1s ease-out'
                          }} />
                        </div>
                        
                        <p style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)'
                        }}>
                          {prediction.prob >= 0.6 ? 'High probability match' : 
                           prediction.prob >= 0.4 ? 'Moderate probability' : 'Low probability - consider other factors'}
                        </p>
                      </div>

                      <span style={{
                        padding: '0.5rem 1rem',
                        background: prediction.prob >= 0.6 
                          ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                          : prediction.prob >= 0.4
                          ? 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)'
                          : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: confidenceColor
                      }}>
                        {prediction.prob >= 0.6 ? 'High' : 
                         prediction.prob >= 0.4 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Unknown Symptoms Warning */}
            {result.unknown_symptoms?.length > 0 && (
              <div style={{
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', color: '#E65100' }}>
                    Unrecognized Symptoms
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {result.unknown_symptoms.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #FFF8E1 0%, #FFFDE7 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 179, 0, 0.3)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ 
                  fontSize: '1.5rem', 
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 179, 0, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ⚕️
                </span>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#F57C00' }}>
                    Medical Disclaimer
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    This AI-powered analysis is for <strong>informational purposes only</strong> and should not 
                    replace professional medical advice. Please consult a qualified healthcare provider for accurate 
                    diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              <button 
                onClick={() => setRoute("consult")}
                style={{
                  padding: '1.1rem 1.5rem',
                  background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px -8px rgba(0, 102, 204, 0.4)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(0, 102, 204, 0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 25px -8px rgba(0, 102, 204, 0.4)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👨‍⚕️</span>
                Consult Doctor
              </button>
              
              <button 
                onClick={() => setRoute("wellness")}
                style={{
                  padding: '1.1rem 1.5rem',
                  background: 'white',
                  color: 'var(--primary)',
                  border: '2px solid var(--primary)',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary-light)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🏥</span>
                Explore Services
              </button>
              
              <button 
                onClick={() => {
                  setResult(null)
                  setSymptoms([])
                }}
                style={{
                  padding: '1.1rem 1.5rem',
                  background: 'var(--gray-100)',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--gray-200)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--gray-100)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔄</span>
                New Check
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '3rem',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: '🔒', text: 'SSL Encrypted' },
            { icon: '🏥', text: 'HIPAA Compliant' },
            { icon: '✅', text: '10K+ Users' }
          ].map((badge, i) => (
            <div 
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .step-indicator {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}
