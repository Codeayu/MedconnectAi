# CLAUDE.md

Guidance for Claude Code (and developers) working in this workspace.

## What this is

**MedConnect AI** — a rural-first, AI-powered digital healthcare ecosystem for India. One
platform connecting patients, doctors, AI health assistance, laboratories, pharmacies,
medical records and emergency services, through three portals (Patient, Doctor, Admin) over
one shared service layer.

> **Smart Care. Connected Everywhere.**
> **आरोग्यं सर्वत्र • सेवा सर्वदा** — *Health Everywhere • Service Always*

Full requirements: **[docs/PRD.md](docs/PRD.md)** — the condensed source of truth. Section
references below (`§10`) point there; the PRD in turn points at the detailed feature docs,
which remain authoritative on screen-level behaviour and copy.

**Read the PRD section for the feature, then its linked detail doc, before writing code.
Do not invent requirements.**

The PRD marks every statement as **Verified** (read from the code on 30 Aug 2026) or
**Specified** (required by the docs, not yet built). Most of the documented product does not
exist yet — check §11, §12 and §18 before assuming a model, endpoint or feature is there.

Two rules shape every decision:

> **AI should explain, not decide.**
>
> **Where a person lives should not determine the quality, speed or understandability of
> the healthcare they can reach.**

## Repository layout

```
MedconnectAi/                      ← repo root (github.com/Codeayu/MedconnectAi)
├── CLAUDE.md                      this file
├── docs/                          PRD.md + product, feature and design docs
├── medconnect_backend/            Django project
│   ├── manage.py
│   ├── medconnect_backend/        settings, urls, wsgi
│   ├── accounts/ doctors/ patients/ consultations/
│   ├── videocall/ lab_tests/
│   └── chatbot/ symptom_prediction/ doctor_matching/
├── medconnect_frontend/           React 19 + Vite
├── requirements.txt               runtime + dev dependencies
└── .env.example                   required environment variables (names only)
```

Deployment artefacts (Dockerfile, docker-compose, CI workflow, gunicorn/entrypoint scripts,
nginx and systemd configs) are intentionally **not on this branch**. Don't add them without
asking.

The **E-Prescription module** is a separate repo (FastAPI + React) with its own PRD and
`CLAUDE.md`. It is destined to become a service inside the Doctor Portal (§7). When touching
prescriptions, reuse its data model — do not build a second, weaker one here. Never commit
its changes to this repo.

## Commands

Both servers must run — the frontend calls the API directly.

**Backend** (port 8000, from `medconnect_backend/`):
```bash
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend** (port 5173, from `medconnect_frontend/`):
```bash
npm install
npm run dev
```

**Lint the frontend** — required before frontend work is considered done:
```bash
npm run lint
```

**Backend checks:**
```bash
python manage.py check && python manage.py makemigrations --check --dry-run
```

Notes:
- `DATABASES` defaults to **`mssql`** (Azure SQL, pyodbc + ODBC Driver 18) unless
  `DATABASE_URL` is set, in which case `dj_database_url` selects PostgreSQL. A `db.sqlite3`
  exists on disk but the SQLite config is commented out — don't assume SQLite works.
- Env keys are listed in `.env.example`. `GEMINI_API_KEY` is **missing from it**
  but required by `chatbot/generator.py` (§18.2).
- `google-genai`, `xgboost` and `joblib` are imported by code but **absent from
  `requirements.txt`** (§18.1) — chat and symptom prediction fail in a clean install.
- Tests: only `lab_tests/tests.py` has real content and there is no pytest config, so
  `pytest` will not do what you expect yet (§18.7).

## Architecture

```
React 19 + Vite (plain JSX, design-token CSS)
        ↓  REST /api/…   (JWT in Authorization header)
Django 5.2 + DRF 3.16
        ↓
Azure SQL (mssql) · PostgreSQL when DATABASE_URL is set
        +
