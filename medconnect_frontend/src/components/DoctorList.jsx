import { useState, useEffect } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { api } from '../api'

const EMOJI = {
  doctor: '👨‍⚕️',
  star: '⭐',
  clock: '🕐',
  money: '💰',
  online: '🟢',
  offline: '⚫',
  video: '📹',
  chat: '💬',
  phone: '📞',
  person: '🏥',
  search: '🔍',
  filter: '🎯',
  calendar: '📅',
  check: '✅'
}

export default function DoctorList({ onBack, onBook }) {
  const [doctors, setDoctors] = useState([])
  const [specializations, setSpecializations] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filters
  const [filters, setFilters] = useState({
    specialization: '',
    is_online: false,
    min_rating: '',
    max_fee: '',
    search: ''
  })

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    consultation_type: 'VIDEO',
    scheduled_date: '',
    scheduled_time: '',
    symptoms: ''
  })

  useEffect(() => {
    loadSpecializations()
    loadDoctors()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDoctors()
    }, 300)
    return () => clearTimeout(timer)
  }, [filters])

  const loadSpecializations = async () => {
    try {
      const data = await api.getSpecializations()
      setSpecializations(data)
    } catch (err) {
      console.error('Failed to load specializations:', err)
    }
  }

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const filterParams = {}
      if (filters.specialization) filterParams.specialization = filters.specialization
      if (filters.is_online) filterParams.is_online = 'true'
      if (filters.min_rating) filterParams.min_rating = filters.min_rating
      if (filters.max_fee) filterParams.max_fee = filters.max_fee
      if (filters.search) filterParams.search = filters.search
      
      const data = await api.getDoctorsList(filterParams)
      setDoctors(data)
    } catch (err) {
      setError('Failed to load doctors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookConsultation = async () => {
    if (!bookingForm.scheduled_date || !bookingForm.scheduled_time) {
      setError('Please select date and time')
      return
    }

    try {
      setBookingLoading(true)
      setError('')
      
      await api.bookConsultation({
        doctor_id: selectedDoctor.id,
        consultation_type: bookingForm.consultation_type,
        scheduled_date: bookingForm.scheduled_date,
        scheduled_time: bookingForm.scheduled_time,
        symptoms: bookingForm.symptoms
      })

      setSuccess('Consultation booked successfully! The doctor will confirm your appointment.')
      setShowBookingModal(false)
      setBookingForm({
        consultation_type: 'VIDEO',
        scheduled_date: '',
        scheduled_time: '',
        symptoms: ''
      })
      
      // Clear success after 5 seconds
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message || 'Failed to book consultation')
    } finally {
      setBookingLoading(false)
    }
  }

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowBookingModal(true)
    setError('')
  }

  const clearFilters = () => {
    setFilters({
      specialization: '',
      is_online: false,
      min_rating: '',
      max_fee: '',
      search: ''
    })
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack}
              style={{ marginBottom: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              ← Back to Dashboard
            </Button>
          )}
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
            {EMOJI.doctor} Find a Doctor
          </h1>
          <p style={{ opacity: 0.9, color: 'white' }}>
            Browse our network of verified healthcare professionals and book a consultation
          </p>
        </div>
      </section>

      {/* Success Alert */}
      {success && (
        <div className="container" style={{ marginTop: '1rem' }}>
          <div style={{
            background: '#E8F5E9',
            border: '1px solid #4CAF50',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {EMOJI.check} {success}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="container" style={{ padding: '1.5rem 1rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>{EMOJI.filter}</span>
            <h3 style={{ margin: 0 }}>Filter Doctors</h3>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {/* Search */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                {EMOJI.search} Search
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              />
            </div>

            {/* Specialization */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                Specialization
              </label>
              <select
                value={filters.specialization}
                onChange={e => setFilters({...filters, specialization: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'white'
                }}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec.value} value={spec.value}>{spec.label}</option>
                ))}
              </select>
            </div>

            {/* Max Fee */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                {EMOJI.money} Max Fee (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={filters.max_fee}
                onChange={e => setFilters({...filters, max_fee: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              />
            </div>

            {/* Min Rating */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
                {EMOJI.star} Min Rating
              </label>
              <select
                value={filters.min_rating}
                onChange={e => setFilters({...filters, min_rating: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'white'
                }}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.is_online}
                onChange={e => setFilters({...filters, is_online: e.target.checked})}
                style={{ width: '18px', height: '18px' }}
              />
              <span>{EMOJI.online} Show only online doctors</span>
            </label>
            
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Doctor List */}
      <div className="container" style={{ padding: '0 1rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem' }}>Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>No doctors found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your filters or search criteria
            </p>
          </Card>
        ) : (
          <>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {doctors.map(doctor => (
                <Card key={doctor.id} hover style={{ overflow: 'hidden' }}>
                  {/* Card Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                    padding: '1.5rem',
                    color: 'white',
                    position: 'relative'
                  }}>
                    {/* Online Status */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: doctor.is_online ? 'rgba(0,200,83,0.9)' : 'rgba(0,0,0,0.3)',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}>
                      {doctor.is_online ? EMOJI.online : EMOJI.offline}
                      {doctor.is_online ? 'Online' : 'Offline'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem'
                      }}>
                        {doctor.profile_image ? (
                          <img 
                            src={doctor.profile_image} 
                            alt={doctor.full_name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : EMOJI.doctor}
                      </div>
                      <div>
                        <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>
                          Dr. {doctor.full_name}
                        </h3>
                        <span style={{ opacity: 0.9 }}>{doctor.specialization_display}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.25rem' }}>
                    {/* Stats Row */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'var(--gray-50)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '0.25rem',
                          color: '#FFB300'
                        }}>
                          {EMOJI.star} {doctor.average_rating || 'N/A'}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({doctor.total_reviews || 0} reviews)
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600' }}>{doctor.experience_years} yrs</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                          ₹{doctor.consultation_fee}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fee</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {doctor.bio}
                      </p>
                    )}

                    {/* Completed Consultations */}
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)',
                      marginBottom: '1rem'
                    }}>
                      {EMOJI.check} {doctor.total_consultations || 0} consultations completed
                    </div>

                    {/* Book Button */}
                    <Button 
                      variant="primary" 
                      onClick={() => openBookingModal(doctor)}
                      style={{ width: '100%' }}
                    >
                      {EMOJI.calendar} Book Consultation
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <Card 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2>Book Consultation</h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Doctor Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {EMOJI.doctor}
              </div>
              <div>
                <h4 style={{ marginBottom: '0.125rem' }}>Dr. {selectedDoctor.full_name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {selectedDoctor.specialization_display}
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)', marginTop: '0.25rem' }}>
                  ₹{selectedDoctor.consultation_fee}/consultation
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FFEBEE',
                border: '1px solid #EF5350',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#C62828',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {/* Booking Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Consultation Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Consultation Type
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { value: 'VIDEO', label: 'Video Call', icon: EMOJI.video },
                    { value: 'AUDIO', label: 'Audio Call', icon: EMOJI.phone },
                    { value: 'CHAT', label: 'Chat', icon: EMOJI.chat },
                    { value: 'IN_PERSON', label: 'In-Person', icon: EMOJI.person }
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setBookingForm({...bookingForm, consultation_type: type.value})}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: bookingForm.consultation_type === type.value 
                          ? '2px solid var(--primary)' 
                          : '1px solid var(--border)',
                        background: bookingForm.consultation_type === type.value 
                          ? 'var(--primary-light)' 
                          : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{type.icon}</span>
                      <span style={{ fontSize: '0.8rem' }}>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {EMOJI.calendar} Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.scheduled_date}
                    onChange={e => setBookingForm({...bookingForm, scheduled_date: e.target.value})}
                    min={getMinDate()}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {EMOJI.clock} Time *
                  </label>
                  <input
                    type="time"
                    value={bookingForm.scheduled_time}
                    onChange={e => setBookingForm({...bookingForm, scheduled_time: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Describe Your Symptoms (Optional)
                </label>
                <textarea
                  value={bookingForm.symptoms}
                  onChange={e => setBookingForm({...bookingForm, symptoms: e.target.value})}
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Fee Info */}
              <div style={{
                padding: '1rem',
                background: '#E3F2FD',
                borderRadius: '8px',
                border: '1px solid #90CAF9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Consultation Fee</span>
                  <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    ₹{selectedDoctor.consultation_fee}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Payment will be collected after the doctor confirms your appointment.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                variant="primary"
                onClick={handleBookConsultation}
                disabled={bookingLoading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {bookingLoading ? 'Booking...' : `${EMOJI.check} Confirm Booking`}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
