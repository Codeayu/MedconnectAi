# MedConnect AI — Product Requirements Document

**Status:** Living document · **Last updated:** 30 August 2026 · **Owner:** Jay Penshanwar

> **Smart Care. Connected Everywhere.**
> **आरोग्यं सर्वत्र • सेवा सर्वदा** — *Health Everywhere • Service Always*

## How to use this document

This is the **condensed source of truth**. It states what we are building, in what order,
and the rules that may not be broken. It deliberately does **not** repeat the detailed
feature docs — each section points to them (`docs/features/…`), and those remain the
authority on screen-level behaviour and copy.

Read the PRD section for a feature, then the linked detail doc, before writing code.
Section numbers (`§7`) are stable reference anchors — `CLAUDE.md` cites them.

Two kinds of statement appear here:

- **Verified** — read from the code on 30 Aug 2026 (§13, §14, §19 marked as such).
- **Specified** — required by the product docs but **not yet built**. Do not assume it exists.

---

## §1 Product summary

MedConnect AI is a **rural-first, AI-powered digital healthcare ecosystem for India**.
One platform connects patients, doctors, AI health assistance, laboratories, pharmacies,
medical records and emergency services.

It is **not** a doctor-booking app, a video-call app, an AI chatbot, or a pharmacy app.
It is the connective tissue between all of them.

Three portals over one shared service layer:

| Portal | User | Character |
|---|---|---|
| Patient | patients, families | friendly · accessible · reassuring · **mobile-first** |
| Doctor | verified doctors, clinics | clinical · efficient · productive · **desktop-first** |
| Admin | platform operators | operational · analytical · controlled · **data-dense** |

All three share one design system, brand and API. Only navigation, information density
and data presentation differ.

---

## §2 Problem

Detail: [`docs/product/problem-statement.md`](product/problem-statement.md)

Indian healthcare — especially in villages and Tier-2/Tier-3 cities — is **fragmented,
distant and hard to understand**. A single patient journey today spans Practo, a phone
call, Google Drive, WhatsApp, Google Meet and YouTube. Nothing carries context forward.

The gaps we are attacking:

1. Specialists are concentrated in cities; travel cost and time deter care.
2. Medical records are paper, scattered, and lost between visits.
3. Reports are written for clinicians, not patients — so patients self-diagnose or panic.
4. Patients don't know which specialist to see for which symptom.
5. Lab pricing is opaque and uncomparable.
6. Follow-up and medication adherence depend on memory.
7. Emergencies have no single, fast, contextual entry point.
8. Low health literacy and English-only interfaces exclude users.

**Core problem statement**

> Where a person lives should not determine the quality, speed or understandability of
> the healthcare they can reach.

---

## §3 Vision, positioning and brand

Detail: [`docs/product/vision.md`](product/vision.md) ·
[`docs/design/25 - Brand Identity.md`](design/25%20-%20Brand%20Identity.md)

**Vision:** a connected healthcare ecosystem where every person can access trusted
healthcare services, information and assistance wherever they live.

Six product pillars: **Accessibility · Intelligence · Personalization · Security ·
Simplicity · Preventive healthcare**.

Governing product philosophy — quoted verbatim because it drives design decisions:

> **AI should explain, not decide.**

Brand voice is clear, calm, human. "Start your consultation," not "Initiate your
teleconsultation session." Guide, don't command. Reassure without false certainty.

Visual language: **medical blue + teal + clean white**, restrained AI accents, authentic
Indian imagery. Never cyberpunk, never sci-fi robots, never fear-based messaging.

---

## §4 Users

Detail: [`docs/product/target-users.md`](product/target-users.md)

| User | Priority | Primary need |
|---|---|---|
| Patients | **Highest** | reach care, understand it, keep records |
| Doctors | **Highest** | less admin, more patient care |
| Hospitals / clinics | Medium | manage doctors and appointments |
| Laboratories | Medium | receive bookings, deliver reports |
| Pharmacies | Low (Phase 2) | discoverability, prescription fulfilment |
| Administrators | Enabling | govern and operate the platform |

Secondary: family members, caregivers, integration partners.

