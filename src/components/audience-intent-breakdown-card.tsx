import * as React from "react"
import { HelpCircleIcon } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import type { AudienceIntentBreakdown } from "@/data/audience-breakdown"
import {
  INTENT_COLORS,
  INTENT_DISPLAY_LABELS,
  TOTAL_AUDIENCE_IN_DATABASE,
  type IntentSegmentKey,
} from "@/data/audience-breakdown"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString("en-US")

function fmtReachShort(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${m >= 10 ? Math.round(m) : m.toFixed(1)}M`.replace(/\.0M$/, "M")
  }
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return fmt(n)
}

const PIE_SELECTED = "hsl(262 83% 58%)"

type Props = {
  breakdown: AudienceIntentBreakdown
  className?: string
  /** Rendered after the reach pie, before the “Audience intelligence” block */
  betweenPieAndIntelligence?: React.ReactNode
}

export function AudienceIntentBreakdownCard({
  breakdown,
  className,
  betweenPieAndIntelligence,
}: Props) {
  const selected = Math.min(breakdown.total, TOTAL_AUDIENCE_IN_DATABASE)
  const rest = Math.max(0, TOTAL_AUDIENCE_IN_DATABASE - selected)
  const pieRows = React.useMemo(() => {
    if (rest <= 0) {
      return [{ name: "Selected", value: Math.max(selected, 1), fill: PIE_SELECTED }]
    }
    return [
      { name: "Selected", value: selected, fill: PIE_SELECTED },
      { name: "In database", value: rest, fill: "var(--intel-pie-rest)" },
    ]
  }, [selected, rest])

  const selectedPctOfDb =
    TOTAL_AUDIENCE_IN_DATABASE > 0
      ? Math.min(
          100,
          Math.round((selected / TOTAL_AUDIENCE_IN_DATABASE) * 1000) / 10
        )
      : 0

  const intentKeys: readonly IntentSegmentKey[] = [
    "hot",
    "warm",
    "cold",
    "silent",
  ]
  const rows = intentKeys.map((key) => ({
    key,
    label: INTENT_DISPLAY_LABELS[key],
    ...breakdown[key],
    ...INTENT_COLORS[key],
  }))

  return (
    <section
      className={cn(
        "w-full border-0 bg-background text-left shadow-none [--intel-pie-rest:#e5e7eb] dark:[--intel-pie-rest:oklch(0.269_0_0)]",
        className
      )}
      aria-label="Audience intelligence breakdown"
    >
      <div className="px-0 pt-1 pb-4">
        <div className="relative mx-auto aspect-square w-[min(200px,100%)] max-w-[220px]">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={pieRows}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={pieRows.length > 1 ? 1 : 0}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {pieRows.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-6 text-center">
            <span className="text-lg font-semibold tabular-nums leading-tight tracking-tight text-foreground">
              {fmtReachShort(selected)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              of {fmtReachShort(TOTAL_AUDIENCE_IN_DATABASE)}
            </span>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {selectedPctOfDb}% selected
            </span>
          </div>
        </div>
      </div>

      {betweenPieAndIntelligence ? (
        <div className="w-full px-0">{betweenPieAndIntelligence}</div>
      ) : null}

      <div className="px-0 pb-2 pt-[28px]">
        <div className="mb-5 flex flex-wrap items-center gap-1.5 sm:mb-6">
          <p className="text-[12px] font-semibold leading-snug">
            <span className="bg-linear-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-violet-400 dark:to-fuchsia-400">
              Audience intelligence
            </span>
          </p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="About audience intelligence"
              >
                <HelpCircleIcon className="size-3" aria-hidden />
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="top" align="start" className="text-[12px]">
              <p className="leading-snug text-muted-foreground">
                Estimated split by Interested, Curious, Seeking support, and No
                signal.
                Figures update when you change audience segments.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>

        <h3 className="-mt-[6px] mb-3.5 text-[12px] font-normal leading-snug tracking-tight text-muted-foreground">
          Engagement intent signals for the selected audience from past campaigns
        </h3>

        <div className="space-y-2.5" role="list" aria-label="Engagement by intent">
          {rows.map((r) => (
            <div
              key={`bar-${r.key}`}
              className="flex w-full min-w-0 items-center gap-2"
              role="listitem"
            >
              <span className="basis-[9rem] shrink-0 whitespace-nowrap text-left text-[11px] leading-tight text-muted-foreground">
                {r.label}
              </span>
              <div
                className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted/40"
                title={`${r.label} · ${fmt(r.count)} · ${r.pct}%`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${Math.max(r.pct, 0.5)}%`,
                    backgroundColor: r.bar,
                  }}
                />
              </div>
              <div className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: r.text }}
                >
                  {fmt(r.count)}
                </span>
                <span className="text-[11px] text-muted-foreground">{r.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
