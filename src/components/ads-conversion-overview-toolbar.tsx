import * as React from "react"
import type { DateRange } from "react-day-picker"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function downloadCsv(filename: string, rows: string[][]) {
  const escape = (cell: string) => {
    if (/[",\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`
    return cell
  }
  const body = rows.map((r) => r.map(escape).join(",")).join("\n")
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  a.click()
  URL.revokeObjectURL(url)
}

export function AdsConversionOverviewToolbar({
  className,
}: {
  className?: string
}) {
  const [tab, setTab] = React.useState("1d")
  const [rangeOpen, setRangeOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const handleExportCsv = React.useCallback(() => {
    downloadCsv(`conversion-overview-${tab}.csv`, [
      ["Period", "Metric", "Value"],
      [tab.toUpperCase(), "Example conversions", "128"],
      [tab.toUpperCase(), "Example rate", "3.2%"],
    ])
  }, [tab])

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-2 bg-white px-0 py-3",
        className
      )}
      data-node-id="14:1155"
    >
      <p
        className="min-h-px min-w-0 flex-1 text-sm font-semibold leading-5 text-[#1b1d1c]"
        data-node-id="14:1156"
      >
        Conversion overview
      </p>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v)
              if (v === "custom") setRangeOpen(true)
              else setRangeOpen(false)
            }}
            className="w-auto"
          >
            <TabsList
              variant="default"
              className="!h-auto min-h-0 gap-0 rounded-[10px] bg-[#f5f5f5] p-[3px]"
              data-node-id="14:1569"
            >
              <TabsTrigger
                value="1d"
                className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium"
              >
                1D
              </TabsTrigger>
              <TabsTrigger
                value="1w"
                className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium"
              >
                1W
              </TabsTrigger>
              <TabsTrigger
                value="1m"
                className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium"
              >
                1M
              </TabsTrigger>
              <TabsTrigger
                value="3m"
                className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium"
              >
                3M
              </TabsTrigger>
              <PopoverAnchor asChild>
                <TabsTrigger
                  value="custom"
                  className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium"
                  onClick={() => setRangeOpen(true)}
                >
                  Custom Date
                </TabsTrigger>
              </PopoverAnchor>
            </TabsList>
            <TabsContent value="1d" className="hidden" />
            <TabsContent value="1w" className="hidden" />
            <TabsContent value="1m" className="hidden" />
            <TabsContent value="3m" className="hidden" />
            <TabsContent value="custom" className="hidden" />
          </Tabs>
          <PopoverContent
            align="end"
            className="w-auto p-0"
            sideOffset={8}
          >
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 min-h-8 gap-1.5 rounded-lg border-[#d4d4d4] bg-white px-3 py-1.5 text-sm font-medium text-[#0a0a0a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-muted/60"
              data-node-id="17:2296"
            >
              Export
              <ChevronDownIcon className="size-4 opacity-70" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem onSelect={handleExportCsv}>
              Download CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                void navigator.clipboard.writeText(
                  JSON.stringify(
                    { period: tab, dateRange, exportedAt: new Date().toISOString() },
                    null,
                    2
                  )
                )
              }}
            >
              Copy report JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
