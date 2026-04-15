import * as React from "react"

import { cn } from "@/lib/utils"

/** Figma MCP assets (replace with local files for production). */
const IMG_FUNNEL_SEG1 =
  "https://www.figma.com/api/mcp/asset/c27ea02c-ab6a-4aa4-aa37-49c419bf3286"
const IMG_FUNNEL_SEG2 =
  "https://www.figma.com/api/mcp/asset/f93286fd-d81f-4c85-96af-533f5b2cf531"
const IMG_FUNNEL_SEG3 =
  "https://www.figma.com/api/mcp/asset/2c4c734a-b94f-4b4d-8876-cbc40571bc38"
/** KPI trend icons — Figma 63:2028 Frame / Frame1 (16×16), no transforms except Time-to-convert per file. */
const IMG_KPI_TREND_FRAME =
  "https://www.figma.com/api/mcp/asset/8061a1f1-873b-4954-9833-40a3bfff2e64"
const IMG_KPI_TREND_FRAME_ALT =
  "https://www.figma.com/api/mcp/asset/fa494f71-486c-454e-bad7-8bcd83f5796c"

function FigmaKpiIcon16({ src }: { src: string }) {
  return (
    <span className="relative size-4 shrink-0">
      <img
        alt=""
        src={src}
        className="pointer-events-none absolute inset-0 block size-full max-w-none select-none"
        draggable={false}
      />
    </span>
  )
}

type PlatformId = "meta" | "google" | "tiktok"

type FunnelColumn = {
  label: string
  valueMain: string
  valueSub: string
  subClassName: string
  chart: "img1" | "img2" | "img3"
  chartOpacity?: string
}

type KpiBlock = {
  label: string
  value: string
  trend?: React.ReactNode
  footer?: React.ReactNode
  roundedClass?: string
}

function AutomateLink() {
  const [sent, setSent] = React.useState(false)
  return (
    <button
      type="button"
      className="w-full max-w-[123px] text-left text-xs leading-4 font-normal text-[#0c70ea] underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      data-node-id="63:2107"
      onClick={() => setSent(true)}
    >
      {sent ? "Queued" : "Automate"}
    </button>
  )
}

const PLATFORM_CORE: Record<
  PlatformId,
  {
    conversionRate: string
    conversionRateClass: string
    industryBadge: string
    funnel: FunnelColumn[]
  }
> = {
  meta: {
    conversionRate: "34.5%",
    conversionRateClass: "text-[#eb991f]",
    industryBadge: "+12% industry avg",
    funnel: [
      {
        label: "Convo started",
        valueMain: "180",
        valueSub: "90%",
        subClassName: "text-[#23a455]",
        chart: "img1",
      },
      {
        label: "Qualified leads",
        valueMain: "-",
        valueSub: "-%",
        subClassName: "text-[#848a86]",
        chart: "img2",
        chartOpacity: "opacity-80",
      },
      {
        label: "Purchases",
        valueMain: "-",
        valueSub: "-%",
        subClassName: "text-[#848a86]",
        chart: "img3",
      },
    ],
  },
  google: {
    conversionRate: "28.2%",
    conversionRateClass: "text-[#eb991f]",
    industryBadge: "+8% industry avg",
    funnel: [
      {
        label: "Convo started",
        valueMain: "142",
        valueSub: "76%",
        subClassName: "text-[#23a455]",
        chart: "img1",
      },
      {
        label: "Qualified leads",
        valueMain: "54",
        valueSub: "12%",
        subClassName: "text-[#23a455]",
        chart: "img2",
        chartOpacity: "opacity-80",
      },
      {
        label: "Purchases",
        valueMain: "12",
        valueSub: "4%",
        subClassName: "text-[#848a86]",
        chart: "img3",
      },
    ],
  },
  tiktok: {
    conversionRate: "19.0%",
    conversionRateClass: "text-[#eb991f]",
    industryBadge: "+3% industry avg",
    funnel: [
      {
        label: "Convo started",
        valueMain: "96",
        valueSub: "62%",
        subClassName: "text-[#23a455]",
        chart: "img1",
      },
      {
        label: "Qualified leads",
        valueMain: "-",
        valueSub: "-%",
        subClassName: "text-[#848a86]",
        chart: "img2",
        chartOpacity: "opacity-80",
      },
      {
        label: "Purchases",
        valueMain: "-",
        valueSub: "-%",
        subClassName: "text-[#848a86]",
        chart: "img3",
      },
    ],
  },
}

const KPI_VALUES: Record<
  PlatformId,
  {
    spend: string
    impressions: string
    clicks: string
    ctr: string
    cpl: string
    cpp: string
    time: string
  }
