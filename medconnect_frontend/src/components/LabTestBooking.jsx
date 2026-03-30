import { useState, useEffect } from 'react'
import McCard from './ui-next/McCard'
import McButton from './ui-next/McButton'
import Badge from './ui/Badge'
import { api } from '../api'
import { 
  TestTube, Search, Filter, MapPin, Clock, Calendar, 
  CheckCircle, X, ShoppingCart, Building, Star, 
  Home, Phone, FileText, AlertCircle, ChevronRight,
  Plus, Minus, Trash2, CreditCard, User
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

export default function LabTestBooking({ onBack, onNavigate }) {
  // Main view state
  const [activeView, setActiveView] = useState('labs') // labs, lab-tests, tests, packages, cart, bookings, booking-form
  const [activeTab, setActiveTab] = useState('all')
  
  // Data states
  const [categories, setCategories] = useState([])
  const [tests, setTests] = useState([])
  const [packages, setPackages] = useState([])
  const [labs, setLabs] = useState([])
  const [labProviders, setLabProviders] = useState([])
  const [selectedLabProvider, setSelectedLabProvider] = useState(null)
  const [labTestOfferings, setLabTestOfferings] = useState([])
  const [cart, setCart] = useState({ tests: [], packages: [], total_amount: 0 })
  const [bookings, setBookings] = useState([])
  
  // UI states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    lab_id: null,
    collection_type: 'HOME',
    scheduled_date: '',
    scheduled_time: '',
    collection_address: '',
    collection_city: '',
    collection_pincode: '',
    collection_landmark: '',
    patient_name: '',
    patient_age: '',
    patient_gender: 'MALE',
    patient_phone: '',
    patient_notes: ''
  })

  // Load data on mount
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading lab test data...')
      const [categoriesData, testsData, packagesData, labsData, labProvidersData, cartData] = await Promise.all([
        api.getLabTestCategories().catch(err => { console.error('Categories error:', err); return [] }),
        api.getLabTests().catch(err => { console.error('Tests error:', err); return [] }),
        api.getLabTestPackages().catch(err => { console.error('Packages error:', err); return [] }),
        api.getLabs().catch(err => { console.error('Labs error:', err); return [] }),
        api.getLabsWithTests().catch(err => { console.error('Labs with tests error:', err); return [] }),
        api.getCart().catch(() => ({ tests: [], packages: [], total_amount: 0 }))
      ])
      console.log('Tests loaded:', testsData)
      console.log('Categories loaded:', categoriesData)
      console.log('Packages loaded:', packagesData)
      console.log('Lab providers loaded:', labProvidersData)
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setTests(Array.isArray(testsData) ? testsData : [])
      setPackages(Array.isArray(packagesData) ? packagesData : [])
      setLabs(Array.isArray(labsData) ? labsData : [])
      setLabProviders(Array.isArray(labProvidersData) ? labProvidersData : [])
      setCart(cartData)
    } catch (err) {
      setError('Failed to load lab tests')
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getLabTestBookings()
      setBookings(data)
    } catch (err) {
      console.error('Bookings error:', err)
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const loadLabTestOfferings = async (labId) => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getLabTestsByLab(labId)
      // Extract test_offerings array from response
      setLabTestOfferings(data.test_offerings || data || [])
    } catch (err) {
      console.error('Lab test offerings error:', err)
      setError(err.message || 'Failed to load lab tests')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLab = (lab) => {
    setSelectedLabProvider(lab)
    setActiveView('lab-tests')
    loadLabTestOfferings(lab.id)
    // Pre-set the lab_id in booking form
    setBookingForm(prev => ({ ...prev, lab_id: lab.id }))
  }

  const handleAddToCart = async (testId = null, packageId = null, labId = null) => {
    try {
      const result = await api.addToCart({ test_id: testId, package_id: packageId, lab_id: labId })
      setCart(result.cart)
    } catch (err) {
      alert('Failed to add to cart')
    }
  }

  const handleRemoveFromCart = async (testId = null, packageId = null) => {
    try {
      const result = await api.removeFromCart({ test_id: testId, package_id: packageId })
      setCart(result.cart)
    } catch (err) {
      alert('Failed to remove from cart')
    }
  }

  const handleClearCart = async () => {
    try {
      const result = await api.clearCart()
      setCart(result.cart)
    } catch (err) {
      alert('Failed to clear cart')
    }
  }

  const handleBookNow = () => {
    if (cart.tests?.length === 0 && cart.packages?.length === 0) {
      alert('Your cart is empty!')
      return
    }
    const fallbackLabId = selectedLabProvider?.id || bookingForm.lab_id || null
    setBookingForm(prev => ({
      ...prev,
      lab_id: cart.selected_lab_id || fallbackLabId
    }))
    setActiveView('booking-form')
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    
    if (!bookingForm.lab_id) {
      alert('Please select a lab')
      return
    }
    
    try {
      setLoading(true)
      const bookingData = {
        ...bookingForm,
        test_ids: cart.tests?.map(t => t.id) || [],
        package_id: cart.packages?.[0]?.id || null
      }
      
      await api.createLabTestBooking(bookingData)
      await api.clearCart()
      setCart({ tests: [], packages: [], total_amount: 0 })
      alert('Booking created successfully!')
      setActiveView('bookings')
      loadBookings()
    } catch (err) {
      alert(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    const reason = prompt('Please provide a reason for cancellation:')
    if (!reason) return
    
    try {
      await api.cancelLabTestBooking(bookingId, { cancellation_reason: reason })
      loadBookings()
      alert('Booking cancelled successfully')
    } catch (err) {
      alert('Failed to cancel booking')
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

  // Filter tests based on search and category
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Navigation tabs
  const mainTabs = [
    { id: 'labs', label: 'Lab Providers', icon: Building },
    { id: 'tests', label: 'All Tests', icon: TestTube },
    { id: 'packages', label: 'Health Packages', icon: FileText },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'cart', label: `Cart (${(cart.tests?.length || 0) + (cart.packages?.length || 0)})`, icon: ShoppingCart }
  ]

  const isInCart = (testId) => cart.tests?.some(t => t.id === testId)
  const isPackageInCart = (packageId) => cart.packages?.some(p => p.id === packageId)

  // Filter labs based on search
  const filteredLabs = labProviders.filter(lab => 
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const bookingLabs = cart.selected_lab_id
    ? labs.filter(lab => lab.id === cart.selected_lab_id)
    : labs

  // Render lab provider card
  const renderLabCard = (lab) => (
    <McCard
      key={lab.id}
      hover
      onClick={() => handleSelectLab(lab)}
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        {/* Lab Logo/Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <Building size={28} />
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
            {lab.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <MapPin size={14} color="#6B7280" />
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{lab.city || 'Not specified'}</span>
          </div>
          {lab.certifications && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {lab.certifications.split(',').map((cert, idx) => (
                <Badge key={idx} variant="secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                  {cert.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lab Info */}
      <div style={{ marginBottom: '1rem' }}>
        {lab.description && (
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            {lab.description.length > 120 ? lab.description.substring(0, 120) + '...' : lab.description}
          </p>
        )}
      </div>

      {/* Features */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {lab.home_collection && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#059669' }}>
            <Home size={14} />
            <span>Home Collection</span>
          </div>
        )}
        {lab.test_offerings_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#2563EB' }}>
            <TestTube size={14} />
            <span>{lab.test_offerings_count} Tests Available</span>
          </div>
        )}
        {lab.operating_hours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#6B7280' }}>
            <Clock size={14} />
            <span>{lab.operating_hours}</span>
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <McButton
          variant="primary"
          size="small"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          View Tests <ChevronRight size={16} />
        </McButton>
      </div>
    </McCard>
  )

  // Render lab test offering card
  const renderLabTestOfferingCard = (offering) => (
    <McCard
      key={offering.id}
      hover
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
            {offering.test_name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            {offering.test_code} • {offering.test_category}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {offering.discounted_price ? (
            <>
              <p style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>
                {formatPrice(offering.price)}
              </p>
              <p style={{ color: '#059669', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                {formatPrice(offering.discounted_price)}
              </p>
            </>
          ) : (
            <p style={{ color: '#2563EB', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
              {formatPrice(offering.price)}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {offering.report_time_hours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#6B7280' }}>
            <Clock size={14} />
            <span>Report in {offering.report_time_hours} hrs</span>
          </div>
        )}
        {offering.home_collection_available && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#059669' }}>
            <Home size={14} />
            <span>Home Collection</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isInCart(offering.test) ? (
          <McButton variant="outline" onClick={() => handleRemoveFromCart(offering.test)}>
            <Minus size={16} /> Remove
          </McButton>
        ) : (
          <McButton variant="primary" onClick={() => handleAddToCart(offering.test, null, selectedLabProvider?.id)}>
            <Plus size={16} /> Add to Cart
          </McButton>
        )}
      </div>
    </McCard>
  )

  // Render test card
  const renderTestCard = (test) => (
    <McCard
      key={test.id}
      hover
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
            {test.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            {test.code} • {test.category_name}
          </p>
        </div>
        {test.is_popular && (
          <Badge style={{ background: '#FEF3C7', color: '#D97706' }}>Popular</Badge>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TestTube size={14} /> {test.sample_type}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} /> {test.report_time_hours}h report
        </span>
        {test.fasting_required && (
          <span style={{ fontSize: '0.85rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={14} /> Fasting {test.fasting_hours}h
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {test.discounted_price ? (
            <>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>
                {formatPrice(test.discounted_price)}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                {formatPrice(test.base_price)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>
              {formatPrice(test.base_price)}
            </span>
          )}
        </div>
        
        {isInCart(test.id) ? (
          <McButton 
            variant="outline" 
            size="sm"
            onClick={() => handleRemoveFromCart(test.id)}
            style={{ borderColor: '#EF4444', color: '#EF4444' }}
          >
            <Minus size={16} /> Remove
          </McButton>
        ) : (
          <McButton 
            variant="primary" 
            size="sm"
            onClick={() => handleAddToCart(test.id)}
          >
            <Plus size={16} /> Add
          </McButton>
        )}
      </div>
    </McCard>
  )

  // Render package card
  const renderPackageCard = (pkg) => (
    <McCard
      key={pkg.id}
      hover
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: pkg.is_featured ? '2px solid #2563EB' : '1px solid rgba(0,0,0,0.05)',
        position: 'relative'
      }}
    >
      {pkg.is_featured && (
        <Badge style={{ 
          position: 'absolute', 
          top: '-10px', 
          right: '1rem',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: 'white'
        }}>
          <Star size={12} /> Featured
        </Badge>
      )}

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
        {pkg.name}
      </h3>
      
      <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '1rem' }}>
        {pkg.description}
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FileText size={14} /> {pkg.test_count} tests
        </span>
        <span style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} /> {pkg.report_time_hours}h report
        </span>
        {pkg.fasting_required && (
          <span style={{ fontSize: '0.85rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={14} /> Fasting {pkg.fasting_hours}h
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2563EB' }}>
            {formatPrice(pkg.package_price)}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
            {formatPrice(pkg.total_value)}
          </span>
          <Badge style={{ marginLeft: '0.5rem', background: '#D1FAE5', color: '#059669' }}>
            {pkg.discount_percentage}% off
          </Badge>
        </div>
        
        {isPackageInCart(pkg.id) ? (
          <McButton 
            variant="outline" 
            size="sm"
            onClick={() => handleRemoveFromCart(null, pkg.id)}
            style={{ borderColor: '#EF4444', color: '#EF4444' }}
          >
            <Minus size={16} /> Remove
          </McButton>
        ) : (
          <McButton 
            variant="primary" 
            size="sm"
            onClick={() => handleAddToCart(null, pkg.id)}
          >
            <Plus size={16} /> Add
          </McButton>
        )}
      </div>
    </McCard>
  )

  // Render booking card
  const renderBookingCard = (booking) => {
    const statusInfo = STATUS_COLORS[booking.status] || STATUS_COLORS.PENDING
    
    return (
      <McCard
        key={booking.id}
        style={{
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
              Booking #{booking.booking_id}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
              {booking.lab_name}
            </p>
          </div>
          <Badge style={{ background: statusInfo.bg, color: statusInfo.color }}>
            {statusInfo.label}
          </Badge>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#6B7280" /> {formatDate(booking.scheduled_date)}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="#6B7280" /> {booking.scheduled_time}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {booking.collection_type === 'HOME' ? <Home size={16} color="#6B7280" /> : <Building size={16} color="#6B7280" />}
            {booking.collection_type === 'HOME' ? 'Home Collection' : 'Lab Visit'}
          </span>
        </div>

        {booking.test_names && booking.test_names.length > 0 && (
          <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '1rem' }}>
            <strong>Tests:</strong> {booking.test_names.join(', ')}
          </p>
        )}

        {booking.package_name && (
          <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '1rem' }}>
            <strong>Package:</strong> {booking.package_name}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2563EB' }}>
            {formatPrice(booking.total_amount)}
          </span>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
              <McButton 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelBooking(booking.booking_id)}
                style={{ borderColor: '#EF4444', color: '#EF4444' }}
              >
                Cancel
              </McButton>
            )}
            <McButton 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedBooking(booking)}
            >
              View Details
            </McButton>
          </div>
        </div>
      </McCard>
    )
  }

  // Render cart view
  const renderCart = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        <ShoppingCart size={24} style={{ marginRight: '0.5rem' }} />
        Your Cart
      </h2>

      {/* Show selected lab if any */}
      {cart.selected_lab_name && (
        <McCard style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #EBF5FF, #F3E8FF)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building size={20} color="#2563EB" />
            <div>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>Tests from</p>
              <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{cart.selected_lab_name}</p>
            </div>
          </div>
        </McCard>
      )}

      {(cart.tests?.length === 0 && cart.packages?.length === 0) ? (
        <McCard style={{ padding: '3rem', textAlign: 'center' }}>
          <ShoppingCart size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#6B7280', marginBottom: '0.5rem' }}>Your cart is empty</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '1.5rem' }}>Add tests or packages to proceed</p>
          <McButton variant="primary" onClick={() => setActiveView('tests')}>
            Browse Tests
          </McButton>
        </McCard>
      ) : (
        <>
          {/* Cart items */}
          <div style={{ marginBottom: '1.5rem' }}>
            {cart.tests?.map(test => (
              <McCard key={test.id} style={{ padding: '1rem', marginBottom: '0.75rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{test.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>{test.code}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 700, color: '#2563EB' }}>{formatPrice(test.effective_price)}</span>
                    <McButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveFromCart(test.id)}
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={18} />
                    </McButton>
                  </div>
                </div>
              </McCard>
            ))}

            {cart.packages?.map(pkg => (
              <McCard key={pkg.id} style={{ padding: '1rem', marginBottom: '0.75rem', borderRadius: '12px', borderColor: '#2563EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Badge style={{ marginBottom: '0.5rem', background: '#EBF5FF', color: '#2563EB' }}>Package</Badge>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pkg.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>{pkg.test_count} tests included</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 700, color: '#2563EB' }}>{formatPrice(pkg.package_price)}</span>
                    <McButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveFromCart(null, pkg.id)}
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={18} />
                    </McButton>
                  </div>
                </div>
              </McCard>
            ))}
          </div>

          {/* Cart summary */}
          <McCard style={{ padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #F9FAFB, #FFFFFF)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(cart.total_amount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>{formatPrice(cart.total_amount)}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <McButton variant="outline" onClick={handleClearCart} style={{ flex: 1 }}>
                Clear Cart
              </McButton>
              <McButton variant="primary" onClick={handleBookNow} style={{ flex: 2 }}>
                <CreditCard size={18} /> Proceed to Book
              </McButton>
            </div>
          </McCard>
        </>
      )}
    </div>
  )

  // Render booking form
  const renderBookingForm = () => (
    <div>
      <McButton 
        variant="outline" 
        onClick={() => setActiveView('cart')}
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back to Cart
      </McButton>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Complete Your Booking
      </h2>

      <form onSubmit={handleSubmitBooking}>
        {/* Select Lab */}
        <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} /> Select Lab
          </h3>

          {cart.selected_lab_name && (
            <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: 0, marginBottom: '1rem' }}>
              This booking is locked to {cart.selected_lab_name} because the cart items were added from that lab.
            </p>
          )}
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {bookingLabs.map(lab => (
              <div
                key={lab.id}
                onClick={() => {
                  if (!cart.selected_lab_id) {
                    setBookingForm({ ...bookingForm, lab_id: lab.id })
                  }
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: bookingForm.lab_id === lab.id ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  cursor: cart.selected_lab_id ? 'default' : 'pointer',
                  background: bookingForm.lab_id === lab.id ? '#EBF5FF' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{lab.name}</h4>
                  {bookingForm.lab_id === lab.id && <CheckCircle size={20} color="#2563EB" />}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  <MapPin size={14} style={{ marginRight: '0.25rem' }} />
                  {lab.city}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {lab.is_nabl_certified && <Badge style={{ background: '#D1FAE5', color: '#059669' }}>NABL</Badge>}
                  {lab.offers_home_collection && <Badge style={{ background: '#EBF5FF', color: '#2563EB' }}>Home Collection</Badge>}
                </div>
              </div>
            ))}
          </div>
        </McCard>

        {/* Collection Type */}
        <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={20} /> Collection Type
          </h3>
          
          <div className="lab-booking-collection-types" style={{ display: 'flex', gap: '1rem' }}>
            <div
              onClick={() => setBookingForm({ ...bookingForm, collection_type: 'HOME' })}
              style={{
                flex: 1,
                padding: '1.25rem',
                borderRadius: '12px',
                border: bookingForm.collection_type === 'HOME' ? '2px solid #2563EB' : '1px solid #E5E7EB',
                cursor: 'pointer',
                textAlign: 'center',
                background: bookingForm.collection_type === 'HOME' ? '#EBF5FF' : 'white'
              }}
            >
              <Home size={28} color={bookingForm.collection_type === 'HOME' ? '#2563EB' : '#6B7280'} />
              <p style={{ fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Home Collection</p>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>Sample collected at your doorstep</p>
            </div>
            <div
              onClick={() => setBookingForm({ ...bookingForm, collection_type: 'LAB' })}
              style={{
                flex: 1,
                padding: '1.25rem',
                borderRadius: '12px',
                border: bookingForm.collection_type === 'LAB' ? '2px solid #2563EB' : '1px solid #E5E7EB',
                cursor: 'pointer',
                textAlign: 'center',
                background: bookingForm.collection_type === 'LAB' ? '#EBF5FF' : 'white'
              }}
            >
              <Building size={28} color={bookingForm.collection_type === 'LAB' ? '#2563EB' : '#6B7280'} />
              <p style={{ fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Lab Visit</p>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>Visit the lab for sample collection</p>
            </div>
          </div>
        </McCard>

        {/* Schedule */}
        <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Schedule
          </h3>
          
          <div className="lab-booking-grid-2" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Date *</label>
              <input
                type="date"
                required
                value={bookingForm.scheduled_date}
                onChange={(e) => setBookingForm({ ...bookingForm, scheduled_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Time *</label>
              <input
                type="time"
                required
                value={bookingForm.scheduled_time}
                onChange={(e) => setBookingForm({ ...bookingForm, scheduled_time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </McCard>

        {/* Home Collection Address */}
        {bookingForm.collection_type === 'HOME' && (
          <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} /> Collection Address
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Address *</label>
                <textarea
                  required
                  value={bookingForm.collection_address}
                  onChange={(e) => setBookingForm({ ...bookingForm, collection_address: e.target.value })}
                  placeholder="Enter your complete address"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div className="lab-booking-grid-2" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.collection_city}
                    onChange={(e) => setBookingForm({ ...bookingForm, collection_city: e.target.value })}
                    placeholder="City"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Pincode *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.collection_pincode}
                    onChange={(e) => setBookingForm({ ...bookingForm, collection_pincode: e.target.value })}
                    placeholder="Pincode"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Landmark</label>
                <input
                  type="text"
                  value={bookingForm.collection_landmark}
                  onChange={(e) => setBookingForm({ ...bookingForm, collection_landmark: e.target.value })}
                  placeholder="Near landmark (optional)"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </McCard>
        )}

        {/* Patient Details */}
        <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} /> Patient Details
          </h3>
          
            <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="lab-booking-grid-2" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.patient_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, patient_name: e.target.value })}
                  placeholder="Patient's full name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Phone *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.patient_phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, patient_phone: e.target.value })}
                  placeholder="Phone number"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div className="lab-booking-grid-2" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Age *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="150"
                  value={bookingForm.patient_age}
                  onChange={(e) => setBookingForm({ ...bookingForm, patient_age: e.target.value })}
                  placeholder="Age"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Gender *</label>
                <select
                  required
                  value={bookingForm.patient_gender}
                  onChange={(e) => setBookingForm({ ...bookingForm, patient_gender: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Notes (Optional)</label>
              <textarea
                value={bookingForm.patient_notes}
                onChange={(e) => setBookingForm({ ...bookingForm, patient_notes: e.target.value })}
                placeholder="Any special instructions or medical conditions"
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </McCard>

        {/* Order Summary */}
        <McCard style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #F9FAFB, #FFFFFF)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
          
          {cart.tests?.map(test => (
            <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280' }}>{test.name}</span>
              <span>{formatPrice(test.effective_price)}</span>
            </div>
          ))}
          
          {cart.packages?.map(pkg => (
            <div key={pkg.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280' }}>{pkg.name} (Package)</span>
              <span>{formatPrice(pkg.package_price)}</span>
            </div>
          ))}
          
          <hr style={{ margin: '1rem 0', borderColor: '#E5E7EB' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Amount</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>{formatPrice(cart.total_amount)}</span>
          </div>
        </McCard>

        <McButton 
          type="submit" 
          variant="primary" 
          disabled={loading}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </McButton>
      </form>
    </div>
  )

  // Main render
  return (
    <div className="lab-test-booking-page" style={{ background: 'var(--gray-50)', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          {onBack && (
            <McButton 
              variant="outline" 
              onClick={onBack}
              style={{ marginBottom: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              ← Back to Dashboard
            </McButton>
          )}
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TestTube size={28} /> Lab Test Booking
          </h1>
          <p style={{ opacity: 0.9, color: 'white' }}>
            Book diagnostic tests and health packages from certified labs
          </p>
        </div>
      </section>

      <div className="container lab-test-booking-content" style={{ padding: '2rem 1rem' }}>
        {/* Navigation Tabs */}
        {activeView !== 'booking-form' && activeView !== 'lab-tests' && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            {mainTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id)
                  setError('')
                  if (tab.id === 'bookings') loadBookings()
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: activeView === tab.id ? 'var(--mc-primary-500)' : 'white',
                  color: activeView === tab.id ? 'white' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Search and Filters */}
        {(activeView === 'labs' || activeView === 'tests' || activeView === 'packages') && (
          <div style={{ marginBottom: '2rem' }}>
            <div className="lab-test-booking-search-row" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <div className="lab-test-booking-search" style={{
                flex: 1,
                minWidth: '250px',
                position: 'relative'
              }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeView === 'labs' ? 'lab providers' : activeView}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            {/* Category filters for tests */}
            {activeView === 'tests' && categories.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: !selectedCategory ? '#2563EB' : '#E5E7EB',
                    background: !selectedCategory ? '#EBF5FF' : 'white',
                    color: !selectedCategory ? '#2563EB' : '#6B7280',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat.id ? '#2563EB' : '#E5E7EB',
                      background: selectedCategory === cat.id ? '#EBF5FF' : 'white',
                      color: selectedCategory === cat.id ? '#2563EB' : '#6B7280',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name} ({cat.test_count})
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTopColor: '#2563EB',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6B7280' }}>Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <McCard style={{ padding: '2rem', textAlign: 'center', background: '#FEF2F2' }}>
            <AlertCircle size={32} color="#EF4444" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: '#DC2626' }}>{error}</p>
            <McButton variant="outline" onClick={() => activeView === 'bookings' ? loadBookings() : loadInitialData()} style={{ marginTop: '1rem' }}>
              Retry
            </McButton>
          </McCard>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Labs View */}
            {activeView === 'labs' && (
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {filteredLabs.map(renderLabCard)}
                {filteredLabs.length === 0 && (
                  <McCard style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
                    <Building size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#6B7280' }}>No lab providers found</h3>
                    <p style={{ color: '#9CA3AF' }}>Try adjusting your search or check back later</p>
                  </McCard>
                )}
              </div>
            )}

            {/* Lab Tests View - Shows tests for selected lab */}
            {activeView === 'lab-tests' && selectedLabProvider && (
              <div>
                {/* Back Button and Lab Info */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <McButton 
                    variant="outline" 
                    onClick={() => {
                      setActiveView('labs')
                      setSelectedLabProvider(null)
                      setLabTestOfferings([])
                    }}
                    style={{ marginBottom: '1rem' }}
                  >
                    ← Back to Labs
                  </McButton>
                  
                  <McCard style={{ padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #F9FAFB, #FFFFFF)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Building size={32} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          {selectedLabProvider.name}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6B7280' }}>
                          {selectedLabProvider.city && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={14} /> {selectedLabProvider.city}
                            </span>
                          )}
                          {selectedLabProvider.operating_hours && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={14} /> {selectedLabProvider.operating_hours}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </McCard>
                </div>

                {/* Lab's Test Offerings */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Available Tests ({labTestOfferings.length})
                </h3>
                <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                  {labTestOfferings.map(renderLabTestOfferingCard)}
                  {labTestOfferings.length === 0 && (
                    <McCard style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
                      <TestTube size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                      <h3 style={{ color: '#6B7280' }}>No tests available</h3>
                      <p style={{ color: '#9CA3AF' }}>This lab hasn't added any tests yet</p>
                    </McCard>
                  )}
                </div>
              </div>
            )}

            {/* Tests View */}
            {activeView === 'tests' && (
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {filteredTests.map(renderTestCard)}
                {filteredTests.length === 0 && (
                  <McCard style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
                    <TestTube size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#6B7280' }}>No tests found</h3>
                    <p style={{ color: '#9CA3AF' }}>Try adjusting your search or filters</p>
                  </McCard>
                )}
              </div>
            )}

            {/* Packages View */}
            {activeView === 'packages' && (
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {filteredPackages.map(renderPackageCard)}
                {filteredPackages.length === 0 && (
                  <McCard style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
                    <FileText size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#6B7280' }}>No packages found</h3>
                    <p style={{ color: '#9CA3AF' }}>Try adjusting your search</p>
                  </McCard>
                )}
              </div>
            )}

            {/* Bookings View */}
            {activeView === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <McCard style={{ padding: '3rem', textAlign: 'center' }}>
                    <Calendar size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#6B7280', marginBottom: '0.5rem' }}>No bookings yet</h3>
                    <p style={{ color: '#9CA3AF', marginBottom: '1.5rem' }}>Book a lab test to get started</p>
                    <McButton variant="primary" onClick={() => setActiveView('tests')}>
                      Browse Tests
                    </McButton>
                  </McCard>
                ) : (
                  bookings.map(renderBookingCard)
                )}
              </div>
            )}

            {/* Cart View */}
            {activeView === 'cart' && renderCart()}

            {/* Booking Form */}
            {activeView === 'booking-form' && renderBookingForm()}
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      {activeView !== 'cart' && activeView !== 'booking-form' && (cart.tests?.length > 0 || cart.packages?.length > 0) && (
        <div
          onClick={() => setActiveView('cart')}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '50px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 100
          }}
        >
          <ShoppingCart size={22} />
          <span style={{ fontWeight: 700 }}>
            {(cart.tests?.length || 0) + (cart.packages?.length || 0)} items
          </span>
          <span style={{ fontWeight: 700 }}>
            {formatPrice(cart.total_amount)}
          </span>
        </div>
      )}

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
