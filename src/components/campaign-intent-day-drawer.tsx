import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { IntentCalendarDrawerDay } from "@/components/intent-calendar-drawer-data"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

/** Matches `ChartTooltipContent` shell: light card, same as performance bar chart tooltips. */
function HourBarTooltipContent({
  className,
  children,
  side = "top",
  sideOffset = 2,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={sideOffset}
        collisionPadding={4}
        className={cn(
          "z-[120] max-w-[260px] min-w-32 origin-(--radix-tooltip-content-transform-origin)",
          "grid items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-left text-xs text-foreground shadow-xl",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

function hourlyBarsPeakMask(values: number[]): boolean[] {
  if (values.length === 0) return []
  const sorted = [...values].sort((a, b) => a - b)
  const cut = Math.max(0, Math.floor(sorted.length * 0.8) - 1)
  const threshold = sorted[cut] ?? 0
  return values.map((v) => v >= threshold)
}

function scoreToneClass(score: number) {
  if (score > 70) return "text-green-600"
  if (score > 45) return "text-amber-600"
  return "text-destructive"
}

function campaignScoreClass(score: number) {
  if (score > 70) return "text-green-600"
  if (score > 45) return "text-amber-600"
  return "text-destructive"
}

const HOUR_TICK_LABELS = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"] as const

/** Bar index 0 = 6:00–7:00, … 17 = 23:00–24:00. */
function formatHour12(hour24: number): string {
  const h = ((hour24 % 24) + 24) % 24
  if (h === 0) return "12am"
  if (h < 12) return `${h}am`
  if (h === 12) return "12pm"
  return `${h - 12}pm`
}

function hourSlotRangeLabel(barIndex: number): string {
  const start = 6 + barIndex
  const end = start + 1
  return `${formatHour12(start)} – ${formatHour12(end)}`
}

/** Tooltip copy tied to day intent score, peak bars, and hourly engagement. */
function bestWindowBarIntentNote(
  dayScore: number,
  engagement: number,
  isPeak: boolean
): string {
  if (isPeak) {
    if (dayScore > 70) {
      return "Peak hour on a high-intent day—strong moment to reach contacts while intent is elevated."
    }
    if (dayScore > 45) {
      return "Top engagement window for this day; line up sends here before quieter slots."
    }
    return "Strongest relative activity today—even with softer day-level intent, this hour outperforms the rest."
  }
  if (engagement >= 55) {
    return "Above-average activity for this day; good secondary slot for staggered or follow-up sends."
  }
  return "Lower relative engagement; use for batch sends or tests rather than priority outreach."
}

export type CampaignIntentDayDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: IntentCalendarDrawerDay | null
}

export function CampaignIntentDayDrawer({
  open,
  onOpenChange,
  day,
}: CampaignIntentDayDrawerProps) {
  const peakMask = React.useMemo(
    () => (day ? hourlyBarsPeakMask(day.hourlyEngagement) : []),
    [day]
  )

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="right"
      modal={false}
      shouldScaleBackground={false}
    >
      <DrawerContent
        hideOverlay
        className={cn(
          "right-drawer !mt-0 flex h-screen max-h-screen w-[380px] !max-w-[380px] flex-col rounded-none border-0 border-l border-border bg-popover shadow-lg",
          "data-[vaul-drawer-direction=right]:w-[380px]",
          "data-[vaul-drawer-direction=right]:sm:max-w-[380px]"
        )}
      >
        {day ? (
          <>
            <DrawerHeader
              className={cn(
                "shrink-0 space-y-0 border-b border-border px-5 pt-5 pb-4 text-left"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start justify-between gap-4 pr-1">
                  <div className="min-w-0">
                    <DrawerTitle className="text-base font-medium leading-snug">
                      {day.date}
                    </DrawerTitle>
                    <DrawerDescription className="mt-1 text-sm text-muted-foreground">
                      {day.week}
                    </DrawerDescription>
                  </div>
                  <div className="shrink-0 text-right">
                    <div
                      className={cn(
                        "text-5xl font-semibold leading-none tabular-nums",
                        scoreToneClass(day.score)
                      )}
                    >
                      {day.score}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      intent score
                    </div>
                  </div>
                </div>
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    aria-label="Close"
                  >
                    <XIcon className="size-4" />
                  </Button>
                </DrawerClose>
              </div>
              <div className="mt-4 rounded-md bg-muted px-2.5 py-2 text-sm leading-snug text-muted-foreground">
                <span className="mr-1 inline-block" aria-hidden>
                  {day.trend === "up" ? "↗" : "↘"}
                </span>
                {day.patternInsight}
              </div>
            </DrawerHeader>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
              <section className="border-b border-border px-5 py-4">
                <h3 className="mb-3 text-xs font-medium text-muted-foreground">
                  Campaigns sent
                </h3>
                <div className="flex flex-col gap-y-3">
                  {day.campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No campaigns this day
                    </p>
                  ) : (
                    day.campaigns.map((c) => (
                      <div
                        key={c.name + c.templateType}
                        className="flex gap-2"
                      >
                        <span
                          className="mt-2 size-[6px] shrink-0 rounded-none"
                          style={{ backgroundColor: c.color }}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-tight text-foreground">
                            {c.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {c.templateType}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-medium tabular-nums",
                            campaignScoreClass(c.score)
                          )}
                        >
                          {c.score}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="border-b border-border px-5 py-6">
                <h3 className="mb-3 text-xs font-medium text-muted-foreground">
                  Best send window · your data
                </h3>
                <div className="flex flex-col gap-y-4">
                  <TooltipProvider delayDuration={200} skipDelayDuration={200}>
                    <div className="flex min-h-[52px] items-end gap-0.5 py-3">
                      {day.hourlyEngagement.map((v, i) => {
                        const isPeak = peakMask[i] ?? false
                        return (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "flex min-h-[52px] min-w-0 flex-1 flex-col justify-end rounded-sm border-0 bg-transparent p-0",
                                  "cursor-pointer outline-none transition-opacity hover:opacity-90",
                                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                )}
                                aria-label={`${hourSlotRangeLabel(i)}, engagement ${v}`}
                              >
                                <div
                                  className={cn(
                                    "w-full rounded-t-[2px] transition-colors",
                                    isPeak ? "bg-green-600" : "bg-muted"
                                  )}
                                  style={{
                                    height: `${Math.max(10, (v / 100) * 48)}px`,
                                  }}
                                />
                              </button>
                            </TooltipTrigger>
                            <HourBarTooltipContent side="top" sideOffset={2}>
                              <p className="font-medium leading-tight text-foreground">
                                {hourSlotRangeLabel(i)}
                              </p>
                              <p className="leading-snug text-muted-foreground">
                                Engagement index ·{" "}
                                <span className="font-medium tabular-nums text-foreground">
                                  {v}
                                </span>
                                {isPeak ? (
                                  <span className="ml-1.5 font-medium text-green-600">
                                    · Peak window
                                  </span>
                                ) : null}
                              </p>
                              <p className="border-t border-border/50 pt-1.5 leading-snug text-muted-foreground">
                                {bestWindowBarIntentNote(
                                  day.score,
                                  v,
                                  isPeak
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Day intent score ·{" "}
                                <span className="font-medium tabular-nums text-foreground">
                                  {day.score}
                                </span>
                              </p>
                            </HourBarTooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </TooltipProvider>
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    {HOUR_TICK_LABELS.map((lb) => (
                      <span key={lb}>{lb}</span>
                    ))}
                  </div>
                  <div className="inline-flex w-fit rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    {day.bestWindow}
                  </div>
                </div>
              </section>

              <section className="border-b border-border px-5 py-4 pb-[20px] last:border-b-0">
                <h3 className="mb-3 text-xs font-medium text-muted-foreground">
                  Intent signals
                </h3>
                <div className="flex flex-col gap-y-3">
                  {day.signals.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="size-[6px] shrink-0 rounded-none"
                        style={{ backgroundColor: s.color }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 text-sm text-foreground">
                        {s.name}
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
