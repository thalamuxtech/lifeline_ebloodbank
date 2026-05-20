"use client";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, className, type = "text", ...props },
  ref,
) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-fg mb-1.5 uppercase tracking-wider">
        {label}
      </span>
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full h-12 rounded-2xl bg-bg border border-border px-4 text-sm",
            "outline-none transition-all focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15",
            "placeholder:text-muted-fg/60",
            error && "border-danger focus:border-danger focus:ring-danger/15",
            isPassword && "pr-12",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-fg hover:text-fg hover:bg-muted"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="block mt-1.5 text-xs text-danger">{error}</span>}
    </label>
  );
});

export function GoogleButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full h-12 rounded-2xl border border-border bg-card hover:bg-muted transition-all flex items-center justify-center gap-3 font-medium text-sm active:scale-[0.99] disabled:opacity-50"
    >
      <GoogleIcon />
      <span>Continue with Google</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.95h5.5c-.24 1.43-1.7 4.2-5.5 4.2-3.31 0-6.01-2.74-6.01-6.12s2.7-6.12 6.01-6.12c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.91 3.49 14.7 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12s4.26 9.5 9.5 9.5c5.49 0 9.13-3.86 9.13-9.29 0-.62-.07-1.1-.16-1.51H12z"
      />
      <path fill="#34A853" d="M3.88 7.57l3.24 2.38C7.99 7.97 9.83 6.62 12 6.62c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.91 3.49 14.7 2.5 12 2.5 8.21 2.5 4.92 4.55 3.88 7.57z" opacity=".0001" />
      <path fill="#4285F4" d="M12 22.5c2.7 0 4.97-.89 6.63-2.43l-3.16-2.6c-.86.6-2.02 1.04-3.47 1.04-2.68 0-4.96-1.81-5.77-4.25H2.9v2.67C4.55 20.2 8 22.5 12 22.5z" opacity=".0001" />
    </svg>
  );
}
