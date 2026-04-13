import * as React from "react"

import { cn } from "@/lib/utils"

const DAY_COUNT = 7
const HOUR_INDICES = Array.from({ length: 24 }, (_, i) => i)

const GRID_COLS = "repeat(24, minmax(0, 1fr))" as const

function cellValue(day: number, hour: number): number {
  const weekend = day >= 5
  const night = hour >= 0 && hour < 6
  const lunch = hour >= 11 && hour <= 13
  const evening = hour >= 17 && hour <= 21
  const morning = hour >= 9 && hour <= 10
  let v = 0.1
  if (lunch) v += 0.38
  if (evening) v += 0.44
  if (morning) v += 0.18
  if (night) v *= 0.32
  if (weekend) v *= 0.76
  v *= 0.9 + (((day * 17 + hour * 11) % 19) / 100)
  return Math.min(1, v)
}

const GRID: number[][] = Array.from({ length: DAY_COUNT }, (_, d) =>
  HOUR_INDICES.map((h) => cellValue(d, h))
)
const maxVal = Math.max(...GRID.flat(), 1e-6)

function greenBarColor(t: number): string {
  const pct = Math.round(t * 100)
  return `color-mix(in srgb, hsl(152 58% 32%) ${pct}%, hsl(152 42% 90%))`
}

export function SendWindowHourlyChart({
  className,
  footer,
}: {
  className?: string
  /** e.g. primary action; rendered left-aligned below the recommendation */
  footer?: React.ReactNode
}) {
  return (
    <div className={cn("flex w-full flex-col items-stretch", className)}>
      <div
        className="grid w-full gap-px pb-4 pt-0"
        style={{ gridTemplateColumns: GRID_COLS }}
        role="img"
        aria-label="Seven rows of send activity by hour; hour scale below; stronger green is higher engagement."
      >
        {GRID.map((row, d) => (
          <React.Fragment key={`day-${d}`}>
            {row.map((cell, h) => {
              const t = cell / maxVal
              return (
                <div
                  key={h}
                  className="aspect-square w-full min-w-0 rounded-none"
                  style={{ backgroundColor: greenBarColor(t) }}
                />
              )
            })}
          </React.Fragment>
        ))}

        {HOUR_INDICES.map((h) => (
          <div
            key={`h-${h}`}
            className="flex min-h-4 min-w-0 items-start justify-center pt-0.5"
          >
            {h % 4 === 0 ? (
              <span className="text-[7px] leading-none font-medium text-muted-foreground">
                {h}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="pt-[8px] text-left text-[12px] font-normal leading-snug text-muted-foreground">
        Based on your engagement, intent, and delivery date from the past 30
        days for similar template, we recommend{" "}
        <span className="font-medium text-foreground">Monday, 8:00 PM</span>.
      </p>

      {footer ? (
        <div className="mt-3 flex w-full justify-start">{footer}</div>
      ) : null}
    </div>
  )
}
