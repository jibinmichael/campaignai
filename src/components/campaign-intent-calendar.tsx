import * as React from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { CampaignIntentDayDrawer } from "@/components/campaign-intent-day-drawer"
import { buildIntentCalendarDrawerDay } from "@/components/intent-calendar-drawer-data"
import type { IntentCalendarDrawerDay } from "@/components/intent-calendar-drawer-data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const GRADIENT_STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 0, rgb: [241, 248, 241] },
  { t: 0.25, rgb: [200, 230, 201] },
  { t: 0.5, rgb: [129, 199, 132] },
  { t: 0.75, rgb: [67, 160, 71] },
  { t: 1, rgb: [27, 94, 32] },
]

export function blendGreen(score: number): string {
  const x = Math.min(1, Math.max(0, score / 100))
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const a = GRADIENT_STOPS[i]!
    const b = GRADIENT_STOPS[i + 1]!
    if (x <= b.t) {
      const span = b.t - a.t || 1
      const u = (x - a.t) / span
      const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * u)
      const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * u)
      const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * u)
      return `rgb(${r},${g},${bl})`
    }
  }
  const last = GRADIENT_STOPS[GRADIENT_STOPS.length - 1]!
  return `rgb(${last.rgb[0]},${last.rgb[1]},${last.rgb[2]})`
}

/** @deprecated Use `blendGreen` */
export const intentScoreToRgb = blendGreen

export type CampaignIntentCalendarCampaign = {
  name: string
  score: number
}

export type CampaignIntentSignalValues = {
  purchase: number
  enquiry: number
  deal: number
  support: number
  passive: number
}

export type CampaignIntentCalendarDay = {
  /** Day of month (1–31) for the cell label. */
  date: number
  /** Heatmap value 0–100 (cell background). */
  score: number
  /** Aggregate intent 0–100 (“All signals” in tooltip). */
  intentScore: number
  campaignCount: number
  signalValues: CampaignIntentSignalValues
  totalClicks: number
  /** % vs same day-of-week average; positive = above. */
  vsAverage: number
  topCta: { label: string; clicks: number }
  campaigns: CampaignIntentCalendarCampaign[]
  contacts: number[]
  unacted: number
}

export const BUSINESS_TYPE_IDS = [
  "ecom",
  "realestate",
  "education",
  "healthcare",
  "saas",
] as const

export type BusinessTypeId = (typeof BUSINESS_TYPE_IDS)[number]

export const BUSINESS_TYPE_CONFIG: Record<
  BusinessTypeId,
  {
    selectLabel: string
    /** Scale legend right label */
    highIntentLabel: string
    /** Intent bucket names (tooltips later) */
    intentBuckets: string[]
    /** Campaign vocabulary hint for future copy */
    campaignVocab: string
  }
> = {
  ecom: {
    selectLabel: "E-commerce",
    highIntentLabel: "High purchase intent",
    intentBuckets: ["Browse", "Cart", "Checkout", "Purchase", "Support"],
    campaignVocab: "promo, sale, abandoned cart",
  },
  realestate: {
    selectLabel: "Real estate",
    highIntentLabel: "High site visit intent",
    intentBuckets: ["Search", "Listing", "Tour", "Offer", "Closing"],
    campaignVocab: "open house, new listing",
  },
  education: {
    selectLabel: "Education",
    highIntentLabel: "High application intent",
    intentBuckets: ["Awareness", "Program", "Apply", "Enroll", "Alumni"],
    campaignVocab: "intake, semester start",
  },
  healthcare: {
    selectLabel: "Healthcare",
    highIntentLabel: "High appointment intent",
    intentBuckets: ["Info", "Triage", "Book", "Visit", "Follow-up"],
    campaignVocab: "reminder, screening",
  },
  saas: {
    selectLabel: "SaaS",
    highIntentLabel: "High demo intent",
    intentBuckets: ["Visit", "Trial", "Demo", "Expand", "Renewal"],
    campaignVocab: "feature launch, webinar",
  },
}

const WEEKDAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"] as const

/** Half the height of a square cell for the same column width. */
const CELL_ASPECT = "aspect-[2/1]"

