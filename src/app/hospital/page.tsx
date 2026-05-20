"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Droplet, Activity, AlertTriangle, ShieldCheck, Hospital } from "lucide-react";
import { Card, CardTitle, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS, formatRelative } from "@/lib/utils";
import { useLocale } from "@/store/locale";

export default function HospitalPage() {
  const { t } = useLocale();
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/inventory").then((r) => r.json()).then((d) => setInventory(d.inventory));
    fetch("/api/requests").then((r) => r.json()).then((d) => setRequests(d.requests));
  }, []);

  const heat = useMemo(() => {
    const map: Record<string, number> = {};
    BLOOD_GROUPS.forEach((g) => (map[g] = 0));
    inventory.forEach((u) => { if (u.status === "available") map[u.bloodGroup]++; });
    return map;
  }, [inventory]);

  const columns: Record<string, any[]> = {
    open: requests.filter((r) => r.status === "open"),
    matched: requests.filter((r) => r.status === "matched"),
    fulfilled: requests.filter((r) => r.status === "fulfilled"),
  };
  const colKeys: ("open" | "matched" | "fulfilled")[] = ["open", "matched", "fulfilled"];

  return (
    <section className="container py-10 md:py-16">
      <div className="flex items-center gap-3 mb-2">
        <Hospital className="h-5 w-5 text-primary-700" />
        <Badge tone="primary">{t.hospital.badge}</Badge>
      </div>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight text-balance">{t.hospital.title}</h1>
      <p className="text-muted-fg mt-3 max-w-xl">{t.hospital.sub}</p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={<Droplet className="h-4 w-4 text-primary-700" />} label={t.hospital.kpi.available} value={inventory.filter((u) => u.status === "available").length} />
        <Kpi icon={<Activity className="h-4 w-4 text-success" />} label={t.hospital.kpi.open} value={columns.open.length} />
        <Kpi icon={<AlertTriangle className="h-4 w-4 text-warning" />} label={t.hospital.kpi.expiring} value={inventory.filter((u) => new Date(u.expiresAt).getTime() - Date.now() < 7 * 86400_000).length} />
        <Kpi icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />} label={t.hospital.kpi.quarantine} value={inventory.filter((u) => u.status === "quarantine").length} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl mb-4">{t.hospital.inventoryByGroup}</h2>
        <Card className="p-6">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {BLOOD_GROUPS.map((g) => {
              const count = heat[g];
              const intensity = Math.min(count / 6, 1);
              return (
                <motion.div key={g} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-2xl p-4 text-center border border-border overflow-hidden"
                  style={{ background: `linear-gradient(135deg, rgba(185,28,28,${0.05 + intensity * 0.55}), rgba(220,38,38,${0.02 + intensity * 0.25}))` }}>
                  <div className="font-display text-2xl">{g}</div>
                  <div className="text-xs text-muted-fg mt-1">{count} {t.hospital.unitCount}</div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl mb-4">{t.hospital.triage}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {colKeys.map((col) => (
            <Card key={col}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="capitalize text-base">{t.hospital.columns[col]}</CardTitle>
                <Badge tone={col === "open" ? "danger" : col === "matched" ? "warning" : "success"}>{columns[col].length}</Badge>
              </CardHeader>
              <CardBody className="space-y-2 max-h-[480px] overflow-y-auto">
                {columns[col].map((r) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border p-3 hover:border-primary-700/40 hover:shadow-soft transition">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{r.bloodGroup} · {r.units}u</div>
                      <Badge tone={r.urgency >= 4 ? "danger" : "neutral"}>U{r.urgency}</Badge>
                    </div>
                    <div className="text-xs text-muted-fg mt-1">{r.hospital} · {r.city}</div>
                    <div className="text-[11px] text-muted-fg mt-1">{formatRelative(r.createdAt)}</div>
                  </motion.div>
                ))}
                {columns[col].length === 0 && <div className="text-xs text-muted-fg p-4 text-center">{t.hospital.noRequests}</div>}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl mb-4">{t.hospital.units}</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-fg bg-muted/40">
                <tr>
                  {[t.hospital.table.barcode, t.hospital.table.group, t.hospital.table.component, t.hospital.table.hospital, t.hospital.table.status, t.hospital.table.expires].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 20).map((u) => {
                  const expiringSoon = new Date(u.expiresAt).getTime() - Date.now() < 7 * 86400_000;
                  return (
                    <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{u.isbtBarcode}</td>
                      <td className="px-4 py-3 font-semibold">{u.bloodGroup}</td>
                      <td className="px-4 py-3 text-muted-fg">{u.component}</td>
                      <td className="px-4 py-3 text-muted-fg">{u.hospital}</td>
                      <td className="px-4 py-3">
                        <Badge tone={u.status === "available" ? "success" : u.status === "quarantine" ? "warning" : "neutral"}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-fg">
                        {expiringSoon && <AlertTriangle className="h-3 w-3 inline text-warning mr-1" />}
                        {new Date(u.expiresAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-fg">{label}</div>
        <div>{icon}</div>
      </div>
      <div className="font-display text-3xl mt-3">{value}</div>
    </Card>
  );
}
