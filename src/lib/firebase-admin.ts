// Server-side Firebase Admin SDK. Import only from API routes / server components.
import "server-only";
import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function init(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const b64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_B64;
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  const json = b64 && b64.trim().length > 0
    ? Buffer.from(b64, "base64").toString("utf8")
    : raw && raw.trim().length > 0
      ? raw
      : null;
  if (json) {
    const parsed = JSON.parse(json);
    if (typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return initializeApp({
      credential: cert(parsed),
      projectId: parsed.project_id ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const app = init();
export const adminAuth: Auth = getAuth(app);
export const adminDb: Firestore = getFirestore(app);
export const adminStorage: Storage = getStorage(app);

// Verify a Firebase ID token from an Authorization: Bearer <token> header.
export async function verifyIdToken(authHeader: string | null | undefined) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return await adminAuth.verifyIdToken(authHeader.slice(7));
  } catch {
    return null;
  }
}
