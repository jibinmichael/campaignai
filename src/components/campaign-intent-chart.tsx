import * as React from "react"

import { cn } from "@/lib/utils"

const COLS = 30

/** One intent row: label, color, 30 daily intensities (0–100). */
export interface IntentRow {
  label: string
  color: string
  values: number[]
}

/** @deprecated Use `IntentRow` */
export type CampaignIntentChartRow = IntentRow

export type CampaignIntentChartProps = {
  data: IntentRow[]
  startDate: Date
  className?: string
}

type TooltipState = {
  x: number
  y: number
  label: string
  date: string
  clicks: number
  color: string
  trendSigned: number
  trendColor: string
} | null

/** JS: 0 Sun … 6 Sat → single letter */
const DAY_LETTER: Record<number, string> = {
  0: "S",
  1: "M",
  2: "T",
  3: "W",
  4: "T",
  5: "F",
  6: "S",
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function formatHeaderDate(d: Date): string {
  return String(d.getDate())
}

function formatTooltipDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function derivedClicks(intensity: number): number {
  return Math.max(0, Math.round((intensity / 100) * 380 + intensity * 0.25))
}

/**
 * diff% = ((value - avg) / avg) * 100; colors per product rules.
 */
function vsAvgTrend(
  label: string,
  value: number,
  rowValues: number[]
): { signed: number; color: string } {
  const slice = rowValues.slice(0, COLS)
  const sum = slice.reduce((a, b) => a + b, 0)
  const avg = sum / COLS
  let signed: number
  if (avg === 0) {
    signed = value === 0 ? 0 : 100
  } else {
    signed = Number((((value - avg) / avg) * 100).toFixed(0))
  }

  if (label === "Enquiry") {
    return { signed, color: "#3A7FBF" }
  }

  const up = signed > 0
  const down = signed < 0

  if (label === "Purchase" && up) return { signed, color: "#3A9459" }
  if (label === "Deal" && up) return { signed, color: "#3A9459" }
  if (label === "Support" && up) return { signed, color: "#C17B3F" }
  if (label === "Passive" && down) return { signed, color: "#3A9459" }

  return { signed, color: "#C17B3F" }
}

export function CampaignIntentChart({
  data,
  startDate,
  className,
}: CampaignIntentChartProps) {
  const [tip, setTip] = React.useState<TooltipState>(null)
  const [tipVisible, setTipVisible] = React.useState(false)

  const columnDates = React.useMemo(
    () => Array.from({ length: COLS }, (_, i) => addDays(startDate, i)),
    [startDate]
  )

  const showTip = React.useCallback(
    (
      e: React.MouseEvent,
      label: string,
      colIndex: number,
      value: number,
      color: string,
      rowValues: number[]
    ) => {
      const d = columnDates[colIndex] ?? addDays(startDate, colIndex)
      const dateStr = formatTooltipDate(d)
      const { signed, color: trendColor } = vsAvgTrend(label, value, rowValues)
      setTip({
        x: e.clientX,
        y: e.clientY,
        label,
        date: dateStr,
        clicks: derivedClicks(value),
        color,
        trendSigned: signed,
        trendColor,
      })
      requestAnimationFrame(() => setTipVisible(true))
    },
    [columnDates, startDate]
  )

  const moveTip = React.useCallback((e: React.MouseEvent) => {
    setTip((prev) =>
      prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
    )
  }, [])

  const hideTip = React.useCallback(() => {
    setTipVisible(false)
    setTip(null)
  }, [])

  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null)

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "88px repeat(30, minmax(0, 1fr))",
    gridTemplateRows: `36px repeat(${data.length}, 40px)`,
  }

  return (
    <div className={cn("w-full min-w-0 bg-transparent", className)}>
      <div className="grid w-full min-w-0" style={gridStyle}>
        {/* Header row */}
        <div
          className="min-h-0 min-w-0 bg-[#FAFAF8]"
          style={{
            height: 36,
            borderRight: "1px solid #EEEEE9",
            borderBottom: "1px solid #EEEEE9",
          }}
          aria-hidden
        />
        {columnDates.map((d, i) => {
          const isMonday = d.getDay() === 1
          const isLast = i === COLS - 1
          return (
            <div
              key={i}
              className="flex min-h-0 min-w-0 flex-col items-center justify-center bg-[#FAFAF8] py-[5px] text-center"
              style={{
                height: 36,
                borderBottom: "1px solid #EEEEE9",
                borderRight: isLast
                  ? undefined
                  : `1px solid ${isMonday ? "#E4E4E0" : "#F4F4F0"}`,
              }}
            >
              <span className="text-[10px] leading-none text-[#BBB]">
                {DAY_LETTER[d.getDay()] ?? ""}
              </span>
              <span
                className="text-[11px] font-medium leading-none"
                style={{ color: isMonday ? "#555" : "#999" }}
              >
                {formatHeaderDate(d)}
              </span>
            </div>
          )
        })}

        {/* Intent rows */}
        {data.map((row, rowIndex) => {
          const isLastRow = rowIndex === data.length - 1
          const values = Array.from({ length: COLS }, (_, i) => row.values[i] ?? 0)

          return (
            <React.Fragment key={row.label}>
              <div
                className="flex min-h-0 min-w-0 items-center gap-[7px] bg-[#FAFAF8] px-[10px]"
                style={{
                  height: 40,
                  borderRight: "1px solid #EEEEE9",
                  borderBottom: isLastRow ? undefined : "1px solid #F8F8F6",
                }}
              >
                <span
                  className="size-[7px] shrink-0 rounded-none"
                  style={{ backgroundColor: row.color }}
                  aria-hidden
                />
                <span className="truncate text-[11px] leading-tight text-[#555]">
                  {row.label}
                </span>
              </div>
              {values.map((v, i) => {
                const clamped = Math.min(100, Math.max(0, v))
                const barH = Math.max(3, (clamped / 100) * 32)
                const baseOpacity = 0.15 + (clamped / 100) * 0.85
                const cellKey = `${row.label}-${i}`
                const isHovered = hoveredKey === cellKey
                const d = columnDates[i]!
                const isMonday = d.getDay() === 1
                const isLastCol = i === COLS - 1

                return (
                  <div
                    key={i}
                    className="flex min-h-0 min-w-0 flex-col bg-white"
                    style={{
                      height: 40,
                      borderRight: isLastCol
                        ? undefined
                        : `1px solid ${isMonday ? "#E4E4E0" : "#F4F4F0"}`,
                      borderBottom: isLastRow
                        ? undefined
                        : "1px solid #F8F8F6",
                    }}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex h-full w-full min-h-0 cursor-pointer flex-row items-end justify-center border-0 bg-transparent px-px py-[3px] outline-none transition-colors",
                        "hover:bg-[#FAFAF8]",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      )}
                      onMouseEnter={(e) => {
                        setHoveredKey(cellKey)
                        showTip(e, row.label, i, clamped, row.color, row.values)
                      }}
                      onMouseMove={(e) => {
                        moveTip(e)
                      }}
                      onMouseLeave={() => {
                        setHoveredKey(null)
                        hideTip()
                      }}
                      aria-label={`${row.label}, ${formatTooltipDate(d)}, ${derivedClicks(clamped)} clicks`}
                    >
                      <span
                        className="block w-full transition-opacity"
                        style={{
                          height: barH,
                          borderRadius: 3,
                          backgroundColor: row.color,
                          opacity: isHovered ? 0.65 : baseOpacity,
                        }}
                      />
                    </button>
                  </div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>

      {tip ? (
        <div
          className="pointer-events-none fixed box-border rounded-[10px] border border-[#E4E4E0] bg-white p-0 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] transition-opacity duration-150 ease-out"
          style={{
            left: tip.x + 12,
            top: tip.y - 8,
            transform: "translateY(-100%)",
            width: 188,
            padding: "12px 14px",
            zIndex: 99,
            opacity: tipVisible ? 1 : 0,
          }}
          role="tooltip"
        >
          <div className="mb-[10px] flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-none"
                style={{ backgroundColor: tip.color }}
                aria-hidden
              />
              <span className="truncate text-xs font-medium text-[#111]">
                {tip.label}
              </span>
            </div>
            <span className="shrink-0 text-[11px] text-[#AAA]">{tip.date}</span>
          </div>
          <div
            className="mb-[10px] h-px w-full shrink-0 bg-[#F0F0EB]"
            aria-hidden
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-medium tabular-nums leading-none text-[#111]">
              {tip.clicks.toLocaleString("en-US")}
            </span>
            <span className="text-[11px] text-[#BBB]">clicks</span>
          </div>
          <div
            className="mt-[10px] text-[11px] font-medium leading-tight"
            style={{ color: tip.trendColor }}
          >
            {tip.trendSigned >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(tip.trendSigned)}% vs avg
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Sample window: 30 days from this start (April 1). */
export const SAMPLE_CAMPAIGN_INTENT_CHART_START_DATE = new Date(2026, 3, 1)

export const SAMPLE_CAMPAIGN_INTENT_CHART_DATA: IntentRow[] = [
  {
    label: "Purchase",
    color: "#C17B3F",
    values: [
      22, 35, 48, 40, 55, 62, 58, 44, 38, 50, 66, 72, 68, 45, 52, 60, 75, 70,
      48, 42, 55, 63, 78, 82, 65, 58, 50, 44, 60, 68,
    ],
  },
  {
    label: "Enquiry",
    color: "#3A7FBF",
    values: [
      45, 42, 38, 55, 48, 40, 35, 50, 58, 44, 42, 38, 48, 52, 45, 40, 35, 42,
      48, 55, 50, 46, 40, 38, 44, 48, 52, 46, 40, 45,
    ],
  },
  {
    label: "Deal",
    color: "#3A9459",
    values: [
      30, 28, 35, 42, 38, 45, 50, 48, 40, 35, 42, 48, 55, 50, 45, 40, 38, 42,
      48, 52, 55, 50, 45, 42, 38, 40, 45, 50, 48, 44,
    ],
  },
  {
    label: "Support",
    color: "#7B5EA8",
    values: [
      18, 22, 20, 25, 28, 24, 20, 18, 22, 26, 24, 20, 18, 22, 25, 28, 24, 22,
      20, 18, 22, 25, 28, 24, 22, 20, 18, 22, 25, 20,
    ],
  },
  {
    label: "Passive",
    color: "#ABABAB",
    values: [
      12, 15, 10, 14, 18, 15, 12, 10, 14, 16, 12, 10, 8, 12, 15, 14, 12, 10,
      14, 16, 12, 10, 12, 14, 16, 12, 10, 8, 12, 10,
    ],
  },
]
