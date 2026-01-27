import Button from './components/ui/Button'
import Card from './components/ui/Card'
import Badge from './components/ui/Badge'
import Input from './components/ui/Input'

/**
 * Component Showcase - Visual Guide for MedConnect AI Design System
 * Use this as a reference for implementing new features
 */
export default function ComponentShowcase() {
  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>
        MedConnect AI Component Library
      </h1>

      {/* Buttons */}
      <section className="section">
        <h2 className="mb-3">Buttons</h2>
        
        <h3 className="mb-2">Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="success">Success Button</Button>
        </div>

        <h3 className="mb-2">Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <h3 className="mb-2">States</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button icon="🚀">With Icon</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="section">
        <h2 className="mb-3">Cards</h2>
        <div className="grid grid-3">
          <Card>
            <h3>Standard Card</h3>
            <p>Basic card with default styling</p>
          </Card>
          
          <Card hover>
            <h3>Hover Card</h3>
            <p>Card with hover effect (lift + shadow)</p>
          </Card>
          
          <Card style={{ border: '2px solid var(--primary)' }}>
            <h3>Custom Border</h3>
            <p>Card with custom styling</p>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="section">
        <h2 className="mb-3">Badges</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="primary" icon="⭐">With Icon</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section className="section">
        <h2 className="mb-3">Input Fields</h2>
        <div style={{ maxWidth: '500px' }}>
          <Input 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon="📧"
          />
          
          <Input 
            label="Password"
            type="password"
            placeholder="Enter password"
            icon="🔒"
          />
          
          <Input 
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            icon="📱"
            error="Invalid phone number format"
          />
        </div>
      </section>

      {/* Service Cards */}
      <section className="section">
        <h2 className="mb-3">Service Cards</h2>
        <div className="grid grid-3">
          {[
            { icon: '🤖', title: 'AI Symptom Checker', desc: 'Instant health insights', color: '#0066CC' },
            { icon: '👨‍⚕️', title: 'Doctor Consultation', desc: 'Talk to specialists', color: '#00BFA5' },
            { icon: '🧪', title: 'Lab Tests', desc: 'Book diagnostic tests', color: '#2196F3' }
          ].map((service, i) => (
            <Card key={i} hover style={{ textAlign: 'center', border: `2px solid ${service.color}15` }}>
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
              <h3 style={{ marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>{service.desc}</p>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Access Now
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Doctor Cards */}
      <section className="section">
        <h2 className="mb-3">Doctor Cards</h2>
        <div className="grid" style={{ gap: '1.25rem' }}>
          {[
            { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: '4.9', fee: '800' },
            { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: '4.8', fee: '1000' }
          ].map((doc, i) => (
            <Card key={i} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
                  <h3 style={{ marginBottom: '0.5rem' }}>{doc.name}</h3>
                  <p style={{ margin: '0.5rem 0', color: 'var(--primary)', fontWeight: 500 }}>
                    {doc.specialty}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Badge variant="success">⭐ {doc.rating}</Badge>
                    <Badge variant="primary">₹{doc.fee}</Badge>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </div>
                
                <Button variant="primary" size="sm">
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Color Palette */}
      <section className="section">
        <h2 className="mb-3">Color Palette</h2>
        <div className="grid grid-4">
          {[
            { name: 'Primary', color: '#0066CC' },
            { name: 'Secondary', color: '#00BFA5' },
            { name: 'Success', color: '#00C853' },
            { name: 'Warning', color: '#FFB300' },
            { name: 'Error', color: '#D32F2F' },
            { name: 'Info', color: '#2196F3' },
            { name: 'Gray 600', color: '#475569' },
            { name: 'Gray 300', color: '#CBD5E1' }
          ].map((item, i) => (
            <Card key={i} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '100%',
                height: '80px',
                background: item.color,
                borderRadius: '8px',
                marginBottom: '0.75rem'
              }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {item.color}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="section">
        <h2 className="mb-3">Typography</h2>
        <Card>
          <h1>Heading 1 - 2.5rem (40px)</h1>
          <h2>Heading 2 - 2rem (32px)</h2>
          <h3>Heading 3 - 1.5rem (24px)</h3>
          <h4>Heading 4 - 1.25rem (20px)</h4>
          <p style={{ fontSize: '1rem' }}>Body Text - 1rem (16px)</p>
          <p style={{ fontSize: '0.875rem' }}>Small Text - 0.875rem (14px)</p>
        </Card>
      </section>

      {/* Grid System */}
      <section className="section">
        <h2 className="mb-3">Grid System</h2>
        
        <h3 className="mb-2">2 Columns</h3>
        <div className="grid grid-2 mb-3">
          <Card><div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-100)' }}>Column 1</div></Card>
          <Card><div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-100)' }}>Column 2</div></Card>
        </div>

        <h3 className="mb-2">3 Columns</h3>
        <div className="grid grid-3 mb-3">
          <Card><div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-100)' }}>Col 1</div></Card>
          <Card><div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-100)' }}>Col 2</div></Card>
          <Card><div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-100)' }}>Col 3</div></Card>
        </div>

        <h3 className="mb-2">4 Columns</h3>
        <div className="grid grid-4">
          <Card><div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--gray-100)' }}>1</div></Card>
          <Card><div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--gray-100)' }}>2</div></Card>
          <Card><div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--gray-100)' }}>3</div></Card>
          <Card><div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--gray-100)' }}>4</div></Card>
        </div>
      </section>
    </div>
  )
}
