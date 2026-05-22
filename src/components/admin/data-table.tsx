"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Pencil, Plus, X, Save } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, deleteDoc as fbDeleteDoc, type DocumentData } from "firebase/firestore";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  editable?: boolean;
  inputType?: "text" | "number" | "select" | "boolean" | "date";
  options?: string[];
};

export function DataTable<T extends { id: string }>({
  title,
  rows,
  columns,
  resource,
  createTemplate,
  onChange,
}: {
  title: string;
  rows: T[];
  columns: Column<T>[];
  resource: string;
  createTemplate?: Partial<T>;
  onChange: () => void;
}) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<any>({});

  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      Object.values(r as any).some((v) => String(v ?? "").toLowerCase().includes(s))
    );
  }, [rows, q]);

  async function save() {
    const id = editing?.id;
    try {
      if (id) {
        const { id: _drop, ...rest } = draft as { id?: string };
        void _drop;
        await updateDoc(doc(db, resource, id), rest as DocumentData);
        toast.success("Updated");
      } else {
        const ref = doc(collection(db, resource));
        const { id: _drop, ...rest } = draft as { id?: string };
        void _drop;
        // Default fields for collections that expect them
        if (resource === "donors") {
          (rest as any).donations ??= 0;
          (rest as any).lastDonationAt ??= null;
          (rest as any).createdAt ??= new Date().toISOString();
        } else if (resource === "requests") {
          (rest as any).status ??= "open";
          (rest as any).createdAt ??= new Date().toISOString();
          (rest as any).patientHash ??= `pt_${ref.id.slice(0, 8)}`;
        } else if (resource === "inventory") {
          (rest as any).collectedAt ??= new Date().toISOString();
          (rest as any).expiresAt ??=
            new Date(Date.now() + 42 * 86_400_000).toISOString();
        } else if (resource === "drives") {
          (rest as any).registered ??= 0;
        }
        await setDoc(ref, rest as DocumentData);
        toast.success("Created");
      }
      setEditing(null);
      setCreating(false);
      setDraft({});
      onChange();
    } catch (e: any) {
      toast.error("Failed: " + (e?.message ?? "unknown error"));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    try {
      await fbDeleteDoc(doc(db, resource, id));
      toast.success("Deleted");
      onChange();
    } catch {
      toast.error("Failed");
    }
  }

  function startEdit(row: T) {
    setEditing(row);
    setDraft({ ...row });
    setCreating(false);
  }
  function startCreate() {
    setCreating(true);
    setEditing(null);
    setDraft({ ...(createTemplate ?? {}) });
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5 flex flex-wrap items-center gap-3 justify-between border-b border-border">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-xs text-muted-fg mt-1">{rows.length} records</p>
        </div>
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-fg" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full h-10 pl-9 pr-3 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
            />
          </div>
          {createTemplate && (
            <Button size="sm" onClick={startCreate}>
              <Plus className="h-4 w-4" /> New
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-fg bg-muted/40">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3 whitespace-nowrap">{c.label}</th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-border hover:bg-muted/30 transition">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3">
                    {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => startEdit(row)} className="p-1.5 rounded hover:bg-muted" aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(row.id)} className="p-1.5 rounded hover:bg-red-50 text-danger ml-1" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center text-muted-fg py-12 text-sm">No records.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {(editing || creating) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => { setEditing(null); setCreating(false); }}
          >
            <motion.div
              initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg bg-card rounded-3xl shadow-glow border border-border overflow-hidden"
            >
              <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                <CardTitle>{editing ? "Edit record" : "New record"}</CardTitle>
                <button onClick={() => { setEditing(null); setCreating(false); }} className="p-1.5 rounded-full hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {columns.filter((c) => c.editable !== false).map((c) => (
                  <label key={String(c.key)} className="block">
                    <span className="text-xs font-medium text-muted-fg mb-1.5 block">{c.label}</span>
                    {c.inputType === "select" ? (
                      <select
                        className="w-full h-11 px-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                        value={draft[c.key as string] ?? ""}
                        onChange={(e) => setDraft({ ...draft, [c.key]: e.target.value })}
                      >
                        <option value="">—</option>
                        {c.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : c.inputType === "boolean" ? (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary-700"
                          checked={!!draft[c.key as string]}
                          onChange={(e) => setDraft({ ...draft, [c.key]: e.target.checked })}
                        />
                        Yes
                      </label>
                    ) : (
                      <input
                        type={c.inputType === "number" ? "number" : c.inputType === "date" ? "datetime-local" : "text"}
                        className="w-full h-11 px-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                        value={
                          c.inputType === "date" && draft[c.key as string]
                            ? new Date(draft[c.key as string]).toISOString().slice(0, 16)
                            : draft[c.key as string] ?? ""
                        }
                        onChange={(e) => {
                          const v =
                            c.inputType === "number" ? Number(e.target.value)
                            : c.inputType === "date" ? new Date(e.target.value).toISOString()
                            : e.target.value;
                          setDraft({ ...draft, [c.key]: v });
                        }}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/30">
                <Button variant="secondary" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
                <Button onClick={save}><Save className="h-4 w-4" /> Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