Design constraints that follow from the user base: low bandwidth, low-end Android
devices, first-time digital users, varied literacy, three languages at launch.

---

## §5 Ecosystem architecture

```text
                         MEDCONNECT AI
          ┌───────────────────┼───────────────────┐
      PATIENT              DOCTOR              ADMIN
       PORTAL              PORTAL              PORTAL
          └───────────────────┼───────────────────┘
                    SHARED SERVICE LAYER
        ┌─────────────────────┼─────────────────────┐
       AI                 Healthcare            Platform
    Services              Services              Services
  Symptom Checker       Appointments          Auth / RBAC
  Health Assistant      Telemedicine          Notifications
  OCR                   E-Prescription        Payments
  Report Analysis       Labs                  Storage
  Recommendations       Pharmacy              Analytics
```

Every capability is a service behind the REST API. A portal is a client, never a
place where business rules live. This is what makes the standalone E-Prescription
module (§7.4) pluggable later.

---

## §6 Scope

Detail: [`docs/product/Product-goles.md`](product/Product-goles.md)

### MVP — the spine

Auth & RBAC · patient dashboard & profile · doctor discovery · appointment booking ·
video consultation · AI Health Assistant · AI Symptom Checker · Medical Wallet ·
OCR upload · AI Report Analysis · e-prescription · lab test booking & comparison ·
health education · notifications · doctor portal (schedule → patient → consultation →
prescription) · admin portal (users, doctor verification, content, health, audit).

### Phase 2

Pharmacy finder · medicine reminders & adherence · Health Timeline · Family Health ·
Emergency SOS · prescription templates · drug-interaction & allergy checks ·
legally-recognised digital signature · analytics dashboards · campaign builder ·
quiet hours · notification search · geographic analytics · feature flags.

### Phase 3

Wearables · predictive risk scoring · AI Health Coach · voice medical scribe ·
imaging AI · federated / privacy-preserving AI · hospital and government integrations.

### Non-goals for the initial release — do not build

AI that replaces a doctor · autonomous diagnosis · ambulance dispatch control ·
medicine delivery logistics · insurance claim processing · hospital ERP replacement ·
wearable hardware · remote-patient-monitoring hardware · compliance regimes outside
the target market.

If a request lands in Phase 2/3 or the non-goals, confirm the scope change before
building it.

---

## §7 Feature map

Each row: where the requirement lives, and the screen-matrix IDs that act as the
implementation and QA checklist.

| Area | Detail doc | Screens |
|---|---|---|
| §7.1 Patient app (all features, IA, states) | [`features/patient-app.md`](features/patient-app.md) | **P-001 … P-145** |
| §7.2 Doctor portal | [`features/doctor-portal.md`](features/doctor-portal.md) | **D-001 … D-038** |
| §7.3 Admin portal | [`features/Admin Portal.md`](features/Admin%20Portal.md) | **A-001 … A-039** |
| §7.4 Cross-platform features 1–22 + feature matrix | [`features/Core-features.md`](features/Core-features.md) | — |
| §7.5 AI modules (8 modules, infra, guardrails) | [`features/AI-features.md`](features/AI-features.md) | — |
| §7.6 Notifications | [`features/Notifications.md`](features/Notifications.md) | **N-001 … N-017** |
| §7.7 Health Education Hub | [`features/Health Education Hub.md`](features/Health%20Education%20Hub.md) | **HE-001 … HE-016** |
| §7.8 Design system | [`design/24 - Design System.md`](design/24%20-%20Design%20System.md) | — |
| §7.9 Brand identity | [`design/25 - Brand Identity.md`](design/25%20-%20Brand%20Identity.md) | — |

The **E-Prescription module** is being built standalone in the sibling repo
`e_prescription` (FastAPI + React) with its own PRD. Per
`features/doctor-portal.md` §13.24 it must eventually become a service inside the
Doctor Portal — so keep its API versioned and its data model compatible (§11).

---

## §8 The core journey

Detail: [`docs/product/user-journeys.md`](product/user-journeys.md)

Everything else is a branch off this chain. If a change breaks a link here, it is a
regression regardless of what else it improves.

