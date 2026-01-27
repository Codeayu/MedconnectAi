import { useState } from "react"
import WellnessHub from "./WellnessHub"
import Card from "./components/ui/Card"
import Button from "./components/ui/Button"
import Badge from "./components/ui/Badge"
import { api } from "./api"

export default function SymptomChecker({ onBack }) {
  const [symptoms, setSymptoms] = useState("")
  const [result, setResult] = useState(null)
  const [route, setRoute] = useState("diagnose")
  const [loading, setLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  async function analyze() {
    if (!symptoms.trim()) return
    
    setLoading(true)
    try {
      const data = await api.predictSymptoms(
        symptoms.split(",").map(s => s.trim())
      )
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
        // Could navigate to consultation history here
      }, 500)
    } catch (error) {
      console.error('Error booking consultation:', error)
      alert('Failed to book consultation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // CONSULT FLOW
  if (route === "consult" && result) {
    return (
      <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <Button 
            variant="outline" 
            onClick={() => setRoute("diagnose")}
            style={{ marginBottom: '2rem' }}
          >
            ← Back to Results
          </Button>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="primary" icon="👨‍⚕️">Recommended Specialists</Badge>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              Consult with Top Doctors
            </h2>
            <p style={{ fontSize: '1.05rem' }}>
              Based on your symptoms, these specialists can help
            </p>
          </div>

          <div className="grid" style={{ gap: '1.25rem' }}>
            {result.recommended_doctors?.map((doc, i) => (
              <Card key={i} className="fade-in" style={{ 
                animationDelay: `${i * 0.1}s`,
                padding: '1.75rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0
                  }}>
                    👨‍⚕️
                  </div>
                  
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.35rem' }}>
                      {doc.name}
                    </h3>
                    <p style={{ 
                      margin: '0.5rem 0',
                      color: 'var(--primary)',
                      fontWeight: 500
                    }}>
                      {doc.specialization}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <Badge variant="success">⭐ {doc.rating}</Badge>
                      <Badge variant="primary">💰 ₹{doc.consultation_fee}</Badge>
                      <Badge variant="secondary">📞 Available</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => bookConsultation(doc)}
                    disabled={loading || bookingSuccess}
                  >
                    {bookingSuccess ? '✅ Booked!' : '📅 Book Consultation'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // WELLNESS FLOW
  if (route === "wellness") {
    return <WellnessHub onBack={() => setRoute("diagnose")} />
  }

  // DIAGNOSIS FLOW
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Badge variant="primary" icon="🤖">AI-Powered</Badge>
          <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '2.5rem' }}>
            Symptom Analysis
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Get instant preliminary health insights powered by advanced AI
          </p>
        </div>

        <Card className="scale-in" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--primary-light)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>ℹ️</span>
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  How to use the symptom checker
                </h4>
                <ul style={{ 
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6
                }}>
                  <li>List all your symptoms separated by commas</li>
                  <li>Be specific about location, duration, and severity</li>
                  <li>Include both major and minor symptoms</li>
                </ul>
              </div>
            </div>
          </div>

          <label style={{ 
            display: 'block',
            marginBottom: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}>
            Describe Your Symptoms
          </label>
          
          <textarea
            placeholder="e.g., fever, headache, body ache, fatigue, sore throat..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            rows={5}
            style={{ 
              marginBottom: '1.5rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />

          <Button 
            variant="primary"
            size="lg"
            onClick={analyze}
            disabled={loading || !symptoms.trim()}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>⏳ Analyzing Your Symptoms...</>
            ) : (
              <>🔍 Analyze Symptoms</>
            )}
          </Button>
        </Card>

        {result && (
          <Card className="fade-in" style={{
            padding: '2rem',
            border: '2px solid var(--primary)',
            background: 'linear-gradient(135deg, #ffffff 0%, #E6F2FF 100%)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <Badge variant="primary" icon="🩺" style={{ marginBottom: '1rem' }}>
                Analysis Result
              </Badge>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                Possible Condition
              </h3>
              <div style={{ 
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{ 
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: 'var(--primary)'
                }}>
                  {result.top_prediction?.disease}
                </div>
                <Badge 
                  variant={
                    result.confidence_level === 'HIGH' ? 'success' : 
                    result.confidence_level === 'MEDIUM' ? 'warning' : 'error'
                  }
                >
                  Confidence: {result.confidence_level}
                </Badge>
              </div>
            </div>

            <div style={{
              background: '#FFF8E1',
              border: '2px solid var(--warning)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
                <div>
                  <h4 style={{ 
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}>
                    Medical Disclaimer
                  </h4>
                  <p style={{ 
                    margin: 0,
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    This is an AI-based preliminary assessment and <strong>not a medical diagnosis</strong>. 
                    Please consult a qualified healthcare professional for accurate diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <Button 
                variant="primary"
                onClick={() => setRoute("consult")}
              >
                👨‍⚕️ Consult Doctor
              </Button>
              <Button 
                variant="outline"
                onClick={() => setRoute("wellness")}
              >
                🏥 Explore Services
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setResult(null)
                  setSymptoms("")
                }}
              >
                🔄 New Check
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
