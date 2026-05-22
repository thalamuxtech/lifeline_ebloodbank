"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS } from "@/lib/utils";
import { listDonors } from "@/lib/data";

const CITIES = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];

export default function AdminDonors() {
  const [rows, setRows] = useState<any[]>([]);
  const refresh = () => listDonors().then(setRows).catch(() => setRows([]));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Donors</h1>
        <p className="text-muted-fg text-sm mt-1">Manage all registered donors. Click Edit or New to add records.</p>
      </header>
      <DataTable
        title="Donor registry"
        resource="donors"
        rows={rows}
        onChange={refresh}
        createTemplate={{ name: "", phone: "", bloodGroup: "O+", city: "Lagos", vnrd: true }}
        columns={[
          { key: "id", label: "ID", editable: false },
          { key: "name", label: "Name", inputType: "text" },
          { key: "phone", label: "Phone", inputType: "text" },
          { key: "bloodGroup", label: "Group", inputType: "select", options: [...BLOOD_GROUPS], render: (r) => <Badge tone="primary">{r.bloodGroup}</Badge> },
          { key: "city", label: "City", inputType: "select", options: CITIES },
          { key: "vnrd", label: "VNRD", inputType: "boolean", render: (r) => <Badge tone={r.vnrd ? "success" : "neutral"}>{r.vnrd ? "Yes" : "No"}</Badge> },
          { key: "donations", label: "#Donations", inputType: "number" },
        ]}
      />
    </div>
  );
}
