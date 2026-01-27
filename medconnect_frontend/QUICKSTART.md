# 🚀 Quick Start Guide - MedConnect AI

## Getting Started

### 1. Install Dependencies
```bash
cd medconnect_frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📁 Project Structure

```
medconnect_frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Input.jsx
│   │   ├── Navbar.jsx       # Main navigation
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx        # Login page
│   │   └── Dashboard.jsx    # User dashboard
│   ├── SymptomChecker.jsx   # AI symptom analysis
│   ├── WellnessHub.jsx      # Health services hub
│   ├── ComponentShowcase.jsx # Component library demo
│   ├── App.jsx              # Main app component
│   ├── App.css              # App-specific styles
│   ├── index.css            # Global styles + design system
│   └── main.jsx             # Entry point
├── DESIGN_SYSTEM.md         # Complete design documentation
├── REDESIGN_SUMMARY.md      # Implementation summary
└── package.json
```

---

## 🎨 Using Components

### Buttons
```jsx
import Button from './components/ui/Button'

// Primary button (default)
<Button onClick={handleClick}>Click Me</Button>

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="success">Success</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icon
<Button icon="🚀">Launch</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Cards
```jsx
import Card from './components/ui/Card'

// Basic card
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Hover effect
<Card hover onClick={handleClick}>
  <h3>Clickable Card</h3>
</Card>

// Custom styling
<Card className="my-custom-class" style={{ border: '2px solid blue' }}>
  Content
</Card>
```

### Badges
```jsx
import Badge from './components/ui/Badge'

<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="secondary">Secondary</Badge>

// With icon
<Badge variant="success" icon="⭐">4.8 Rating</Badge>
```

### Input Fields
```jsx
import Input from './components/ui/Input'

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  icon="📧"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password is too short"
  icon="🔒"
/>
```

---

## 🎨 Using the Design System

### Colors (CSS Variables)
```jsx
// In inline styles
<div style={{ color: 'var(--primary)' }}>Text</div>
<div style={{ background: 'var(--gray-100)' }}>Background</div>

// Available colors:
--primary        // #0066CC
--secondary      // #00BFA5
--success        // #00C853
--warning        // #FFB300
--error          // #D32F2F
--text-primary   // #0F172A
--text-secondary // #475569
--bg-page        // #F8FAFB
--bg-card        // #FFFFFF
```

### Layout Classes
```jsx
// Container (max-width: 1200px, centered)
<div className="container">
  Content
</div>

// Grid layouts
<div className="grid grid-2">   {/* 2 columns */}
<div className="grid grid-3">   {/* 3 columns */}
<div className="grid grid-4">   {/* 4 columns */}

// Sections
<section className="section">      {/* 4rem padding */}
<section className="section-sm">   {/* 2rem padding */}
<section className="section-lg">   {/* 6rem padding */}
```

### Spacing Utilities
```jsx
// Margin
<div className="mt-1">  {/* margin-top: 0.5rem */}
<div className="mt-2">  {/* margin-top: 1rem */}
<div className="mt-3">  {/* margin-top: 1.5rem */}
<div className="mt-4">  {/* margin-top: 2rem */}

<div className="mb-1">  {/* margin-bottom: 0.5rem */}
// ... same for mb-2, mb-3, mb-4

// Padding
<div className="p-1">   {/* padding: 0.5rem */}
<div className="p-2">   {/* padding: 1rem */}
// ... etc
```

### Text Utilities
```jsx
<div className="text-center">Text Center</div>
<div className="text-left">Text Left</div>
<div className="text-right">Text Right</div>

<span className="text-primary">Primary Color</span>
<span className="text-success">Success Color</span>
<span className="text-error">Error Color</span>

<div className="font-bold">Bold Text</div>
<div className="font-semibold">Semibold Text</div>
```

### Flex Utilities
```jsx
<div className="flex">
<div className="flex flex-col">
<div className="flex items-center">
<div className="flex justify-center">
<div className="flex justify-between">
<div className="flex gap-2">
```

