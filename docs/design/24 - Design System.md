# 24. Design System

## 24.1 Overview

The MedConnect AI Design System is the unified visual and interaction framework for the entire MedConnect AI ecosystem.

It ensures that every interface feels like part of the same healthcare platform while allowing each user experience to have its own purpose.

The design system must support:

- Patient Application
- Doctor Portal
- Admin Portal
- Landing Website
- E-Prescription Module
- AI Health Assistant
- Telemedicine
- Medical Wallet
- Laboratory
- Pharmacy
- Future MedConnect AI products

### Design Philosophy

> **Simple enough for everyone. Professional enough for healthcare. Intelligent enough for AI.**

The design system should combine:

**Healthcare trust + modern technology + accessibility + simplicity.**

---

# 24.2 Design Principles

## 1. Human First

The interface should feel designed around people rather than technology.

Avoid unnecessary technical terminology.

---

## 2. Healthcare Trust

The visual language should communicate:

- Safety
- Reliability
- Professionalism
- Accuracy
- Privacy
- Care

---

## 3. Simplicity

Users should understand what to do without needing instructions.

Prefer:

```text
Clear CTA
      ↓
Simple Action
      ↓
Clear Result
```

over complex multi-step interfaces.

---

## 4. Accessibility First

MedConnect AI targets users across different literacy, age, technology familiarity, and geographic backgrounds.

Design should support:

- Large readable text
- High contrast
- Clear icons
- Simple language
- Large touch targets
- Screen readers
- Keyboard navigation
- Reduced motion
- Multilingual interfaces

---

## 5. Progressive Disclosure

Do not show everything at once.

Show:

```text
Essential Information
        ↓
Optional Details
        ↓
Advanced Information
```

This is especially important for medical records and AI-generated information.

---

# 24.3 Design System Structure

```text
MEDCONNECT AI DESIGN SYSTEM
│
├── Foundations
│   ├── Color
│   ├── Typography
│   ├── Spacing
│   ├── Grid
│   ├── Elevation
│   └── Motion
│
├── Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Modals
│   ├── Tables
│   ├── Tabs
│   ├── Navigation
│   └── Notifications
│
├── Patterns
│   ├── Authentication
│   ├── Search
│   ├── Booking
│   ├── Consultation
│   ├── Prescription
│   └── Medical Records
│
└── Templates
    ├── Patient
    ├── Doctor
    └── Admin
```

---

# 24.4 Color System

The primary visual direction should use a **medical blue + teal + clean white** palette.

The exact production values should be defined as design tokens so they can be changed globally.

### Primary Brand Color

Used for:

- Primary buttons
- Links
- Active navigation
- Brand elements
- Important UI actions

Suggested token:

```text
color.primary.500
```

---

### Secondary / Healthcare Accent

Teal can communicate:

- Health
- Wellness
- Technology
- Positive actions

Suggested tokens:

```text
color.secondary.500
color.secondary.600
```

---

### Background

Primary background:

```text
color.background.primary
```

Secondary surfaces:

```text
color.background.secondary
color.background.surface
```

The interface should generally use light, clean backgrounds.

---

# 24.5 Semantic Colors

Semantic colors must have consistent meanings.

### Success

Used for:

- Completed
- Verified
- Successful
- Healthy system state

### Warning

Used for:

- Pending
- Attention required
- Non-critical warning

### Error

Used for:

- Failed action
- Invalid information
- System errors

### Critical

Used sparingly for:

- Emergency
- SOS
- Critical system alerts

### Information

Used for:

- Helpful information
- Educational content
- Neutral system messages

Never rely on color alone to communicate status.

Use:

```text
Color + Icon + Text
```

---

# 24.6 Color Tokens

Recommended token architecture:

```text
Primary
├── 50
├── 100
├── 200
├── 300
├── 400
├── 500
├── 600
├── 700
├── 800
└── 900

Secondary
├── 50
├── 100
├── ...
└── 900

Neutral
├── 50
├── 100
├── ...
└── 950

Success
Warning
Error
Info
Critical
```

Claude Design should use tokens rather than hard-coded colors.

---

# 24.7 Typography

Typography should prioritize:

- Readability
- Professional appearance
- Multilingual compatibility
- Accessibility

Recommended hierarchy:

```text
Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
```

---

# 24.8 Typography Guidelines

### H1

Used for primary page headings.

### H2

Major sections.

### H3

Cards and subsections.

### Body

Main content.

### Caption

Supporting information.

Avoid excessively small text, especially for:

- Medical information
- Prescription details
- Patient records
- Warning messages

