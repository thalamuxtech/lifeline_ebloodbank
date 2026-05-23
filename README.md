# LifeLine — Nigeria's E-Blood Bank

> Every drop, a lifeline.

A multilingual, voice + SMS enabled E-blood bank built by **Haleyouth Foundation** to make blood donation discovery, matching, and inventory tracking effortless across Nigeria.

[![Deploy to Firebase Hosting](https://github.com/thalamuxtech/lifeline_ebloodbank/actions/workflows/firebase-hosting-deploy.yml/badge.svg)](https://github.com/thalamuxtech/lifeline_ebloodbank/actions/workflows/firebase-hosting-deploy.yml)

---

## Features

- 🩸 **Donor registration** with blood-group compatibility, last-donation cooldown, and VNRD tracking
- 🚨 **Real-time blood requests** with automatic donor matching (ABO/Rh aware)
- 🏥 **Hospital portal** for managing inventory (ISBT barcoded units, components, expiry)
- 📅 **Donation drives** with capacity tracking and city filters
- 🌍 **Multilingual UI** (English, Hausa, Yoruba, Igbo, Nigerian Pidgin)
- 🎙️ **Voice agent** for hands-free assistance
- 📱 **SMS + USSD fallback** (`SMS "BLOOD" → 5050`, `*565*5050#`)
- 🔐 **Role-based access** (donor / hospital / admin) with Firebase Auth custom claims
- 📊 **Admin dashboard** with live stats, donor management, request triage, inventory, drives

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Forms / validation | Zod |
| State | Zustand |
| Charts | Recharts |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Cloud Firestore |
| Files | Firebase Storage |
| Hosting | Firebase Hosting (Web Frameworks) |
| Notifications | sonner (toasts) |

## Quick start

```bash
pnpm install
cp .env.example .env.local       # then fill in your Firebase config
pnpm seed                        # one-time: bootstrap admin user + demo data
pnpm dev                         # → http://localhost:3000
```

The `.env.local` needs your Firebase web config plus a base64-encoded service account for the admin SDK. See [`.env.example`](./.env.example) for the full list.

## Project structure

```
src/
├── app/
│   ├── (public pages)        # home, about, donate, request, eligibility, hospital
│   ├── sign-in, sign-up      # email + Google auth
│   ├── account               # signed-in profile
│   ├── admin/                # role-guarded admin dashboard
│   └── api/                  # REST handlers (Firebase Admin SDK)
├── components/
│   ├── auth/                 # AuthShell, fields, RoleGuard
│   ├── layout/               # header, footer, dock, user menu
│   ├── ui/                   # button, card, badge, animations
│   ├── admin/                # data-table
│   ├── voice/                # voice agent
│   └── providers/            # AuthProvider
├── lib/
│   ├── firebase.ts           # client SDK
│   ├── firebase-admin.ts     # server SDK
│   ├── types.ts              # domain types + collection names
│   ├── utils.ts              # blood-group compatibility helpers
│   ├── firestore-helpers.ts  # snap → object converters
│   └── i18n.ts               # locale strings
├── store/
│   └── locale.ts             # zustand locale store
└── scripts/
    └── seed.ts               # idempotent Firestore seed + admin bootstrap
```

## Deploy

Every push to `main` automatically deploys to Firebase Hosting via [`.github/workflows/firebase-hosting-deploy.yml`](./.github/workflows/firebase-hosting-deploy.yml). The workflow uses the Web Frameworks integration to build Next.js and deploy SSR pages to Cloud Functions.

### Required GitHub repo secrets

| Secret | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web SDK config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT_B64` | Service account JSON, base64-encoded (server) |
| `FIREBASE_SERVICE_ACCOUNT_LIFELINE_EBLOODBANK` | Raw JSON for the deploy action |

### Firebase project setup

Required APIs (enable once per project):

- Authentication → Sign-in providers: **Email/Password** and **Google**
- Cloud Firestore (production mode)
- Cloud Storage
- Cloud Functions, Cloud Build, Cloud Run (Blaze plan)

## Security

- Firestore rules enforce role-based access — see [`firestore.rules`](./firestore.rules)
- Storage rules cap uploads at 5 MB and restrict by user / hospital — see [`storage.rules`](./storage.rules)
- The admin role is granted via Firebase Auth custom claim `role: admin` (set by the seed script)

## License

Built by Haleyouth Foundation. All rights reserved.
