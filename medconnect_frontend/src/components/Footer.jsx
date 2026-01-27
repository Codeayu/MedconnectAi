const EMOJI = {
  hospital: String.fromCodePoint(0x1F3E5),
  pin: String.fromCodePoint(0x1F4CD),
  envelope: String.fromCodePoint(0x2709, 0xFE0F),
  phone: String.fromCodePoint(0x1F4DE),
  copyright: String.fromCodePoint(0x00A9)
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      color: 'white',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {EMOJI.hospital}
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'white'
                }}>
                  MedConnect AI
                </h3>
                <p style={{
                  fontSize: '0.75rem',
                  margin: 0,
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  Smart Healthcare Platform
                </p>
              </div>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              margin: 0
            }}>
              Your trusted AI-powered healthcare companion. Get instant symptom analysis, 
              connect with verified doctors, and take control of your health journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['Home', 'About Us', 'Services', 'Contact', 'FAQ'].map(link => (
                <li key={link} style={{ marginBottom: '0.75rem' }}>
                  <a 
                    href="#" 
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = '#00BFA5'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Services
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['AI Symptom Checker', 'Doctor Consultation', 'Lab Tests', 'Health Articles', 'Emergency Help'].map(link => (
                <li key={link} style={{ marginBottom: '0.75rem' }}>
                  <a 
                    href="#" 
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = '#00BFA5'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem'
              }}>
                <span>{EMOJI.pin}</span>
                Amravati, Maharashtra, India
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem'
              }}>
                <span>{EMOJI.envelope}</span>
                support@medconnect.ai
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem'
              }}>
                <span>{EMOJI.phone}</span>
                +91 1800-XXX-XXXX
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          marginBottom: '2rem'
        }} />

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.85rem',
            margin: 0
          }}>
            {EMOJI.copyright} {currentYear} MedConnect AI. All rights reserved.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a 
                key={link}
                href="#" 
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
