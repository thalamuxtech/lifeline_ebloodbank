// Client-side data layer. Replaces the deleted /api/* routes for static export.
// All operations go directly to Firestore via the browser SDK; security is
// enforced by firestore.rules.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc as fbDeleteDoc,
  query,
  orderBy,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  COL,
  type Donor,
  type BloodRequest,
  type InventoryUnit,
  type Drive,
  type Settings,
} from "./types";
import { BLOOD_GROUPS, donorCanGiveTo, type BloodGroup } from "./utils";

function snapToObj<T>(s: QueryDocumentSnapshot<DocumentData>): T {
  return { id: s.id, ...(s.data() as object) } as T;
}

// ───────── donors ─────────
export async function listDonors(): Promise<Donor[]> {
  const q = query(collection(db, COL.donors), orderBy("createdAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapToObj<Donor>(d));
}

export async function createDonor(input: {
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  vnrd?: boolean;
  uid?: string;
}): Promise<Donor> {
  const ref = doc(collection(db, COL.donors));
  const data: Omit<Donor, "id"> = {
    uid: input.uid,
    name: input.name,
    phone: input.phone,
    bloodGroup: input.bloodGroup,
    city: input.city,
    vnrd: input.vnrd ?? true,
    donations: 0,
    lastDonationAt: null,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}

export async function deleteDonor(id: string) {
  await fbDeleteDoc(doc(db, COL.donors, id));
}

// ───────── requests ─────────
export async function listRequests(): Promise<BloodRequest[]> {
  const q = query(collection(db, COL.requests), orderBy("createdAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapToObj<BloodRequest>(d));
}

export async function createRequest(input: {
  hospital: string;
  city: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: 1 | 2 | 3 | 4 | 5;
  patientName: string;
  createdBy?: string;
}): Promise<{ request: BloodRequest; matches: Array<Pick<Donor, "id" | "name" | "bloodGroup" | "city" | "vnrd">> }> {
  const ref = doc(collection(db, COL.requests));
  const data: Omit<BloodRequest, "id"> = {
    patientHash: `pt_${[...input.patientName].map((c) => c.charCodeAt(0).toString(16)).join("").slice(0, 8)}`,
    hospital: input.hospital,
    city: input.city,
    bloodGroup: input.bloodGroup,
    units: input.units,
    urgency: input.urgency,
    status: "open",
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, data);
  const request: BloodRequest = { id: ref.id, ...data };

  // Match against donors: ABO/Rh compatible + 90-day cooldown.
  let matches: Array<Pick<Donor, "id" | "name" | "bloodGroup" | "city" | "vnrd">> = [];
  try {
    const donorsSnap = await getDocs(query(collection(db, COL.donors), limit(500)));
    matches = donorsSnap.docs
      .map((d) => snapToObj<Donor>(d))
      .filter((d) => {
        const eligible =
          !d.lastDonationAt || Date.now() - new Date(d.lastDonationAt).getTime() > 90 * 86_400_000;
        return donorCanGiveTo(d.bloodGroup as BloodGroup, input.bloodGroup) && eligible;
      })
      .slice(0, 8)
      .map((d) => ({ id: d.id, name: d.name, bloodGroup: d.bloodGroup, city: d.city, vnrd: d.vnrd }));
  } catch {
    // Reading donors may require auth; matches are optional UX.
  }

  return { request, matches };
}

export async function updateRequest(id: string, patch: Partial<BloodRequest>) {
  const { id: _drop, ...rest } = patch as Partial<BloodRequest> & { id?: string };
  void _drop;
  await updateDoc(doc(db, COL.requests, id), rest as DocumentData);
}

export async function deleteRequest(id: string) {
  await fbDeleteDoc(doc(db, COL.requests, id));
}

// ───────── inventory ─────────
export async function listInventory(): Promise<InventoryUnit[]> {
  const q = query(collection(db, COL.inventory), orderBy("collectedAt", "desc"), limit(500));
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapToObj<InventoryUnit>(d));
}

export async function createInventory(input: {
  isbtBarcode: string;
  bloodGroup: BloodGroup;
  component: InventoryUnit["component"];
  hospital: string;
  collectedAt?: string;
  expiresAt?: string;
  status?: InventoryUnit["status"];
}): Promise<InventoryUnit> {
  const now = new Date();
  const ref = doc(collection(db, COL.inventory));
  const data: Omit<InventoryUnit, "id"> = {
    isbtBarcode: input.isbtBarcode,
    bloodGroup: input.bloodGroup,
    component: input.component,
    hospital: input.hospital,
    status: input.status ?? "available",
    collectedAt: input.collectedAt ?? now.toISOString(),
    expiresAt: input.expiresAt ?? new Date(now.getTime() + 42 * 86_400_000).toISOString(),
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}

export async function updateInventory(id: string, patch: Partial<InventoryUnit>) {
  const { id: _drop, ...rest } = patch as Partial<InventoryUnit> & { id?: string };
  void _drop;
  await updateDoc(doc(db, COL.inventory, id), rest as DocumentData);
}

export async function deleteInventory(id: string) {
  await fbDeleteDoc(doc(db, COL.inventory, id));
}

// ───────── drives ─────────
export async function listDrives(): Promise<Drive[]> {
  const q = query(collection(db, COL.drives), orderBy("scheduledAt", "asc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapToObj<Drive>(d));
}

export async function createDrive(input: Omit<Drive, "id" | "registered">): Promise<Drive> {
  const ref = doc(collection(db, COL.drives));
  const data: Omit<Drive, "id"> = { registered: 0, ...input };
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}

export async function updateDrive(id: string, patch: Partial<Drive>) {
  const { id: _drop, ...rest } = patch as Partial<Drive> & { id?: string };
  void _drop;
  await updateDoc(doc(db, COL.drives, id), rest as DocumentData);
}

export async function deleteDrive(id: string) {
  await fbDeleteDoc(doc(db, COL.drives, id));
}

// Generic delete used by the admin data-table.
export async function deleteResource(resource: "donors" | "requests" | "inventory" | "drives", id: string) {
  await fbDeleteDoc(doc(db, resource, id));
}

// ───────── settings ─────────
const SETTINGS_DOC = "site";
const SETTINGS_DEFAULTS: Settings = {
  siteTagline: "Every drop, a lifeline.",
  smsShortcode: "5050",
  ussdCode: "*565*5050#",
  helpline: "0800-LIFELINE",
  bannerActive: false,
  bannerText: "Join us for World Blood Donor Day — June 14",
  campaignsActive: true,
};

export async function getSettings(): Promise<Settings> {
  const ref = doc(db, COL.settings, SETTINGS_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return SETTINGS_DEFAULTS;
  }
  return snap.data() as Settings;
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const ref = doc(db, COL.settings, SETTINGS_DOC);
  await setDoc(ref, patch, { merge: true });
  const snap = await getDoc(ref);
  return snap.data() as Settings;
}

// ───────── stats ─────────
export async function getStats() {
  const [donorsSnap, requestsSnap, inventorySnap, drivesSnap] = await Promise.all([
    getDocs(query(collection(db, COL.donors), limit(1000))),
    getDocs(query(collection(db, COL.requests), limit(1000))),
    getDocs(query(collection(db, COL.inventory), limit(2000))).catch(
      () => ({ docs: [] as QueryDocumentSnapshot<DocumentData>[] })
    ),
    getDocs(query(collection(db, COL.drives), limit(500))),
  ]);

  const donors = donorsSnap.docs.map((d) => snapToObj<Donor>(d));
  const requests = requestsSnap.docs.map((d) => snapToObj<BloodRequest>(d));
  const inventory = (inventorySnap.docs as QueryDocumentSnapshot<DocumentData>[]).map((d) =>
    snapToObj<InventoryUnit>(d)
  );
  const drives = drivesSnap.docs.map((d) => snapToObj<Drive>(d));

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

  return {
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
  };
}

