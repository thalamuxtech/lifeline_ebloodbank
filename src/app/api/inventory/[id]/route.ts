import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { COL, type InventoryUnit } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = await req.json();
  const ref = adminDb.collection(COL.inventory).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not found" }, { status: 404 });
  delete patch.id;
  await ref.update(patch);
  const updated = await ref.get();
  return NextResponse.json({ unit: { id: updated.id, ...updated.data() } as InventoryUnit });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ref = adminDb.collection(COL.inventory).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not found" }, { status: 404 });
  await ref.delete();
  return NextResponse.json({ ok: true });
}
