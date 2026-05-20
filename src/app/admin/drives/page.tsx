"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";

const HOSPITALS = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];
const CITIES = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];

export default function AdminDrives() {
  const [rows, setRows] = useState<any[]>([]);
  const refresh = () => fetch("/api/drives").then((r) => r.json()).then((d) => setRows(d.drives));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Drives</h1>
        <p className="text-muted-fg text-sm mt-1">Schedule blood drives and outreach events.</p>
      </header>
      <DataTable
        title="Blood drives"
        resource="drives"
        rows={rows}
        onChange={refresh}
        createTemplate={{ title: "", organiser: "Hale Youth Foundation", hospital: "LUTH", city: "Lagos", scheduledAt: new Date().toISOString(), capacity: 100 }}
        columns={[
          { key: "id", label: "ID", editable: false },
          { key: "title", label: "Title", inputType: "text" },
          { key: "organiser", label: "Organiser", inputType: "text" },
          { key: "hospital", label: "Hospital", inputType: "select", options: HOSPITALS },
          { key: "city", label: "City", inputType: "select", options: CITIES },
          { key: "scheduledAt", label: "When", inputType: "date", render: (r) => new Date(r.scheduledAt).toLocaleString() },
          { key: "capacity", label: "Capacity", inputType: "number" },
          { key: "registered", label: "Registered", inputType: "number" },
        ]}
      />
    </div>
  );
}
