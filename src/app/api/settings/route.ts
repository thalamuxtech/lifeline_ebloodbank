import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { COL, type Settings } from "@/lib/types";

export const runtime = "nodejs";

const SETTINGS_DOC = "site";

const DEFAULTS: Settings = {
  siteTagline: "Every drop, a lifeline.",
  smsShortcode: "5050",
  ussdCode: "*565*5050#",
  helpline: "0800-LIFELINE",
  bannerActive: false,
  bannerText: "Join us for World Blood Donor Day — June 14",
  campaignsActive: true,
};

export async function GET() {
  const ref = adminDb.collection(COL.settings).doc(SETTINGS_DOC);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(DEFAULTS);
    return NextResponse.json({ settings: DEFAULTS });
  }
  return NextResponse.json({ settings: snap.data() as Settings });
}

export async function PATCH(req: Request) {
  const patch = await req.json();
  const ref = adminDb.collection(COL.settings).doc(SETTINGS_DOC);
  await ref.set(patch, { merge: true });
  const snap = await ref.get();
  return NextResponse.json({ settings: snap.data() as Settings });
}
