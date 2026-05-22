"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Siren, Droplet, CalendarHeart, Activity as ActIcon } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { listDonors, listRequests, listInventory, listDrives } from "@/lib/data";

export default function AdminActivity() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      listDonors().catch(() => []),
      listRequests().catch(() => []),
      listInventory().catch(() => []),
      listDrives().catch(() => []),
    ]).then(([donors, requests, inventory, drives]) => {
      const stream = [
        ...donors.slice(0, 20).map((x: any) => ({ at: x.createdAt, type: "donor", text: `${x.name} registered (${x.bloodGroup}, ${x.city})`, icon: Heart, tone: "primary" })),
        ...requests.slice(0, 20).map((x: any) => ({ at: x.createdAt, type: "request", text: `Request ${x.id} — ${x.units}× ${x.bloodGroup} at ${x.hospital}`, icon: Siren, tone: "danger" })),
        ...inventory.slice(0, 15).map((x: any) => ({ at: x.collectedAt, type: "unit", text: `Unit ${x.isbtBarcode} (${x.bloodGroup}) collected → ${x.hospital}`, icon: Droplet, tone: "warning" })),
        ...drives.map((x: any) => ({ at: x.scheduledAt, type: "drive", text: `Drive: ${x.title} in ${x.city}`, icon: CalendarHeart, tone: "success" })),
      ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setItems(stream);
    });
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Activity</h1>
        <p className="text-muted-fg text-sm mt-1">Real-time stream across the platform.</p>
      </header>

      <Card className="p-2">
        <ul className="divide-y divide-border">
          {items.map((it, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 rounded-2xl"
            >
              <div className={`h-9 w-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center`}>
                <it.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-sm">{it.text}</div>
              <Badge tone={it.tone as any}>{it.type}</Badge>
              <span className="text-xs text-muted-fg w-16 text-right">{formatRelative(it.at)}</span>
            </motion.li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
