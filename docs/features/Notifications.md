# 23. Notifications

## 23.1 Overview

The MedConnect AI Notification System is a centralized communication layer that keeps patients, doctors, and administrators informed about important platform events.

Notifications must be designed around **priority, relevance, timing, and safety**.

The system should prevent notification overload while ensuring critical healthcare information is not missed.

> **Core Principle: Notify when it matters, not whenever something happens.**

---

# 23.2 Notification Types

Notifications are divided into:

```text
Clinical
Appointment
Medication
Laboratory
Prescription
AI
Emergency
Family
System
Security
Education
Promotional
```

---

# 23.3 Notification Priority

## Critical

Examples:

- Emergency SOS status
- Critical system security event
- Urgent appointment changes

## High

Examples:

- Appointment starting soon
- Doctor cancelled appointment
- Prescription issued
- Lab report available

## Medium

Examples:

- Medicine reminder
- Follow-up reminder
- Health education recommendation

## Low

Examples:

- New educational article
- Optional platform updates

Promotional notifications should remain separate and should never visually resemble emergency alerts.

---

# 23.4 Notification Channels

Possible channels:

### In-App

Primary notification channel.

### Push Notification

Mobile/browser push.

### SMS

For selected critical workflows where appropriate.

### Email

For account and selected healthcare communication.

### WhatsApp

Future integration where legally and operationally appropriate.

The notification engine should determine the appropriate channel based on event type and user preferences.

---

# 23.5 Notification Center

```text
--------------------------------
Notifications

[All] [Appointments] [Health]

Today

🔵 Appointment Reminder
Your consultation starts in 30 minutes.

🔵 Prescription
Dr. Sharma issued a prescription.

Yesterday

🟢 Lab Report
Your report is now available.

--------------------------------
[Mark all as read]
--------------------------------
```

---

# 23.6 Notification Badge

Navigation can show:

```text
Notifications 🔴 3
```

The badge should represent unread notifications rather than total notifications.

---

# 23.7 Notification Detail

```text
--------------------------------
Appointment Reminder

Your consultation with
Dr. Sharma starts at 5:00 PM.

Date:
28 August 2026

[View Appointment]
[Join Consultation]
--------------------------------
```

---

# 23.8 Appointment Notifications

Examples:

### Booking Confirmed

> Your appointment with Dr. Sharma has been confirmed.

### Appointment Reminder

> Your consultation starts in 30 minutes.

### Doctor Joined

> Your doctor is ready for the consultation.

### Appointment Rescheduled

> Your appointment has been moved to 6:00 PM.

### Appointment Cancelled

> Your appointment has been cancelled.

---

# 23.9 Prescription Notifications

When a doctor issues an e-prescription:

```text
Prescription Available

Dr. Sharma has issued a new prescription.

[View Prescription]
```

The notification should never expose sensitive medication information in the lock-screen preview unless the user explicitly permits it.

---

# 23.10 Laboratory Notifications

Examples:

```text
Report Uploaded

Your laboratory report is now available.

[View Report]
```

AI analysis:

```text
Report Analysis Ready

Your AI-assisted report explanation is available.

[View Analysis]
```

The AI notification must clearly identify that the content is AI-generated.

---

# 23.11 Medicine Notifications

Medicine reminder:

```text
Medicine Reminder

It's time for your scheduled medicine.

[Mark as Taken]

[Snooze]
```

Possible actions:

- Taken
- Snooze
- Skip

The system should preserve adherence history according to product requirements.

---

# 23.12 Follow-Up Notifications

Example:

```text
Follow-up Reminder

You have a recommended follow-up
with your doctor.

[View Appointment]
[Book Follow-up]
```

---

# 23.13 AI Notifications

AI may notify users about:

- Report analysis availability
- Health education recommendations
- Medication-related reminders
- Personalized health tasks

AI notifications must not make unsupported diagnoses.

Avoid:

> "You may have diabetes."

Prefer:

> "Your report contains terms you may want to understand. View the explanation."

---

# 23.14 Emergency Notifications

Emergency notifications require a separate visual hierarchy.

Example:

```text
🚨 EMERGENCY

SOS Activated

Your emergency request is active.

[View Emergency Status]
```

Emergency notifications should not be mixed into ordinary promotional or educational notification feeds in a way that could obscure them.

---

# 23.15 Family Notifications

Examples:

```text
Family Health

Your mother's appointment starts
in 1 hour.

[View Appointment]
```

