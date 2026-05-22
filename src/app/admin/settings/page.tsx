"use client";
import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Megaphone } from "lucide-react";
import { toast, Toaster } from "sonner";
import { getSettings, updateSettings } from "@/lib/data";

export default function AdminSettings() {
  const [s, setS] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getSettings().then(setS).catch(() => setS(null)); }, []);

  async function save() {
    setSaving(true);
    try {
      const updated = await updateSettings(s);
      setS(updated);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  }

  if (!s) return <div className="p-10 text-muted-fg">Loading…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Settings</h1>
        <p className="text-muted-fg text-sm mt-1">Site-wide configuration. Changes apply instantly.</p>
      </header>

      <Card className="p-6 space-y-5">
        <CardTitle>Branding</CardTitle>
        <Field label="Site tagline">
          <input className="input" value={s.siteTagline} onChange={(e) => setS({ ...s, siteTagline: e.target.value })} />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <CardTitle>Channels</CardTitle>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="SMS shortcode">
            <input className="input" value={s.smsShortcode} onChange={(e) => setS({ ...s, smsShortcode: e.target.value })} />
          </Field>
          <Field label="USSD code">
            <input className="input" value={s.ussdCode} onChange={(e) => setS({ ...s, ussdCode: e.target.value })} />
          </Field>
          <Field label="Helpline">
            <input className="input" value={s.helpline} onChange={(e) => setS({ ...s, helpline: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary-700" /> Site banner</CardTitle>
        <label className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={s.bannerActive}
            onChange={(e) => setS({ ...s, bannerActive: e.target.checked })} />
          <span className="text-sm">Show announcement banner on home page</span>
        </label>
        <Field label="Banner text">
          <input className="input" value={s.bannerText} onChange={(e) => setS({ ...s, bannerText: e.target.value })} />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <CardTitle>Campaigns</CardTitle>
        <label className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={s.campaignsActive}
            onChange={(e) => setS({ ...s, campaignsActive: e.target.checked })} />
          <span className="text-sm">Send SOS broadcasts to donors when new requests arrive</span>
        </label>
      </Card>

      <div className="flex gap-2 sticky bottom-4">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>

      <Toaster richColors position="top-right" />
      <style jsx global>{`.input { @apply w-full h-11 px-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-fg mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
