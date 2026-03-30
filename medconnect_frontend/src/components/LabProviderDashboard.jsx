import { useState, useEffect } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import { api } from '../api'
import { 
  TestTube, Calendar, Clock, CheckCircle, X, AlertCircle,
  Building, Star, Phone, MapPin, Activity, Settings,
  ChevronRight, Search, Filter, User, FileText, Plus
} from './ui/icons/Icon'

// Status colors for bookings
const STATUS_COLORS = {
  PENDING: { bg: '#FFF3E0', color: '#E65100', label: 'Pending' },
  CONFIRMED: { bg: '#E3F2FD', color: '#1565C0', label: 'Confirmed' },
  SAMPLE_COLLECTED: { bg: '#E8F5E9', color: '#2E7D32', label: 'Sample Collected' },
  PROCESSING: { bg: '#FFF8E1', color: '#F57C00', label: 'Processing' },
  COMPLETED: { bg: '#F3E5F5', color: '#7B1FA2', label: 'Completed' },
  CANCELLED: { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' },
  REFUNDED: { bg: '#ECEFF1', color: '#546E7A', label: 'Refunded' }
}

export default function LabProviderDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [testOfferings, setTestOfferings] = useState([])
  const [availableTests, setAvailableTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddTestModal, setShowAddTestModal] = useState(false)
  const [newTestData, setNewTestData] = useState({
    test: '',
    price: '',
    discounted_price: '',
    is_available: true,
    home_collection_available: true
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings()
    } else if (activeTab === 'tests') {
      loadTestOfferings()
      loadAvailableTests()
    }
  }, [activeTab, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [dashData, profileData] = await Promise.all([
        api.getLabProviderDashboard(),
        api.getLabProviderProfile()
      ])
      setDashboardData(dashData)
      setProfile(profileData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      const filters = statusFilter ? { status: statusFilter } : {}
      const data = await api.getLabProviderBookings(filters)
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings:', err)
    }
  }

  const loadTestOfferings = async () => {
    try {
      const data = await api.getLabProviderTestOfferings()
      setTestOfferings(data)
    } catch (err) {
      console.error('Failed to load test offerings:', err)
    }
  }

  const loadAvailableTests = async () => {
    try {
      const data = await api.getLabTests()
      setAvailableTests(data)
    } catch (err) {
      console.error('Failed to load available tests:', err)
    }
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.updateLabProviderBookingStatus(bookingId, { status: newStatus })
      loadBookings()
      alert('Booking status updated successfully')
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleAddTestOffering = async (e) => {
    e.preventDefault()
    try {
      await api.addTestOffering({
        test: parseInt(newTestData.test),
        price: parseFloat(newTestData.price),
        discounted_price: newTestData.discounted_price ? parseFloat(newTestData.discounted_price) : null,
        is_available: newTestData.is_available,
        home_collection_available: newTestData.home_collection_available
      })
      setShowAddTestModal(false)
      setNewTestData({ test: '', price: '', discounted_price: '', is_available: true, home_collection_available: true })
      loadTestOfferings()
      alert('Test added successfully')
    } catch (err) {
      alert('Failed to add test: ' + err.message)
    }
  }

  const handleDeleteTestOffering = async (offeringId) => {
    if (!confirm('Are you sure you want to remove this test?')) return
    try {
      await api.deleteTestOffering(offeringId)
      loadTestOfferings()
    } catch (err) {
      alert('Failed to remove test: ' + err.message)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString()}`
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--gray-50)'
      }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--gray-50)'
      }}>
        <McCard style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--mc-semantic-error)" style={{ marginBottom: '1rem' }} />
          <h3>Error Loading Dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <McButton variant="primary" onClick={loadData}>Try Again</McButton>
        </McCard>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="lab-provider-overview" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <McCard style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Activity size={32} color="var(--mc-primary)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{dashboardData?.total_bookings || 0}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Bookings</p>
        </McCard>
        
        <McCard style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Calendar size={32} color="var(--mc-accent)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{dashboardData?.today_bookings || 0}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Today's Bookings</p>
        </McCard>
        
        <McCard style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Clock size={32} color="#E65100" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{dashboardData?.pending_bookings || 0}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pending</p>
        </McCard>
        
        <McCard style={{ padding: '1.5rem', textAlign: 'center' }}>
          <CheckCircle size={32} color="var(--mc-semantic-success)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{dashboardData?.completed_bookings || 0}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Completed</p>
        </McCard>
      </div>

      {/* Revenue & Tests */}
      <div className="lab-provider-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <McCard style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Revenue Stats
          </h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--mc-semantic-success)' }}>
            {formatPrice(dashboardData?.total_revenue || 0)}
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>Total Revenue (Paid)</p>
        </McCard>
        
        <McCard style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TestTube size={20} /> Tests & Reviews
          </h4>
          <div className="lab-provider-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{dashboardData?.total_tests_offered || 0}</div>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Tests Offered</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={20} color="#FFC107" /> {dashboardData?.average_rating || 0}
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{dashboardData?.total_reviews || 0} Reviews</p>
            </div>
          </div>
        </McCard>
      </div>

      {/* Lab Info */}
      {profile && profile.lab && (
        <McCard style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} /> Lab Information
          </h4>
          <div className="lab-provider-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Lab Name</h5>
              <p style={{ margin: 0, fontWeight: 500 }}>{profile.lab.name}</p>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Status</h5>
              <Badge variant={profile.is_approved ? 'success' : 'warning'}>
                {profile.is_approved ? 'Verified' : 'Pending Verification'}
              </Badge>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Address</h5>
              <p style={{ margin: 0 }}>{profile.lab.address}, {profile.lab.city}</p>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Phone</h5>
              <p style={{ margin: 0 }}>{profile.lab.phone}</p>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Certifications</h5>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {profile.lab.is_nabl_certified && <Badge variant="primary">NABL</Badge>}
                {profile.lab.is_cap_certified && <Badge variant="primary">CAP</Badge>}
              </div>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>Working Hours</h5>
              <p style={{ margin: 0 }}>{profile.lab.opening_time} - {profile.lab.closing_time}</p>
            </div>
          </div>
        </McCard>
      )}
    </div>
  )

  const renderBookings = () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'white',
            minWidth: 150
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SAMPLE_COLLECTED">Sample Collected</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <McButton variant="outline" onClick={loadBookings}>
          <Search size={16} /> Refresh
        </McButton>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <McCard style={{ padding: '3rem', textAlign: 'center' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Bookings Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No bookings match your filter criteria</p>
        </McCard>
      ) : (
        bookings.map(booking => (
          <McCard key={booking.id} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem' }}>#{booking.booking_id}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {booking.patient_name} • {booking.patient_phone}
                </p>
              </div>
              <Badge 
                style={{ 
                  background: STATUS_COLORS[booking.status]?.bg,
                  color: STATUS_COLORS[booking.status]?.color
                }}
              >
                {STATUS_COLORS[booking.status]?.label || booking.status}
              </Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tests</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{booking.test_names?.join(', ') || booking.package_name || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Scheduled</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{formatDate(booking.scheduled_date)} at {booking.scheduled_time}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Collection</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{booking.collection_type}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Amount</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{formatPrice(booking.total_amount)}</p>
              </div>
            </div>

            {booking.collection_type === 'HOME' && booking.collection_address && (
              <div style={{ 
                background: 'var(--gray-50)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <MapPin size={16} color="var(--text-secondary)" style={{ marginTop: 2 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  {booking.collection_address}, {booking.collection_city} - {booking.collection_pincode}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {booking.status === 'PENDING' && (
                  <McButton 
                    variant="primary" 
                    size="small"
                    onClick={() => handleUpdateBookingStatus(booking.booking_id, 'CONFIRMED')}
                  >
                    Confirm
                  </McButton>
                )}
                {booking.status === 'CONFIRMED' && (
                  <McButton 
                    variant="primary" 
                    size="small"
                    onClick={() => handleUpdateBookingStatus(booking.booking_id, 'SAMPLE_COLLECTED')}
                  >
                    Mark Sample Collected
                  </McButton>
                )}
                {booking.status === 'SAMPLE_COLLECTED' && (
                  <McButton 
                    variant="primary" 
                    size="small"
                    onClick={() => handleUpdateBookingStatus(booking.booking_id, 'PROCESSING')}
                  >
                    Mark Processing
                  </McButton>
                )}
                {booking.status === 'PROCESSING' && (
                  <McButton 
                    variant="primary" 
                    size="small"
                    onClick={() => handleUpdateBookingStatus(booking.booking_id, 'COMPLETED')}
                  >
                    Mark Completed
                  </McButton>
                )}
                {booking.status !== 'CANCELLED' && (
                  <McButton 
                    variant="outline" 
                    size="small"
                    onClick={() => handleUpdateBookingStatus(booking.booking_id, 'CANCELLED')}
                  >
                    Cancel
                  </McButton>
                )}
              </div>
            )}
          </McCard>
        ))
      )}
    </div>
  )

  const renderTests = () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Test Offerings ({testOfferings.length})</h3>
        <McButton variant="primary" onClick={() => setShowAddTestModal(true)}>
          <Plus size={16} /> Add Test
        </McButton>
      </div>

      {testOfferings.length === 0 ? (
        <McCard style={{ padding: '3rem', textAlign: 'center' }}>
          <TestTube size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Tests Added</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add tests to start receiving bookings</p>
          <McButton variant="primary" onClick={() => setShowAddTestModal(true)}>
            <Plus size={16} /> Add Your First Test
          </McButton>
        </McCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {testOfferings.map(offering => (
            <McCard key={offering.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem' }}>{offering.test_name}</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {offering.test_code} • {offering.test_category}
                  </p>
                </div>
                <Badge variant={offering.is_available ? 'success' : 'muted'}>
                  {offering.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Price</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {offering.discounted_price ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                          {formatPrice(offering.price)}
                        </span>
                        {formatPrice(offering.discounted_price)}
                      </>
                    ) : (
                      formatPrice(offering.price)
                    )}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sample</p>
                  <p style={{ margin: 0 }}>{offering.sample_type}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {offering.home_collection_available && (
                  <Badge variant="outline" style={{ fontSize: '0.75rem' }}>Home Collection</Badge>
                )}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <McButton 
                  variant="outline" 
                  size="small" 
                  style={{ color: 'var(--mc-semantic-error)' }}
                  onClick={() => handleDeleteTestOffering(offering.id)}
                >
                  Remove
                </McButton>
              </div>
            </McCard>
          ))}
        </div>
      )}

      {/* Add Test Modal */}
      {showAddTestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <McCard className="lab-provider-modal-card" style={{ width: '100%', maxWidth: 500, padding: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Add Test Offering</h3>
            <form onSubmit={handleAddTestOffering}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Test *</label>
                <select
                  value={newTestData.test}
                  onChange={(e) => setNewTestData(prev => ({ ...prev, test: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <option value="">Select a test</option>
                  {availableTests.map(test => (
                    <option key={test.id} value={test.id}>
                      {test.code} - {test.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="lab-provider-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price (₹) *</label>
                  <input
                    type="number"
                    value={newTestData.price}
                    onChange={(e) => setNewTestData(prev => ({ ...prev, price: e.target.value }))}
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={newTestData.discounted_price}
                    onChange={(e) => setNewTestData(prev => ({ ...prev, discounted_price: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newTestData.is_available}
                    onChange={(e) => setNewTestData(prev => ({ ...prev, is_available: e.target.checked }))}
                  />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newTestData.home_collection_available}
                    onChange={(e) => setNewTestData(prev => ({ ...prev, home_collection_available: e.target.checked }))}
                  />
                  Home Collection
                </label>
              </div>

              <div className="lab-provider-modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <McButton type="button" variant="outline" onClick={() => setShowAddTestModal(false)}>
                  Cancel
                </McButton>
                <McButton type="submit" variant="primary">
                  Add Test
                </McButton>
              </div>
            </form>
          </McCard>
        </div>
      )}
    </div>
  )

  const renderProfile = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {profile && (
        <>
          <McCard style={{ padding: '1.5rem' }}>
            <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} /> Provider Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.full_name}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.email}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Designation</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.designation || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Contact Phone</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.contact_phone}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>License Number</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.license_number}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>GST Number</p>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.gst_number || 'N/A'}</p>
              </div>
            </div>
          </McCard>

          {profile.lab && (
            <McCard style={{ padding: '1.5rem' }}>
              <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={20} /> Lab Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lab Name</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.lab.name}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.lab.phone}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Address</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>
                    {profile.lab.address}, {profile.lab.city}, {profile.lab.state} - {profile.lab.pincode}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Working Hours</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>
                    {profile.lab.opening_time} - {profile.lab.closing_time}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Working Days</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>{profile.lab.working_days}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Home Collection</p>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 500 }}>
                    {profile.lab.offers_home_collection ? `Yes (Fee: ₹${profile.lab.home_collection_fee})` : 'No'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Certifications</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {profile.lab.is_nabl_certified && <Badge variant="primary">NABL</Badge>}
                    {profile.lab.is_cap_certified && <Badge variant="primary">CAP</Badge>}
                    {!profile.lab.is_nabl_certified && !profile.lab.is_cap_certified && 'None'}
                  </div>
                </div>
              </div>
            </McCard>
          )}
        </>
      )}
    </div>
  )

  return (
    <div className="lab-provider-dashboard-page" style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: 'var(--gray-50)',
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="lab-provider-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem' }}>Lab Provider Dashboard</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Manage your lab, tests, and bookings
              </p>
            </div>
            {!profile?.is_approved && (
              <Badge variant="warning" style={{ padding: '0.75rem 1rem' }}>
                <AlertCircle size={16} /> Account Pending Verification
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="lab-provider-tabs" style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
            { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
            { id: 'tests', label: 'Test Offerings', icon: <TestTube size={16} /> },
            { id: 'profile', label: 'Profile', icon: <Settings size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: activeTab === tab.id ? 'var(--mc-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'tests' && renderTests()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  )
}