function cellDate(monthStart: Date, dayOfMonth: number): Date {
  const d = new Date(monthStart)
  d.setDate(dayOfMonth)
  return d
}

function formatTooltipCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}

function filterScorePresentation(day: CampaignIntentCalendarDay): {
  label: string
  value: number
  barColor: string
  numberColor: string
} {
  return {
    label: "Intent score",
    value: day.intentScore,
    barColor: "rgb(22 163 74)",
    numberColor: "rgb(22 163 74)",
  }
}

function vsAverageLine(dayDate: Date, pct: number): { text: string; className: string } {
  const dow = format(dayDate, "EEE")
  if (pct > 0) {
    return {
      text: `↑ ${pct}% vs avg ${dow}`,
      className: "text-green-600",
    }
  }
  if (pct < 0) {
    return {
      text: `↓ ${Math.abs(pct)}% vs avg ${dow}`,
      className: "text-amber-600",
    }
  }
  return {
    text: `→ 0% vs avg ${dow}`,
    className: "text-muted-foreground",
  }
}

function campaignCountLabel(n: number): string {
  return n === 1 ? "1 campaign" : `${n} campaigns`
}

function CalendarDayTooltipBody({
  day,
  monthStart,
}: {
  day: CampaignIntentCalendarDay
  monthStart: Date
}) {
  const d = cellDate(monthStart, day.date)
  const dateTitle = format(d, "EEEE, MMM d")
  const n = day.campaignCount

  if (n === 0) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{dateTitle}</p>
        <p className="text-xs text-muted-foreground">No campaigns sent</p>
      </div>
    )
  }

  const metric = filterScorePresentation(day)
  const v = Math.min(100, Math.max(0, metric.value))
  const vs = vsAverageLine(d, day.vsAverage)

  return (
    <>
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <p className="text-sm font-medium text-foreground">{dateTitle}</p>
        <p className="text-xs text-muted-foreground">
          {campaignCountLabel(n)}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="shrink-0 text-xs text-muted-foreground">
            {metric.label}
          </span>
          <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-none bg-muted">
            <div
              className="h-full rounded-none"
              style={{
                width: `${v}%`,
                backgroundColor: metric.barColor,
              }}
            />
          </div>
          <span
            className="shrink-0 text-xs font-semibold tabular-nums"
            style={{ color: metric.numberColor }}
          >
            {metric.value}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="shrink-0 text-xs text-muted-foreground">
            Total clicks
          </span>
          <div className="min-w-0 flex-1" aria-hidden />
          <div className="shrink-0 text-right">
            <p className="text-xs font-semibold tabular-nums text-foreground">
              {formatTooltipCount(day.totalClicks)}
            </p>
            <p className={cn("text-[10px] leading-tight", vs.className)}>
              {vs.text}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <div className="flex min-w-0 flex-col">
          <span className="mb-0.5 text-[10px] text-muted-foreground">
            Top CTA
          </span>
          <span className="text-xs font-medium text-foreground">
            {day.topCta.label}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold tabular-nums text-foreground">
            {formatTooltipCount(day.topCta.clicks)}
          </p>
          <p className="text-[10px] text-muted-foreground">clicks</p>
        </div>
      </div>
    </>
  )
}

function isBusinessTypeId(v: string): v is BusinessTypeId {
  return (BUSINESS_TYPE_IDS as readonly string[]).includes(v)
}

function buildCells(
  days: CampaignIntentCalendarDay[],
  startDayOffset: number
): ({ kind: "empty" } | { kind: "day"; day: CampaignIntentCalendarDay })[] {
  const out: (
    | { kind: "empty" }
    | { kind: "day"; day: CampaignIntentCalendarDay }
  )[] = []
  for (let i = 0; i < startDayOffset; i++) out.push({ kind: "empty" })
  for (const d of days) out.push({ kind: "day", day: d })
  const total = out.length
  const cells = Math.ceil(total / 7) * 7
  while (out.length < cells) out.push({ kind: "empty" })
  return out
}

export type CampaignIntentCalendarProps = {
  data: CampaignIntentCalendarDay[]
  /** 0 = first column is Monday */
  startDayOffset: number
  /** First day of the displayed month (used for drawer date labels). */
  monthStart: Date
  businessType: string
  /**
   * Days 1..n use full intent coloring; later days of the month stay as cells
   * with dates visible but muted grey (month in progress).
   */
  pastDaysWithData?: number
  onDayClick?: (day: CampaignIntentCalendarDay) => void
  className?: string
}

