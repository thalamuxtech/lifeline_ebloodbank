"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Users, Droplet, Siren, CalendarHeart, TrendingUp, Heart } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/components/ui/counter";

const COLORS = ["#B91C1C", "#DC2626", "#EF4444", "#F87171", "#FCA5A5", "#FECACA", "#FEE2E2", "#FFF1F2"];

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch("/api/stats").then((r) => r.json()).then(setStats); }, []);

  if (!stats) return <div className="p-10 text-muted-fg">Loading…</div>;
  const { totals, byGroup, last30 } = stats;

  return (
    <div className="space-y-8">
      <header>
        <Badge tone="primary"><TrendingUp className="h-3 w-3" /> Live overview</Badge>
        <h1 className="font-display text-4xl tracking-tight mt-2">Dashboard</h1>
        <p className="text-muted-fg mt-1 text-sm">National view of donors, units, and requests.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Donors" value={totals.donors} icon={<Users className="h-4 w-4" />} tone="primary" />
        <Kpi label="VNRD" value={totals.vnrd} icon={<Heart className="h-4 w-4" />} tone="success" />
        <Kpi label="Open requests" value={totals.open} icon={<Siren className="h-4 w-4" />} tone="danger" />
        <Kpi label="Units in stock" value={totals.inventory} icon={<Droplet className="h-4 w-4" />} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <CardTitle>Last 30 days</CardTitle>
          <p className="text-xs text-muted-fg mb-4">Donor registrations vs blood requests</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B91C1C" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#B91C1C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="donors" stroke="#B91C1C" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="requests" stroke="#F59E0B" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <CardTitle>Donor mix</CardTitle>
          <p className="text-xs text-muted-fg mb-4">By blood group</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byGroup} dataKey="donors" nameKey="group" innerRadius={48} outerRadius={86} paddingAngle={3}>
                  {byGroup.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {byGroup.map((g: any, i: number) => (
              <div key={g.group} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {g.group}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <CardTitle>Demand vs supply by group</CardTitle>
        <p className="text-xs text-muted-fg mb-4">Open requests against available units</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byGroup} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="group" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="units" fill="#059669" radius={[8, 8, 0, 0]} />
              <Bar dataKey="demand" fill="#B91C1C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "primary" | "success" | "danger" | "warning" }) {
  const tones: Record<string, string> = {
    primary: "from-primary-700 to-primary-900",
    success: "from-emerald-600 to-emerald-800",
    danger: "from-red-600 to-red-800",
    warning: "from-amber-500 to-amber-700",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`relative overflow-hidden p-5 text-white bg-gradient-to-br ${tones[tone]} border-none`}>
        <div className="flex items-center justify-between text-white/80 text-xs">
          {label}
          <span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center">{icon}</span>
        </div>
        <div className="font-display text-4xl mt-2"><Counter to={value} /></div>
      </Card>
    </motion.div>
  );
}