```text
Patient has a symptom
    → AI Symptom Checker explains what it may relate to (never diagnoses)
    → recommends a specialist type
    → patient finds and books a doctor
    → video consultation
    → doctor writes clinical notes and an e-prescription
    → prescription lands in the patient's Medical Wallet
    → labs booked if ordered; report uploaded; OCR + AI explanation
    → follow-up scheduled; reminders sent
    → the whole history stays in one place, in the patient's language
```

Two design consequences:

1. **Context must carry forward.** A consultation knows its appointment; a prescription
   knows its consultation; a report knows the patient's record. No step restarts from zero.
2. **Every screen answers three questions** (`design/25` §25.33): *Can I trust this? Can I
   understand this? Can I act on this?*

---

## §9 AI architecture

Detail: [`features/AI-features.md`](features/AI-features.md)

Eight specified modules: **Health Assistant · Symptom Checker · OCR · Report Analysis ·
Doctor Recommendation · Personalization · Notification Intelligence · Content
Intelligence**.

The specified shape is an **AI Orchestrator** in front of task-specific models, with a
RAG layer over curated medical knowledge, per-request safety filtering, and human
verification for anything low-confidence.

**Verified as built (30 Aug 2026)** — the parts that exist today:

| Piece | Implementation |
|---|---|
| Conversational AI | Google Gemini (`gemini-2.0-flash`) via `google-genai` |
| Intent routing | keyword router in `chatbot/router.py` |
| Retrieval | Pinecone + sentence-transformers |
| Drug / medical lookup | OpenFDA + RxNorm knowledge services |
| Symptom prediction | XGBoost `.joblib` model + label encoder, lazily loaded |
| Safety | `chatbot/safety.py` — emergency and self-harm phrase lists, dosage-advice redaction, mandatory disclaimer |
| Multimodal | pytesseract (OCR), PyMuPDF (PDF), faster-whisper (audio) |

Not built: the orchestrator abstraction, OCR confidence scoring with a human-verification
queue, report trend analysis, and the recommendation/personalization/notification engines.

**Guardrails that apply to every AI surface:**

- No diagnosis, no dosage advice, no treatment plan. Explain; recommend seeing someone.
- Emergency language triggers an emergency pathway before anything else runs.
- Every AI output carries a visible disclaimer and an "AI-generated" label (§10.3).
- Confidence is **not** a probability of disease. Never present it as one.
- A doctor's content always outranks AI content on screen.

---

## §10 Non-negotiable rules

Clinical-safety, legal and privacy requirements. Not preferences. If a request conflicts
with one of these, say so rather than complying.

### §10.1 Clinical safety

1. AI never diagnoses, prescribes, or states a dosage. It explains and directs to care.
2. Emergency symptoms trigger emergency guidance ahead of any other AI response.
3. Only a **verified, approved** doctor may issue a prescription or clinical note.
   Enforce server-side, not in the UI.
4. An issued prescription is **immutable**. Corrections create a new version linked to the
   original; the original, its timestamp and its doctor identity survive.
5. Admins may **never** edit clinical content. They govern accounts, verification and
   content — not medicine.
6. OCR and AI extraction of a medical report is **draft data** until a human confirms it.

### §10.2 Privacy and data minimisation

7. Never log PHI. Not in application logs, not in analytics, not in error reports.
8. Return only the fields a screen needs. Aggregates and admin analytics must not expose
   identifiable clinical detail.
9. Notification previews must not leak medical content; a hidden-preview mode is required
   (`features/Notifications.md` §23.35).
10. Never put PHI behind a guessable URL, and never rely on an unguessable URL as access
    control. Authorise every read server-side.
11. India deployment must be reviewed against the **DPDP Act 2023** and applicable
    prescription / e-signature rules before production.

### §10.3 Honesty in the interface

12. Every piece of information is labelled by source: **Doctor provided · AI generated ·
    User added · System generated**.
13. Never overpromise an outcome, never use fear to drive action, never present AI as a
    doctor.
14. Status is communicated with **colour + icon + text** — never colour alone.

### §10.4 Auditability

15. Every significant action is audit-logged, append-only: account changes, verification
    decisions, prescription lifecycle, record access, admin actions.
