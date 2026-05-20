import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { fromSnap } from "@/lib/firestore-helpers";
import { BLOOD_GROUPS } from "@/lib/utils";
import { COL, type InventoryUnit } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb
    .collection(COL.inventory)
    .orderBy("collectedAt", "desc")
    .limit(500)
    .get();
  return NextResponse.json({ inventory: snap.docs.map((d) => fromSnap<InventoryUnit>(d)) });
}

const Schema = z.object({
  isbtBarcode: z.string().min(3),
  bloodGroup: z.enum(BLOOD_GROUPS),
  component: z.enum(["Whole Blood", "Packed Cells", "Plasma", "Platelets"]),
  hospital: z.string().min(2),
  collectedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  status: z
    .enum(["quarantine", "available", "reserved", "issued", "transfused", "expired"])
    .default("available"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const now = new Date();
  const ref = adminDb.collection(COL.inventory).doc();
  const unit: InventoryUnit = {
    id: ref.id,
    isbtBarcode: parsed.data.isbtBarcode,
    bloodGroup: parsed.data.bloodGroup,
    component: parsed.data.component,
    hospital: parsed.data.hospital,
    status: parsed.data.status,
    collectedAt: parsed.data.collectedAt ?? now.toISOString(),
    expiresAt: parsed.data.expiresAt ?? new Date(now.getTime() + 42 * 86_400_000).toISOString(),
  };
  const { id: _id, ...data } = unit;
  void _id;
  await ref.set(data);
  return NextResponse.json({ unit }, { status: 201 });
}
