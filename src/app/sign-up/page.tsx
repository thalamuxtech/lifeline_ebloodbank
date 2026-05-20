"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field, GoogleButton } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "donor", label: "Donor", desc: "Save lives by giving blood" },
  { value: "hospital", label: "Hospital", desc: "Manage requests & inventory" },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUpEmail, signInGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("donor");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUpEmail(email.trim(), password, name.trim(), role);
      toast.success("Account created");
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the network. It takes less than a minute."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary-700 font-medium hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                "rounded-2xl border p-3 text-left transition-all",
                role === r.value
                  ? "border-primary-700 bg-primary-700/5 ring-4 ring-primary-700/15"
                  : "border-border hover:border-primary-700/40 bg-card",
              )}
            >
              <div className="font-medium text-sm">{r.label}</div>
              <div className="text-xs text-muted-fg mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
        <Field
          label="Full name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-fg">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton onClick={() => signInGoogle(role)} loading={loading} />
      <p className="mt-6 text-[11px] text-muted-fg text-center leading-relaxed">
        By continuing you agree to our Terms and acknowledge our Privacy Notice. We never share donor
        information without consent.
      </p>
    </AuthShell>
  );
}
