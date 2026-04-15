"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

/** Figma PlYsn2j4gbkftQibcUwJNf / node 75:184 — MCP assets (~7d TTL). */
const IMG_INFO_16 =
  "https://www.figma.com/api/mcp/asset/76fa4b78-a20f-4599-a67d-56a001571b39"
const IMG_INFO_12 =
  "https://www.figma.com/api/mcp/asset/cb4b262e-cda9-4c75-ab8e-e700feea78c1"
const IMG_WORKFLOW =
  "https://www.figma.com/api/mcp/asset/8f545dc4-5b3a-4d8e-b089-a9f673c52960"
const IMG_CLAP =
  "https://www.figma.com/api/mcp/asset/1176ea68-d019-4a19-8c31-da487a67aa60"

function InfoIcon({
  className,
  size = "16",
}: {
  className?: string
  size?: "12" | "16"
}) {
  const isSm = size === "12"
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden",
        isSm ? "size-3" : "size-4",
        className
      )}
      data-node-id={isSm ? "75:622" : "75:619"}
    >
      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          isSm ? "size-2.5" : "size-3.5"
        )}
      >
        <img
          alt=""
          src={isSm ? IMG_INFO_12 : IMG_INFO_16}
          className="absolute inset-0 block size-full max-w-none"
          data-node-id={isSm ? "75:636" : "75:633"}
        />
      </span>
    </span>
  )
}

function VsIndustryFooter({ dataNodeId }: { dataNodeId: string }) {
  return (
    <p
      className="w-fit self-start text-xs font-medium leading-4 text-[#23a455]"
      data-node-id={dataNodeId}
    >
      <span className="text-[#848a86]">vs</span>
      <span className="text-[#848a86]"> </span>
      <span className="text-[#505451]">1.3:1 industry avg</span>
    </p>
  )
}

function parseRevenueK(s: string): number {
  const m = s.match(/\$?([\d.]+)\s*k/i)
  if (m) return parseFloat(m[1]) * 1000
  return 0
}

function parseRoasRatio(s: string): number {
  const m = s.match(/^([\d.]+)\s*:\s*1/i)
  return m ? parseFloat(m[1]) : 0
}

function pctGrowthThenToNow(then: number, now: number): string {
  if (then === 0) return now > 0 ? "+100%" : "+0%"
  const p = Math.round(((now - then) / then) * 100)
  return `${p >= 0 ? "+" : ""}${p}%`
}

function expandMonthLabel(shortMonth: string): string {
  const [mon, yy] = shortMonth.split(/\s+/)
  const y = parseInt(yy ?? "0", 10)
  const year = Number.isFinite(y) && y < 100 ? 2000 + y : y
  return `${mon} ${year}`
}

const MONTH_LONG: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
}

function monthYearFull(shortMonth: string): string {
  const [abbr, yyRaw] = shortMonth.split(/\s+/)
  const y = parseInt(yyRaw ?? "0", 10)
  const year = Number.isFinite(y) && y < 100 ? 2000 + y : y
  const long = MONTH_LONG[abbr ?? ""] ?? abbr ?? ""
  return `${long} ${year}`
}

type MilestoneDef = {
  monthIdx: number
  color: string
  label: string
  nudgeX?: number
}

/** 12 stops on the strip — indices align with `snapshots` (May 25 → Apr 26). */
const STRIP_STOPS = 12
const STRIP_LAST = STRIP_STOPS - 1

