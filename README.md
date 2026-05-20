# LifeLine — Nigeria's E-Blood Bank

A multilingual, voice + SMS enabled E-blood bank built by Hale Youth Foundation.

Stack: Next.js 15 (App Router) · React 19 · Tailwind · Framer Motion · Firebase (Auth, Firestore, Storage, Hosting).

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in Firebase config + service account
pnpm seed                    # bootstrap admin user + demo data (one time)
pnpm dev                     # http://localhost:3000
```

## Seeding

`pnpm seed` is idempotent: it creates (or updates the password of) the admin user and only seeds collections that are empty.

Admin login (set by seed):

- Email: `thalamuxtech@gmail.com`
- Password: see internal secrets vault

## Architecture

| Surface | Path |
|---|---|
| Public site | `src/app/(public pages)` |
| Admin dashboard | `src/app/admin/*` (role-guarded) |
| REST API | `src/app/api/*` (Next.js route handlers, Firebase Admin SDK) |
| Client Firebase | `src/lib/firebase.ts` |
| Server Firebase | `src/lib/firebase-admin.ts` |
| Auth context | `src/components/providers/auth-provider.tsx` |
| Role guard | `src/components/auth/role-guard.tsx` |

## Deploy

Pushing to `main` triggers `.github/workflows/firebase-hosting-deploy.yml` which builds Next.js and deploys to Firebase Hosting via the Web Frameworks integration.

Required GitHub repo secrets:

- `FIREBASE_SERVICE_ACCOUNT_LIFELINE_EBLOODBANK` — service account JSON for Hosting deploy
- `FIREBASE_ADMIN_SERVICE_ACCOUNT_B64` — base64 of the same JSON (used by SSR API routes)
- `NEXT_PUBLIC_FIREBASE_*` — all the web SDK config values

See [.env.example](./.env.example) for the full list.