---

# 24.9 Multilingual Typography

The typography system must support:

- English
- Hindi
- Marathi
- Future Indian languages

Fonts should have strong Unicode coverage.

The layout must tolerate:

```text
English length
≠
Hindi length
≠
Marathi length
```

Buttons and cards should not break when translated text becomes longer.

---

# 24.10 Spacing System

Use a consistent spacing scale.

Recommended base:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Use spacing tokens rather than arbitrary values.

Example:

```text
spacing.1
spacing.2
spacing.3
...
```

---

# 24.11 Layout Grid

Desktop:

```text
12-column grid
```

Tablet:

```text
8-column grid
```

Mobile:

```text
4-column grid
```

Recommended responsive breakpoints should be defined centrally.

---

# 24.12 Border Radius

Use a consistent radius system.

Example:

```text
radius.sm
radius.md
radius.lg
radius.xl
radius.full
```

Healthcare cards should generally use moderate rounded corners.

Avoid excessive "bubble" styling.

---

# 24.13 Elevation

Use subtle elevation.

Levels:

```text
Elevation 0
Elevation 1
Elevation 2
Elevation 3
Elevation 4
```

Use elevation to establish hierarchy rather than decorative shadows.

---

# 24.14 Cards

Cards are frequently used throughout MedConnect AI.

Card types:

- Doctor Card
- Appointment Card
- Report Card
- Prescription Card
- Health Education Card
- AI Recommendation Card
- Lab Card
- Pharmacy Card
- Notification Card

Example:

```text
┌─────────────────────────────┐
│ 🩺 Dr. Sharma               │
│ Cardiologist                │
│                             │
│ ⭐ 4.8                      │
│                             │
│ Next Available              │
│ Today, 5:00 PM              │
│                             │
│ [Book Appointment]          │
└─────────────────────────────┘
```

---

# 24.15 Buttons

Button hierarchy:

### Primary

Main action.

```text
[Book Appointment]
```

### Secondary

Alternative action.

```text
[View Profile]
```

### Tertiary

Low-emphasis action.

```text
View Details
```

### Destructive

Dangerous action.

```text
[Delete]
```

### Emergency

Special emergency CTA.

```text
[🚨 SOS]
```

Emergency actions should have a distinct visual treatment.

---

# 24.16 Button States

Every button should support:

```text
Default
Hover
Focus
Pressed
Loading
Disabled
Success
Error
```

---

# 24.17 Input Fields

Input states:

```text
Default
Focus
Filled
Error
Success
Disabled
Read-only
```

Example:

```text
Mobile Number

┌──────────────────────────┐
│ +91 98765 43210          │
└──────────────────────────┘

✓ Verified
```

---

# 24.18 Forms

Forms should:

- Group related information
- Use clear labels
- Show validation close to the field
- Avoid unnecessary fields
- Preserve user input after errors
- Support keyboard navigation

For healthcare forms, avoid ambiguous terminology.

---

# 24.19 Icons

Icons should be:

- Simple
- Consistent
- Recognizable
- Accessible

Use icons together with text for critical functions.

Examples:

```text
🏠 Home
📅 Appointments
🩺 Doctors
📄 Records
💊 Medicines
🔔 Notifications
```

Production UI should use a consistent icon library rather than emojis unless intentionally used as an illustration style.

---

# 24.20 Navigation

Patient:

```text
Home
Doctors
Appointments
Health
Profile
```

Doctor:

```text
Dashboard
Appointments
Patients
Consultations
Prescriptions
AI Tools
```

Admin:

```text
Dashboard
Users
Healthcare
AI
Content
Analytics
Security
Settings
```

---

# 24.21 Tables

Tables are primarily used in the Doctor and Admin Portals.

Requirements:

- Sortable columns
- Search
- Filters
- Pagination
- Row actions
- Status badges
- Responsive behavior

On mobile, complex tables should transform into cards.

---

# 24.22 Status Badges

Examples:

```text
● Verified
● Pending
● Completed
● Cancelled
● Active
● Suspended
```

Status should use both text and visual indicators.

---

# 24.23 Alerts

Alert types:

```text
Success
Information
Warning
Error
Critical
```

Example:

```text
⚠️ Your doctor has requested additional
information before the consultation.
```

---

# 24.24 Modal Design

Use modals for:

- Confirmation
- Important warnings
- Short forms
- Quick actions

Do not place long workflows inside modals.

---

# 24.25 Bottom Sheets

Mobile applications may use bottom sheets for:

- Filters
- Quick actions
- Appointment options
- Sharing
- Sort options

