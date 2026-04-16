import * as React from "react"

import {
  AdsDateRangeSegmentTabs,
  type AdsDateRangeSegmentTabsProps,
} from "@/components/ads-date-range-segment-tabs"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Same chevron asset as `AdsReportingFiltersRow`. */
const IMG_CHEVRON_DOWN =
  "https://www.figma.com/api/mcp/asset/4c592c00-18f5-48d4-ab50-7d24165d0582"

const outlineMenuButtonClass =
  "inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#d4d4d4] bg-white px-3 py-1.5 text-sm font-medium leading-5 text-[#0a0a0a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-muted/40"

const watiShadowBase =
  "shadow-[0px_1px_2px_-1px_rgba(27,29,28,0.1),0px_1px_3px_0px_rgba(27,29,28,0.1)]"

const jetMonoReg12 =
  "[font-family:'JetBrains_Mono',ui-monospace,monospace] text-xs font-normal leading-4 text-black opacity-50"

const jetMonoReg10 =
  "[font-family:'JetBrains_Mono',ui-monospace,monospace] text-[10px] font-normal leading-3 text-black opacity-50"

function MenuChevron({ "data-node-id": dataNodeId }: { "data-node-id"?: string }) {
  return (
    <span
      className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden"
      aria-hidden
      data-node-id={dataNodeId}
    >
      <img
        alt=""
        src={IMG_CHEVRON_DOWN}
        className="block h-[4.5px] w-2 max-w-none"
      />
    </span>
  )
}

function MetricPill({
  volume,
  rate,
  pillNodeId,
  volumeNodeId,
  rateNodeId,
  className,
}: {
  volume: string
  rate: string
  pillNodeId: string
  volumeNodeId: string
  rateNodeId: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 overflow-hidden rounded-lg bg-white p-1 text-right whitespace-nowrap",
        watiShadowBase,
        className
      )}
      data-node-id={pillNodeId}
    >
      <p className={cn(jetMonoReg12, "relative shrink-0")} data-node-id={volumeNodeId}>
        {volume}
      </p>
      <p className={cn(jetMonoReg10, "relative shrink-0")} data-node-id={rateNodeId}>
        {rate}
      </p>
    </div>
  )
}

type BarColumn = {
  key: string
  /** Figma mint track height inside 213px plot (cols 2–4). */
  mintH: number
  /** Figma solid green height (px). */
  greenH: number
  pill: { volume: string; rate: string; pillNodeId: string; volId: string; rateId: string }
  /** Tailwind arbitrary top for pill (Figma absolute). */
  pillPositionClass: string
}

const BAR_COLUMNS: BarColumn[] = [
  {
    key: "c1",
    mintH: 0,
    greenH: 213,
    pill: {
      volume: "125k",
      rate: "100%",
      pillNodeId: "137:3728",
      volId: "137:3729",
      rateId: "137:3730",
    },
    pillPositionClass: "",
  },
  {
    key: "c2",
    mintH: 186,
    greenH: 91,
    pill: {
      volume: "100k",
      rate: "80%",
      pillNodeId: "137:3712",
      volId: "137:3713",
      rateId: "137:3714",
    },
    pillPositionClass:
      "left-1/2 top-[calc(50%+2px)] -translate-x-1/2 -translate-y-1/2",
  },
  {
    key: "c3",
    mintH: 186,
    greenH: 71,
    pill: {
      volume: "30k",
      rate: "30%",
      pillNodeId: "137:3716",
      volId: "137:3717",
      rateId: "137:3718",
    },
    pillPositionClass:
      "left-[calc(50%+0.5px)] top-[calc(50%+24px)] -translate-x-1/2 -translate-y-1/2",
  },
  {
    key: "c4",
    mintH: 186,
    greenH: 45,
    pill: {
      volume: "10k",
      rate: "10%",
      pillNodeId: "137:3720",
      volId: "137:3721",
      rateId: "137:3722",
    },
    pillPositionClass:
      "left-[calc(50%+0.5px)] top-[calc(50%+48px)] -translate-x-1/2 -translate-y-1/2",
  },
]

export type AdsFunnelMovesOverTimeSectionProps = {
  className?: string
} & AdsDateRangeSegmentTabsProps

