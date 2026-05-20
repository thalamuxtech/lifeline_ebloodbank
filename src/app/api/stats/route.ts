import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { fromSnap } from "@/lib/firestore-helpers";
import { BLOOD_GROUPS } from "@/lib/utils";
import { COL, type Donor, type BloodRequest, type InventoryUnit, type Drive } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const [donorsSnap, requestsSnap, inventorySnap, drivesSnap] = await Promise.all([
    adminDb.collection(COL.donors).limit(1000).get(),
    adminDb.collection(COL.requests).limit(1000).get(),
    adminDb.collection(COL.inventory).limit(2000).get(),
    adminDb.collection(COL.drives).limit(500).get(),
  ]);

  const donors = donorsSnap.docs.map((d) => fromSnap<Donor>(d));
  const requests = requestsSnap.docs.map((d) => fromSnap<BloodRequest>(d));
  const inventory = inventorySnap.docs.map((d) => fromSnap<InventoryUnit>(d));
  const drives = drivesSnap.docs.map((d) => fromSnap<Drive>(d));

  const byGroup = BLOOD_GROUPS.map((g) => ({
    group: g,
    donors: donors.filter((d) => d.bloodGroup === g).length,
    units: inventory.filter((u) => u.bloodGroup === g && u.status === "available").length,
    demand: requests.filter((r) => r.bloodGroup === g && r.status === "open").length,
  }));

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(Date.now() - (29 - i) * 86_400_000);
    const key = day.toISOString().slice(0, 10);
    return {
      day: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      donors: donors.filter((d) => d.createdAt.slice(0, 10) === key).length,
      requests: requests.filter((r) => r.createdAt.slice(0, 10) === key).length,
    };
  });

  return NextResponse.json({
    totals: {
      donors: donors.length,
      vnrd: donors.filter((d) => d.vnrd).length,
      requests: requests.length,
      open: requests.filter((r) => r.status === "open").length,
      inventory: inventory.filter((u) => u.status === "available").length,
      drives: drives.length,
    },
    byGroup,
    last30,
  });
}
