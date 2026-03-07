/**
 * MedConnect AI — New Design System Showcase
 * Navigate to this page via the "Design System" link in the navbar
 * or by setting ?page=showcase in the URL.
 */

import { useState } from 'react'
import McButton from './ui-next/McButton'
import McCard from './ui-next/McCard'
import McInput from './ui-next/McInput'
import McModal from './ui-next/McModal'
import McToast from './ui-next/McToast'
import McSearchBar from './ui-next/McSearchBar'
import {
  Icon,
  Stethoscope, Heart, Activity, Pill, Shield, Calendar, Clock,
  Ambulance, UserDoctor, Search, Bell, Star, Video, Phone,
  MessageCircle, ArrowRight, CheckCircle, BookOpen, BarChart, TrendingUp,
  Sparkles, Send, Upload, Filter, Mic, FileText,
} from './ui/icons/Icon'

export default function DesignShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchVal, setSearchVal] = useState('')
  const [inputVal, setInputVal] = useState('')

  const showToast = (type) => {
    setToast({ message: `This is a ${type} notification message.`, type })
  }

  return (
    <div style={{
      background: 'var(--mc-bg-page)',
      minHeight: 'calc(100vh - 80px)',
      padding: 'var(--mc-space-10) var(--mc-space-6)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ===== HEADER ===== */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--mc-space-16)' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--mc-space-2)',
            padding: 'var(--mc-space-2) var(--mc-space-4)',
            background: 'var(--mc-primary-50)',
            borderRadius: 'var(--mc-radius-full)',
            fontSize: 'var(--mc-text-xs)',
            fontWeight: 'var(--mc-font-semibold)',
            color: 'var(--mc-primary-600)',
            marginBottom: 'var(--mc-space-4)',
          }}>
            <Sparkles size={14} /> NEW DESIGN SYSTEM v2
          </span>
          <h1 style={{
            fontSize: 'var(--mc-text-4xl)',
            fontWeight: 'var(--mc-font-extrabold)',
            color: 'var(--mc-text-primary)',
            letterSpacing: 'var(--mc-tracking-tight)',
            margin: 'var(--mc-space-4) 0 var(--mc-space-3)',
            fontFamily: 'var(--mc-font-sans)',
          }}>
            Premium Component Showcase
          </h1>
          <p style={{
            fontSize: 'var(--mc-text-lg)',
            color: 'var(--mc-text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 'var(--mc-leading-relaxed)',
          }}>
            Curved surfaces, soft shadows, SVG icons, glass effects.
            No emojis anywhere.
          </p>
        </div>

        {/* ===== SECTION: ICONS ===== */}
        <Section title="SVG Icon System" subtitle="40+ icons, no emojis. All icons accept size, color, strokeWidth props.">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 'var(--mc-space-4)',
          }}>
            {[
              ['stethoscope', Stethoscope],
              ['heart', Heart],
              ['activity', Activity],
              ['pill', Pill],
              ['shield', Shield],
              ['calendar', Calendar],
              ['clock', Clock],
              ['ambulance', Ambulance],
              ['user-doctor', UserDoctor],
              ['search', Search],
              ['bell', Bell],
              ['star', Star],
              ['video', Video],
              ['phone', Phone],
              ['message', MessageCircle],
              ['arrow-right', ArrowRight],
              ['check-circle', CheckCircle],
              ['book-open', BookOpen],
              ['bar-chart', BarChart],
              ['trending-up', TrendingUp],
              ['sparkles', Sparkles],
              ['send', Send],
              ['upload', Upload],
              ['filter', Filter],
              ['mic', Mic],
              ['file-text', FileText],
            ].map(([name, Comp]) => (
              <div key={name} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--mc-space-2)',
                padding: 'var(--mc-space-4)',
                borderRadius: 'var(--mc-radius-lg)',
                background: 'var(--mc-bg-card)',
                border: '1px solid var(--mc-border-subtle)',
              }}>
                <Comp size={24} color="var(--mc-primary-500)" />
                <span style={{ fontSize: 'var(--mc-text-xs)', color: 'var(--mc-text-muted)' }}>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== SECTION: BUTTONS ===== */}
        <Section title="Buttons" subtitle="Six variants, three sizes. Hover, press, loading, and disabled states.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mc-space-3)', marginBottom: 'var(--mc-space-6)' }}>
            <McButton variant="primary" icon={Stethoscope}>Primary</McButton>
            <McButton variant="secondary" icon={Heart}>Secondary</McButton>
            <McButton variant="outline">Outline</McButton>
            <McButton variant="ghost">Ghost</McButton>
            <McButton variant="danger">Danger</McButton>
            <McButton variant="success" icon={CheckCircle}>Success</McButton>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mc-space-3)', marginBottom: 'var(--mc-space-6)' }}>
            <McButton size="sm">Small</McButton>
            <McButton size="md">Medium</McButton>
            <McButton size="lg" icon={ArrowRight}>Large</McButton>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mc-space-3)' }}>
            <McButton loading>Loading</McButton>
            <McButton disabled>Disabled</McButton>
            <McButton variant="primary" iconRight={ArrowRight}>Icon Right</McButton>
          </div>
        </Section>

        {/* ===== SECTION: CARDS ===== */}
        <Section title="Cards" subtitle="Default, glass, gradient, outlined variants. Hover lift effect.">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--mc-space-5)',
          }}>
            <McCard hover>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mc-space-3)', marginBottom: 'var(--mc-space-4)' }}>
                <IconCircle icon={Stethoscope} color="var(--mc-primary-500)" bg="var(--mc-primary-50)" />
                <div>
                  <h3 style={{ fontSize: 'var(--mc-text-base)', fontWeight: 'var(--mc-font-semibold)', color: 'var(--mc-text-primary)', margin: 0 }}>AI Symptom Checker</h3>
                  <p style={{ fontSize: 'var(--mc-text-sm)', color: 'var(--mc-text-secondary)', margin: 0 }}>Analyze symptoms with AI</p>
                </div>
              </div>
              <McButton size="sm" variant="outline" iconRight={ArrowRight}>Open</McButton>
            </McCard>

            <McCard variant="glass" hover>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mc-space-3)', marginBottom: 'var(--mc-space-4)' }}>
                <IconCircle icon={MessageCircle} color="var(--mc-secondary-500)" bg="var(--mc-secondary-50)" />
                <div>
                  <h3 style={{ fontSize: 'var(--mc-text-base)', fontWeight: 'var(--mc-font-semibold)', color: 'var(--mc-text-primary)', margin: 0 }}>Health Chatbot</h3>
                  <p style={{ fontSize: 'var(--mc-text-sm)', color: 'var(--mc-text-secondary)', margin: 0 }}>24/7 health assistant</p>
                </div>
              </div>
              <McButton size="sm" variant="outline" iconRight={ArrowRight}>Chat</McButton>
            </McCard>

            <McCard variant="outlined" hover>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mc-space-3)', marginBottom: 'var(--mc-space-4)' }}>
                <IconCircle icon={UserDoctor} color="var(--mc-accent-500)" bg="var(--mc-accent-50)" />
                <div>
                  <h3 style={{ fontSize: 'var(--mc-text-base)', fontWeight: 'var(--mc-font-semibold)', color: 'var(--mc-text-primary)', margin: 0 }}>Find Doctors</h3>
                  <p style={{ fontSize: 'var(--mc-text-sm)', color: 'var(--mc-text-secondary)', margin: 0 }}>Browse specialists</p>
                </div>
              </div>
              <McButton size="sm" variant="outline" iconRight={ArrowRight}>Browse</McButton>
            </McCard>
          </div>

          {/* Stat cards row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--mc-space-4)',
            marginTop: 'var(--mc-space-6)',
          }}>
            {[
              { icon: BarChart, label: 'Health Score', value: '85/100', color: 'var(--mc-primary-500)' },
              { icon: Calendar, label: 'Last Checkup', value: '2 weeks ago', color: 'var(--mc-success-500)' },
              { icon: Pill, label: 'Medications', value: '3 active', color: 'var(--mc-secondary-500)' },
              { icon: TrendingUp, label: 'Activity', value: 'Good', color: 'var(--mc-accent-500)' },
            ].map((stat, i) => (
              <McCard key={i} compact>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mc-space-3)' }}>
                  <stat.icon size={22} color={stat.color} />
                  <div>
                    <div style={{ fontSize: 'var(--mc-text-xl)', fontWeight: 'var(--mc-font-bold)', color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 'var(--mc-text-xs)', color: 'var(--mc-text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              </McCard>
            ))}
          </div>
        </Section>

        {/* ===== SECTION: INPUTS & SEARCH ===== */}
        <Section title="Inputs & Search" subtitle="Rounded inputs with icon support, focus rings, validation states.">
          <div style={{ maxWidth: '480px' }}>
            <McSearchBar
              value={searchVal}
              onChange={setSearchVal}
              placeholder="Search doctors, symptoms, or services..."
              style={{ marginBottom: 'var(--mc-space-6)' }}
            />

            <McInput
              label="Email Address"
              placeholder="you@example.com"
              icon={Search}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              required
            />

            <McInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              hint="At least 8 characters."
            />

            <McInput
              label="Valid Field"
              value="hello@medconnect.ai"
              success
              readOnly
            />

            <McInput
              label="Error Field"
              value="bad"
              error="Email address is not valid."
            />
          </div>
        </Section>

        {/* ===== SECTION: MODAL ===== */}
        <Section title="Modal" subtitle="Focus-trapped dialog with Escape-to-close and overlay blur.">
          <McButton onClick={() => setModalOpen(true)} icon={Sparkles}>Open Modal</McButton>
          <McModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Book Consultation"
            footer={
              <>
                <McButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</McButton>
                <McButton onClick={() => setModalOpen(false)} icon={CheckCircle}>Confirm</McButton>
              </>
            }
          >
            <p style={{ marginBottom: 'var(--mc-space-4)' }}>
              Schedule a video consultation with a specialist. Fill in
              details below and we will match you with the best available doctor.
            </p>
            <McInput label="Your Symptoms" placeholder="Describe your symptoms..." />
            <McInput label="Preferred Date" type="date" />
          </McModal>
        </Section>

        {/* ===== SECTION: TOASTS ===== */}
        <Section title="Toasts" subtitle="Notification toasts with auto-dismiss. SVG icons, no emojis.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mc-space-3)' }}>
            <McButton variant="success" size="sm" onClick={() => showToast('success')}>Success Toast</McButton>
            <McButton variant="danger" size="sm" onClick={() => showToast('error')}>Error Toast</McButton>
            <McButton size="sm" onClick={() => showToast('warning')} style={{ background: 'var(--mc-warning-500)', color: 'white', border: 'none' }}>Warning Toast</McButton>
            <McButton variant="outline" size="sm" onClick={() => showToast('info')}>Info Toast</McButton>
          </div>
          {toast && (
            <McToast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </Section>

        {/* ===== SECTION: SAMPLE DATA TABLE ===== */}
        <Section title="Medical Data Table" subtitle="Clean table with rounded container and soft borders.">
          <McCard style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--mc-text-sm)',
              fontFamily: 'var(--mc-font-sans)',
            }}>
              <thead>
                <tr style={{ background: 'var(--mc-neutral-50)' }}>
                  {['Patient', 'Date', 'Type', 'Status', 'Doctor'].map(h => (
                    <th key={h} style={{
                      padding: 'var(--mc-space-3) var(--mc-space-4)',
                      textAlign: 'left',
                      fontWeight: 'var(--mc-font-semibold)',
                      color: 'var(--mc-text-secondary)',
                      borderBottom: '1px solid var(--mc-border-default)',
                      fontSize: 'var(--mc-text-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--mc-tracking-wide)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Rahul Verma', date: '2026-03-02', type: 'Video', status: 'Completed', doc: 'Dr. Priya Sharma' },
                  { name: 'Anjali Deshmukh', date: '2026-03-03', type: 'Chat', status: 'In Progress', doc: 'Dr. Amit Patel' },
                  { name: 'Vikram Singh', date: '2026-03-04', type: 'Video', status: 'Scheduled', doc: 'Dr. Neha Gupta' },
                ].map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: '1px solid var(--mc-border-subtle)',
                    transition: `background var(--mc-duration-fast) var(--mc-ease-default)`,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--mc-neutral-25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 'var(--mc-space-3) var(--mc-space-4)', fontWeight: 'var(--mc-font-medium)', color: 'var(--mc-text-primary)' }}>{row.name}</td>
                    <td style={{ padding: 'var(--mc-space-3) var(--mc-space-4)', color: 'var(--mc-text-secondary)' }}>{row.date}</td>
                    <td style={{ padding: 'var(--mc-space-3) var(--mc-space-4)' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 10px', borderRadius: 'var(--mc-radius-full)',
                        fontSize: 'var(--mc-text-xs)', fontWeight: 'var(--mc-font-semibold)',
                        background: 'var(--mc-primary-50)', color: 'var(--mc-primary-600)',
                      }}>
                        {row.type === 'Video' ? <Video size={12} /> : <MessageCircle size={12} />}
                        {row.type}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--mc-space-3) var(--mc-space-4)' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px', borderRadius: 'var(--mc-radius-full)',
                        fontSize: 'var(--mc-text-xs)', fontWeight: 'var(--mc-font-semibold)',
                        background: row.status === 'Completed' ? 'var(--mc-success-50)' : row.status === 'In Progress' ? 'var(--mc-warning-50)' : 'var(--mc-info-50)',
                        color: row.status === 'Completed' ? 'var(--mc-success-700)' : row.status === 'In Progress' ? 'var(--mc-warning-700)' : 'var(--mc-info-700)',
                      }}>{row.status}</span>
                    </td>
                    <td style={{ padding: 'var(--mc-space-3) var(--mc-space-4)', color: 'var(--mc-text-secondary)' }}>{row.doc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </McCard>
        </Section>

        {/* ===== SECTION: THEME SWATCHES ===== */}
        <Section title="Color Palettes" subtitle="Three alternative themes. Add class to <html> to switch.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--mc-space-5)' }}>
            <PaletteCard
              name="A: Clinical Blue (Default)"
              colors={['#3366FF','#06B6D4','#F97316','#6C7381','#141720']}
              labels={['Primary','Secondary','Accent','Neutral','Dark']}
            />
            <PaletteCard
              name='B: Sage Green (class="theme-sage")'
              colors={['#059669','#22C55E','#D946EF','#6C7381','#141720']}
              labels={['Primary','Secondary','Accent','Neutral','Dark']}
            />
            <PaletteCard
              name='C: Midnight Indigo (class="theme-indigo")'
              colors={['#6366F1','#F43F5E','#F59E0B','#6C7381','#141720']}
              labels={['Primary','Secondary','Accent','Neutral','Dark']}
            />
          </div>
        </Section>

      </div>
    </div>
  )
}