> = {
  meta: {
    spend: "$32.9k",
    impressions: "$32.9k",
    clicks: "$32.9k",
    ctr: "$32.9k",
    cpl: "$49.0",
    cpp: "$49.0",
    time: "3hrs",
  },
  google: {
    spend: "$28.1k",
    impressions: "$32.9k",
    clicks: "$32.9k",
    ctr: "$32.9k",
    cpl: "$49.0",
    cpp: "$49.0",
    time: "4.2hrs",
  },
  tiktok: {
    spend: "$18.4k",
    impressions: "$32.9k",
    clicks: "$32.9k",
    ctr: "$32.9k",
    cpl: "$49.0",
    cpp: "$49.0",
    time: "5.1hrs",
  },
}

function buildKpis(id: PlatformId): KpiBlock[] {
  const v = KPI_VALUES[id]
  return [
    {
      label: "Ad spend",
      value: v.spend,
      trend: (
        <span className="text-xs leading-4 font-normal text-[#23a455]">
          +90%
        </span>
      ),
      roundedClass: "rounded-bl-[4px] rounded-tl-[4px]",
    },
    {
      label: "Impressions",
      value: v.impressions,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#eb991f]">
          <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME} />
          9%
        </span>
      ),
    },
    {
      label: "Clicks",
      value: v.clicks,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#eb991f]">
          <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME} />
          9%
        </span>
      ),
    },
    {
      label: "CTR",
      value: v.ctr,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#eb991f]">
          <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME} />
          9%
        </span>
      ),
    },
    {
      label: "CPL",
      value: v.cpl,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#23a455]">
          <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME_ALT} />
          90%
        </span>
      ),
    },
    {
      label: "CPP",
      value: v.cpp,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#23a455]">
          <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME_ALT} />
          90%
        </span>
      ),
    },
    {
      label: "Time to convert",
      value: v.time,
      trend: (
        <span className="flex items-center gap-1 text-xs leading-4 text-[#ec3244]">
          <span className="flex shrink-0 items-center justify-center">
            <span className="-scale-y-100">
              <FigmaKpiIcon16 src={IMG_KPI_TREND_FRAME} />
            </span>
          </span>
          234%
        </span>
      ),
      footer: <AutomateLink />,
      roundedClass: "rounded-br-[4px] rounded-tr-[4px]",
    },
  ]
}

function FunnelChart({ variant, className }: { variant: string; className?: string }) {
  const src =
    variant === "img1"
      ? IMG_FUNNEL_SEG1
      : variant === "img2"
        ? IMG_FUNNEL_SEG2
        : IMG_FUNNEL_SEG3
  return (
    <div className={cn("relative w-full", className)}>
      <img alt="" src={src} className="h-full w-full object-contain object-left" />
    </div>
  )
}

