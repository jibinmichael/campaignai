import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MESSAGE_TEMPLATES } from "@/data/message-templates"
import { cn } from "@/lib/utils"

export function MessageTemplateSearchSelect({
  value,
  onValueChange,
  id,
  "aria-label": ariaLabel,
}: {
  value: string
  onValueChange: (id: string) => void
  id?: string
  "aria-label"?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const selected = MESSAGE_TEMPLATES.find((t) => t.id === value)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MESSAGE_TEMPLATES
    return MESSAGE_TEMPLATES.filter((t) =>
      t.name.toLowerCase().includes(q)
    )
  }, [query])

  React.useEffect(() => {
    if (!open) setQuery("")
    else
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size="lg"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className="w-full max-w-md justify-between border-black-100 bg-background px-3 text-[12px] font-normal hover:bg-background"
        >
          <span className="truncate text-left">
            {selected?.name ?? "Select message template"}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(calc(100vw-3rem),28rem)] p-0">
        <div className="border-b border-border p-2">
          <Input
            ref={searchInputRef}
            placeholder="Search templates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <ul
          className="max-h-60 overflow-y-auto p-1"
          role="listbox"
          aria-label="Message templates"
        >
          {filtered.length === 0 ? (
            <li className="px-2 py-3 text-center text-[12px] text-muted-foreground">
              No templates match your search
            </li>
          ) : (
            filtered.map((t) => {
              const isSel = t.id === value
              return (
                <li key={t.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    className={cn(
                      "flex w-full rounded-md px-2 py-1.5 text-left text-[12px] outline-none transition-colors",
                      isSel
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => {
                      onValueChange(t.id)
                      setOpen(false)
                    }}
                  >
                    {t.name}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
