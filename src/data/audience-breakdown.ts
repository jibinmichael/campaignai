/** Shown in create-campaign exclude copy; wire to real filters when available. */
export const EXCLUDE_OVER_MESSAGED_CONTACT_COUNT = 19_350

/** e.g. 19_350 → "19.35K" */
export function fmtContactsK2(n: number): string {
  return `${(n / 1_000).toFixed(2)}K`
}

export function fmtCompactThousands(n: number): string {
  if (n >= 1_000 && n % 1_000 === 0) return `${n / 1_000}K`
  return n.toLocaleString("en-US")
}

export type AudienceIntentBreakdown = {
  total: number
  hot: { count: number; pct: number }
  warm: { count: number; pct: number }
  cold: { count: number; pct: number }
  silent: { count: number; pct: number }
}

/** Total reachable contacts in the database (vs. selected subset in the pie). */
export const TOTAL_AUDIENCE_IN_DATABASE = 2_500_000

/** Default / “all contacts” baseline — matches product reference proportions. */
const BASE: AudienceIntentBreakdown = {
  total: 50_000,
  hot: { count: 4_000, pct: 8 },
  warm: { count: 15_500, pct: 31 },
  cold: { count: 3_000, pct: 6 },
  silent: { count: 27_500, pct: 55 },
}

function fromParts(
  total: number,
  hotPct: number,
  warmPct: number,
  coldPct: number,
  silentPct: number
): AudienceIntentBreakdown {
  const h = Math.round((total * hotPct) / 100)
  const w = Math.round((total * warmPct) / 100)
  const c = Math.round((total * coldPct) / 100)
  const s = total - h - w - c
  return {
    total,
    hot: { count: h, pct: hotPct },
    warm: { count: w, pct: warmPct },
    cold: { count: c, pct: coldPct },
    silent: { count: s, pct: silentPct },
  }
}

const SEGMENT_PRESETS: Record<string, AudienceIntentBreakdown> = {
  "all-contacts": BASE,
  "engaged-30d": fromParts(32_000, 18, 44, 7, 31),
  "sms-opt-in": fromParts(18_000, 12, 38, 9, 41),
}

function averageBreakdown(
  presets: AudienceIntentBreakdown[]
): AudienceIntentBreakdown {
  if (presets.length === 0) return BASE
  if (presets.length === 1) return presets[0]!
  const n = presets.length
  const avgTotal = Math.round(
    presets.reduce((s, p) => s + p.total, 0) / n
  )
  let hot =
    presets.reduce((s, p) => s + p.hot.pct, 0) / n
  let warm =
    presets.reduce((s, p) => s + p.warm.pct, 0) / n
  let cold =
    presets.reduce((s, p) => s + p.cold.pct, 0) / n
  let silent =
    presets.reduce((s, p) => s + p.silent.pct, 0) / n
  const sum = hot + warm + cold + silent
  hot = (hot / sum) * 100
  warm = (warm / sum) * 100
  cold = (cold / sum) * 100
  silent = (silent / sum) * 100
  const h = Math.round(hot)
  const w = Math.round(warm)
  const c = Math.round(cold)
  const si = 100 - h - w - c
  return fromParts(avgTotal, h, w, c, si)
}

export function getAudienceBreakdownForSegments(
  segmentIds: string[]
): AudienceIntentBreakdown {
  const ids = [...new Set(segmentIds)].filter(Boolean).sort()
  if (ids.length === 0) return BASE

  if (ids.length === 1) {
    const id = ids[0]!
    return SEGMENT_PRESETS[id] ?? BASE
  }

  const presets = ids.map((id) => SEGMENT_PRESETS[id] ?? BASE)
  return averageBreakdown(presets)
}

export const INTENT_COLORS = {
  hot: { bar: "#B87333", text: "#B87333" },
  warm: { bar: "#3182CE", text: "#3182CE" },
  cold: { bar: "#E53E3E", text: "#E53E3E" },
  silent: { bar: "#D1D5DB", text: "#4B5563" },
} as const

/** User-facing names for intent segments (internal keys stay hot/warm/cold/silent). */
export const INTENT_DISPLAY_LABELS = {
  hot: "Interested",
  warm: "Curious",
  cold: "Seeking support",
  silent: "No signal",
} as const

export type IntentSegmentKey = keyof typeof INTENT_DISPLAY_LABELS
