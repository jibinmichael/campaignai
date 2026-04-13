import { format } from "date-fns"

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

/** Minimal day shape required to build drawer detail. */
export type CalendarDayForDrawer = {
  date: number
  score: number
  campaigns: { name: string; score: number }[]
  contacts: number[]
  unacted: number
}

export type IntentCalendarDrawerCampaign = {
  name: string
  templateType: string
  score: number
  color: string
}

export type IntentCalendarDrawerSignal = {
  name: string
  color: string
  count: number
  action: string
  actionBg: string
  actionColor: string
}

export type IntentCalendarDrawerDay = {
  date: string
  week: string
  score: number
  trend: "up" | "down"
  patternInsight: string
  campaigns: IntentCalendarDrawerCampaign[]
  hourlyEngagement: number[]
  bestWindow: string
  signals: IntentCalendarDrawerSignal[]
  unacted: number
}

const TEMPLATE_TYPES = [
  "Promotional",
  "Lifecycle",
  "Flash",
  "Re-engagement",
] as const

const CAMPAIGN_DOT_COLORS = [
  "#3A7FBF",
  "#C17B3F",
  "#3A9459",
  "#7B5EA8",
  "#EA580C",
]

function weekOfMonthLabel(dayOfMonth: number): string {
  const w = Math.min(4, Math.max(1, Math.ceil(dayOfMonth / 7.5)))
  return `Week ${w} of 4`
}

function formatBestWindowFromPeak(hourly: number[], seed: number): string {
  let maxI = 0
  let maxV = -1
  hourly.forEach((v, i) => {
    if (v > maxV) {
      maxV = v
      maxI = i
    }
  })
  const startH = 6 + maxI
  const endH = Math.min(23, startH + 2)
  const label = (h: number) => {
    const p = h >= 12 ? "pm" : "am"
    const x = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${x}${p}`
  }
  const delivery = Math.round(88 + pseudoRandom(seed + maxI + 99) * 12)
  return `${label(startH)} – ${label(endH)} · ${delivery}% delivery · peak engagement`
}

export function buildIntentCalendarDrawerDay(
  day: CalendarDayForDrawer,
  ctx: {
    monthStart: Date
    intentBuckets: string[]
    stableSeed: number
  }
): IntentCalendarDrawerDay {
  const { monthStart, intentBuckets, stableSeed } = ctx
  const cal = new Date(monthStart)
  cal.setDate(day.date)

  const dateStr = format(cal, "EEEE, MMM d")
  const weekStr = weekOfMonthLabel(day.date)
  const trend: "up" | "down" =
    day.score >= 50 + Math.round(pseudoRandom(stableSeed) * 15) ? "up" : "down"
  const patternInsight =
    trend === "up"
      ? "Intent is trending above your 30-day baseline—prioritize follow-ups while momentum holds."
      : "Intent cooled versus baseline—consider refreshing creative or narrowing segments."

  const campaigns: IntentCalendarDrawerCampaign[] = day.campaigns.map((c, i) => ({
    name: c.name,
    templateType:
      TEMPLATE_TYPES[
        Math.floor(pseudoRandom(stableSeed + i * 3) * TEMPLATE_TYPES.length)
      ]!,
    score: c.score,
    color: CAMPAIGN_DOT_COLORS[i % CAMPAIGN_DOT_COLORS.length]!,
  }))

  const hourlyEngagement = Array.from({ length: 18 }, (_, h) =>
    Math.round(12 + pseudoRandom(stableSeed + h * 31 + 7) * 88)
  )
  const bestWindow = formatBestWindowFromPeak(hourlyEngagement, stableSeed)

  const signals: IntentCalendarDrawerSignal[] = intentBuckets.map((name, i) => {
    const count =
      day.contacts[i] ?? Math.round(pseudoRandom(stableSeed + i * 5) * 40)
    const actions = ["Nurture", "Reach out", "Hot lead", "Schedule", "Review"] as const
    const action = actions[i % actions.length]!
    const palettes = [
      { bg: "bg-blue-500/15", color: "text-blue-700" },
      { bg: "bg-amber-500/15", color: "text-amber-800" },
      { bg: "bg-emerald-500/15", color: "text-emerald-800" },
      { bg: "bg-violet-500/15", color: "text-violet-800" },
      { bg: "bg-slate-500/15", color: "text-slate-700" },
    ] as const
    const pal = palettes[i % palettes.length]!
    return {
      name,
      color: CAMPAIGN_DOT_COLORS[i % CAMPAIGN_DOT_COLORS.length]!,
      count,
      action,
      actionBg: pal.bg,
      actionColor: pal.color,
    }
  })

  return {
    date: dateStr,
    week: weekStr,
    score: day.score,
    trend,
    patternInsight,
    campaigns,
    hourlyEngagement,
    bestWindow,
    signals,
    unacted: day.unacted,
  }
}
