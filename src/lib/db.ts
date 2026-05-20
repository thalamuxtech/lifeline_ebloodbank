// File-backed JSON DB for the local dev demo.
// Swap with Firestore in production via /lib/firebase.
import { BLOOD_GROUPS, type BloodGroup } from "./utils";
import fs from "node:fs";
import path from "node:path";

export type Donor = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  vnrd: boolean;
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

export type DbShape = {
  donors: Donor[];
  requests: BloodRequest[];
  inventory: InventoryUnit[];
  drives: Drive[];
  settings: Settings;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function rand<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

function seed(): DbShape {
  const cities = ["Lagos", "Kano", "Abuja", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];
  const hospitals = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];
  const names = [
    "Aisha B.", "Chinedu O.", "Tunde A.", "Hauwa M.", "Emeka K.", "Funke A.",
    "Ibrahim S.", "Ngozi U.", "Yusuf D.", "Olubunmi T.", "Sani G.", "Ifeoma N.",
    "Kemi O.", "Bashir M.", "Adaeze C.", "Femi A.", "Hadiza I.", "Obinna E.",
  ];
  const donors: Donor[] = Array.from({ length: 36 }, (_, i) => ({
    id: `D${1000 + i}`,
    name: rand(names),
    phone: `+23480${Math.floor(10000000 + Math.random() * 89999999)}`,
    bloodGroup: rand([...BLOOD_GROUPS]),
    city: rand(cities),
    vnrd: Math.random() > 0.3,
    donations: Math.floor(Math.random() * 12),
    lastDonationAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 200).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 500).toISOString(),
  }));
  const requests: BloodRequest[] = Array.from({ length: 18 }, (_, i) => ({
    id: `R${2000 + i}`,
    patientHash: `pt_${Math.random().toString(36).slice(2, 8)}`,
    hospital: rand(hospitals),
    city: rand(cities),
    bloodGroup: rand([...BLOOD_GROUPS]),
    units: 1 + Math.floor(Math.random() * 3),
    urgency: (1 + Math.floor(Math.random() * 5)) as BloodRequest["urgency"],
    status: rand(["open", "open", "open", "matched", "fulfilled"] as BloodRequest["status"][]),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 48).toISOString(),
  }));
  const inventory: InventoryUnit[] = Array.from({ length: 48 }, (_, i) => {
    const collectedAt = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 25);
    const expiresAt = new Date(collectedAt.getTime() + 1000 * 60 * 60 * 24 * 42);
    return {
      id: `U${3000 + i}`,
      isbtBarcode: `W${Math.floor(1000000 + Math.random() * 8999999)}`,
      bloodGroup: rand([...BLOOD_GROUPS]),
      component: rand(["Whole Blood", "Packed Cells", "Plasma", "Platelets"] as const),
      collectedAt: collectedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: rand(["available", "available", "available", "reserved", "quarantine"] as const),
      hospital: rand(hospitals),
    };
  });
  const drives: Drive[] = Array.from({ length: 6 }, (_, i) => ({
    id: `DR${4000 + i}`,
    title: rand(["World Blood Donor Day", "Campus Drive", "Mosque Outreach", "Church Drive", "Corporate Drive", "Community Drive"]),
    organiser: "Hale Youth Foundation",
    hospital: rand(hospitals),
    city: rand(cities),
    scheduledAt: new Date(Date.now() + (i + 1) * 86400000 * 3).toISOString(),
    capacity: 50 + Math.floor(Math.random() * 200),
    registered: Math.floor(Math.random() * 80),
  }));
  const settings: Settings = {
    siteTagline: "Every drop, a lifeline.",
    smsShortcode: "5050",
    ussdCode: "*565*5050#",
    helpline: "0800-LIFELINE",
    bannerActive: false,
    bannerText: "Join us for World Blood Donor Day — June 14",
    campaignsActive: true,
  };
  return { donors, requests, inventory, drives, settings };
}

function load(): DbShape {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      const s = seed();
      fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2));
      return s;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return seed();
  }
}

function persist(state: DbShape) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  } catch {}
}

declare global {
  // eslint-disable-next-line no-var
  var __LIFELINE_DB: DbShape | undefined;
}

export function db(): DbShape {
  if (!globalThis.__LIFELINE_DB) globalThis.__LIFELINE_DB = load();
  return globalThis.__LIFELINE_DB!;
}

export function save() {
  if (globalThis.__LIFELINE_DB) persist(globalThis.__LIFELINE_DB);
}

export function reseed() {
  globalThis.__LIFELINE_DB = seed();
  persist(globalThis.__LIFELINE_DB);
  return globalThis.__LIFELINE_DB;
}