16. Deletion of clinical records is a status change with a reason, never a hard delete.

---

## §11 Data model — as built

**Verified** from `medconnect_backend/*/models.py` on 30 Aug 2026.

| App | Models |
|---|---|
| `accounts` | `User` (email login, unique phone, role, `is_verified`), `RevokedRefreshToken` |
| `doctors` | `DoctorProfile` (`license_number`, specialization, `is_approved`, fee, languages), `DoctorReview` |
| `patients` | `PatientProfile` — **only** `full_name`, `age`, `gender` |
| `consultations` | `Consultation` — `diagnosis`, `prescription`, `notes` are **free-text** |
| `videocall` | `VideoRoom`, `CallLog` |
| `lab_tests` | 11 models — the most complete domain; `LabTestBooking` numbers itself `LTB{YYYYMMDD}{6 hex}` |

Roles that exist: `PATIENT`, `DOCTOR`, `LAB_PROVIDER`, `ADMIN`.

### Gaps against the docs — do not assume these exist

- No clinic, pharmacy, medical-wallet, notification, audit-log, health-education or
  admin-content models.
- No structured prescription. `Consultation.prescription` is a text blob; the real
  structured model (medicines as rows, versioning, verification tokens) lives only in the
  `e_prescription` module and must be brought in, not re-invented.
- `PatientProfile` has no allergies, chronic conditions, medications or history — which the
  doctor-portal and AI docs both assume.
- No clinic/pharmacy/staff roles, and none of the 7 admin sub-roles the admin doc specifies.

### Rules for extending it

- The audit log arrives with the first clinical write path, not later.
- Add `allergies`, `chronic_conditions`, `current_medications`, `blood_group` to the patient
  record before building anything that claims to check safety.
- Keep foreign keys for future context (`consultation_id` on a prescription, `appointment_id`
  on a consultation) even when the feature is deferred.
- Human-readable identifiers are generated **server-side, inside the transaction**, following
  the `LTB…` precedent.

---

## §12 API surface — as built

**Verified** from `medconnect_backend/urls.py`.

```text
/health/            /admin/
/api/auth/          /api/doctors/         /api/patients/
/api/consultations/ /api/video/           /api/chat/
/api/symptoms/      /api/doctors-match/   /api/lab-tests/
```

Auth: SimpleJWT — 24 h access, 7 d refresh, rotation on, plus a homegrown
`RevokedRefreshToken` blacklist. Throttling: anon 60/min, user 300/min, auth 12/min,
chat 30/min.

**Required change:** there is **no API versioning**. The ecosystem architecture (§5) and the
E-Prescription integration (§7) both need it. New surface should land under `/api/v1/` and
existing routes should be aliased there before third-party or cross-module consumption.

---

## §13 Tech stack — verified

Read from `requirements.txt`, `package.json`, `settings.py`, `Dockerfile` and
`docker-compose.yml` on 30 Aug 2026.

| Layer | What is actually used |
|---|---|
| Backend | Django 5.2.10 · DRF 3.16.1 · SimpleJWT 5.5.1 · django-cors-headers |
| Database | **`mssql`** (Azure SQL, pyodbc + ODBC Driver 18) by default; PostgreSQL via `dj_database_url` when `DATABASE_URL` is set; SQLite block is commented out |
| Frontend | React 19.2 · Vite 7 (`plugin-react-swc`) · **plain JSX, no TypeScript** |
| Styling | `design-tokens.css` + a 2242-line `index.css`. **No Tailwind** |
| Video | `twilio-video` client, `twilio` server |
| AI | google-genai · Pinecone · sentence-transformers · XGBoost · pytesseract · PyMuPDF · faster-whisper |
| Deploy | multi-stage Dockerfile (python:3.12-slim, linux/arm64, non-root `appuser`) · gunicorn + whitenoise · GitHub Actions · nginx + systemd in `medconnectai-deploy/` · optional Sentry |
| Local compose | postgres:16-alpine + redis:7-alpine + backend |

Constraints that follow: **do not introduce TypeScript or Tailwind** into this codebase, and
keep queries ORM-level so the MSSQL/PostgreSQL split stays a connection-string concern.

