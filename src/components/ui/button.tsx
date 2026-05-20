"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-primary-700 text-white shadow-glow hover:bg-primary-800 hover:shadow-[0_0_0_1px_rgba(185,28,28,0.25),0_24px_80px_-20px_rgba(185,28,28,0.6)]",
        secondary: "bg-card text-fg border border-border hover:border-primary-700/40 hover:bg-muted",
        ghost: "text-fg hover:bg-muted",
        danger: "bg-danger text-white hover:bg-red-700",
        outline: "border border-primary-700/30 text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
