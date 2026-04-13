import * as React from "react"

import { cn } from "@/lib/utils"

export function StickyActionFooter({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 w-full shrink-0 border-t border-border/50 bg-background px-6 py-4 md:px-8",
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-end lg:gap-3">
        {children}
      </div>
    </div>
  )
}
