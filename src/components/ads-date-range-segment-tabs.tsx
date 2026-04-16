import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const segmentTabClass =
  "font-['JetBrains_Mono',monospace] tabular-nums !h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium text-[#0a0a0a] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"

export type AdsDateRangeSegmentTabsProps = {
  range: string
  onRangeChange: (value: string) => void
  rangeOpen: boolean
  onRangeOpenChange: (open: boolean) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (value: DateRange | undefined) => void
  /** Figma node on tablist; omit when duplicate instances exist. */
  tabListDataNodeId?: string
}

/** 1D … Custom Date — shared by ads filters row (Figma 84:1421). */
export function AdsDateRangeSegmentTabs({
  range,
  onRangeChange,
  rangeOpen,
  onRangeOpenChange,
  dateRange,
  onDateRangeChange,
  tabListDataNodeId = "84:1421",
}: AdsDateRangeSegmentTabsProps) {
  return (
    <Popover open={rangeOpen} onOpenChange={onRangeOpenChange}>
      <Tabs
        value={range}
        onValueChange={(v) => {
          onRangeChange(v)
          if (v === "custom") onRangeOpenChange(true)
          else onRangeOpenChange(false)
        }}
        className="w-auto shrink-0"
      >
        <TabsList
          variant="default"
          className="!h-auto min-h-0 gap-0 rounded-[10px] bg-[#f5f5f5] p-[3px]"
          data-node-id={tabListDataNodeId}
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
              onClick={() => onRangeOpenChange(true)}
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
          onSelect={onDateRangeChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
