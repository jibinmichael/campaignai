import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const segmentTabClass =
  "!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium text-[#0a0a0a] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"

/** Figma PlYsn2j4gbkftQibcUwJNf / node 84:1339 */
export function AdsFunnelMovesToolbar({ className }: { className?: string }) {
  const [range, setRange] = React.useState("1d")
  const [rangeOpen, setRangeOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  return (
    <div
      className={cn("flex w-full items-center gap-1 pl-0", className)}
      data-node-id="84:1339"
    >
      <div
        className="flex min-h-0 min-w-0 max-w-full flex-[0_1_auto] flex-col justify-center gap-0.5 py-0.5 pl-0 pr-1 sm:max-w-md"
        data-node-id="84:1340"
      >
        <p
          className="min-w-0 text-balance text-[16px] font-semibold leading-snug text-[#1b1d1c]"
          data-node-id="84:1341"
        >
          How your funnel moves over time
        </p>
        <p
          className="min-w-0 text-pretty text-sm font-normal leading-snug text-[#848a86] sm:whitespace-nowrap"
          data-node-id="84:1397"
        >
          Spend vs conversations, leads and purchases
        </p>
      </div>

      <div
        className="min-h-px min-w-px flex-1"
        aria-hidden
        data-node-id="84:1344"
      />

      <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
        <Tabs
          value={range}
          onValueChange={(v) => {
            setRange(v)
            if (v === "custom") setRangeOpen(true)
            else setRangeOpen(false)
          }}
          className="w-auto shrink-0"
        >
          <TabsList
            variant="default"
            className="!h-auto min-h-0 gap-0 rounded-[10px] bg-[#f5f5f5] p-[3px]"
            data-node-id="84:1421"
          >
            <TabsTrigger value="1d" className={segmentTabClass}>
              1D
            </TabsTrigger>
            <TabsTrigger value="1w" className={segmentTabClass}>
              1W
            </TabsTrigger>
            <TabsTrigger value="1m" className={segmentTabClass}>
              1M
            </TabsTrigger>
            <TabsTrigger value="3m" className={segmentTabClass}>
              3M
            </TabsTrigger>
            <PopoverAnchor asChild>
              <TabsTrigger
                value="custom"
                className={segmentTabClass}
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
        <PopoverContent align="end" className="w-auto p-0" sideOffset={8}>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
