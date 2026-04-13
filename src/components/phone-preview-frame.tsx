import { cn } from "@/lib/utils"

/**
 * Portrait frame (iPhone-style aspect). Light shadow; parent should give width (e.g. w-full).
 */
export function PhonePreviewFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "box-border shrink-0 bg-white rounded-[2.625rem]",
        "aspect-[393/852] w-[min(221px,calc(100%-2rem))]",
        "shadow-[0_6px_20px_-4px_rgba(15,23,42,0.05),0_2px_8px_-2px_rgba(15,23,42,0.04)]",
        className
      )}
      aria-hidden
    />
  )
}
