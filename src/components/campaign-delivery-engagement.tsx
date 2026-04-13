import type { ReactNode } from "react"
import { Ban, MousePointerClick, Reply } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

/** Shared padding for Campaign delivery and Engagement columns (px-6 py-5). */
const FUNNEL_COL_PAD = "px-6 py-5"
/** Match performance card: lightest border (black-100 / #f2f2f2). */
const FUNNEL_OUTLINE = "border-black-100"
const FUNNEL_RULE = "bg-black-100"
/** Smallest type size in funnel columns — 11px floor per spec. */
const CAP = "text-[11px] leading-[14px]"
/** Gradient text + pill; hover in `.funnel-inline-link` (globals.css). */
const FUNNEL_GRADIENT_LINK_CLASS = cn(
  "funnel-inline-link",
  CAP,
  "font-medium no-underline decoration-transparent",
  "inline-flex items-center rounded-full px-2.5 py-1 align-baseline",
  "focus-visible:outline-none"
)
/** Muted grey text link only (no gradient, no pill). */
const FUNNEL_MUTED_LINK_CLASS = cn(
  CAP,
  "font-medium text-muted-foreground underline-offset-2 transition-colors",
  "hover:text-foreground hover:underline",
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)
/** One width for every bar label + stats spacer so all bars share the same start edge. */
const FUNNEL_LABEL_COL = "w-[72px]"

