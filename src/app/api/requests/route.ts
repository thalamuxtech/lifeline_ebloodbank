import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, verifyIdToken } from "@/lib/firebase-admin";
import { fromSnap } from "@/lib/firestore-helpers";
import { BLOOD_GROUPS, donorCanGiveTo, type BloodGroup } from "@/lib/utils";
import { COL, type BloodRequest, type Donor } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb
    .collection(COL.requests)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  return NextResponse.json({ requests: snap.docs.map((d) => fromSnap<BloodRequest>(d)) });
}

const Schema = z.object({
  hospital: z.string().min(2),
  city: z.string().min(2),
  bloodGroup: z.enum(BLOOD_GROUPS),
  units: z.number().int().min(1).max(10),
  urgency: z.number().int().min(1).max(5),
  patientName: z.string().min(1),
});

export async function POST(req: Request) {
  const token = await verifyIdToken(req.headers.get("authorization"));
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { hospital, city, bloodGroup, units, urgency, patientName } = parsed.data;

  const ref = adminDb.collection(COL.requests).doc();
  const reqRow: BloodRequest = {
    id: ref.id,
    patientHash: `pt_${Buffer.from(patientName).toString("hex").slice(0, 8)}`,
    hospital,
    city,
    bloodGroup,
    units,
    urgency: urgency as 1 | 2 | 3 | 4 | 5,
    status: "open",
    createdBy: token?.uid,
    createdAt: new Date().toISOString(),
  };
  const { id: _id, ...data } = reqRow;
  void _id;
  await ref.set(data);

  // Match: query donors of any group, then filter in-memory by ABO/Rh compatibility + 90-day cooldown.
  const donorsSnap = await adminDb.collection(COL.donors).limit(500).get();
  const matches = donorsSnap.docs
    .map((d) => fromSnap<Donor>(d))
    .filter((d) => {
      const eligible =
        !d.lastDonationAt || Date.now() - new Date(d.lastDonationAt).getTime() > 90 * 86_400_000;
      return donorCanGiveTo(d.bloodGroup as BloodGroup, bloodGroup) && eligible;
    })
    .slice(0, 8)
    .map((d) => ({ id: d.id, name: d.name, bloodGroup: d.bloodGroup, city: d.city, vnrd: d.vnrd }));

  return NextResponse.json({ request: reqRow, matches }, { status: 201 });
}
