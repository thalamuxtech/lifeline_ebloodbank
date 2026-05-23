/**
 * Seed Firestore with demo data and bootstrap the admin user.
 *
 * Run: pnpm seed
 *
 * Idempotent: if a collection already has docs, it is skipped.
 * The admin user is upserted (created if missing, otherwise password is updated).
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { BLOOD_GROUPS, type BloodGroup } from "../src/lib/utils";

const ADMIN_EMAIL = "thalamuxtech@gmail.com";
const ADMIN_PASSWORD = "Thalamuxtech@Admin321";
const ADMIN_NAME = "Thalamux Admin";

function loadServiceAccount() {
  const b64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_B64;
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  const json = b64 ? Buffer.from(b64, "base64").toString("utf8") : raw;
  if (!json) throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT[_B64] missing in .env.local");
  const parsed = JSON.parse(json);
  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed;
}

if (!getApps().length) {
  const sa = loadServiceAccount();
  initializeApp({
    credential: cert(sa),
    projectId: sa.project_id ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const auth = getAuth();
const db = getFirestore();

function rand<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

async function bootstrapAdmin() {
  let user;
  try {
    user = await auth.getUserByEmail(ADMIN_EMAIL);
    await auth.updateUser(user.uid, { password: ADMIN_PASSWORD, displayName: ADMIN_NAME });
    console.log(`✓ admin user exists, password reset: ${ADMIN_EMAIL}`);
  } catch {
    user = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true,
    });
    console.log(`✓ admin user created: ${ADMIN_EMAIL}`);
  }
  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  await db.collection("users").doc(user.uid).set(
    {
      uid: user.uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      photoURL: null,
      role: "admin",
      createdAt: new Date().toISOString(),
      createdAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  console.log(`✓ admin custom claim + users/${user.uid} profile set`);
}

async function seedIfEmpty<T extends object>(
  col: string,
  build: () => T[],
  idPrefix: string,
) {
  const snap = await db.collection(col).limit(1).get();
  if (!snap.empty) {
    console.log(`• ${col} already populated, skipping`);
    return;
  }
  const items = build();
  const batch = db.batch();
  items.forEach((item, i) => {
    const ref = db.collection(col).doc(`${idPrefix}${1000 + i}`);
    batch.set(ref, item);
  });
  await batch.commit();
  console.log(`✓ seeded ${items.length} ${col}`);
}

async function seedSettings() {
  const ref = db.collection("settings").doc("site");
  const snap = await ref.get();
  if (snap.exists) {
    console.log("• settings/site already exists, skipping");
    return;
  }
  await ref.set({
    siteTagline: "Every drop, a lifeline.",
    smsShortcode: "5050",
    ussdCode: "*565*5050#",
    helpline: "0800-LIFELINE",
    bannerActive: false,
    bannerText: "Join us for World Blood Donor Day — June 14",
    campaignsActive: true,
  });
  console.log("✓ seeded settings/site");
}

async function main() {
  console.log("→ Bootstrapping admin + seeding Firestore...");
  await bootstrapAdmin();
  await seedSettings();

  const cities = ["Lagos", "Kano", "Abuja", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];
  const hospitals = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];
  const names = [
    "Aisha B.", "Chinedu O.", "Tunde A.", "Hauwa M.", "Emeka K.", "Funke A.",
    "Ibrahim S.", "Ngozi U.", "Yusuf D.", "Olubunmi T.", "Sani G.", "Ifeoma N.",
    "Kemi O.", "Bashir M.", "Adaeze C.", "Femi A.", "Hadiza I.", "Obinna E.",
  ];

  await seedIfEmpty(
    "donors",
    () =>
      Array.from({ length: 36 }, () => ({
        name: rand(names),
        phone: `+23480${Math.floor(10000000 + Math.random() * 89999999)}`,
        bloodGroup: rand(BLOOD_GROUPS) as BloodGroup,
        city: rand(cities),
        vnrd: Math.random() > 0.3,
        donations: Math.floor(Math.random() * 12),
        lastDonationAt: new Date(Date.now() - Math.random() * 86400000 * 200).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 500).toISOString(),
      })),
    "D",
  );

  await seedIfEmpty(
    "requests",
    () =>
      Array.from({ length: 18 }, () => ({
        patientHash: `pt_${Math.random().toString(36).slice(2, 8)}`,
        hospital: rand(hospitals),
        city: rand(cities),
        bloodGroup: rand(BLOOD_GROUPS) as BloodGroup,
        units: 1 + Math.floor(Math.random() * 3),
        urgency: (1 + Math.floor(Math.random() * 5)) as 1 | 2 | 3 | 4 | 5,
        status: rand(["open", "open", "open", "matched", "fulfilled"]) as "open" | "matched" | "fulfilled",
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      })),
    "R",
  );

  await seedIfEmpty(
    "inventory",
    () =>
      Array.from({ length: 48 }, () => {
        const collected = new Date(Date.now() - Math.random() * 86400000 * 25);
        const expires = new Date(collected.getTime() + 86400000 * 42);
        return {
          isbtBarcode: `W${Math.floor(1000000 + Math.random() * 8999999)}`,
          bloodGroup: rand(BLOOD_GROUPS) as BloodGroup,
          component: rand(["Whole Blood", "Packed Cells", "Plasma", "Platelets"]) as
            | "Whole Blood" | "Packed Cells" | "Plasma" | "Platelets",
          collectedAt: collected.toISOString(),
          expiresAt: expires.toISOString(),
          status: rand(["available", "available", "available", "reserved", "quarantine"]) as
            "available" | "reserved" | "quarantine",
          hospital: rand(hospitals),
        };
      }),
    "U",
  );

  await seedIfEmpty(
    "drives",
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        title: rand([
          "World Blood Donor Day",
          "Campus Drive",
          "Mosque Outreach",
          "Church Drive",
          "Corporate Drive",
          "Community Drive",
        ]),
        organiser: "Haleyouth Foundation",
        hospital: rand(hospitals),
        city: rand(cities),
        scheduledAt: new Date(Date.now() + (i + 1) * 86400000 * 3).toISOString(),
        capacity: 50 + Math.floor(Math.random() * 200),
        registered: Math.floor(Math.random() * 80),
      })),
    "DR",
  );

  console.log("✓ done");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
