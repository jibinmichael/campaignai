import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type FunnelSeriesKey =
  | "conversations"
  | "leads"
  | "qualified"
  | "purchases"

export type FunnelSeriesVisibility = Record<FunnelSeriesKey, boolean>

export const FUNNEL_SERIES_DEFAULT_VISIBILITY: FunnelSeriesVisibility = {
  conversations: true,
  leads: true,
  qualified: true,
  purchases: true,
}

const chartConfig = {
  conversations: {
    label: "Impressions",
    color: "#23a455",
  },
  leads: { label: "Conversations Started", color: "#eb991f" },
  qualified: { label: "Qualified leads", color: "#213b89" },
  purchases: { label: "Qualified purchases", color: "#353735" },
} satisfies ChartConfig

function round2(n: number) {
  return Math.round(n * 100) / 100
}

const ACTIVE_PERIOD = "10"

function periodValues(period: string) {
  if (period === ACTIVE_PERIOD) {
    return {
      conversations: 12,
      leads: round2(9 + (105.357 / 135) * 3),
      qualified: round2(9 + (30 / 135) * 3),
      purchases: round2(9 + (23 / 135) * 3),
    }
  }
  const low = round2(9 + (2 / 135) * 3)
  return {
    conversations: low,
    leads: low,
    qualified: low,
    purchases: low,
  }
}

const chartData = (["10", "11", "12", "13", "14", "15"] as const).map(
  (period) => ({
    period,
    ...periodValues(period),
  })
)

/** Space for 12px two-digit ticks + 20px gap before plot area. */
const FUNNEL_Y_AXIS_WIDTH = 26 + 20

const FUNNEL_X_AXIS_LABELS: { value: string; nodeId: string }[] = [
  { value: "10", nodeId: "88:1642" },
  { value: "11", nodeId: "88:1643" },
  { value: "12", nodeId: "88:1644" },
  { value: "13", nodeId: "88:1645" },
  { value: "14", nodeId: "88:1646" },
  { value: "15", nodeId: "88:1685" },
]

function funnelYAxisTick(props: {
  x?: string | number
  y?: string | number
  payload?: { value?: number | string }
  className?: string
}) {
  const y = Number(props.y)
  const { payload, className } = props
  if (Number.isNaN(y) || payload?.value == null) return null
  return (
    <text
      x={0}
      y={y}
      dy="0.355em"
      textAnchor="start"
      fill="currentColor"
      className={cn(className, "opacity-50")}
      style={{ fontSize: 12 }}
    >
      {payload.value}
    </text>
  )
}

const BAR_RADIUS: [number, number, number, number] = [3, 3, 0, 0]

export function AdsFunnelChartRow({
  className,
  visibility = FUNNEL_SERIES_DEFAULT_VISIBILITY,
}: {
  className?: string
  visibility?: FunnelSeriesVisibility
}) {
  return (
    <div
      className={cn("w-full min-w-0 overflow-hidden bg-white", className)}
      data-node-id="88:1628"
    >
      <ChartContainer
        config={chartConfig}
        initialDimension={{ width: 800, height: 168 }}
        className="aspect-auto h-[168px] w-full min-h-[168px] max-w-none justify-start [&_.recharts-cartesian-grid-horizontal_line]:stroke-[#e7e9e8]"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 10, right: 64, bottom: 0, left: 0 }}
          barCategoryGap="18%"
          barGap={2}
        >
          <CartesianGrid
            horizontal
            vertical={false}
            stroke="#e7e9e8"
            strokeDasharray="0"
          />
          <XAxis dataKey="period" type="category" hide />
          <YAxis
            domain={[9, 12]}
            ticks={[10, 11, 12]}
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            width={FUNNEL_Y_AXIS_WIDTH}
            tick={funnelYAxisTick}
          />
          <ChartTooltip
            cursor={{ fill: "rgb(231 233 232 / 0.45)" }}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => `Day ${label}`}
                labelClassName="pb-1.5"
                valueAlignment="spread"
                payloadListClassName="gap-2.5"
                itemClassName="gap-2.5"
                className="border-border/60 px-3 py-3 text-sm leading-snug"
              />
            }
          />
          {visibility.conversations ? (
            <Bar
              dataKey="conversations"
              name="conversations"
              fill="var(--color-conversations)"
              radius={BAR_RADIUS}
              maxBarSize={14}
              isAnimationActive={false}
            />
          ) : null}
          {visibility.leads ? (
            <Bar
              dataKey="leads"
              name="leads"
              fill="var(--color-leads)"
              radius={BAR_RADIUS}
              maxBarSize={14}
              isAnimationActive={false}
            />
          ) : null}
          {visibility.qualified ? (
            <Bar
              dataKey="qualified"
              name="qualified"
              fill="var(--color-qualified)"
              radius={BAR_RADIUS}
              maxBarSize={14}
              isAnimationActive={false}
            />
          ) : null}
          {visibility.purchases ? (
            <Bar
              dataKey="purchases"
              name="purchases"
              fill="var(--color-purchases)"
              radius={BAR_RADIUS}
              maxBarSize={14}
              isAnimationActive={false}
            />
          ) : null}
        </BarChart>
      </ChartContainer>

      <div
        className="flex w-full items-center justify-between border-t border-solid border-[#e7e9e8] px-16 py-2 text-xs font-normal leading-4 text-black/50 whitespace-nowrap"
        data-node-id="88:1641"
      >
        {FUNNEL_X_AXIS_LABELS.map(({ value, nodeId }) => (
          <span key={value} className="shrink-0" data-node-id={nodeId}>
            {value}
          </span>
        ))}
      </div>
    </div>
  )
}