Gemini · Pinecone · XGBoost · Twilio Video
```

**Layering rules**

- A portal is a **client**. Business rules live in the backend, never in a React component.
- Django apps own their domain. Cross-app logic goes in a service module, not in a view.
- Views/serializers stay thin: validate, delegate, return. Any state transition on clinical
  data (verification, prescription lifecycle, booking status) goes in a service function so
  no endpoint can bypass or duplicate it.
- Every new endpoint enforces role **and** object-level ownership server-side.

**API versioning:** new surface belongs under `/api/v1/`. The current routes are unversioned
(§12) — this must be fixed before the E-Prescription module or any external consumer
integrates.

## Non-negotiable rules

These are clinical-safety, legal and privacy requirements — not preferences. Full list in
**§10**. If a request conflicts with one, **say so instead of complying**.

1. **AI never diagnoses, prescribes or gives a dosage.** It explains and points to care.
   Every AI output carries a disclaimer and an "AI generated" label.
2. **Emergency language wins.** Emergency / self-harm detection runs before any other AI
   response path (`chatbot/safety.py`).
3. **Only verified, approved doctors** issue clinical content. Enforced server-side.
4. **Issued clinical records are immutable.** Corrections create a new linked version.
   Invalidation is a status change with a reason — never a hard delete, never a silent
   overwrite.
5. **Admins never edit clinical content.** They govern accounts, verification and content.
6. **OCR / AI extraction is draft data** until a human confirms it.
7. **Never log PHI** — not in logs, analytics or error reports. Return only the fields a
   screen needs.
8. **Notification previews must not leak medical content.**
9. **Never put PHI behind a guessable URL, and never treat an unguessable URL as access
   control.** Authorise every read.
10. **Label every piece of information by source:** Doctor provided · AI generated · User
    added · System generated. A doctor's content outranks AI content on screen.
11. **Audit every significant action**, append-only: account changes, verification decisions,
    record access, clinical writes, admin actions.
12. **Confidence is not a probability of disease.** Never present it as one.
13. No fear-based messaging, no overpromised outcomes, no presenting AI as a doctor.

Regulatory: India deployment must be reviewed against the **DPDP Act 2023** and applicable
prescription / e-signature rules before production (§17). Treat HTTPS, RBAC, encryption at
rest, rate limiting and expiring share links as production requirements, and **flag
explicitly when something we build is dev-only**.

## Conventions

**Backend (Django / DRF)**

- Django 5.2 idioms; `AUTH_USER_MODEL = "accounts.User"` (email is the username field, phone
  is unique, `role` + `is_verified` on the user).
- Timezone-aware UTC: `django.utils.timezone.now()`. Never naive `datetime.utcnow()`.
- Distinct serializers per direction. Never accept a client-supplied `id`, `role`,
  `is_verified`, `is_approved`, status field or generated number on input — those are
  server-controlled.
- Correct status codes: 400/422 validation, 401 unauthenticated, 403 forbidden, 404 missing,
  409 illegal state transition. **Never return `null` with 200 for a missing resource** — it
  makes frontends hang on "Loading…".
- Choices/enums live in one place per app (`constants.py`, following `accounts/constants.py`)
  and are exposed via an endpoint so the frontend never hardcodes a duplicate list.
- Human-readable identifiers are generated server-side **inside the transaction**, following
  the `LabTestBooking` → `LTB{YYYYMMDD}{6 hex}` precedent. Never client-side.
- Model changes need a migration in the same commit. Keep queries ORM-level — no
  MSSQL-only or Postgres-only SQL, so the engine stays a connection-string concern.
- Keep forward-looking foreign keys (`consultation_id`, `appointment_id`) even when the
  feature is deferred.

**Frontend (React / Vite)**

- **Plain JSX. No TypeScript.** Don't add `.ts`/`.tsx`.
- **No Tailwind.** Styling uses `design-tokens.css` + `index.css`. Consume tokens
  (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `typography.*`), never raw hex.
- All API access goes through the shared client using `API_BASE_URL` from
  `src/config.js` (`import.meta.env.VITE_API_BASE_URL`). **Never hardcode a backend URL** —
  `src/api/index.js` currently does and is the bug, not the pattern (§18.3).
- Every data view handles all states explicitly: empty, loading, validation, success, error,
  network failure, unauthorised. A bare `Loading…` that never resolves is a bug.
- Patient UI is **mobile-first**; doctor and admin UI are desktop-first but responsive.
- No user-facing string hardcoded in a component — Hindi and Marathi are launch languages and
  translated text is 30–50% longer.
- Accessibility: WCAG 2.2 AA on core flows. Status uses **colour + icon + text**, never
  colour alone. Real focus states, keyboard navigation, large touch targets.
- Run `npm run lint` before considering frontend work done.

**Git**

- Commit only this repo's changes here. The E-Prescription module has its own repo — never
  mix the two.
- One logical change per commit. Keep the app working at every commit: never land a backend
  change that breaks the frontend without updating it in the same commit.
- Never commit `.env`, `db.sqlite3`, `env/`, `node_modules/`, model artefacts, logs, or any
  real patient data.
- Only create commits when explicitly asked.

## Gotchas

Each one verified in the code — see §18 for the full list with effects.

1. **Two competing API clients.** `src/api.js` is env-driven and has a single-flight refresh
   interceptor; `src/api/index.js` hardcodes `http://127.0.0.1:8000/api`. Check which one a
   component imports before debugging a failing call. Converge on the env-driven one.