---

# 24.26 Toasts

Use toasts for short-lived feedback.

Example:

```text
✓ Prescription saved successfully.
```

Critical information should never rely only on a toast.

---

# 24.27 Loading States

Use:

- Skeleton screens
- Progress indicators
- Button loading states

Avoid blank screens.

Example:

```text
Doctor Card
████████████
██████
████████████████
```

---

# 24.28 Empty States

Every list should have an intentional empty state.

Example:

```text
No Appointments Yet

Your upcoming consultations
will appear here.

[Find a Doctor]
```

---

# 24.29 Error States

Example:

```text
Something went wrong.

We couldn't load your medical records.

[Try Again]
```

Errors should be human-readable.

Avoid exposing technical stack traces.

---

# 24.30 AI UI Components

AI features should have a recognizable but subtle visual identity.

Components:

- AI badge
- AI response card
- AI suggestion
- AI confidence/context indicator where appropriate
- AI disclaimer
- Regenerate
- Feedback

Example:

```text
✨ AI Health Assistant

Based on the information you provided...

[View Details]

AI-generated information
For informational purposes only.
```

---

# 24.31 AI vs Human Information

The UI must clearly differentiate:

```text
AI-generated
Doctor-provided
System-generated
User-provided
```

Example:

```text
✨ AI Summary
Generated by MedConnect AI

👨‍⚕️ Doctor's Note
Written by Dr. Sharma
```

---

# 24.32 Medical Data Visualization

Potential visualizations:

- Health timeline
- Blood pressure trends
- Glucose trends
- Weight trends
- Lab history

Charts must:

- Have labels
- Use readable scales
- Avoid misleading visualizations
- Provide exact values
- Support accessibility

---

# 24.33 Accessibility

Target:

**WCAG 2.2 AA where practical and applicable.**

Support:

- Keyboard navigation
- Screen readers
- Focus indicators
- High contrast
- Accessible forms
- Alternative text
- Large touch targets
- Reduced motion

---

# 24.34 Responsive Design

### Mobile

Primary target for patients.

### Tablet

Important for:

- Doctors
- Patients
- Clinics

### Desktop

Primary target for:

- Doctors
- Admins

---

# 24.35 Responsive Behavior

Example:

```text
Desktop
Sidebar + Content

Tablet
Compact Sidebar + Content

Mobile
Bottom Navigation + Content
```

---

# 24.36 Motion Design

Motion should be:

- Smooth
- Minimal
- Purposeful

Use animation for:

- Navigation
- Loading
- Success
- AI generation
- Transitions

Avoid unnecessary motion in healthcare workflows.

---

# 24.37 Microinteractions

Examples:

```text
Appointment Booked
      ↓
✓ Success animation

Prescription Issued
      ↓
✓ Confirmation

Medicine Taken
      ↓
✓ Updated adherence state
```

---

# 24.38 Design Tokens

Claude Design should establish a centralized token architecture:

```text
colors.*
typography.*
spacing.*
radius.*
shadow.*
breakpoint.*
motion.*
icon.*
component.*
```

All components should consume these tokens.

---

# 24.39 Component Naming

Use predictable naming.

Example:

```text
Button
Button.Primary
Button.Secondary

Card
Card.Doctor
Card.Appointment
Card.Report

Input
Input.Search
Input.Phone

Modal
Modal.Confirmation
Modal.Warning
```

---

# 24.40 Design System Documentation

Every component should document:

- Purpose
- Anatomy
- Variants
- States
- Usage
- Accessibility
- Responsive behavior
- Do / Don't examples

---

# 24.41 Cross-Portal Consistency

The following must remain consistent across all portals:

- Logo
- Typography
- Core colors
- Iconography
- Spacing
- Buttons
- Inputs
- Alerts
- AI visual language

The following may differ:

- Navigation
- Information density
- Dashboard layouts
- Data presentation

---

# 24.42 Design System Goal

The final design system should allow a developer or designer to create a new MedConnect AI screen without inventing a new visual style.

> **Build once. Reuse everywhere.**

---

# 24.43 Claude Design Prompt

Claude Design should treat this section as the **single source of truth for the MedConnect AI visual system**.

When generating any screen:

1. Use the established design tokens.
2. Reuse existing components.
3. Maintain accessibility.
4. Maintain healthcare trust.
5. Support responsive layouts.
6. Support multilingual content.
7. Clearly distinguish AI-generated content.
8. Keep clinical information readable.
9. Avoid unnecessary decoration.
10. Maintain consistent interaction patterns.