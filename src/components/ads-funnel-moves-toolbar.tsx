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

export type AdsFunnelMovesToolbarProps = {
  className?: string
  range: string
  onRangeChange: (value: string) => void
  rangeOpen: boolean
  onRangeOpenChange: (open: boolean) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (value: DateRange | undefined) => void
  /**
   * First instance: true (default) — Figma `data-node-id`s on this block.
   * Duplicate instance: false — same UI, no `data-node-id`s (avoids duplicate ids in the DOM).
   */
  showFigmaNodeIds?: boolean
  /** Default true. Set false on a title-only row (subtitle + date tabs hidden). */
  showSubtitle?: boolean
  /** Default true. Set false to hide 1D…Custom Date; state still syncs from other instances. */
  showDateRange?: boolean
  /** Main heading above the subtitle (when shown). */
  title?: string
}

function figmaNode(
  show: boolean,
  id: string,
): { "data-node-id": string } | Record<string, never> {
  return show ? { "data-node-id": id } : {}
}

/** Figma PlYsn2j4gbkftQibcUwJNf / node 84:1339 */
export function AdsFunnelMovesToolbar({
  className,
  range,
  onRangeChange,
  rangeOpen,
  onRangeOpenChange,
  dateRange,
  onDateRangeChange,
  showFigmaNodeIds = true,
  showSubtitle = true,
  showDateRange = true,
  title = "Where your leads come from",
}: AdsFunnelMovesToolbarProps) {
  return (
    <div
      className={cn("flex w-full items-center gap-1 pl-0", className)}
      {...figmaNode(showFigmaNodeIds, "84:1339")}
    >
      <div
        className="flex min-h-0 min-w-0 max-w-full flex-[0_1_auto] flex-col justify-center gap-0.5 py-0.5 pl-0 pr-1 sm:max-w-md"
        {...figmaNode(showFigmaNodeIds, "84:1340")}
      >
        <p
          className="min-w-0 text-balance text-[16px] font-semibold leading-snug text-[#1b1d1c]"
          {...figmaNode(showFigmaNodeIds, "84:1341")}
        >
          {title}
        </p>
        {showSubtitle ? (
          <p
            className="min-w-0 text-pretty text-sm font-normal leading-snug text-[#848a86] sm:whitespace-nowrap"
            {...figmaNode(showFigmaNodeIds, "84:1397")}
          >
            Spend vs conversations, leads and purchases
          </p>
        ) : null}
      </div>

      {showDateRange ? (
        <>
          <div
            className="min-h-px min-w-px flex-1"
            aria-hidden
            {...figmaNode(showFigmaNodeIds, "84:1344")}
          />

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
                {...figmaNode(showFigmaNodeIds, "84:1421")}
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
        </>
      ) : null}
    </div>
  )
}
