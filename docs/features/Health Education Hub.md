# 22. Health Education Hub

## 22.1 Overview

The Health Education Hub is MedConnect AI's centralized health-information and awareness platform.

Its purpose is to provide patients and families with **simple, accessible, multilingual, trustworthy health education** without requiring a medical background.

The Health Education Hub should support MedConnect AI's rural-first mission by making health information easier to understand for users in:

- Rural areas
- Tier-2 cities
- Tier-3 cities
- Low-health-literacy communities
- First-time digital healthcare users

> **Core Principle: Educate before users panic, confuse, or self-diagnose.**

The hub should not replace a doctor. It should provide educational information and guide users toward appropriate professional care when necessary.

---

# 22.2 Objectives

The Health Education Hub should:

- Improve health awareness.
- Explain common diseases and symptoms.
- Promote preventive healthcare.
- Provide medication and lifestyle education.
- Help users understand medical terminology.
- Explain laboratory tests.
- Explain common procedures.
- Provide maternal and child health education.
- Provide emergency awareness.
- Support multiple Indian languages.
- Help users make informed healthcare decisions.
- Connect educational content to relevant MedConnect AI services.

---

# 22.3 Main Categories

Recommended initial categories:

```text
Health Education
│
├── General Health
├── Common Diseases
├── Symptoms
├── Nutrition
├── Mental Wellness
├── Women's Health
├── Men's Health
├── Child Health
├── Senior Health
├── Maternal Health
├── Preventive Care
├── Medicines
├── Lab Tests
├── First Aid
├── Emergency Awareness
└── Healthy Lifestyle
```

Future categories can be added through the Admin CMS.

---

# 22.4 Health Education Dashboard

```text
------------------------------------------------
Health Education

Search health topics...

[ What are you looking for? ]

Featured
--------------------------------
Understanding Blood Pressure
[Read Article]

Popular Topics
--------------------------------

🫀 Heart Health
🥗 Nutrition
🩸 Diabetes
🧠 Mental Wellness
👶 Child Health
👩 Women's Health

--------------------------------

Recommended For You
--------------------------------

Based on your interests

[Article Card]
[Article Card]

--------------------------------
```

---

# 22.5 Search

Users should be able to search:

- Diseases
- Symptoms
- Medicines
- Tests
- Health topics
- Articles

Example:

```text
Search: "high BP"

Results

What is High Blood Pressure?
Symptoms of High BP
How to Monitor Blood Pressure
When to See a Doctor
```

Search should support multilingual queries where technically feasible.

---

# 22.6 Content Types

The hub should support multiple content formats.

### Articles

Text-based educational content.

### Infographics

Visual health explanations.

### Videos

Short educational videos.

### FAQs

Question-and-answer format.

### Guides

Step-by-step educational material.

### Awareness Campaigns

Time-sensitive public-health campaigns.

### Interactive Content

Future:

- Health quizzes
- Risk-awareness questionnaires
- Educational calculators

---

# 22.7 Article Card

Each article card should contain:

- Thumbnail/illustration
- Category
- Title
- Short description
- Reading time
- Language
- Published/updated date

Example:

```text
--------------------------------
🫀 Heart Health

5 Ways to Keep Your Heart Healthy

Simple lifestyle changes that can
support cardiovascular health.

5 min read

[Read More]
--------------------------------
```

---

# 22.8 Article Details

Article screen:

```text
--------------------------------
Heart Health

5 Ways to Keep Your Heart Healthy

5 min read

Updated: Aug 2026

--------------------------------

Introduction

...

What You Should Know

...

Warning Signs

...

When to See a Doctor

...

Related Topics

...

[Find a Doctor]
--------------------------------
```

---

# 22.9 Medical Content Structure

Where appropriate, articles should follow a consistent structure:

1. What is it?
2. Common causes
3. Common symptoms
4. Risk factors
5. Prevention
6. When to seek medical care
7. Diagnosis
8. Treatment overview
9. Frequently asked questions
10. Related topics

Not every article needs every section.

---

# 22.10 Medical Disclaimer

Educational content should include an appropriate disclaimer.

Example:

```text
This information is provided for educational purposes
and is not a substitute for professional medical advice,
diagnosis, or treatment.

If you have concerning symptoms, consult a qualified
healthcare professional.
```

The exact legal wording should be centrally controlled by the platform.

---

# 22.11 Emergency Content

Certain articles should clearly identify emergency warning signs.

Example:

```text
⚠️ Seek Emergency Care

If you experience severe symptoms such as...

[Emergency SOS]
```

Emergency CTAs should only appear where clinically appropriate.

---

# 22.12 Related Healthcare Actions

Education should connect naturally to platform services.

For example:

```text
Article:
Understanding Diabetes

Related Actions:

[Check Symptoms]
[Find a Doctor]
[Find Laboratory]
[View Health Records]
```

The user should never be forced to leave the article simply to take the next logical action.