---

## §14 Design system and brand — essentials

Detail: [`design/24 - Design System.md`](design/24%20-%20Design%20System.md) ·
[`design/25 - Brand Identity.md`](design/25%20-%20Brand%20Identity.md)

- Palette: **medical blue + teal + clean white**. Consume tokens
  (`colors.* typography.* spacing.* radius.* shadow.* breakpoint.* motion.*`), never
  hard-coded hex.
- Type scale Display → H1–H4 → Body Large/Body/Small → Caption/Label. Clinical text never
  gets small type.
- Accessibility target: **WCAG 2.2 AA** where practical. (`Core-features.md` says 2.1 AA —
  2.2 is the newer statement and wins; the older line should be corrected.)
- Grid 12 / 8 / 4 columns for desktop / tablet / mobile. Mobile-first for patients,
  desktop-first for doctors and admins.
- Every list needs a real **empty state**; every view needs loading, error, unauthorised and
  network-failure states. A spinner that never resolves is a bug.
- AI surfaces use a distinct but subordinate visual identity: badge, disclaimer, regenerate,
  feedback.
- Emergency treatments are visually unique and never reused for promotional content.
- Emoji are documentation shorthand in these docs. Production UI uses a single professional
  icon set.
- Tagline **Smart Care. Connected Everywhere.** and the Sanskrit mission belong on brand
  surfaces (landing, splash, auth, about) — not on every screen. Branding never outranks
  clinical information.

---

## §15 Language and accessibility

Launch languages: **English, Hindi, Marathi**. Planned: Gujarati, Bengali, Tamil, Telugu,
Kannada, Malayalam, Punjabi, Odia, Assamese.

Consequences for implementation:

- No user-facing string is hardcoded in a component. Translated strings are 30–50% longer —
  buttons, cards and tables must not break.
- Fonts need full Devanagari coverage.
- Medical translations require review for accuracy after translation, not before.
- Health-literacy mode: short sentences, plain words, bullets, visuals. *"High blood pressure
  means the pressure of blood flowing through your blood vessels stays higher than normal"* —
  not *"hypertension is a chronic cardiovascular condition characterised by…"*.
- Low-bandwidth, low-end Android is the assumed patient device.

---

## §16 Targets

From `docs/product/Product-goles.md` and `Core-features.md`. Treat as goals to design
toward and measure, not as achieved numbers.

| Dimension | Target |
|---|---|
| Page / screen load | < 3 s on a 3G connection |
| API response | < 500 ms typical |
| AI assistant reply | < 5 s |
| Uptime | 99.9% |
| Booking completion | > 80% of started flows |
| Report understanding | patient can explain their own report after reading the AI summary |
| Accessibility | WCAG 2.2 AA on core flows |
| Languages on core flows | 3 at launch |

---

## §17 Security and compliance

Production requirements — flag explicitly whenever something built is dev-only.

- HTTPS everywhere; secure cookie / token handling. **Tokens currently live in
  `localStorage`** — verified; revisit before production.
- RBAC enforced server-side on every endpoint, including object-level ownership checks.
- Encryption at rest for medical records and uploads.
- Rate limiting on auth, AI and public endpoints (partly in place — §12).
- Secrets only via environment variables. Never commit `.env`, real patient data, or a DB
  file. Reference secrets by key name in docs and logs, never by value.
- Expiring, revocable links for anything shared outside the platform.
- Audit trail per §10.4.
- DPDP Act 2023 review, consent capture, data-retention and deletion policy before launch.

---

## §18 Known gaps and risks

**Verified** by reading the code on 30 Aug 2026; gaps 1 and 3 re-verified after merging
`origin/main` on 5 Sep 2026. Numbered so they can be cited in issues.

