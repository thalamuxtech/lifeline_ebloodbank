import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { fromSnap } from "@/lib/firestore-helpers";
import { COL, type Drive } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb
    .collection(COL.drives)
    .orderBy("scheduledAt", "asc")
    .limit(100)
    .get();
  return NextResponse.json({ drives: snap.docs.map((d) => fromSnap<Drive>(d)) });
}

const Schema = z.object({
  title: z.string().min(2),
  organiser: z.string().min(2),
  hospital: z.string().min(2),
  city: z.string().min(2),
  scheduledAt: z.string(),
  capacity: z.number().int().min(1),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const ref = adminDb.collection(COL.drives).doc();
  const drive: Drive = { id: ref.id, registered: 0, ...parsed.data };
  const { id: _id, ...data } = drive;
  void _id;
  await ref.set(data);
  return NextResponse.json({ drive }, { status: 201 });
}
