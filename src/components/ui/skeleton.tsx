// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-obsidian-800/60",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