const MILESTONES: MilestoneDef[] = [
  { monthIdx: 0, color: "#34A853", label: "First dollar made" },
  { monthIdx: 0, color: "#1877F2", label: "First lead qualified", nudgeX: 9 },
  { monthIdx: 0, color: "#FBBC05", label: "First purchase closed", nudgeX: 18 },
  { monthIdx: 2, color: "#1877F2", label: "100 leads milestone" },
  { monthIdx: 4, color: "#34A853", label: "$10k revenue crossed" },
  { monthIdx: 5, color: "#E24B4A", label: "ROAS hit 3:1" },
  { monthIdx: 7, color: "#1877F2", label: "400 leads milestone" },
  { monthIdx: 8, color: "#4ADE80", label: "Top 10% across Wati" },
  { monthIdx: 9, color: "#34A853", label: "$40k revenue crossed" },
  { monthIdx: 10, color: "#8B5CF6", label: "600 leads milestone" },
]

function FilmstripTimeTravel({
  currentIndex,
  onIndexChange,
  snapshots,
}: {
  currentIndex: number
  onIndexChange: (i: number) => void
  snapshots: readonly {
    month: string
    revenue: string
    leads: number
    purchases: number
    roas: string
  }[]
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  /** 12 stops — snap to the segment under the pointer (same grid as flex segments). */
  const indexFromClientX = useCallback((clientX: number) => {
    const el = stripRef.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const w = r.width
    if (w <= 0) return 0
    const x = Math.min(Math.max(clientX - r.left, 0), w)
    const segW = w / STRIP_STOPS
    return Math.min(STRIP_LAST, Math.max(0, Math.floor(x / segW)))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      onIndexChange(indexFromClientX(e.clientX))
    }
    const onUp = () => setDragging(false)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [dragging, indexFromClientX, onIndexChange])

  const onStripPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-filmstrip-handle]")) return
    const idx = indexFromClientX(e.clientX)
    onIndexChange(idx)
    setDragging(true)
    try {
      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onHandlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setDragging(true)
    onIndexChange(indexFromClientX(e.clientX))
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const atStripEnd = currentIndex >= STRIP_LAST
  const handleLeftPct = atStripEnd
    ? 100
    : ((currentIndex + 0.5) / STRIP_STOPS) * 100
  const rangeStartLabel = monthYearFull(snapshots[0]!.month)
  const rangeEndLabel = monthYearFull(snapshots[STRIP_LAST]!.month)

  return (
    <div
      className="flex w-full shrink-0 flex-col gap-[10px] overflow-hidden rounded-br-[12px] rounded-bl-[12px] border border-solid border-[#e7e9e8] bg-white pt-[18px] pr-7 pb-4 pl-6"
      data-node-id="117:2622"
    >
      <div
        className="flex shrink-0 flex-col justify-center leading-none text-xs font-medium whitespace-nowrap text-[#505451]"
        data-node-id="117:2623"
      >
        <p className="leading-4">Rewind & see the progress</p>
      </div>
      <div
        className="relative flex w-full select-none items-center gap-2 py-1"
        data-node-id="117:2624"
      >
          <span className="max-w-[5.5rem] shrink-0 text-right text-xs leading-4 text-[#848a86] sm:max-w-none">
            {rangeStartLabel}
          </span>
          <div className="relative min-w-0 flex-1">
            <div className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F5F5F0] px-[3px] py-px [border-width:0.5px]">
              <div
                ref={stripRef}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={STRIP_LAST}
                aria-valuenow={currentIndex}
                aria-label="Time travel month"
                className="relative h-4 w-full cursor-pointer touch-none"
                onPointerDown={onStripPointerDown}
              >
          {/* Perforations */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-0"
            style={{ top: 2 }}
          >
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={`t-${i}`}
                className="shrink-0 rounded-[1px] border border-[#E0E0E0] bg-white [border-width:0.5px]"
                style={{ width: 4, height: 3 }}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-0"
            style={{ bottom: 2 }}
          >
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={`b-${i}`}
                className="shrink-0 rounded-[1px] border border-[#E0E0E0] bg-white [border-width:0.5px]"
                style={{ width: 4, height: 3 }}
              />
            ))}
          </div>

          {/* Frame segments */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: STRIP_STOPS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-full flex-1 border-[#EBEBEB] [border-right-width:0.5px] transition-[background] duration-[40ms] last:border-r-0",
                  i < currentIndex ? "bg-[rgba(24,119,242,0.06)]" : "bg-transparent"
                )}
              />
            ))}
          </div>

          {/* Milestones */}
          {MILESTONES.map((m, mi) => {
            const leftPct = ((m.monthIdx + 0.5) / STRIP_STOPS) * 100
            const lit = m.monthIdx <= currentIndex
            const monthStr = expandMonthLabel(snapshots[m.monthIdx]!.month)
            return (
              <div
                key={mi}
                role="presentation"
                className="group pointer-events-auto absolute top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(${leftPct}% + ${m.nudgeX ?? 0}px)`,
                  opacity: lit ? 1 : 0.2,
                  transition: "opacity 0.2s",
                }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  setDragging(true)
                  onIndexChange(m.monthIdx)
                }}
              >
                <div
                  className={cn(
                    "origin-center rounded-[1px] border border-white [border-width:0.5px] transition-transform duration-150",
                    !dragging && "group-hover:scale-y-[1.4]"
                  )}
                  style={{
                    width: 4,
                    height: 8,
                    backgroundColor: m.color,
                  }}
                />
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 min-w-max -translate-x-1/2 transition-opacity duration-150",
                    dragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <div className="relative rounded-md bg-[#1a1a1a] px-2 py-[5px] text-[10px] leading-tight text-white">
                    <div>{m.label}</div>
                    <div className="mt-0.5 text-[9px] text-[#555]">
                      {monthStr}
                    </div>
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "4px solid #1a1a1a",
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
              </div>
            </div>
            {/* Grip: sibling of overflow-hidden shell so tall hit area is not clipped; still over bar */}
            <button
              type="button"
              data-filmstrip-handle
              className={cn(
                "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-[0.5px] border-white/[0.08] bg-gradient-to-b from-[#38383c] to-[#171719]",
                "touch-manipulation shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.28),0_0.5px_0_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.22),0_4px_14px_rgba(0,0,0,0.08)]",
                "box-border h-3 w-[14px] shrink-0 p-0",
                atStripEnd ? "-translate-x-full" : "-translate-x-1/2",
                dragging
                  ? "scale-[1.06] cursor-grabbing shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.32),0_0.5px_0_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.12)]"
                  : "cursor-grab hover:scale-[1.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.3),0_0.5px_0_rgba(0,0,0,0.38),0_2px_6px_rgba(0,0,0,0.22),0_6px_16px_rgba(0,0,0,0.1)] active:scale-[1.06] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.32),0_0.5px_0_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.12)]"
              )}
              style={{
                left: `calc(3px + (100% - 6px) * ${handleLeftPct / 100})`,
                transition: dragging
                  ? "left 0s linear, transform 0.22s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.22s ease-out"
                  : "left 75ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.22s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.22s ease-out",
              }}
              aria-label="Scrub timeline"
              onPointerDown={onHandlePointerDown}
            >
              <span className="flex items-center gap-px" aria-hidden>
                <span className="h-[5px] w-px rounded-full bg-white/[0.38] shadow-[0_0.5px_0_rgba(255,255,255,0.15)]" />
                <span className="h-[5px] w-px rounded-full bg-white/[0.38] shadow-[0_0.5px_0_rgba(255,255,255,0.15)]" />
                <span className="h-[5px] w-px rounded-full bg-white/[0.38] shadow-[0_0.5px_0_rgba(255,255,255,0.15)]" />
              </span>
            </button>
          </div>
          <span className="max-w-[5.5rem] shrink-0 text-left text-xs leading-4 text-[#353735] sm:max-w-none">
            {rangeEndLabel}
          </span>
      </div>
    </div>
  )
}