Family notifications must respect configured permissions.

---

# 23.16 Security Notifications

Examples:

```text
Security Alert

A new device signed into your
MedConnect AI account.

[Review Activity]
```

Other events:

- Password changed
- Email changed
- Mobile number changed
- New login
- Account security change

---

# 23.17 Education Notifications

Examples:

```text
Health Education

New article:
Understanding Blood Pressure

[Read Article]
```

Seasonal campaigns:

```text
Health Awareness

Learn about preventive health
during monsoon season.

[Learn More]
```

Users should be able to control non-critical education notifications.

---

# 23.18 Notification Preferences

Settings:

```text
Notification Preferences

Appointments              ON
Medicine Reminders        ON
Prescription Updates      ON
Lab Reports               ON
AI Updates                ON
Family Health             ON
Health Education          ON
Security Alerts           ON
Emergency Alerts          ON
Promotions                OFF
```

Security and emergency notifications should not be disabled if doing so would compromise essential account or safety functionality; the exact behavior should follow product/legal requirements.

---

# 23.19 Quiet Hours

Optional feature:

```text
Quiet Hours

From: 10:00 PM
To:   07:00 AM

[Enable]
```

Critical notifications may bypass quiet hours when appropriate.

---

# 23.20 Notification Frequency

For non-critical notifications:

- Immediate
- Daily summary
- Weekly summary
- Disabled

Example:

```text
Health Education

○ Immediate
○ Daily Summary
○ Weekly Summary
○ Off
```

---

# 23.21 Notification Grouping

Avoid sending many separate notifications for the same event.

Example:

Instead of:

```text
3 new health articles
1 recommendation
2 reminders
```

Create:

```text
Your Health Updates

6 new updates are available.

[View Updates]
```

Critical healthcare events should not be grouped if grouping could hide important information.

---

# 23.22 Notification Deep Linking

Every notification should open the relevant screen.

Examples:

```text
Appointment notification
        ↓
Appointment Details

Prescription notification
        ↓
Prescription Details

Lab notification
        ↓
Report Details

Medicine reminder
        ↓
Medicine Reminder

Doctor message
        ↓
Conversation
```

---

# 23.23 Notification Lifecycle

```text
Event Generated
      ↓
Notification Rule
      ↓
Priority Calculation
      ↓
User Preference Check
      ↓
Channel Selection
      ↓
Notification Sent
      ↓
Delivered
      ↓
Read
      ↓
Action / Dismiss
```

---

# 23.24 Notification Status

Each notification may have:

```text
Created
Queued
Sent
Delivered
Read
Actioned
Failed
Expired
```

The backend should track delivery status where supported by the channel.

---

# 23.25 Notification Engine

Conceptual architecture:

```text
Platform Event
      ↓
Event Bus
      ↓
Notification Engine
      ↓
Priority + Rules
      ↓
User Preferences
      ↓
Template Engine
      ↓
Localization
      ↓
Channel Router
      ↓
Push / SMS / Email / In-App
```

---

# 23.26 Notification Templates

Templates should support variables.

Example:

```text
Appointment Reminder

Hello {{patient_name}},

Your consultation with
{{doctor_name}} starts at {{appointment_time}}.

[View Appointment]
```

Templates should be centrally managed and version-controlled.

---

# 23.27 Multilingual Notifications

Notifications should use the user's preferred language.

Example:

English:

> Your appointment starts in 30 minutes.

Hindi:

> आपकी अपॉइंटमेंट 30 मिनट में शुरू होगी।

Marathi:

> तुमची अपॉइंटमेंट ३० मिनिटांत सुरू होईल.

Medical translations should be reviewed for accuracy.

---

# 23.28 Notification Delivery Rules

Example:

```text
Appointment Created
        ↓
Send Confirmation

24 Hours Before
        ↓
Send Reminder

1 Hour Before
        ↓
Send Reminder

15 Minutes Before
        ↓
Optional Reminder

Appointment Started
        ↓
Join Notification
```

Exact timing should be configurable.

---

# 23.29 Notification Deduplication

The system should prevent duplicate notifications caused by:

- Retry events
- API failures
- Multiple event triggers
- Synchronization problems

Each event should have an idempotency mechanism.

---

# 23.30 Notification Expiration

Some notifications become irrelevant after a certain time.

Example:

```text
Appointment reminder
```

After the appointment:

