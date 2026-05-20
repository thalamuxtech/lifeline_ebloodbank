"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Droplet, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <RoleGuard allow={["donor", "hospital", "admin"]}>
      <AccountInner />
    </RoleGuard>
  );
}

function AccountInner() {
  const { user, profile } = useAuth();
  if (!user || !profile) return null;
  const initials = (profile.displayName || user.email || "U")
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((s) => s[0]?.toUpperCase()).join("");

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-5 mb-10">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary-700 to-rose-500 text-white font-display text-2xl flex items-center justify-center shadow-glow">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-tight">{profile.displayName || "Your account"}</h1>
            <div className="text-sm text-muted-fg flex items-center gap-2 mt-1">
              <Shield className="h-3.5 w-3.5" /> {profile.role}
            </div>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-xl">Profile</h2>
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile.email || user.email} />
          {profile.phone && <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={profile.phone} />}
          {profile.city && <InfoRow icon={<MapPin className="h-4 w-4" />} label="City" value={profile.city} />}
          {profile.bloodGroup && (
            <InfoRow icon={<Droplet className="h-4 w-4" />} label="Blood group" value={profile.bloodGroup} />
          )}
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Member since"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
        </Card>
      </motion.div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-fg">
        {icon} {label}
      </div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );
}
