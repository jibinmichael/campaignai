import * as React from "react"
import type { DateRange } from "react-day-picker"
import { ChevronDownIcon, LayoutGridIcon, SearchIcon } from "lucide-react"

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

export function AdsAllAdsToolbar({ className }: { className?: string }) {
  const [tab, setTab] = React.useState("1d")
  const [rangeOpen, setRangeOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [sortBy, setSortBy] = React.useState("Start time")

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-3 bg-white py-2",
        className
      )}
      data-node-id="63:2109"
    >
      <p
        className="min-w-0 max-w-full text-balance text-[13px] font-semibold leading-snug text-[#1b1d1c]"
        data-node-id="63:2110"
      >
        All ad campaigns across channels
      </p>

      <div
        className="min-h-px min-w-px flex-1 basis-4"
        aria-hidden
        data-node-id="63:2111"
      />

      <div
        className="flex h-8 min-w-[min(100%,220px)] max-w-md shrink-0 items-center gap-0.5 rounded border border-solid border-[#e7e9e8] bg-white px-3 py-1.5"
        data-node-id="63:2112"
      >
        <SearchIcon
          className="size-5 shrink-0 text-[#848a86]"
          aria-hidden
          strokeWidth={1.75}
        />
        <input
          type="search"
          name="ads-search"
          placeholder="Search for ads and source_id"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm leading-5 text-[#353735] outline-none placeholder:text-[#b7b9b7]"
          data-node-id="I63:2112;475:9012"
        />
      </div>

      <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v)
            if (v === "custom") setRangeOpen(true)
            else setRangeOpen(false)
          }}
          className="w-auto shrink-0"
        >
          <TabsList
            variant="default"
            className="!h-auto min-h-0 gap-0 rounded-[10px] bg-[#f5f5f5] p-[3px]"
            data-node-id="63:2325"
          >
            <TabsTrigger
              value="1d"
              className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
            >
              1D
            </TabsTrigger>
            <TabsTrigger
              value="1w"
              className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
            >
              1W
            </TabsTrigger>
            <TabsTrigger
              value="1m"
              className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
            >
              1M
            </TabsTrigger>
            <TabsTrigger
              value="3m"
              className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
            >
              3M
            </TabsTrigger>
            <PopoverAnchor asChild>
              <TabsTrigger
                value="custom"
                className="!h-auto min-h-[29px] flex-none rounded-[10px] px-2 py-1 text-sm font-medium data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
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

      <p
        className="shrink-0 text-sm font-medium leading-5 whitespace-nowrap text-[#848a86]"
        data-node-id="63:2113"
      >
        Sort by:
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-8 shrink-0 items-center gap-1 overflow-hidden rounded-none border-x-0 border-t-0 border-b border-solid border-[#9ca19d] bg-white p-1 text-sm font-medium leading-5 text-[#353735] outline-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-node-id="63:2114"
          >
            <span data-node-id="63:2115">{sortBy}</span>
            <ChevronDownIcon
              className="size-4 shrink-0 text-[#353735]"
              aria-hidden
              data-node-id="63:2116"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          {(["Start time", "Spend", "Impressions", "CTR"] as const).map((opt) => (
            <DropdownMenuItem key={opt} onSelect={() => setSortBy(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-8 shrink-0 gap-1 rounded px-2 py-1 text-sm font-medium text-[#353735] hover:bg-[#ebebeb] bg-[#f6f7f6]"
            data-node-id="63:2117"
          >
            <LayoutGridIcon className="size-4 shrink-0" aria-hidden data-node-id="63:2118" />
            <span data-node-id="63:2120">Columns</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-80" aria-hidden data-node-id="63:2121" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          <DropdownMenuItem>Toggle column visibility…</DropdownMenuItem>
          <DropdownMenuItem>Reset to default</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