```text
Expired
```

However, the appointment history should remain accessible separately.

---

# 23.31 Notification Actions

Where appropriate, notifications should provide quick actions.

Examples:

### Appointment

```text
[Join]
[View]
```

### Medicine

```text
[Mark Taken]
[Snooze]
```

### Prescription

```text
[View]
```

### Security

```text
[Review]
```

Actions must require appropriate authentication for sensitive operations.

---

# 23.32 Notification Center Filters

Filters:

```text
All
Appointments
Health
Medicines
Reports
Prescriptions
Family
Security
Education
```

---

# 23.33 Notification Search

Users can search notification history.

Example:

```text
Search notifications

"prescription"
```

Results:

```text
Prescription issued
Prescription updated
Prescription available
```

---

# 23.34 Notification Retention

The system should define retention periods by notification type.

Notifications should not become an uncontrolled permanent storage mechanism.

Important healthcare records should remain in their proper modules:

- Prescription → Medical Wallet
- Report → Medical Wallet
- Appointment → Appointments
- Consultation → Consultation History

The notification should act as a pointer to the source record.

---

# 23.35 Privacy

Notification previews can contain sensitive information.

Users should have an option such as:

```text
Notification Preview

○ Show full content
○ Hide sensitive content
```

Example hidden preview:

> You have a new healthcare update.

Instead of exposing:

> Your prescription for [medicine] is ready.

---

# 23.36 Notification Security

Sensitive actions may require:

- Login
- OTP
- Device authentication
- Session validation

Never include:

- Passwords
- OTPs
- Full medical records
- Sensitive patient data

inside ordinary notification content.

---

# 23.37 Notification Analytics

System-level metrics:

- Sent
- Delivered
- Opened
- Actioned
- Failed
- Unsubscribed

By category:

```text
Appointment
Medicine
Prescription
Laboratory
Education
System
```

Analytics should be used to improve communication without encouraging excessive notifications.

---

# 23.38 Notification Failure Handling

If push notification fails:

```text
Push Failed
     ↓
Retry
     ↓
Alternative Channel
     ↓
Log Failure
```

Fallback behavior must respect user preferences, consent, and channel availability.

---

# 23.39 Notification Screen Matrix

| ID | Screen | Priority |
|---|---|---|
| N-001 | Notification Center | MVP |
| N-002 | Notification Details | MVP |
| N-003 | Notification Filters | MVP |
| N-004 | Notification Search | Phase 2 |
| N-005 | Notification Preferences | MVP |
| N-006 | Quiet Hours | Phase 2 |
| N-007 | Notification Permission | MVP |
| N-008 | Appointment Notification | MVP |
| N-009 | Prescription Notification | MVP |
| N-010 | Lab Report Notification | MVP |
| N-011 | Medicine Reminder | MVP |
| N-012 | Follow-up Reminder | MVP |
| N-013 | AI Notification | MVP |
| N-014 | Family Notification | MVP |
| N-015 | Security Notification | MVP |
| N-016 | Emergency Notification | MVP |
| N-017 | Education Notification | MVP |

---

# 23.40 Notification User Flow

```text
PLATFORM EVENT
      ↓
NOTIFICATION ENGINE
      ↓
CHECK PRIORITY
      ↓
CHECK USER PREFERENCES
      ↓
LOCALIZE
      ↓
SEND
      ↓
USER RECEIVES
      ↓
NOTIFICATION CENTER
      ↓
DEEP LINK
      ↓
RELEVANT FEATURE
```

---

# 23.41 Claude Design Instructions

Notifications should be designed as a **supporting communication system**, not the center of the application.

The design must visually differentiate:

### Emergency

Highly prominent.

### Clinical

Clear and important.

### Reminder

Action-oriented.

### Educational

Informational.

### Promotional

Subtle and clearly labeled.

The user should always understand:

**What happened?**

**Why am I seeing this?**

**What should I do next?**

---

# 23.42 Notification Success Criteria

The notification system is successful when:

1. Important healthcare events reach users reliably.
2. Users are not overwhelmed by unnecessary notifications.
3. Notifications open the correct application screen.
4. Users can control non-critical notification preferences.
5. Emergency notifications remain prominent.
6. Sensitive information is protected.
7. Notifications support multiple languages.
8. Duplicate notifications are prevented.
9. Notification delivery can be monitored.
10. Critical records remain stored in their proper modules rather than inside notifications.