### Animation Classes
```jsx
<div className="fade-in">      {/* Fade in animation */}
<div className="slide-in">     {/* Slide in from left */}
<div className="scale-in">     {/* Scale in animation */}
```

---

## 🎯 Common Patterns

### Service Card Pattern
```jsx
<Card hover style={{ textAlign: 'center', border: '2px solid #0066CC15' }}>
  <div style={{
    width: '70px',
    height: '70px',
    margin: '0 auto 1rem',
    background: '#0066CC10',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem'
  }}>
    🤖
  </div>
  <h3>AI Symptom Checker</h3>
  <p>Get instant health insights</p>
  <Button variant="outline" size="sm" style={{ width: '100%' }}>
    Access Now
  </Button>
</Card>
```

### Doctor Card Pattern
```jsx
<Card>
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem'
    }}>
      👨‍⚕️
    </div>
    
    <div style={{ flex: 1 }}>
      <h3>Dr. John Smith</h3>
      <p style={{ color: 'var(--primary)' }}>Cardiologist</p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <Badge variant="success">⭐ 4.8</Badge>
        <Badge variant="primary">₹500</Badge>
      </div>
    </div>
    
    <Button variant="primary" size="sm">Book Now</Button>
  </div>
</Card>
```

### Hero Section Pattern
```jsx
<section style={{
  background: 'linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)',
  padding: '5rem 0'
}}>
  <div className="container" style={{ textAlign: 'center' }}>
    <Badge variant="primary" icon="✨">Featured</Badge>
    <h1 style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
      Your Headline Here
    </h1>
    <p style={{ fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
      Your description text here
    </p>
    <Button variant="primary" size="lg">Get Started</Button>
  </div>
</section>
```

---

## 🔧 API Integration

### Making API Calls
```jsx
import { useState } from 'react'

function MyComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('http://127.0.0.1:8000/api/endpoint/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ /* data */ })
      })
      
      const result = await res.json()
      setData(result)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </Button>
      {error && <p className="text-error">{error}</p>}
    </div>
  )
}
```

---

## 📱 Responsive Design

### Mobile-First Approach
```jsx
// Component will automatically stack on mobile
<div className="grid grid-3">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

// Custom responsive styles
<div style={{
  display: 'flex',
  flexDirection: window.innerWidth < 768 ? 'column' : 'row'
}}>
  Content
</div>
```

### Breakpoints
- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🎨 Viewing Component Showcase

To see all components in action:

1. Import ComponentShowcase in App.jsx:
```jsx
import ComponentShowcase from './ComponentShowcase'

// Add to your routes
{page === "showcase" && <ComponentShowcase />}
```

2. Navigate to the showcase page to see all components

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Components not styled correctly
- **Fix**: Make sure `index.css` is imported in `main.jsx`

**Issue**: Colors not working
- **Fix**: Use CSS variables like `var(--primary)`

**Issue**: Grid not responsive
- **Fix**: Use predefined grid classes: `grid grid-2`, `grid grid-3`, etc.

**Issue**: Icons not showing
- **Fix**: Emojis are used as icons. For production, consider replacing with SVG icons

---

## 📚 Resources

- **DESIGN_SYSTEM.md** - Complete design documentation
- **REDESIGN_SUMMARY.md** - Implementation details
- **ComponentShowcase.jsx** - Visual component library

---

## 🚀 Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

## 🎯 Best Practices

1. **Always use components** from `/components/ui/` for consistency
2. **Use CSS variables** for colors instead of hardcoded values
3. **Follow naming conventions** - PascalCase for components, camelCase for functions
4. **Keep components small** - Single responsibility principle
5. **Use semantic HTML** - `<section>`, `<article>`, `<nav>`, etc.
6. **Add loading states** - Better UX during API calls
7. **Handle errors gracefully** - Show user-friendly messages
8. **Test on mobile** - Always check responsive design

---

**Happy Coding! 🎉**

For detailed documentation, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
