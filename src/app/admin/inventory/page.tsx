"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS } from "@/lib/utils";

const HOSPITALS = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];

export default function AdminInventory() {
  const [rows, setRows] = useState<any[]>([]);
  const refresh = () => fetch("/api/inventory").then((r) => r.json()).then((d) => setRows(d.inventory));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Inventory</h1>
        <p className="text-muted-fg text-sm mt-1">Manage individual blood units (ISBT-128 barcoded).</p>
      </header>
      <DataTable
        title="Blood units"
        resource="inventory"
        rows={rows}
        onChange={refresh}
        createTemplate={{ isbtBarcode: "", bloodGroup: "O+", component: "Whole Blood", hospital: "LUTH", status: "available" }}
        columns={[
          { key: "id", label: "ID", editable: false },
          { key: "isbtBarcode", label: "Barcode", inputType: "text" },
          { key: "bloodGroup", label: "Group", inputType: "select", options: [...BLOOD_GROUPS] },
          { key: "component", label: "Component", inputType: "select", options: ["Whole Blood", "Packed Cells", "Plasma", "Platelets"] },
          { key: "hospital", label: "Hospital", inputType: "select", options: HOSPITALS },
          { key: "status", label: "Status", inputType: "select", options: ["quarantine", "available", "reserved", "issued", "transfused", "expired"],
            render: (r) => <Badge tone={r.status === "available" ? "success" : r.status === "quarantine" ? "warning" : "neutral"}>{r.status}</Badge> },
          { key: "expiresAt", label: "Expires", inputType: "date", render: (r) => new Date(r.expiresAt).toLocaleDateString() },
        ]}
      />
    </div>
  );
}
