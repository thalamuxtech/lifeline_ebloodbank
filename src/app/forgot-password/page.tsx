"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send reset email";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? `We sent a password reset link to ${email}. Follow the instructions in the email to set a new password.`
          : "Enter the email you signed up with and we'll send a reset link."
      }
      footer={
        <span>
          <Link href="/sign-in" className="text-primary-700 font-medium hover:underline">
            Back to sign in
          </Link>
        </span>
      }
    >
      {!sent && (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