export function CampaignIntentCalendar({
  data,
  startDayOffset,
  monthStart,
  businessType,
  pastDaysWithData,
  onDayClick,
  className,
}: CampaignIntentCalendarProps) {
  void pastDaysWithData

  const biz: BusinessTypeId = isBusinessTypeId(businessType)
    ? businessType
    : "ecom"

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerDay, setDrawerDay] =
    React.useState<IntentCalendarDrawerDay | null>(null)

  const visibleDays = React.useMemo(() => data.slice(0, 30), [data])
  const cells = React.useMemo(
    () => buildCells(visibleDays, startDayOffset),
    [visibleDays, startDayOffset]
  )

  const legendSwatchScores = [0, 25, 50, 75, 100]
  const bizConfig = BUSINESS_TYPE_CONFIG[biz]

  const handleCellClick = React.useCallback(
    (day: CampaignIntentCalendarDay) => {
      if (day.campaignCount === 0) return
      setDrawerDay(
        buildIntentCalendarDrawerDay(day, {
          monthStart,
          intentBuckets: bizConfig.intentBuckets,
          stableSeed: day.date * 7919,
        })
      )
      setDrawerOpen(true)
      onDayClick?.(day)
    },
    [monthStart, bizConfig.intentBuckets, onDayClick]
  )

  return (
    <div
      className={cn("w-full min-w-0 bg-transparent", className)}
      data-slot="campaign-intent-calendar-card"
    >
      <CampaignIntentDayDrawer
        open={drawerOpen}
        onOpenChange={(o) => {
          setDrawerOpen(o)
          if (!o) setDrawerDay(null)
        }}
        day={drawerDay}
      />
      <TooltipProvider delayDuration={300}>
        <div className="p-[14px]">
          <div className="grid w-full grid-cols-7 gap-[3px] pb-[3px]">
            {WEEKDAY_HEADERS.map((letter, i) => (
              <div
                key={`wd-${i}`}
                className="text-center text-[9px] tracking-[0.04em] text-[#BBB]"
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="grid w-full grid-cols-7 gap-[3px]">
            {cells.map((cell, idx) => {
              if (cell.kind === "empty") {
                return (
                  <div
                    key={`e-${idx}`}
                    className={cn(
                      "pointer-events-none overflow-hidden rounded-[7px] bg-muted/30",
                      CELL_ASPECT
                    )}
                    aria-hidden
                  />
                )
              }
              const { day } = cell
              const hasCampaign = day.campaignCount > 0
              const t = day.score / 100
              const labelColor = t > 0.45 ? "#ffffff" : "#555555"

              const cellShell = cn(
                "relative overflow-hidden rounded-[7px] border-0 p-0 outline-none",
                CELL_ASPECT,
                "transition-opacity duration-150 ease-out"
              )

              if (!hasCampaign) {
                return (
                  <div
                    key={`d-${idx}-${day.date}`}
                    className={cn(
                      cellShell,
                      "pointer-events-none cursor-default bg-muted/40"
                    )}
                    aria-hidden
                  />
                )
              }

              const bg = blendGreen(day.score)

              return (
                <Tooltip key={`d-${idx}-${day.date}`}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleCellClick(day)}
                      className={cn(
                        cellShell,
                        "cursor-pointer hover:opacity-[0.82] focus-visible:outline-none"
                      )}
                      style={{ backgroundColor: bg }}
                      aria-label={`${day.date}, ${formatTooltipCount(day.totalClicks)} clicks`}
                    >
                      <span
                        className="absolute left-[6px] top-[5px] text-[10px] font-medium"
                        style={{ color: labelColor }}
                      >
                        {day.date}
                      </span>
                      <span
                        className="absolute bottom-[6px] right-[6px] text-[10px] font-semibold tabular-nums"
                        style={{ color: labelColor }}
                      >
                        {formatTooltipCount(day.totalClicks)}
                      </span>
                      <span className="absolute right-[6px] top-[6px] flex flex-row gap-0.5">
                        {day.campaigns.slice(0, 3).map((c, dotI) => (
                          <span
                            key={`${c.name}-${dotI}`}
                            className="h-1 w-1 shrink-0 rounded-full bg-[rgba(255,255,255,0.65)]"
                            title={c.name}
                            aria-hidden
                          />
                        ))}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={18}
                    className={cn(
                      "fixed z-[99] pointer-events-none flex w-[200px] min-w-[200px] max-w-[200px] flex-col items-stretch gap-0 rounded-lg border border-border/50 bg-background px-[13px] py-[11px] text-foreground shadow-md"
                    )}
                  >
                    <CalendarDayTooltipBody day={day} monthStart={monthStart} />
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          <div className="mt-[10px] flex flex-row flex-wrap items-center gap-1">
            <span className="text-[10px] text-[#BBB]">Low intent</span>
            {legendSwatchScores.map((s) => (
              <span
                key={s}
                className="inline-block h-[10px] w-3 shrink-0 rounded-none"
                style={{ backgroundColor: blendGreen(s) }}
                aria-hidden
              />
            ))}
            <span className="text-[10px] text-[#BBB]">
              {bizConfig.highIntentLabel}
            </span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const SAMPLE_TOP_CTA_LABELS = [
  "Shop Now",
  "Learn more",
  "Book a call",
  "View offer",
] as const

/** 30 sample days (day-of-month 1–30). */
export function buildSampleCampaignIntentCalendarData(
  seed = 0
): CampaignIntentCalendarDay[] {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const score = Math.round(20 + pseudoRandom(seed + day) * 75)
    const nCamp = Math.floor(pseudoRandom(seed + day + 100) * 4)
    const campaigns: CampaignIntentCalendarCampaign[] = Array.from(
      { length: nCamp },
      (_, j) => ({
        name: `Campaign ${day}-${j + 1}`,
        score: Math.round(pseudoRandom(seed + day + j) * 100),
      })
    )
    const campaignCount = nCamp
    const intentScore = score
    const signalValues: CampaignIntentSignalValues = {
      purchase: Math.round(pseudoRandom(seed + day + 401) * 100),
      enquiry: Math.round(pseudoRandom(seed + day + 402) * 100),
      deal: Math.round(pseudoRandom(seed + day + 403) * 100),
      support: Math.round(pseudoRandom(seed + day + 404) * 100),
      passive: Math.round(pseudoRandom(seed + day + 405) * 100),
    }
    const totalClicks =
      campaignCount === 0
        ? 0
        : Math.round(800 + pseudoRandom(seed + day + 500) * 9200)
    const vsAverage =
      campaignCount === 0
        ? 0
        : Math.round((pseudoRandom(seed + day + 501) - 0.5) * 50)
    const topCta =
      campaignCount === 0
        ? { label: "", clicks: 0 }
        : {
            label: SAMPLE_TOP_CTA_LABELS[day % SAMPLE_TOP_CTA_LABELS.length]!,
            clicks: Math.round(200 + pseudoRandom(seed + day + 502) * 8000),
          }
    return {
      date: day,
      score,
      intentScore,
      campaignCount,
      signalValues,
      totalClicks,
      vsAverage,
      topCta,
      campaigns,
      contacts: [12, 8, 5, 3, 2].map((c, bi) =>
        Math.round(c * (0.5 + pseudoRandom(seed + day + bi)))
      ),
      unacted: Math.floor(pseudoRandom(seed + day + 200) * 20),
    }
  })
}

export const SAMPLE_CAMPAIGN_INTENT_CALENDAR_DATA =
  buildSampleCampaignIntentCalendarData()

/** Monday-first offset for a month that starts on Wednesday (e.g. Apr 2026). */
export const SAMPLE_CAMPAIGN_INTENT_CALENDAR_START_DAY_OFFSET = 2

/** Sample month anchor for April 2026 (matches sample day numbers 1–30). */
export const SAMPLE_CAMPAIGN_INTENT_CALENDAR_MONTH_START = new Date(
  2026,
  3,
  1
)

export {
  CampaignEngagementCalendar,
  type CampaignEngagementCalendarProps,
} from "./campaign-engagement-calendar"