function FunnelProgressBar({
  value,
  className,
  trackClassName,
  indicatorClassName,
  label,
  labelClassName,
}: {
  value: number
  className?: string
  trackClassName?: string
  indicatorClassName?: string
  label: string
  labelClassName?: string
}) {
  return (
    <div className={cn("relative h-10 w-full min-w-0", className)}>
      <Progress
        value={value}
        className={cn(
          "h-10 rounded-lg bg-[#f3f4f6]",
          trackClassName,
          "[&_[data-slot=progress-indicator]]:rounded-lg [&_[data-slot=progress-indicator]]:rounded-r-none [&_[data-slot=progress-indicator]]:transition-none",
          indicatorClassName
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex h-full items-center justify-start px-2.5">
        <span
          className={cn(
            "text-sm font-normal leading-none",
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

function BarLabelRow({
  label,
  children,
  labelClassName,
  labelColClassName,
}: {
  label: string
  children: ReactNode
  labelClassName?: string
  labelColClassName?: string
}) {
  return (
    <div className="flex gap-4 py-1.5">
      <div
        className={cn(
          "flex shrink-0 flex-col items-end justify-center text-sm leading-none text-[#848a86]",
          labelColClassName ?? FUNNEL_LABEL_COL,
          labelClassName
        )}
      >
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

/** Spacer matching label column so stats align with bar start (same x as header text). */
function LabelColumnSpacer({ className }: { className?: string }) {
  return <div className={cn(FUNNEL_LABEL_COL, "shrink-0", className)} aria-hidden />
}

export function CampaignDeliveryEngagement({
  className,
}: {
  className?: string
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[4px] border p-0 py-0 shadow-none ring-0",
        FUNNEL_OUTLINE,
        className
      )}
    >
      <div className="grid grid-cols-1 items-stretch md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
        {/* Campaign delivery */}
        <div
          className={cn(
            "flex flex-col gap-3 bg-white",
            FUNNEL_COL_PAD,
            FUNNEL_OUTLINE,
            "border-b max-md:rounded-t-[4px] md:rounded-l-[4px] md:border-b-0"
          )}
        >
          <h2 className="mb-3 text-base font-semibold leading-snug text-foreground">
            Campaign delivery
          </h2>

          <BarLabelRow label="Sent">
            <FunnelProgressBar
              value={100}
              indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#e6e7eb]"
              label="3.6k Contacts"
              labelClassName="text-[#353735]"
            />
          </BarLabelRow>

          <div className="flex gap-4 py-1">
            <LabelColumnSpacer />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-base font-medium leading-[22px] text-[#353735]">
                90%
              </p>
              <p className={cn(CAP, "text-[#848a86]")}>Of delivered</p>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-1 pt-0.5",
                  CAP,
                  "text-[#505451]"
                )}
              >
                <span aria-hidden>🚨</span>
                <span>All time high failure rate! </span>
                <a href="#" className={FUNNEL_MUTED_LINK_CLASS}>
                  View breakdown
                </a>
              </div>
            </div>
          </div>

          <BarLabelRow label="Delivered">
            <FunnelProgressBar
              value={46}
              indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#3b83f6]"
              label="1789 Contacts"
              labelClassName="text-white"
            />
          </BarLabelRow>

          <div className="flex gap-4 pt-1">
            <LabelColumnSpacer />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-base font-medium leading-[22px] text-[#353735]">
                90%
              </p>
              <p className={cn(CAP, "text-[#848a86]")}>Of delivered</p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex w-full shrink-0 items-center justify-center gap-3 border-b bg-white py-3 md:relative md:w-12 md:flex-col md:border-b-0 md:py-0",
            FUNNEL_OUTLINE
          )}
        >
          <div className="flex items-center gap-3 md:hidden">
            <Separator className={cn("h-px w-20", FUNNEL_RULE)} />
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border bg-white text-sm font-medium text-[#848a86]",
                FUNNEL_OUTLINE
              )}
            >
              Vs
            </div>
            <Separator className={cn("h-px w-20", FUNNEL_RULE)} />
          </div>
          <Separator
            orientation="vertical"
            className={cn(
              "absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 md:block",
              FUNNEL_RULE
            )}
          />
          <div
            className={cn(
              "relative z-10 hidden size-10 items-center justify-center rounded-full border bg-white text-sm font-medium text-[#848a86] md:my-auto md:flex",
              FUNNEL_OUTLINE
            )}
          >
            Vs
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-3 bg-white",
            FUNNEL_COL_PAD,
            "max-md:rounded-b-[4px] md:rounded-r-[4px]"
          )}
        >
          <h2 className="mb-3 text-base font-semibold leading-snug text-foreground">
            Engagement
          </h2>

          <BarLabelRow label="Opened">
            <FunnelProgressBar
              value={100}
              indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#17a34a]"
              label="3.6k Contacts"
              labelClassName="text-white"
            />
          </BarLabelRow>

          <div className="flex gap-4 py-1">
            <LabelColumnSpacer />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-base font-medium leading-[22px] text-[#353735]">
                90%
              </p>
              <p className={cn(CAP, "text-[#848a86]")}>Of delivered</p>
            </div>
          </div>

          <BarLabelRow label="Read">
            <FunnelProgressBar
              value={56}
              indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#7f5ee1]"
              label="1789 Contacts"
              labelClassName="text-white"
            />
          </BarLabelRow>

          <div className="flex gap-4 py-1">
            <LabelColumnSpacer />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-base font-medium leading-[22px] text-[#353735]">
                90%
              </p>
              <p className={cn(CAP, "text-[#848a86]")}>Of delivered</p>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-1 pt-0.5",
                  CAP,
                  "text-[#505451]"
                )}
              >
                <span aria-hidden>🎉</span>
                <span>All time high read rate </span>
                <a href="#" className={FUNNEL_GRADIENT_LINK_CLASS}>
                  See What&apos;s working
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-4 py-1">
            <LabelColumnSpacer />
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2">
              <FunnelProgressBar
                value={38}
                indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#f3e8d8]"
                label="1789 Contacts"
                labelClassName="text-[#353735]"
              />
              <FunnelProgressBar
                value={38}
                indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#dde6f7]"
                label="1789 Contacts"
                labelClassName="text-[#353735]"
              />
              <FunnelProgressBar
                value={38}
                indicatorClassName="[&_[data-slot=progress-indicator]]:bg-[#e6e8eb]"
                label="1789 Contacts"
                labelClassName="text-[#353735]"
              />
            </div>
          </div>

          <div className="flex gap-4 pb-1">
            <LabelColumnSpacer />
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-medium leading-[22px] text-[#353735]">
                  90%
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-[#505451]",
                    CAP
                  )}
                >
                  <Reply
                    className="size-4 shrink-0 text-[#17a34a]"
                    aria-hidden
                  />
                  <span>Replied</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-medium leading-[22px] text-[#353735]">
                  90%
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-[#505451]",
                    CAP
                  )}
                >
                  <MousePointerClick
                    className="size-4 shrink-0 text-[#3b83f6]"
                    aria-hidden
                  />
                  <span>Button clicks</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-medium leading-[22px] text-[#353735]">
                  90%
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-[#505451]",
                    CAP
                  )}
                >
                  <Ban
                    className="size-4 shrink-0 text-red-500"
                    aria-hidden
                  />
                  <span>No action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