/* --- Helper components --- */

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 'var(--mc-space-16)' }}>
      <h2 style={{
        fontSize: 'var(--mc-text-2xl)',
        fontWeight: 'var(--mc-font-bold)',
        color: 'var(--mc-text-primary)',
        margin: '0 0 var(--mc-space-2)',
        fontFamily: 'var(--mc-font-sans)',
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: 'var(--mc-text-sm)',
          color: 'var(--mc-text-muted)',
          margin: '0 0 var(--mc-space-6)',
        }}>{subtitle}</p>
      )}
      {children}
    </section>
  )
}

function IconCircle({ icon: Ic, color, bg }) {
  return (
    <div style={{
      width: '44px', height: '44px',
      borderRadius: 'var(--mc-radius-md)',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Ic size={22} color={color} />
    </div>
  )
}

function PaletteCard({ name, colors, labels }) {
  return (
    <McCard compact>
      <h4 style={{
        fontSize: 'var(--mc-text-sm)',
        fontWeight: 'var(--mc-font-semibold)',
        color: 'var(--mc-text-primary)',
        margin: '0 0 var(--mc-space-3)',
      }}>{name}</h4>
      <div style={{ display: 'flex', gap: 'var(--mc-space-2)' }}>
        {colors.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <div style={{
              width: '100%', height: '40px',
              borderRadius: 'var(--mc-radius-sm)',
              background: c,
            }} />
            <span style={{ fontSize: '10px', color: 'var(--mc-text-muted)' }}>{labels[i]}</span>
            <span style={{ fontSize: '9px', color: 'var(--mc-text-muted)', fontFamily: 'var(--mc-font-mono)' }}>{c}</span>
          </div>
        ))}
      </div>
    </McCard>
  )
}
