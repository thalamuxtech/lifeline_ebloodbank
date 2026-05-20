import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "primary" | "success" | "warning" | "danger" }) {
  const tones = {
    neutral: "bg-muted text-muted-fg",
    primary: "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    danger: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
