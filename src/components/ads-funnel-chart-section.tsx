import * as React from "react"

import {
  AdsFunnelChartRow,
  type FunnelSeriesKey,
  FUNNEL_SERIES_DEFAULT_VISIBILITY,
  type FunnelSeriesVisibility,
} from "@/components/ads-funnel-chart-row"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const LEGEND_ITEMS: {
  key: FunnelSeriesKey
  label: string
  color: string
  nodeId: string
  vsNodeId: string
  ytdNodeId: string
  /** Year-over-year style delta for display (Figma 88:1515). */
  ytdDeltaPercent: number
}[] = [
  {
    key: "conversations",
    label: "Impressions",
    color: "#23a455",
    nodeId: "88:1516",
    vsNodeId: "89:1756",
    ytdNodeId: "89:1759",
    ytdDeltaPercent: -12,
  },
  {
    key: "leads",
    label: "Conversations Started",
    color: "#eb991f",
    nodeId: "88:1519",
    vsNodeId: "89:1760",
    ytdNodeId: "89:1761",
    ytdDeltaPercent: -12,
  },
  {
    key: "qualified",
    label: "Qualified leads",
    color: "#213b89",
    nodeId: "88:1522",
    vsNodeId: "89:1763",
    ytdNodeId: "89:1764",
    ytdDeltaPercent: 12,
  },
  {
    key: "purchases",
    label: "Qualified purchases",
    color: "#353735",
    nodeId: "88:1525",
    vsNodeId: "89:1766",
    ytdNodeId: "89:1767",
    ytdDeltaPercent: 12,
  },
]

function FunnelLegendYtdDelta({
  percent,
  dataNodeId,
}: {
  percent: number
  dataNodeId?: string
}) {
  const tone =
    percent < 0
      ? "text-[#ec3244]"
      : percent > 0
        ? "text-[#23a455]"
        : "text-[#0a0a0a]"
  const signed =
    percent > 0 ? `+${percent}%` : `${percent}%`

  return (
    <span
      className="whitespace-nowrap text-[10px] leading-4 text-[#0a0a0a]"
      data-node-id={dataNodeId}
    >
      <span
        className={cn(
          "font-['JetBrains_Mono',monospace] font-normal leading-4",
          tone
        )}
      >
        {signed}
      </span>
      <span className="leading-4"> YTD</span>
    </span>
  )
}

/** Figma 88:1515 + chart (84:1346); checkboxes toggle bar series. */
export function AdsFunnelChartSection({ className }: { className?: string }) {
  const [visibility, setVisibility] = React.useState<FunnelSeriesVisibility>(
    FUNNEL_SERIES_DEFAULT_VISIBILITY
  )

  const setSeries = React.useCallback(
    (key: FunnelSeriesKey, checked: boolean) => {
      setVisibility((v) => ({ ...v, [key]: checked }))
    },
    []
  )

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-end py-5",
        className
      )}
      data-node-id="84:1346"
    >
      <AdsFunnelChartRow visibility={visibility} />

      <div
        className="flex w-full flex-wrap items-center gap-3 py-2"
        data-node-id="88:1515"
      >
        {LEGEND_ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex shrink-0 items-center gap-1 overflow-hidden rounded-[32px] border border-solid border-[#e7e9e8] bg-white px-2 py-1.5"
            data-node-id={item.nodeId}
          >
            <label className="flex cursor-pointer items-center gap-1">
              <span
                className="size-[10px] shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="whitespace-nowrap text-center text-[12px] font-medium leading-5 text-[#0a0a0a]">
                {item.label}
              </span>
              <Checkbox
                checked={visibility[item.key]}
                onCheckedChange={(c) => setSeries(item.key, c === true)}
                className="size-4 shrink-0 rounded-[4px] border-[#171717] data-[state=checked]:border-[#171717] data-[state=checked]:bg-[#171717]"
                aria-label={`Show ${item.label} on chart`}
              />
              <span
                className="whitespace-nowrap text-center text-[10px] leading-4 text-[#0a0a0a]"
                data-node-id={item.vsNodeId}
              >
                vs
              </span>
              <FunnelLegendYtdDelta
                percent={item.ytdDeltaPercent}
                dataNodeId={item.ytdNodeId}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
