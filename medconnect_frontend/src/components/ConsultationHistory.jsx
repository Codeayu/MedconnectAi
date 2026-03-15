import { useState, useEffect } from "react"
import McCard from './ui-next/McCard'
import Badge from './ui/Badge'
import McButton from './ui-next/McButton'
import { api } from '../api'
import { FileText, Clock, CheckCircle, Calendar, UserDoctor, BarChart, AlertCircle, MessageCircle } from './ui/icons/Icon'

export default function ConsultationHistory({ onBack }) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reviewDraft, setReviewDraft] = useState({ consultationId: null, doctorId: null, rating: 5, comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    fetchConsultations()
  }, [])

  async function fetchConsultations() {
    try {
      const data = await api.getPatientConsultations()
      setConsultations(data)
    } catch (err) {
      setError("Failed to load consultations")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    ONGOING: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error',
    REJECTED: 'error'
  }

  const statusIcons = {
    PENDING: AlertCircle,
    CONFIRMED: UserDoctor,
    ONGOING: BarChart,
    COMPLETED: CheckCircle,
    CANCELLED: AlertCircle,
    REJECTED: AlertCircle
  }

  async function submitReview() {
    if (!reviewDraft.consultationId || !reviewDraft.doctorId) return
    try {
      setReviewSubmitting(true)
      await api.submitReview(reviewDraft.doctorId, {
        consultation: reviewDraft.consultationId,
        rating: Number(reviewDraft.rating),
        comment: reviewDraft.comment
      })
      setReviewDraft({ consultationId: null, doctorId: null, rating: 5, comment: '' })
      await fetchConsultations()
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ 
      background: 'var(--gray-50)', 
      minHeight: 'calc(100vh - 80px)', 
      padding: '3rem 0' 
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {onBack && (
          <McButton 
            variant="outline" 
            onClick={onBack}
            style={{ marginBottom: '2rem' }}
          >
            ← Back to Dashboard
          </McButton>
        )}

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, var(--mc-primary-500) 0%, var(--mc-secondary-500) 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 20px rgba(0, 102, 204, 0.25)'
          }}>
            <FileText size={32} color="white" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
            My Consultations
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Track your medical consultations and appointments
          </p>
        </div>
        
        {loading ? (
          <McCard style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--mc-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Clock size={24} color="var(--mc-neutral-400)" />
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Loading consultations...
            </p>
          </McCard>
        ) : error ? (
          <McCard style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertCircle size={24} color="#C62828" />
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--error)' }}>
              {error}
            </h3>
            <McButton 
              variant="primary" 
              onClick={fetchConsultations}
              style={{ marginTop: '1rem' }}
            >
              Retry
            </McButton>
          </McCard>
        ) : consultations.length === 0 ? (
          <McCard style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--mc-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileText size={28} color="var(--mc-neutral-400)" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>No Consultations Yet</h3>
            <p style={{ 
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem'
            }}>
              Start your health journey by checking your symptoms with our AI-powered tool
            </p>
            <McButton 
              variant="primary"
              onClick={onBack}
            >
              Check Symptoms Now
            </McButton>
          </McCard>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <McCard style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--mc-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <BarChart size={20} color="var(--mc-primary-500)" />
                </div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--mc-primary-500)'
                }}>
                  {consultations.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Total Consultations
                </div>
              </McCard>
              
              <McCard style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <Clock size={20} color="#E65100" />
                </div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--warning)'
                }}>
                  {consultations.filter(c => c.status === 'REQUESTED' || c.status === 'ASSIGNED').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Pending
                </div>
              </McCard>
              
              <McCard style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <CheckCircle size={20} color="var(--mc-semantic-success)" />
                </div>
                <div style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700,
                  color: 'var(--success)'
                }}>
                  {consultations.filter(c => c.status === 'COMPLETED').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Completed
                </div>
              </McCard>
            </div>

            {/* Consultations List */}
            <div className="grid" style={{ gap: '1.25rem' }}>
              {consultations.map((consultation, index) => (
                <McCard 
                  key={consultation.id} 
                  hover
                  className="fade-in"
                  style={{ 
                    padding: '1.75rem',
                    animationDelay: `${index * 0.1}s`,
                    border: `2px solid ${
                      consultation.status === 'COMPLETED' ? 'var(--success)' :
                      consultation.status === 'ONGOING' ? 'var(--primary)' :
                      'var(--border)'
                    }`
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h3 style={{ fontSize: '1.4rem', margin: 0 }}>
                          Consultation #{consultation.id}
                        </h3>
                        <Badge variant={statusColors[consultation.status]}>
                          {(() => { const IC = statusIcons[consultation.status]; return IC ? <IC size={14} /> : null; })()}
                          {' '}{consultation.status}
                        </Badge>
                      </div>
                      <p style={{ 
                        margin: 0,
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem'
                      }}>
                                              <Calendar size={14} /> {formatDate(consultation.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* AI Prediction */}
                  {consultation.ai_prediction && (
                    <div style={{
                      background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--primary-light)'
                    }}>
                      <h4 style={{ 
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        color: 'var(--mc-primary-500)'
                      }}>
                        <BarChart size={16} /> AI Analysis
                      </h4>
                      <div style={{ 
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {consultation.ai_prediction.top_diseases?.map((disease, i) => (
                          <Badge key={i} variant="primary">
                            {disease}
                            {consultation.ai_prediction.confidence?.[i] && 
                              ` (${Math.round(consultation.ai_prediction.confidence[i] * 100)}%)`
                            }
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor Info */}
                  {consultation.doctor ? (
                    <div style={{
                      background: 'var(--success)10',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--success)'
                    }}>
                      <strong style={{ color: 'var(--success)' }}>
                        <UserDoctor size={16} /> Assigned Doctor:
                      </strong>  {consultation.doctor}
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--warning)10',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--warning)'
                    }}>
                      <strong style={{ color: 'var(--warning)' }}>
                        <Clock size={16} /> Awaiting Doctor Assignment
                      </strong>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <McButton variant="outline" size="sm">
                      <FileText size={14} /> View Details
                    </McButton>
                    {consultation.status === 'CONFIRMED' && (
                      <McButton variant="primary" size="sm">
                        <MessageCircle size={14} /> Start Consultation
                      </McButton>
                    )}
                    {consultation.status === 'COMPLETED' && consultation.doctor_profile_id && !consultation.is_reviewed && (
                      <McButton
                        variant="primary"
                        size="sm"
                        onClick={() => setReviewDraft({
                          consultationId: consultation.id,
                          doctorId: consultation.doctor_profile_id,
                          rating: 5,
                          comment: ''
                        })}
                      >
                        <CheckCircle size={14} /> Review Doctor
                      </McButton>
                    )}
                    {consultation.status === 'COMPLETED' && consultation.is_reviewed && (
                      <McButton variant="outline" size="sm" disabled>
                        <CheckCircle size={14} /> Review Submitted
                      </McButton>
                    )}
                  </div>
                </McCard>
              ))}
            </div>
          </>
        )}

        {reviewDraft.consultationId && (
          <McCard style={{ marginTop: '1rem', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Review Doctor</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                Rating
                <select
                  value={reviewDraft.rating}
                  onChange={(e) => setReviewDraft(prev => ({ ...prev, rating: e.target.value }))}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                Comment (optional)
                <textarea
                  rows={3}
                  value={reviewDraft.comment}
                  onChange={(e) => setReviewDraft(prev => ({ ...prev, comment: e.target.value }))}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                  placeholder="Share your experience"
                />
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <McButton variant="primary" onClick={submitReview} disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </McButton>
                <McButton
                  variant="outline"
                  onClick={() => setReviewDraft({ consultationId: null, doctorId: null, rating: 5, comment: '' })}
                  disabled={reviewSubmitting}
                >
                  Cancel
                </McButton>
              </div>
            </div>
          </McCard>
        )}
      </div>
    </div>
  )
}