function KpiGhostRow({
  show,
  ghostText,
  deltaText,
}: {
  show: boolean
  ghostText: string
  deltaText: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[5px] [margin-top:3px]",
        show && "min-h-[18px]"
      )}
    >
      {show ? (
        <>
          <span className="text-[12px] text-[#D0D0D0]">{ghostText}</span>
          <span className="text-[10px] font-medium text-[#1A7A45]">
            {deltaText}
          </span>
        </>
      ) : null}
    </div>
  )
}

/** Figma 75:183 (frame) + 75:184 (card). Filmstrip time-travel sits below the KPI row. */
export function AdsLifetimeSummaryCard() {
  const snapshots = [
    { month: "May 25", revenue: "$3.4k", leads: 45, purchases: 22, roas: "2.1:1" },
    { month: "Jun 25", revenue: "$5.8k", leads: 72, purchases: 38, roas: "2.4:1" },
    { month: "Jul 25", revenue: "$8.2k", leads: 110, purchases: 58, roas: "2.7:1" },
    { month: "Aug 25", revenue: "$11.4k", leads: 162, purchases: 88, roas: "2.9:1" },
    { month: "Sep 25", revenue: "$16.2k", leads: 224, purchases: 128, roas: "3.1:1" },
    { month: "Oct 25", revenue: "$21.8k", leads: 298, purchases: 172, roas: "3.3:1" },
    { month: "Nov 25", revenue: "$27.4k", leads: 362, purchases: 214, roas: "3.5:1" },
    { month: "Dec 25", revenue: "$33.1k", leads: 420, purchases: 258, roas: "3.6:1" },
    { month: "Jan 26", revenue: "$38.8k", leads: 484, purchases: 298, roas: "3.8:1" },
    { month: "Feb 26", revenue: "$44.2k", leads: 544, purchases: 352, roas: "4.0:1" },
    { month: "Mar 26", revenue: "$48.6k", leads: 590, purchases: 398, roas: "4.1:1" },
    { month: "Apr 26", revenue: "$51.8k", leads: 620, purchases: 428, roas: "4.2:1" },
  ] as const

  const [currentIndex, setCurrentIndex] = useState(11)
  const today = snapshots[11]!
  const past = currentIndex < 11 ? snapshots[currentIndex]! : null

  const revNow = parseRevenueK(today.revenue)
  const revThen = past ? parseRevenueK(past.revenue) : 0
  const roasNow = parseRoasRatio(today.roas)
  const roasThen = past ? parseRoasRatio(past.roas) : 0
  const roasPrimary = today.roas.replace(/:1\s*$/i, "")

  const showGhost = currentIndex < 11 && past !== null

  return (
    <div
      className="flex w-full flex-col items-start justify-start bg-white py-2"
      data-node-id="75:183"
    >
      <section
        className="flex w-full shrink-0 flex-col items-start gap-1 overflow-hidden rounded-[8px] bg-white py-3"
        data-node-id="75:184"
      >
        <div
          className="flex w-full shrink-0 flex-col items-start overflow-hidden"
          data-node-id="75:185"
        >
          {/* Figma PlYsn2j4gbkftQibcUwJNf / node 117:2558 */}
          <div
            className="flex w-full shrink-0 flex-col items-start pb-4"
            data-node-id="117:2558"
          >
            <div
              className="flex w-full max-w-[388px] flex-col gap-1.5 overflow-hidden bg-white"
              data-node-id="117:2559"
            >
              <div
                className="flex shrink-0 flex-col justify-center leading-none"
                data-node-id="128:2924"
              >
                <p className="font-['JetBrains_Mono',monospace] text-[14px] font-medium leading-5 text-[#0c70ea]">
                  389 days
                </p>
              </div>
              <div
                className="flex w-full flex-col bg-white"
                data-node-id="117:2560"
              >
                {/* Figma metadata: node 117:2561 — 298×78 */}
                <div
                  className="flex w-[298px] shrink-0 flex-col justify-center leading-[0] text-[#1b1d1c]"
                  data-node-id="117:2561"
                >
                  <p className="text-2xl font-semibold leading-[26px]">
                    Since you&apos;ve connected your Ad accounts with Wati
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mb-3 mt-[18px] text-[13px] font-semibold leading-5 text-[#848a86]">
            Together we&apos;ve
          </p>
        </div>

        <div
          className="mb-3 mt-px w-full shrink-0 pb-0"
          data-node-id="79:1049"
        >
          <div
            className="flex w-full min-w-0 flex-1 items-stretch gap-3 overflow-hidden rounded-t-[12px] border border-b-0 border-[#e7e9e8] bg-white"
            data-node-id="81:1141"
          >
            {/* 1 — Revenue from conversations */}
            <div
              className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 border-r border-[#e7e9e8] px-6 py-4"
              data-node-id="81:1149"
            >
              <div
                className="flex shrink-0 items-center gap-1 overflow-hidden"
                data-node-id="81:1150"
              >
                <p
                  className="shrink-0 text-sm font-normal leading-5 text-[#505451]"
                  data-node-id="81:1151"
                >
                  Revenue from conversations
                </p>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-sm text-[#505451] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="About revenue from conversations"
                    >
                      <InfoIcon size="12" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-64 text-[13px] leading-relaxed">
                    <p className="text-popover-foreground">
                      Revenue attributed to chat conversations in this lifetime
                      window.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <p
                className="font-['JetBrains_Mono',monospace] text-[32px] font-normal leading-none tracking-[-3.84px] text-[#1a1a1a]"
                data-node-id="81:1153"
              >
                {today.revenue}
              </p>
              <KpiGhostRow
                show={showGhost}
                ghostText={past?.revenue ?? ""}
                deltaText={pctGrowthThenToNow(revThen, revNow)}
              />
              <div
                className="flex shrink-0 items-center gap-1"
                data-node-id="88:1746"
              >
                <div
                  className="inline-flex shrink-0 items-center gap-0.5 rounded-full py-0.5"
                  data-node-id="88:1747"
                >
                  <span
                    className="relative size-4 shrink-0"
                    data-node-id="88:1748"
                  >
                    <img
                      alt=""
                      src={IMG_CLAP}
                      className="absolute inset-0 block size-full max-w-none"
                    />
                  </span>
                  <span
                    className="whitespace-nowrap text-xs font-normal leading-4 text-[#1b1d1c]"
                    data-node-id="88:1751"
                  >
                    You&apos;re in top 10% across Wati
                  </span>
                </div>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-sm text-[#353735] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="More information about top 10% ranking"
                    >
                      <InfoIcon />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-64 text-[13px] leading-relaxed">
                    <p className="text-popover-foreground">
                      Compared to other Wati workspaces with connected ad
                      accounts.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            {/* 2 — Leads qualified */}
            <div
              className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 px-6 py-4"
              data-node-id="81:1142"
            >
              <div
                className="flex shrink-0 items-center gap-1 overflow-hidden"
                data-node-id="81:1143"
              >
                <div
                  className="size-2.5 shrink-0 bg-[#213b89]"
                  data-node-id="88:1562"
                  aria-hidden
                />
                <p
                  className="shrink-0 text-sm font-normal leading-5 text-[#505451]"
                  data-node-id="81:1144"
                >
                  Leads qualified
                </p>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-sm text-[#505451] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="About leads qualified"
                    >
                      <InfoIcon size="12" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-64 text-[13px] leading-relaxed">
                    <p className="text-popover-foreground">
                      Leads that met your qualification rules in this lifetime
                      window.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <p
                className="font-['JetBrains_Mono',monospace] text-[32px] font-normal leading-none tracking-[-3.84px] text-[#1a1a1a]"
                data-node-id="81:1146"
              >
                {today.leads}
              </p>
              <KpiGhostRow
                show={showGhost}
                ghostText={String(past?.leads ?? "")}
                deltaText={pctGrowthThenToNow(past?.leads ?? 0, today.leads)}
              />
              <div
                className="inline-flex w-fit max-w-full shrink-0 items-center gap-1.5 self-start py-0.5"
                data-node-id="81:1196"
              >
                <span className="relative size-3 shrink-0" data-node-id="81:1206">
                  <img
                    alt=""
                    src={IMG_WORKFLOW}
                    className="absolute inset-0 block size-full max-w-none"
                  />
                </span>
                <span className="whitespace-nowrap text-xs font-medium leading-4 text-[#353735]">
                  342 qualified automatically
                </span>
              </div>
            </div>

            {/* 3 — Qualified purchases */}
            <div
              className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 border-l border-[#e7e9e8] px-6 py-4"
              data-node-id="81:1163"
            >
              <div
                className="flex shrink-0 items-center gap-1 overflow-hidden"
                data-node-id="81:1164"
              >
                <div
                  className="size-2.5 shrink-0 bg-[#353735]"
                  data-node-id="88:1560"
                  aria-hidden
                />
                <p
                  className="shrink-0 text-sm font-normal leading-5 text-[#505451]"
                  data-node-id="81:1165"
                >
                  Qualified purchases
                </p>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-sm text-[#505451] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="About qualified purchases"
                    >
                      <InfoIcon size="12" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-64 text-[13px] leading-relaxed">
                    <p className="text-popover-foreground">
                      Purchases attributed in this lifetime window.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <p
                className="font-['JetBrains_Mono',monospace] text-[32px] font-normal leading-none tracking-[0.32px] text-[#1a1a1a]"
                data-node-id="81:1167"
              >
                {today.purchases}
              </p>
              <KpiGhostRow
                show={showGhost}
                ghostText={String(past?.purchases ?? "")}
                deltaText={pctGrowthThenToNow(
                  past?.purchases ?? 0,
                  today.purchases
                )}
              />
              <p
                className="w-fit self-start text-xs leading-4 text-[#eb991f]"
                data-node-id="81:1169"
              >
                <span className="font-medium text-[#848a86]">vs </span>
                <span className="font-['JetBrains_Mono',monospace] text-xs font-medium leading-4 text-[#505451]">
                  1hr
                </span>
                <span className="font-medium text-[#505451]"> industry avg</span>
              </p>
            </div>

            {/* 4 — Return on spend */}
            <div
              className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 border-l border-[#e7e9e8] px-6 py-4"
              data-node-id="81:1156"
            >
              <div
                className="flex shrink-0 items-center gap-1 overflow-hidden"
                data-node-id="81:1157"
              >
                <p
                  className="shrink-0 text-sm font-normal leading-5 text-[#505451]"
                  data-node-id="81:1158"
                >
                  Return on spend
                </p>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-sm text-[#505451] outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="About return on spend"
                    >
                      <InfoIcon size="12" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-64 text-[13px] leading-relaxed">
                    <p className="text-popover-foreground">
                      Blended return on ad spend for this lifetime window.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div
                className="font-['JetBrains_Mono',monospace] font-normal leading-none text-[#1a1a1a]"
                data-node-id="81:1160"
              >
                <p className="leading-none">
                  <span className="text-[32px] tracking-[-3.84px]">
                    {roasPrimary}
                  </span>
                  <span className="text-xl tracking-[-2.4px] text-[#848a86]">
                    :1
                  </span>
                </p>
              </div>
              <KpiGhostRow
                show={showGhost}
                ghostText={past?.roas ?? ""}
                deltaText={pctGrowthThenToNow(roasThen, roasNow)}
              />
              <VsIndustryFooter dataNodeId="81:1162" />
            </div>
          </div>

          <FilmstripTimeTravel
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            snapshots={snapshots}
          />
        </div>
      </section>
    </div>
  )
}

export const LifetimeMetricsCard = AdsLifetimeSummaryCard