2. **Two competing component libraries** — `src/components/ui/*` and
   `src/components/ui-next/Mc*`. Find out which the screen actually renders before editing.
3. **No client-side routing.** `react-router-dom` is installed but unused; `App.jsx`
   navigates with `useState("landing")` + `setPage()`. There are no URLs, so deep links and
   notification deep-linking are impossible today. Adding a route means touching `App.jsx`.
4. **Missing dependencies** (§18.1) and **missing `GEMINI_API_KEY` in `.env.example`**
   (§18.2). AI features fail silently on a fresh environment — `model_loader.py` returns
   `None` on load failure rather than raising.
5. **`Consultation.diagnosis` / `.prescription` / `.notes` are free-text `TextField`s.** There
   is no structured prescription here. The real model lives in the separate E-Prescription
   repo.
6. **`PatientProfile` has only `full_name`, `age`, `gender`** — no allergies, conditions,
   medications or history. Do not build a feature that claims to check drug safety on top of
   it.
7. **Roles are only** `PATIENT`, `DOCTOR`, `LAB_PROVIDER`, `ADMIN`. The clinic, pharmacy,
   staff and 7 admin sub-roles in the docs don't exist.
8. **JWT in `localStorage`**, 24 h access / 7 d refresh, rotation on with
   `BLACKLIST_AFTER_ROTATION = False` plus a homegrown `RevokedRefreshToken(jti)` table.
   Revocation correctness depends on that custom table, not on SimpleJWT's blacklist app.
9. **CORS**: `CORS_ALLOW_ALL_ORIGINS` follows `DEBUG`, so it is permissive locally and
   restricted in production via `CORS_ORIGINS`. A "works locally, blocked in prod" CORS bug
   means that env var.
10. **`docs/technical/` is empty.** There is no architecture, API or data-model reference
    beyond `docs/PRD.md`. If you work out something non-obvious about the system, write it
    there.

## Roadmap

Per §19. Do the earlier band before the later one — later work depends on it.

| Band | Work |
|---|---|
| **Stabilise (now)** | Fix gaps §18.1–3; add `/api/v1/`; real routing with URLs; one component library, one API client; pytest config + tests on auth and booking |
| **Complete the spine** | Patient record fields; structured prescription from `e_prescription`; audit log; notification model + in-app centre; medical wallet storage |
| **Make it trustworthy** | Doctor verification end to end; admin portal essentials; source labelling everywhere; full state coverage |
| **Make it understandable** | i18n (English/Hindi/Marathi); health-literacy mode; Health Education Hub; OCR + report explanation with human verification |

**Deferred — confirm the scope change before building.** Phase 2: pharmacy finder, medicine
reminders, Health Timeline, Family Health, Emergency SOS, prescription templates,
drug-interaction and allergy checks, legally-recognised digital signature, analytics.
Phase 3: wearables, predictive risk scoring, AI Health Coach, voice scribe, imaging AI,
hospital/government integrations.

**Never build:** AI that replaces a doctor, autonomous diagnosis, ambulance dispatch control,
medicine delivery logistics, insurance claims, hospital ERP replacement.

Design schemas and APIs so deferred items slot in without a rewrite — but do not implement
them.

## Working in this repo as an agent

- Read the relevant `docs/PRD.md` section, then its linked feature doc, before coding. Prefer
  their vocabulary and field names over invented ones.
- Check §11/§12/§18 before assuming something exists. "The docs describe it" ≠ "it is built".
- **Flag, don't silently accept**, any request that conflicts with the non-negotiable rules.
- This project handles health data and has almost no test coverage. When changing auth,
  authorisation, AI safety, or any clinical write path, say so explicitly and describe how you
  verified it. Run the server and exercise the path — don't claim it works from reading alone.
- Use realistic but **obviously fake** data for seeds, demos and screenshots. Never real
  patient information.
- Reference secrets by key name, never by value. Don't echo `.env` contents.
- When docs disagree, precedence is: PRD Verified statements → the feature doc for that
  screen → the design system → older general docs. Record the resolution in the PRD so the
  conflict isn't re-litigated.