| # | Gap | Effect |
|---|---|---|
| 1 | ~~`google-genai`, `xgboost`, `joblib` missing from requirements~~ — **closed 5 Sep 2026**: all three are now pinned in `requirements.txt` | — |
| 2 | `GEMINI_API_KEY` missing from `.env.example` although `chatbot/generator.py` requires it | silent AI failure on a fresh setup |
| 3 | Two frontend API layers: `src/api.js` (env-driven, with refresh interceptor) vs `src/api/index.js` (**hardcodes** `http://104.208.88.185:8000/api`). `src/config.js` also **defaults** to that same public IP when `VITE_API_BASE_URL` is unset | a developer running locally silently sends real requests — and any PHI in them — to the production server; environment separation is not enforced anywhere in the client |
| 4 | Two component libraries: `src/components/ui/*` vs `src/components/ui-next/Mc*` | inconsistent UI, doubled maintenance |
| 5 | `react-router-dom` installed but unused; `App.jsx` switches pages with `useState` | no URLs, no deep links → notification deep-linking (§7.6) is impossible |
| 6 | No API versioning (§12) | blocks E-Prescription integration and any external consumer |
| 7 | Test files are empty stubs except `lab_tests/tests.py`; no pytest config despite pytest being installed | no safety net on clinical logic |
| 8 | `docs/technical/` is empty | no architecture / API / data-model reference; this PRD is the first entry |
| 9 | `Consultation.prescription` is free text (§11) | no structured, verifiable prescription in the main platform |
| 10 | Model and role coverage far behind the docs (§11) | most documented features have no persistence layer yet |
| 11 | `PatientProfile` lacks allergies / conditions / history | any "safety check" feature would be unsafe to claim |
| 12 | JWT in `localStorage`, 24 h access token | XSS exposure; long-lived credential |

Highest-value fixes first: **3, 2, 6, 7** — they are cheap and they unblock or de-risk
everything after them. **3 is now the most urgent**: it is a data-protection issue, not just
a configuration smell (§10.2, §17).

---

## §19 Roadmap

Sequenced so each step is usable and the next one depends on it.

**Stabilise (now)**
Fix gaps 2 and 3 (3 first — it leaks local traffic to production); add `/api/v1/`; introduce
react-router with real URLs; pick one component library and one API client; add pytest config
and tests around auth and booking.

**Complete the spine**
Patient record fields (§11); structured prescription brought in from the `e_prescription`
module; audit log; notification model + in-app centre; medical wallet storage.

**Make it trustworthy**
Doctor verification workflow end to end; admin portal essentials (users, verification,
content, platform health, audit); source labelling across every surface (§10.3);
full state coverage per §14.

**Make it understandable**
i18n for English/Hindi/Marathi; health-literacy content mode; health education hub;
OCR + report explanation with human verification.

**Then Phase 2/3 per §6.**

---

## §20 Success criteria

The product works when:

1. A rural patient with a low-end phone can reach a relevant doctor without travelling.
2. A patient can read their own medical report and explain it in their own words.
3. A doctor spends more of a consultation on the patient than on paperwork.
4. A prescription issued in a video consultation is verifiable, structured and permanent.
5. Nothing in the interface lets a user mistake AI output for a doctor's judgement.
6. A patient's history is in one place, in their language, a year later.
7. An operator can answer "who accessed this record, and when?" from the audit trail.

---

## §21 Document map

```text
docs/
├── PRD.md                          ← this file
├── product/
│   ├── problem-statement.md        §2
│   ├── vision.md                   §3
│   ├── target-users.md             §4
│   ├── user-journeys.md            §8
│   └── Product-goles.md            §6, §16
├── features/
│   ├── patient-app.md              §7.1  P-001…P-145
│   ├── doctor-portal.md            §7.2  D-001…D-038
│   ├── Admin Portal.md             §7.3  A-001…A-039
│   ├── Core-features.md            §7.4
│   ├── AI-features.md              §7.5, §9
│   ├── Notifications.md            §7.6  N-001…N-017
│   └── Health Education Hub.md     §7.7  HE-001…HE-016
├── design/
│   ├── 24 - Design System.md       §7.8, §14
│   ├── 25 - Brand Identity.md      §7.9, §14
│   └── *.png                       landing / doctor login / lab-provider login mockups
└── technical/                      empty — architecture, API and data-model docs go here
```

Precedence when documents disagree: **this PRD's Verified statements** → the feature doc for
the screen in question → the design system → older general docs. Record the resolution here
so the same conflict is not re-litigated.
