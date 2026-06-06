// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-primary text-primary-foreground",
        secondary:  "bg-secondary text-secondary-foreground",
        destructive:"bg-destructive text-destructive-foreground",
        outline:    "border border-current",
        gold:       "border border-champagne-700/50 bg-champagne-900/20 text-champagne-400 tracking-wider uppercase",
        status:     "bg-obsidian-800 text-ivory-300 tracking-wider uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
