import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, verifyIdToken } from "@/lib/firebase-admin";
import { BLOOD_GROUPS } from "@/lib/utils";
import { COL, type Donor } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb
    .collection(COL.donors)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  const donors: Donor[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Donor, "id">) }));
  return NextResponse.json({ donors });
}

const Schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  bloodGroup: z.enum(BLOOD_GROUPS),
  city: z.string().min(2),
  vnrd: z.boolean().default(true),
});

export async function POST(req: Request) {
  const token = await verifyIdToken(req.headers.get("authorization"));
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const ref = adminDb.collection(COL.donors).doc();
  const donor: Donor = {
    id: ref.id,
    uid: token?.uid,
    ...parsed.data,
    donations: 0,
    lastDonationAt: null,
    createdAt: new Date().toISOString(),
  };
  // Firestore doesn't store the id field (it's the doc id), so split it.
  const { id: _id, ...data } = donor;
  void _id;
  await ref.set(data);
  return NextResponse.json({ donor }, { status: 201 });
}
