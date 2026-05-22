"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS } from "@/lib/utils";
import { listRequests } from "@/lib/data";

const HOSPITALS = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];
const CITIES = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];

export default function AdminRequests() {
  const [rows, setRows] = useState<any[]>([]);
  const refresh = () => listRequests().then(setRows).catch(() => setRows([]));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Requests</h1>
        <p className="text-muted-fg text-sm mt-1">Triage and update blood requests in real time.</p>
      </header>
      <DataTable
        title="Blood requests"
        resource="requests"
        rows={rows}
        onChange={refresh}
        columns={[
          { key: "id", label: "ID", editable: false },
          { key: "hospital", label: "Hospital", inputType: "select", options: HOSPITALS },
          { key: "city", label: "City", inputType: "select", options: CITIES },
          { key: "bloodGroup", label: "Group", inputType: "select", options: [...BLOOD_GROUPS], render: (r) => <Badge tone="danger">{r.bloodGroup}</Badge> },
          { key: "units", label: "Units", inputType: "number" },
          { key: "urgency", label: "Urgency", inputType: "number", render: (r) => <Badge tone={r.urgency >= 4 ? "danger" : "neutral"}>U{r.urgency}</Badge> },
          { key: "status", label: "Status", inputType: "select", options: ["open", "matched", "fulfilled", "cancelled"], render: (r) =>
              <Badge tone={r.status === "open" ? "danger" : r.status === "matched" ? "warning" : r.status === "fulfilled" ? "success" : "neutral"}>{r.status}</Badge>
          },
        ]}
      />
    </div>
  );
}
