"use client"

import * as React from "react"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import { INTENT_DISPLAY_LABELS } from "@/data/audience-breakdown"
import { cn } from "@/lib/utils"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type DayIntentPercents = {
  hot: number
  warm: number
  cold: number
  silent: number
}

export type DayEngagement = {
  campaignCount: number
  clicks: number
  sends: number
  readRate: number
  vs: number | null
  /** Present when `campaignCount > 0`; four buckets sum to 100. */
  intent?: DayIntentPercents
}

const INTENT_COLORS = {
  hot: "#C17B3F",
  warm: "#3A7FBF",
  cold: "#E24B4A",
  silent: "#DADADA",
} as const

const INTENT_ORDER = (
  ["hot", "warm", "cold", "silent"] as const
).map((key) => ({ key, label: INTENT_DISPLAY_LABELS[key] }))

function normalizeIntentFromRawCounts(raw: {
  hot: number
  warm: number
  cold: number
  silent: number
}): DayIntentPercents {
  const t = raw.hot + raw.warm + raw.cold + raw.silent
  if (t <= 0) {
    return { hot: 25, warm: 25, cold: 25, silent: 25 }
  }
  const pct = [
    (raw.hot / t) * 100,
    (raw.warm / t) * 100,
    (raw.cold / t) * 100,
    (raw.silent / t) * 100,
  ]
  const floors = pct.map((x) => Math.floor(x))
  let remainder = 100 - floors.reduce((a, b) => a + b, 0)
  const order = [0, 1, 2, 3].sort(
    (i, j) => pct[j]! - floors[j]! - (pct[i]! - floors[i]!)
  )
  for (let k = 0; k < remainder; k++) {
    floors[order[k]!]! += 1
  }
  return {
    hot: floors[0]!,
    warm: floors[1]!,
    cold: floors[2]!,
    silent: floors[3]!,
  }
}

export type CalendarViewMode = "month" | "week" | "day"

const WEEKDAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

/** Fixed viewport height for the date grid (header + cells); rows share space equally. */
const CALENDAR_GRID_MAX_PX = 320

/** Diagonal stripes for dates after today (subtle cool grey / off-white, ~45°). */
const FUTURE_DAY_CELL_STYLE: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  backgroundImage:
    "repeating-linear-gradient(135deg, #e8eaed 0px, #e8eaed 5px, #f7f8f9 5px, #f7f8f9 10px)",
}

function seedFromDate(d: Date): number {
  return d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

/** Deterministic engagement for a calendar day (campaign store stub). */
export function getDayEngagement(date: Date): DayEngagement {
  const s = seedFromDate(date)
  const campaignCount = Math.floor(pseudoRandom(s + 11) * 4)
  if (campaignCount === 0) {
    return {
      campaignCount: 0,
      clicks: 0,
      sends: 0,
      readRate: 0,
      vs: null,
    }
  }
  const clicks = Math.round(400 + pseudoRandom(s + 22) * 9600)
  const sends = Math.round(15000 + pseudoRandom(s + 33) * 120000)
  const readRate = Math.round(35 + pseudoRandom(s + 44) * 55)
  const vs = Math.round((pseudoRandom(s + 55) - 0.5) * 40)
  const rawHot = Math.floor(pseudoRandom(s + 60) * 120) + 8
  const rawWarm = Math.floor(pseudoRandom(s + 61) * 100) + 10
  const rawCold = Math.floor(pseudoRandom(s + 62) * 80) + 6
  const rawSilent = Math.floor(pseudoRandom(s + 63) * 200) + 20
  const intent = normalizeIntentFromRawCounts({
    hot: rawHot,
    warm: rawWarm,
    cold: rawCold,
    silent: rawSilent,
  })
  return { campaignCount, clicks, sends, readRate, vs, intent }
}

export function blendGreen(t: number): string {
  if (t < 0.01) return "hsl(var(--muted))"
  const stops: [number, number, number][] = [
    [232, 245, 233],
    [165, 214, 167],
    [102, 187, 106],
    [56, 142, 60],
    [27, 94, 32],
  ]
  const scaled = Math.min(0.999, t)
  const i = Math.min(3, Math.floor(scaled * 4))
  const n = Math.min(4, i + 1)
  const f = (scaled * 4) % 1
  return `rgb(${stops[i]!
    .map((v, j) => Math.round(v + (stops[n]![j]! - v) * f))
    .join(",")})`
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m % 1 < 0.05 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1000) {
    const k = n / 1000
    return `${k % 1 < 0.05 ? k.toFixed(0) : k.toFixed(1)}k`
  }
  return String(n)
}