---

# 22.13 Personalized Education

The platform can recommend educational content based on:

- User-selected interests
- Age group
- Family health interests
- Previously viewed topics
- Upcoming appointments
- General health goals
- Medicine education
- Report-related educational topics

Personalization must avoid presenting unsupported medical conclusions.

Example:

```text
Recommended for You

Understanding Your Blood Test
Why Regular Health Checkups Matter
Healthy Eating Basics
```

---

# 22.14 Report-Linked Education

After a user uploads a report, the platform may offer educational resources related to report terminology.

Example:

```text
Your Report Contains:

Hemoglobin

Learn More:
"What is Hemoglobin?"

[Read Educational Guide]
```

This should explain terminology rather than automatically diagnosing the patient.

---

# 22.15 Medicine Education

Medicine-related educational content may explain:

- General purpose
- Common usage information
- General precautions
- Storage
- Common terminology

The content must not override a doctor's prescription or provide unsafe personalized treatment instructions.

---

# 22.16 Health Literacy Mode

Because the platform targets diverse literacy levels, content should support:

- Simple language
- Short paragraphs
- Visual explanations
- Icons
- Bullet points
- Audio narration — future
- Regional languages

Example:

Instead of:

> Hypertension is a chronic cardiovascular condition characterized by persistently elevated arterial blood pressure.

Use:

> **High blood pressure means the pressure of blood flowing through your blood vessels stays higher than normal over time.**

---

# 22.17 Language Support

Initial languages:

- English
- Hindi
- Marathi

Future:

- Gujarati
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Odia
- Assamese

Content should be reviewed for medical accuracy after translation.

---

# 22.18 Saved Articles

Users can save useful content.

```text
Saved Articles

❤️ Heart Health
Understanding Blood Pressure

🥗 Nutrition
Healthy Eating Basics
```

Actions:

- Save
- Remove
- Share

---

# 22.19 Article Sharing

Users can share educational content through supported device sharing mechanisms.

Shared content should contain:

- Article title
- MedConnect AI identity
- Link/reference
- Appropriate disclaimer where necessary

---

# 22.20 Content Feedback

At the bottom:

```text
Was this information helpful?

👍 Yes     👎 No
```

Optional:

```text
What could be improved?
```

This feedback should be available to the content team through the Admin Portal.

---

# 22.21 Content Quality

Health education content should have:

- Author/reviewer information where appropriate
- Review date
- Last updated date
- Source references where appropriate
- Medical review status

Example:

```text
Medically Reviewed
Updated: August 2026
```

---

# 22.22 Admin Content Workflow

```text
Content Draft
      ↓
Editorial Review
      ↓
Medical Review
      ↓
Translation
      ↓
Quality Check
      ↓
Publish
      ↓
Periodic Review
      ↓
Update / Archive
```

---

# 22.23 Health Education Notifications

The platform can notify users about:

- New health articles
- Awareness campaigns
- Seasonal health information
- Preventive-care education

Promotional and educational notifications should be clearly distinguishable from clinical reminders.

---

# 22.24 Health Education Screen Matrix

| ID | Screen | Priority |
|---|---|---|
| HE-001 | Education Dashboard | MVP |
| HE-002 | Category List | MVP |
| HE-003 | Category Details | MVP |
| HE-004 | Search | MVP |
| HE-005 | Search Results | MVP |
| HE-006 | Article Card | MVP |
| HE-007 | Article Details | MVP |
| HE-008 | FAQ | MVP |
| HE-009 | Health Guide | MVP |
| HE-010 | Infographic Viewer | Phase 2 |
| HE-011 | Video Education | Phase 3 |
| HE-012 | Saved Articles | Phase 2 |
| HE-013 | Article Feedback | MVP |
| HE-014 | Related Topics | MVP |
| HE-015 | Personalized Education | Phase 2 |
| HE-016 | Health Campaign | Phase 2 |

---

# 22.25 Health Education User Flow

```text
Dashboard
    ↓
Health Education
    ↓
Browse / Search
    ↓
Category
    ↓
Article
    ↓
Understand
    ↓
Related Healthcare Action
    │
    ├── Find Doctor
    ├── Check Symptoms
    ├── Find Lab
    └── Emergency SOS
```

---

# 22.26 Claude Design Instructions

Design the Health Education Hub as a **calm, trustworthy health-information experience**.

Avoid making it look like a news website.

Prioritize:

- Readability
- Large typography
- Visual hierarchy
- Simple language
- Health illustrations
- Category discovery
- Search
- Multilingual readiness
- Accessibility

The user should feel:

> "I can understand this without being a medical expert."

---

# 22.27 Success Criteria

A user should be able to:

1. Open Health Education.
2. Find a topic quickly.
3. Understand the article.
4. Identify important warning signs.
5. Know when professional help may be appropriate.
6. Navigate to the relevant MedConnect AI healthcare service.
7. Read content in their preferred supported language.