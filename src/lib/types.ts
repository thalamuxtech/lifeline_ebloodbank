// Canonical domain types. The Firestore documents store the same shape as these.
// `id` is the Firestore doc id (not stored as a field).
import type { BloodGroup } from "./utils";

export type Role = "donor" | "hospital" | "admin";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
  phone?: string;
  city?: string;
  bloodGroup?: BloodGroup;
  createdAt: string;
};

export type Donor = {
  id: string;
  uid?: string; // linked Firebase Auth user (optional for offline-registered donors)
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  vnrd: boolean; // voluntary non-remunerated donor
  donations: number;
  lastDonationAt: string | null;
  createdAt: string;
};

export type BloodRequest = {
  id: string;
  patientHash: string;
  hospital: string;
  city: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: 1 | 2 | 3 | 4 | 5;
  status: "open" | "matched" | "fulfilled" | "cancelled";
  createdBy?: string; // uid
  createdAt: string;
};

export type InventoryUnit = {
  id: string;
  isbtBarcode: string;
  bloodGroup: BloodGroup;
  component: "Whole Blood" | "Packed Cells" | "Plasma" | "Platelets";
  collectedAt: string;
  expiresAt: string;
  status: "quarantine" | "available" | "reserved" | "issued" | "transfused" | "expired";
  hospital: string;
};

export type Drive = {
  id: string;
  title: string;
  organiser: string;
  hospital: string;
  city: string;
  scheduledAt: string;
  capacity: number;
  registered: number;
};

export type Settings = {
  siteTagline: string;
  smsShortcode: string;
  ussdCode: string;
  helpline: string;
  bannerActive: boolean;
  bannerText: string;
  campaignsActive: boolean;
};

// Firestore collection name constants — keep in one place to avoid typos.
export const COL = {
  users: "users",
  donors: "donors",
  requests: "requests",
  inventory: "inventory",
  drives: "drives",
  settings: "settings",
} as const;