/** Tooltip metric values (handles 0 / missing as em dash). */
function fmt(n: number | undefined | null): string {
  if (!n || n === 0) return "—"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k"
  return n.toLocaleString()
}

function campaignsLabel(n: number): string {
  return n === 1 ? "1 campaign" : `${n} campaigns`
}

function EngagementTooltipBody({
  date,
  day,
  maxClicks,
}: {
  date: Date
  day: DayEngagement
  maxClicks: number
}) {
  const header = format(date, "EEE, MMM d")

  if (day.campaignCount === 0) {
    return (
      <div className="p-[11px]">
        <p className="text-xs font-medium text-foreground">{header}</p>
        <p className="mt-1 text-xs text-muted-foreground">No campaigns sent</p>
      </div>
    )
  }

  const clickPct = Math.min(100, Math.round((day.clicks / maxClicks) * 100))

  return (
    <div className="flex flex-col gap-0 p-[11px]">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-border pb-2">
        <span className="text-xs font-medium text-foreground">{header}</span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {campaignsLabel(day.campaignCount)}
        </span>
      </div>

      <div className="flex flex-col gap-[6px]">
        <div className="flex w-full min-w-0 items-center gap-2">
          <span className="min-w-[68px] shrink-0 text-[11px] text-muted-foreground">
            Sends
          </span>
          <span className="min-h-0 min-w-0 flex-1" aria-hidden />
          <span className="min-w-[36px] shrink-0 text-right text-[11px] font-semibold text-foreground">
            {fmt(day.sends)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="min-w-[68px] text-[11px] text-muted-foreground">
            Read rate
          </span>
          <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#3A9459]"
              style={{ width: `${day.readRate ?? 0}%` }}
            />
          </div>
          <span className="min-w-[36px] shrink-0 text-right text-[11px] font-semibold text-foreground">
            {day.readRate == null || day.readRate === 0
              ? "—"
              : `${day.readRate}%`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="min-w-[68px] text-[11px] text-muted-foreground">
            Clicks
          </span>
          <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#1B5E20]"
              style={{ width: `${clickPct}%` }}
            />
          </div>
          <div className="flex min-w-[36px] shrink-0 flex-col items-end">
            <span className="text-[11px] font-semibold text-foreground">
              {fmt(day.clicks)}
            </span>
            {day.vs !== null && (
              <span
                className={cn(
                  "text-[10px]",
                  day.vs >= 0 ? "text-green-600" : "text-amber-600"
                )}
              >
                {day.vs >= 0 ? "↑" : "↓"} {Math.abs(day.vs)}% vs avg
              </span>
            )}
          </div>
        </div>
      </div>

      {day.intent ? (
        <div className="mt-2 border-t border-border pt-2">
          <p className="mb-1.5 text-[9px] font-medium tracking-wider text-muted-foreground">
            Engagement Intent
          </p>
          <div className="flex flex-col gap-1.5">
            {INTENT_ORDER.map(({ key, label }) => {
              const pct = day.intent![key]
              const color = INTENT_COLORS[key]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="flex min-w-[9rem] shrink-0 items-center gap-[6px]">
                    <span
                      className="size-1.5 shrink-0 rounded-none"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="whitespace-nowrap text-[11px] leading-tight text-foreground">
                      {label}
                    </span>
                  </span>
                  <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="min-w-[36px] shrink-0 text-right text-[11px] font-semibold text-foreground">
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function buildGridDays(view: CalendarViewMode, today: Date): Date[] {
  if (view === "day") {
    return [today]
  }
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  if (view === "week") {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

function computeMonthMaxMetrics(monthStart: Date, monthEnd: Date) {
  const allMonthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  let maxClicks = 1
  for (const d of allMonthDays) {
    const e = getDayEngagement(d)
    maxClicks = Math.max(maxClicks, e.clicks)
  }
  return { maxClicks }
}

function EngagementGridCell({
  day,
  today,
  maxClicks,
  /** Week view: one row of narrow columns — skip `aspect-square` so cells fill grid height. */
  fillCellHeight = false,
}: {
  day: Date
  today: Date
  maxClicks: number
  fillCellHeight?: boolean
}) {
  const inMonth = isSameMonth(day, today)
  const data = getDayEngagement(day)
  const t = data.clicks / maxClicks

  const dayStart = startOfDay(day)
  const todayStart = startOfDay(today)
  const isFutureDay = isAfter(dayStart, todayStart)

  /** Fills grid row so all weeks fit in `CALENDAR_GRID_MAX_PX`; column width stays fluid (w-full). */
  const cellSize = "h-full min-h-0 w-full min-w-0 rounded-none"

  /** After today: always striped (no engagement treatment). */
  if (isFutureDay) {
    return (
      <div
        className={cn(
          cellSize,
          "relative overflow-hidden border border-border/25",
          !inMonth && "opacity-70"
        )}
        style={FUTURE_DAY_CELL_STYLE}
        aria-hidden={!inMonth}
      >
        <span className="absolute left-[5px] top-[4px] text-[9px] font-medium leading-none text-muted-foreground">
          {day.getDate()}
        </span>
      </div>
    )
  }

  /** Today or past, no campaigns: flat subtle grey. */
  if (data.campaignCount === 0) {
    const emptyBody = (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              cellSize,
              "relative cursor-default overflow-hidden border border-border/20 bg-muted/55",
              !inMonth && "opacity-60"
            )}
            aria-hidden={!inMonth}
          >
            <span className="absolute left-[5px] top-[4px] text-[9px] font-medium leading-none text-muted-foreground">
              {day.getDate()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="w-[196px] border-0 bg-transparent p-0 text-foreground shadow-none [&>svg]:hidden"
        >
          <div className="overflow-hidden rounded-lg border border-border/50 bg-background shadow-md">
            <EngagementTooltipBody
              date={day}
              day={data}
              maxClicks={maxClicks}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    )
    return emptyBody
  }

  const labelColor = t > 0.45 ? "rgba(255,255,255,0.92)" : "#555555"
  const bg = blendGreen(t)

  const intent = data.intent!

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-none transition-opacity hover:opacity-75",
            "cursor-pointer",
            fillCellHeight
              ? "h-full"
              : "aspect-square h-auto max-h-full"
          )}
        >
          <div
            className="relative min-h-0 flex-1"
            style={{ background: bg }}
          >
            <span
              className="absolute left-[5px] top-[4px] text-[9px] font-medium leading-none"
              style={{ color: labelColor }}
            >
              {day.getDate()}
            </span>
            <span className="absolute right-[5px] top-[5px] flex flex-row gap-px">
              {Array.from(
                { length: Math.min(3, data.campaignCount) },
                (_, i) => (
                  <span
                    key={i}
                    className="size-1 shrink-0 rounded-none bg-[rgba(255,255,255,0.65)]"
                    aria-hidden
                  />
                )
              )}
            </span>
            <span
              className="absolute bottom-[5px] right-[5px] text-[9px] font-semibold leading-none tabular-nums"
              style={{ color: labelColor }}
            >
              {formatCompact(data.clicks)}
            </span>
          </div>
          <div
            className="flex h-[7px] w-full shrink-0 overflow-hidden bg-[rgba(255,255,255,0.92)]"
            aria-hidden
          >
            {INTENT_ORDER.map(({ key }) => (
              <div
                key={key}
                className="h-full shrink-0"
                style={{
                  width: `${intent[key]}%`,
                  backgroundColor: INTENT_COLORS[key],
                }}
              />
            ))}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="w-[220px] border-0 bg-transparent p-0 text-foreground shadow-none [&>svg]:hidden"
      >
        <div className="overflow-hidden rounded-lg border border-border/50 bg-background shadow-md">
          <EngagementTooltipBody
            date={day}
            day={data}
            maxClicks={maxClicks}
          />
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export type CampaignEngagementCalendarProps = {
  className?: string
}

export function CampaignEngagementCalendar({
  className,
}: CampaignEngagementCalendarProps) {
  const [view, setView] = React.useState<CalendarViewMode>("month")

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const { maxClicks } = React.useMemo(
    () => computeMonthMaxMetrics(monthStart, monthEnd),
    [monthStart.getTime(), monthEnd.getTime()]
  )

  const gridDays = buildGridDays(view, today)
  const weekRowCount =
    view === "day" ? 1 : Math.ceil(gridDays.length / 7) || 1

  return (
    <TooltipProvider delayDuration={250}>
      <div className={cn("w-full min-w-0", className)}>
        <div className="mb-2 flex w-full justify-end">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as CalendarViewMode)}
            size="sm"
          >
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div
          className="flex w-full min-w-0 flex-col"
          style={{ height: CALENDAR_GRID_MAX_PX, maxHeight: CALENDAR_GRID_MAX_PX }}
        >
          {view === "day" ? (
            <>
              <div className="shrink-0 pb-1 text-center text-[10px] font-normal tracking-wide text-muted-foreground">
                {format(today, "EEEE, MMM d, yyyy")}
              </div>
              <div
                className="min-h-0 flex-1 grid w-full grid-cols-1 gap-[3px]"
                style={{
                  gridTemplateRows: "minmax(0, 1fr)",
                }}
              >
                {gridDays.map((day) => (
                  <EngagementGridCell
                    key={format(day, "yyyy-MM-dd")}
                    day={day}
                    today={today}
                    maxClicks={maxClicks}
                    fillCellHeight
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="grid shrink-0 grid-cols-7 gap-x-[3px] gap-y-0 pb-1">
                {WEEKDAY_HEADERS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[9px] font-normal leading-tight tracking-wider text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div
                className="min-h-0 flex-1 grid w-full grid-cols-7 gap-[3px]"
                style={{
                  gridTemplateRows: `repeat(${weekRowCount}, minmax(0, 1fr))`,
                }}
              >
                {gridDays.map((day) => (
                  <EngagementGridCell
                    key={format(day, "yyyy-MM-dd")}
                    day={day}
                    today={today}
                    maxClicks={maxClicks}
                    fillCellHeight={view === "week"}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-2 flex w-full flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 py-5">
          <div className="flex min-w-0 flex-row flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                No activity
              </span>
              {(
                [
                  "#E8F5E9",
                  "#A5D6A7",
                  "#4CAF50",
                  "#2E7D32",
                  "#1A3D1F",
                ] as const
              ).map((c) => (
                <span
                  key={c}
                  className="size-2.5 shrink-0 rounded-none"
                  style={{ backgroundColor: c }}
                  aria-hidden
                />
              ))}
              <span className="text-[10px] text-muted-foreground">
                High engagement
              </span>
            </div>
            <div className="flex items-center gap-[5px]">
              <span
                className="size-2.5 shrink-0 rounded-none bg-foreground/20"
                aria-hidden
              />
              <span className="text-[10px] text-muted-foreground">
                Campaigns sent
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-row flex-wrap items-center justify-end gap-x-6 gap-y-2">
            {INTENT_ORDER.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 shrink-0 rounded-none"
                  style={{ backgroundColor: INTENT_COLORS[key] }}
                  aria-hidden
                />
                <span className="text-[10px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