/** Figma Ads-Reporting 2.0 — node 130:3287 (header, Meta + tabs, chart 137:3539, legend). */
export function AdsFunnelMovesOverTimeSection({
  className,
  ...dateRangeTabs
}: AdsFunnelMovesOverTimeSectionProps) {
  const [source, setSource] = React.useState<"meta" | "google">("meta")

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-1 bg-white py-2",
        className
      )}
      data-node-id="130:3287"
    >
      <div
        className="flex w-full flex-col gap-1 overflow-hidden rounded-lg bg-white py-2"
        data-node-id="130:3288"
      >
        {/* Title row — tabs live on row 130:3296 in Figma */}
        <div
          className="flex w-full min-w-0 flex-wrap items-center gap-1"
          data-node-id="130:3289"
        >
          <div
            className="flex min-h-0 min-w-0 max-w-full flex-[0_1_auto] flex-col justify-center gap-0.5 py-0.5 pl-0 pr-1 sm:max-w-md"
            data-node-id="130:3290"
          >
            <p
              className="min-w-0 text-balance text-[16px] font-semibold leading-snug text-[#1b1d1c]"
              data-node-id="130:3291"
            >
              How your funnel moves over time
            </p>
            <p
              className="min-w-0 text-pretty text-sm font-normal leading-snug text-[#848a86] sm:whitespace-nowrap"
              data-node-id="130:3293"
            >
              Spend vs conversations, leads and purchases
            </p>
          </div>
          <div className="min-h-px min-w-px flex-1" data-node-id="130:3294" aria-hidden />
        </div>

        {/* Meta + date range — Figma gap 12px (130:3296) */}
        <div
          className="flex w-full flex-wrap items-center gap-3 py-2"
          data-node-id="130:3296"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={outlineMenuButtonClass}
                data-node-id="130:3297"
              >
                <span data-node-id="I130:3297;8:196">
                  {source === "meta" ? "Meta" : "Google"}
                </span>
                <MenuChevron data-node-id="I130:3297;1495:14442" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[10rem]">
              <DropdownMenuItem
                onSelect={() => setSource("meta")}
                className={source === "meta" ? "font-medium" : undefined}
              >
                Meta
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSource("google")}
                className={source === "google" ? "font-medium" : undefined}
              >
                Google
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AdsDateRangeSegmentTabs
            {...dateRangeTabs}
            tabListDataNodeId="137:3640"
          />
        </div>

        {/* Chart block — Figma 137:3539 */}
        <div
          className="relative h-[309px] w-full shrink-0 overflow-hidden"
          data-node-id="137:3539"
        >
          <div
            className="absolute left-0 right-0 top-10 flex h-[213px] border-t border-[#e7e9e8] bg-white"
            data-node-id="137:3540"
          >
            {/* Y-axis */}
            <div
              className="flex h-full w-10 shrink-0 flex-col justify-between py-1 pl-0 pr-2 text-right [font-family:'JetBrains_Mono',ui-monospace,monospace] text-xs font-normal leading-4 text-black"
              data-node-id="137:3541"
            >
              <p className="opacity-50" data-node-id="137:3542">
                100%
              </p>
              <p className="opacity-50" data-node-id="137:3588">
                75%
              </p>
              <p className="opacity-50" data-node-id="137:3543">
                50%
              </p>
              <p className="opacity-50" data-node-id="137:3544">
                25%
              </p>
            </div>

            {/* Plot */}
            <div
              className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
              data-node-id="137:3545"
            >
              {/* Horizontal guides — Figma vector lines ~evenly spaced */}
              {[5, 53, 101, 149].map((top, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-[#e7e9e8]/80"
                  style={{ top }}
                  aria-hidden
                  data-node-id={i === 0 ? "137:3549" : i === 1 ? "137:3548" : i === 2 ? "137:3547" : "137:3546"}
                />
              ))}

              <div className="absolute inset-0 flex pt-0 pb-0 pl-[10px] pr-[10px]">
                {BAR_COLUMNS.map((col, i) => (
                  <div
                    key={col.key}
                    className={cn(
                      "relative flex min-w-0 flex-1",
                      i === 0 ? "justify-start" : "justify-center px-0.5"
                    )}
                  >
                    {col.mintH === 0 ? (
                      <div className="relative h-[213px] w-[145px] max-w-full shrink-0">
                        <div
                          className="absolute inset-0 bg-[#23a455]"
                          data-node-id="137:3550"
                        />
                        <MetricPill
                          volume={col.pill.volume}
                          rate={col.pill.rate}
                          pillNodeId={col.pill.pillNodeId}
                          volumeNodeId={col.pill.volId}
                          rateNodeId={col.pill.rateId}
                          className="absolute left-1/2 top-[33px] z-10 -translate-x-1/2"
                        />
                      </div>
                    ) : (
                      <div
                        className="absolute bottom-0 left-1/2 w-[min(100%,145px)] max-w-full -translate-x-1/2 bg-[#ebf7f0]"
                        style={{ height: col.mintH }}
                        data-node-id={
                          i === 1 ? "137:3633" : i === 2 ? "137:3636" : "137:3638"
                        }
                      >
                        <MetricPill
                          volume={col.pill.volume}
                          rate={col.pill.rate}
                          pillNodeId={col.pill.pillNodeId}
                          volumeNodeId={col.pill.volId}
                          rateNodeId={col.pill.rateId}
                          className={cn("absolute z-10", col.pillPositionClass)}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-[#23a455]"
                          style={{ height: col.greenH }}
                          data-node-id={
                            i === 1 ? "137:3632" : i === 2 ? "137:3637" : "137:3639"
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis labels — 137:3580: same flex track as chart (w-10 y-axis + plot pl-[10px] + 4×flex-1) */}
          <div
            className="absolute bottom-0 left-0 right-0 box-border flex h-14 overflow-hidden border-t border-solid border-[#e7e9e8] bg-white text-xs font-medium leading-[0] text-[#353735] [font-family:'JetBrains_Mono',ui-monospace,monospace]"
            data-node-id="137:3580"
          >
            <div className="w-10 shrink-0" aria-hidden />
            <div className="flex min-w-0 flex-1 items-center py-3 pl-[10px] pr-[10px]">
              <div className="relative flex min-h-0 min-w-0 flex-1 justify-start">
                <div className="w-[min(100%,145px)]">
                  <ol
                    className="relative block w-full list-decimal ps-[18px] [list-style-position:outside]"
                    data-node-id="137:3582"
                    start={1}
                  >
                    <li className="text-left">
                      <span className="leading-4">Impressions</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="relative flex min-h-0 min-w-0 flex-1 justify-center px-0.5">
                <div className="w-[min(100%,145px)]">
                  <ol
                    className="relative block w-full list-decimal ps-[18px] [list-style-position:outside]"
                    data-node-id="137:3589"
                    start={2}
                  >
                    <li className="text-left">
                      <span className="block leading-4">Conversations</span>
                      <span className="block leading-4">started</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="relative flex min-h-0 min-w-0 flex-1 justify-center px-0.5">
                <div className="w-[min(100%,145px)]">
                  <ol
                    className="relative block w-full list-decimal ps-[18px] [list-style-position:outside]"
                    data-node-id="137:3590"
                    start={3}
                  >
                    <li className="text-left">
                      <span className="block leading-4">Leads</span>
                      <span className="block leading-4">qualiffied</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="relative flex min-h-0 min-w-0 flex-1 justify-center px-0.5">
                <div className="w-[min(100%,145px)]">
                  <ol
                    className="relative block w-full list-decimal ps-[18px] [list-style-position:outside]"
                    data-node-id="137:3591"
                    start={4}
                  >
                    <li className="text-left">
                      <span className="block leading-4">Purchase</span>
                      <span className="block leading-4">made</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend — Figma 137:3592 */}
        <div
          className="flex w-full items-center justify-center overflow-hidden py-2"
          data-node-id="137:3592"
        >
          <div
            className="flex items-center gap-1 overflow-hidden rounded-[32px] bg-white px-2 py-1.5"
            data-node-id="137:3593"
          >
            <div
              className="size-2.5 shrink-0 bg-[#23a455]"
              data-node-id="137:3594"
              aria-hidden
            />
            <p
              className="shrink-0 text-center text-sm font-medium leading-5 text-[#0a0a0a]"
              data-node-id="137:3595"
            >
              Overall
            </p>
            <p
              className="shrink-0 text-center text-sm font-normal leading-5 tracking-[-0.28px] text-[#505451] [font-family:'JetBrains_Mono',ui-monospace,monospace]"
              data-node-id="137:3630"
            >
              100%
            </p>
            <div className="h-0.5 w-3 shrink-0 bg-[#353735]/25" data-node-id="137:3631" aria-hidden />
            <p
              className="shrink-0 text-center text-[10px] font-normal leading-4 text-[#0a0a0a]"
              data-node-id="137:3597"
            >
              vs
            </p>
            <p className="text-center text-[10px] leading-4 text-[#0a0a0a]" data-node-id="137:3598">
              <span className="[font-family:'JetBrains_Mono',ui-monospace,monospace] font-normal leading-4 text-[#ec3244]">
                -12%
              </span>
              <span className="leading-4">{` YTD`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