function PlatformPanel({ id }: { id: PlatformId }) {
  const data = PLATFORM_CORE[id]
  const kpis = buildKpis(id)

  return (
    <div
      className="flex w-full flex-col overflow-hidden border-0 bg-white px-7 py-5"
      data-node-id="63:2037"
    >
      <div
        className="flex w-full max-w-full items-start py-4"
        data-node-id="63:2038"
      >
        <div className="flex min-h-[124px] min-w-0 flex-1 items-start">
          <div className="flex h-[124px] w-[128px] shrink-0 flex-col justify-center gap-1 py-1 pr-6">
            <div className="py-1">
              <p
                className={cn(
                  "text-2xl font-semibold leading-7 whitespace-nowrap",
                  data.conversionRateClass
                )}
                data-node-id="63:2042"
              >
                {data.conversionRate}
              </p>
            </div>
            <div className="flex h-7 items-center py-1">
              <p
                className="text-sm font-medium leading-5 whitespace-nowrap text-[#353735]"
                data-node-id="63:2044"
              >
                Conversion rate
              </p>
            </div>
            <div
              className="inline-flex w-fit items-center justify-center gap-0.5 rounded-full bg-[#e7e9e8] px-1.5 py-0.5"
              data-node-id="63:2045"
            >
              <span className="whitespace-nowrap text-xs font-medium leading-4 text-[#505451]">
                {data.industryBadge}
              </span>
            </div>
          </div>

          <div className="flex min-h-[124px] min-w-0 flex-1 justify-start">
            <div className="flex min-h-[124px] w-[88%] min-w-0 max-w-full">
              {data.funnel.map((col, i) => (
                <div
                  key={col.label}
                  className={cn(
                    "flex h-[124px] min-w-0 flex-1 flex-col gap-1 overflow-hidden",
                    i < data.funnel.length - 1 &&
                      "border-r border-solid border-[#e7e9e8]",
                    "items-start"
                  )}
                  data-node-id={
                    i === 0 ? "63:2047" : i === 1 ? "63:2055" : "63:2063"
                  }
                >
                  <div className="flex shrink-0 items-center pl-4 pr-3">
                    <p className="whitespace-nowrap text-xs font-medium leading-4 text-[#353735]">
                      {col.label}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 pl-4 pr-3 whitespace-nowrap">
                    <span className="text-sm font-semibold leading-5 text-[#1b1d1c]">
                      {col.valueMain}
                    </span>
                    <span
                      className={cn(
                        "text-xs leading-4 font-normal",
                        col.subClassName
                      )}
                    >
                      {col.valueSub}
                    </span>
                  </div>
                  <div className="mt-auto flex w-full shrink-0 items-end justify-start">
                    {col.chart === "img3" ? (
                      <div className="flex w-full items-center justify-start">
                        <div className="w-full -scale-y-100">
                          <div className="relative h-5 w-full max-w-full">
                            <img
                              alt=""
                              src={IMG_FUNNEL_SEG3}
                              className="absolute inset-0 size-full max-w-none object-contain object-left"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FunnelChart
                        variant={col.chart}
                        className={cn(
                          col.chart === "img1" ? "h-[39px]" : "h-[29px]",
                          col.chartOpacity
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex w-full flex-wrap gap-3 pl-[144px]"
        data-node-id="63:2293"
      >
        {kpis.map((kpi, idx) => (
          <div
            key={`${id}-${kpi.label}`}
            className={cn(
              "flex size-[120px] shrink-0 flex-col items-start gap-1 overflow-hidden py-4 pl-3 pr-1",
              kpi.roundedClass
            )}
            data-node-id={`kpi-${idx}`}
          >
            <p className="w-full min-w-0 text-xs font-medium leading-4 text-[#848a86]">
              {kpi.label}
            </p>
            <div className="flex items-center py-1">
              <p className="text-center text-base font-bold leading-[22px] text-black">
                {kpi.value}
              </p>
            </div>
            {kpi.trend && (
              <div className="flex items-center gap-1 py-1">{kpi.trend}</div>
            )}
            {kpi.footer}
          </div>
        ))}
      </div>
    </div>
  )
}

const PLATFORM_TAB_ROWS: { id: PlatformId; label: string; nodeId: string }[] =
  [
    { id: "meta", label: "Meta Ads", nodeId: "36:258" },
    { id: "google", label: "Google Ads", nodeId: "36:259" },
    { id: "tiktok", label: "TiktTok Ads", nodeId: "36:260" },
  ]

export function AdsPlatformTabsSection({
  className,
}: {
  className?: string
}) {
  const [platform, setPlatform] = React.useState<PlatformId>("meta")

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-3 pb-5 -mt-2",
        className
      )}
      data-node-id="36:257"
    >
      <div className="w-full overflow-hidden rounded-lg border border-solid border-[#e7e9e8] bg-white">
        {/* Figma Ads-Reporting-2.0 / 36:257 — underline tabs, no gray segmented bar */}
        <div
          className="flex w-full flex-wrap items-start border-b border-solid border-[#e7e9e8] bg-white py-px"
          role="tablist"
          aria-label="Ad platforms"
        >
          <div className="flex w-full items-start">
            {PLATFORM_TAB_ROWS.map(({ id, label, nodeId }) => {
              const selected = platform === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`ads-platform-tab-${id}`}
                  aria-selected={selected}
                  tabIndex={0}
                  data-node-id={nodeId}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 overflow-hidden px-3 py-5 text-left text-sm font-medium leading-5 text-[#353735] transition-colors",
                    "border-b-2 border-solid -mb-px focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                    selected
                      ? "border-[#353735] bg-white"
                      : "border-transparent bg-white hover:text-foreground"
                  )}
                  onClick={() => setPlatform(id)}
                >
                  {id === "meta" ? (
                    <>
                      <span data-node-id="36:261">{label}</span>
                      <span
                        className="inline-flex items-center justify-center gap-1 rounded-full bg-[#d3f4f5] px-1.5 py-0.5"
                        data-node-id="48:683"
                      >
                        <span className="whitespace-nowrap text-xs font-medium leading-4 text-[#005c99]">
                          Top performing
                        </span>
                      </span>
                    </>
                  ) : (
                    <span
                      data-node-id={
                        id === "google" ? "36:263" : "36:265"
                      }
                    >
                      {label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`ads-platform-panel-${platform}`}
          aria-labelledby={`ads-platform-tab-${platform}`}
          className="w-full outline-none"
        >
          <PlatformPanel id={platform} />
        </div>
      </div>
    </div>
  )
}
