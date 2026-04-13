import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SEGMENTS } from "@/data/segments"

export function AudienceSegmentsMultiSelect({
  value,
  onChange,
  id,
}: {
  value: string[]
  onChange: (next: string[]) => void
  id?: string
}) {
  const [open, setOpen] = React.useState(false)

  const toggle = (segmentId: string) => {
    onChange(
      value.includes(segmentId)
        ? value.filter((x) => x !== segmentId)
        : [...value, segmentId]
    )
  }

  const summary =
    value.length === 0
      ? "Select segments"
      : value.length === 1
        ? (SEGMENTS.find((s) => s.id === value[0])?.label ?? "1 selected")
        : `${value.length} selected`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          className={cn(
            "flex h-9 w-full max-w-md items-center justify-between gap-2 rounded-lg border border-black-100 bg-background px-3 text-left text-[12px] outline-none transition-colors",
            "hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            value.length === 0 && "text-muted-foreground"
          )}
          aria-expanded={open}
          aria-label="Choose audience segments"
        >
          <span className="truncate">{summary}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[min(100%,18rem)] p-2"
        align="start"
      >
        <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto p-1">
          {SEGMENTS.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60"
            >
              <Checkbox
                id={`segment-${s.id}`}
                checked={value.includes(s.id)}
                onCheckedChange={() => toggle(s.id)}
              />
              <Label
                htmlFor={`segment-${s.id}`}
                className="cursor-pointer text-[12px] font-normal leading-snug"
              >
                {s.label}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
