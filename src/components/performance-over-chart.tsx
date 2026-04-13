import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const CHART_DATA = [
  { date: "26 Jan", spend: 0, impressions: 0, pinClicks: 0, reach: 0, engagements: 0 },
  { date: "27 Jan", spend: 0, impressions: 0, pinClicks: 0, reach: 0, engagements: 0 },
  { date: "28 Jan", spend: 0, impressions: 0, pinClicks: 0, reach: 0, engagements: 0 },
  { date: "29 Jan", spend: 0, impressions: 0, pinClicks: 0, reach: 0, engagements: 0 },
  { date: "30 Jan", spend: 1, impressions: 1600, pinClicks: 18, reach: 1500, engagements: 48 },
  { date: "31 Jan", spend: 1, impressions: 1100, pinClicks: 12, reach: 1050, engagements: 35 },
  { date: "1 Feb", spend: 1, impressions: 1300, pinClicks: 15, reach: 1250, engagements: 42 },
  { date: "2 Feb", spend: 0, impressions: 300, pinClicks: 4, reach: 280, engagements: 12 },
] as const

type MetricId = "spend" | "impressions" | "pinClicks" | "reach" | "engagements"

const METRICS: {
  id: MetricId
  label: string
  displayValue: string
  /** Shown as subscript after the main value (include %). */
  percentSub: string
  borderClass: string
  bgSelectedClass: string
  chartColor: string
}[] = [
  {
    id: "spend",
    label: "Spend",
    displayValue: "US$3.00",
    percentSub: "+2.4%",
    borderClass: "border-[#003366]",
    bgSelectedClass: "bg-[#e8eef5]",
    chartColor: "#003366",
  },
  {
    id: "impressions",
    label: "Audience size",
    displayValue: "4.34k",
    percentSub: "+8.1%",
    borderClass: "border-[#20B2AA]",
    bgSelectedClass: "bg-[#e6f7f6]",
    chartColor: "#20B2AA",
  },
  {
    id: "pinClicks",
    label: "Delivered",
    displayValue: "42",
    percentSub: "+5.0%",
    borderClass: "border-transparent",
    bgSelectedClass: "bg-muted/60",
    chartColor: "#6b7280",
  },
  {
    id: "reach",
    label: "Read",
    displayValue: "4.26k",
    percentSub: "+3.1%",
    borderClass: "border-transparent",
    bgSelectedClass: "bg-muted/60",
    chartColor: "#8b5cf6",
  },
  {
    id: "engagements",
    label: "Engagements",
    displayValue: "162",
    percentSub: "+12%",
    borderClass: "border-transparent",
    bgSelectedClass: "bg-muted/60",
    chartColor: "#ea580c",
  },
]

const MAX_SELECTED_METRICS = 33

const CAMPAIGN_FILTER_OPTIONS = [
  { value: "all", label: "All Campaigns" },
  { value: "cmp-spring", label: "Spring promo" },
  { value: "cmp-lifecycle", label: "Lifecycle nurture" },
  { value: "cmp-reengage", label: "Re-engagement" },
] as const

const MESSAGE_TEMPLATE_FILTER_OPTIONS = [
  { value: "all", label: "All Message templates" },
  { value: "tpl-welcome", label: "Welcome message" },
  { value: "tpl-reminder", label: "Appointment reminder" },
  { value: "tpl-offer", label: "Offer / promo" },
] as const

/** Same layout as `PerformanceOverChart` header (title, description, campaign & template filters). */
export function PerformanceOverChartHeaderRow({
  title = "Performance over last 7 days",
  description = `Select up to ${MAX_SELECTED_METRICS} metrics to view graph`,
}: {
  title?: string
  /** Pass `null` or `""` to hide the subtitle line. */
  description?: string | null
} = {}) {
  const [campaignFilter, setCampaignFilter] = React.useState<string>("all")
  const [messageTemplateFilter, setMessageTemplateFilter] =
    React.useState<string>("all")

  return (
    <CardHeader className="border-b border-black-100 px-6 py-6">
      <CardTitle className="text-base font-semibold leading-snug text-foreground">
        {title}
      </CardTitle>
      {description ? (
        <CardDescription className="text-sm font-normal text-muted-foreground">
          {description}
        </CardDescription>
      ) : null}
      <CardAction>
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger
              size="sm"
              className="w-fit shrink-0 border-black-100 bg-background"
              aria-label="Campaign filter"
            >
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="min-w-[var(--radix-select-trigger-width)]"
            >
              {CAMPAIGN_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} textValue={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={messageTemplateFilter}
            onValueChange={setMessageTemplateFilter}
          >
            <SelectTrigger
              size="sm"
              className="w-fit shrink-0 border-black-100 bg-background"
              aria-label="Message template filter"
            >
              <SelectValue placeholder="All Message templates" />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="min-w-[var(--radix-select-trigger-width)]"
            >
              {MESSAGE_TEMPLATE_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} textValue={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-black-100 bg-background"
            onClick={() => {}}
          >
            Sync 90 days data
          </Button>
        </div>
      </CardAction>
    </CardHeader>
  )
}

/** Subtle horizontal baseline under the date axis (X only; Y axes have no line). */
const CHART_SUBTLE_AXIS_LINE = {
  stroke: "var(--border)",
  strokeWidth: 1,
  strokeOpacity: 0.35,
} as const

function formatSpendAxis(v: number) {
  return `US$${v.toFixed(2)}`
}

function formatCountAxis(v: number) {
  if (v >= 1000) {
    const k = v / 1000
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(2)}k`
  }
  return String(Math.round(v))
}

function buildChartConfig(active: MetricId[]): ChartConfig {
  const cfg: ChartConfig = {}
  for (const id of active) {
    const m = METRICS.find((x) => x.id === id)
    if (m) {
      cfg[id] = { label: m.label, color: m.chartColor }
    }
  }
  return cfg
}

export function PerformanceOverChart({
  className,
}: {
  className?: string
}) {
  const [selected, setSelected] = React.useState<MetricId[]>([
    "spend",
    "impressions",
  ])

  const toggleMetric = React.useCallback((id: MetricId) => {
    setSelected((prev) => {
      const on = prev.includes(id)
      if (on) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_SELECTED_METRICS) return prev
      return [...prev, id]
    })
  }, [])

  const chartConfig = React.useMemo(
    () => buildChartConfig(selected),
    [selected]
  )

  const axisMetrics = React.useMemo(() => {
    if (selected.length === 0) {
      return { left: null as MetricId | null, right: null as MetricId | null }
    }
    if (selected.length === 1) {
      return { left: selected[0]!, right: null as MetricId | null }
    }
    if (selected.includes("spend") && selected.includes("impressions")) {
      return { left: "spend" as const, right: "impressions" as const }
    }
    return { left: selected[0]!, right: selected[1]! }
  }, [selected])

  const leftId = axisMetrics.left
  const rightId = axisMetrics.right

  const maxFor = (id: MetricId | null) =>
    id
      ? Math.max(...CHART_DATA.map((d) => Number(d[id])), 1)
      : 1

  const extras = React.useMemo(
    () => selected.filter((id) => id !== leftId && id !== rightId),
    [selected, leftId, rightId]
  )

  const leftMax = maxFor(leftId)
  const rightMax = React.useMemo(() => {
    const ids = [
      ...(rightId ? [rightId] : []),
      ...extras,
    ] as MetricId[]
    if (ids.length === 0) return 1
    return Math.max(...ids.map((id) => maxFor(id)), 1)
  }, [rightId, extras])

  const spendImpressionsPair =
    selected.includes("spend") &&
    selected.includes("impressions") &&
    leftId === "spend" &&
    rightId === "impressions"

  const isSpend = (id: MetricId | null) => id === "spend"

  return (
    <Card
      className={cn(
        "gap-0 rounded-[4px] border border-black-100 py-0 ring-0",
        className
      )}
    >
      <PerformanceOverChartHeaderRow />

      <CardContent className="flex flex-col gap-4 px-0 pb-6 pt-0">
        <div className="grid w-full grid-cols-2 gap-1.5 p-6 sm:grid-cols-3 lg:grid-cols-5">
          {METRICS.map((m) => {
            const isOn = selected.includes(m.id)
            return (
              <Card
                key={m.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggleMetric(m.id)
                  }
                }}
                onClick={() => toggleMetric(m.id)}
                className={cn(
                  "flex min-h-[52px] min-w-0 w-full cursor-pointer gap-0 py-2.5 ring-0 transition-colors",
                  isOn
                    ? cn(
                        "border-2 bg-card",
                        m.id === "spend" || m.id === "impressions"
                          ? cn(m.borderClass, m.bgSelectedClass)
                          : "border-neutral-300 bg-muted/40"
                      )
                    : "border border-transparent bg-[#F5F5F0] hover:bg-[#ebebe6]"
                )}
              >
                <CardContent className="flex h-full flex-col justify-start gap-0 px-2.5 py-0">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-left text-sm font-normal leading-tight text-foreground">
                      {m.label}
                    </span>
                    <span
                      className="flex shrink-0 items-center justify-center px-1 py-1"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isOn}
                        onCheckedChange={() => toggleMetric(m.id)}
                        aria-label={`${m.label} metric`}
                        className={cn(
                          isOn &&
                            m.id === "spend" &&
                            "border-[#003366] data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]",
                          isOn &&
                            m.id === "impressions" &&
                            "border-[#20B2AA] data-[state=checked]:border-[#20B2AA] data-[state=checked]:bg-[#20B2AA]"
                        )}
                      />
                    </span>
                  </div>
                  <p className="flex flex-wrap items-baseline gap-x-1 text-sm font-bold tabular-nums leading-tight tracking-tight text-foreground">
                    <span>{m.displayValue}</span>
                    <span className="text-xs font-normal tabular-nums text-muted-foreground">
                      {m.percentSub}
                    </span>
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="w-full px-6 py-6 sm:py-8">
          <div className="px-4">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] w-full max-w-none sm:h-[260px]"
            initialDimension={{ width: 1200, height: 260 }}
          >
            <BarChart
              data={[...CHART_DATA]}
              margin={{ top: 8, right: 8, left: 0, bottom: 12 }}
              barCategoryGap="18%"
              barGap={2}
            >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 6"
              className="stroke-border/30"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={CHART_SUBTLE_AXIS_LINE}
              tickMargin={6}
              tick={{ fontSize: 11 }}
              padding={{ left: 28, right: 28 }}
            />

            {selected.length === 0 ? null : selected.length === 1 ? (
              <>
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={0}
                  domain={
                    isSpend(leftId)
                      ? [0, Math.max(4, Math.ceil(leftMax * 1.1))]
                      : [0, Math.ceil(leftMax * 1.15)]
                  }
                  tickFormatter={(v) =>
                    isSpend(leftId)
                      ? formatSpendAxis(Number(v))
                      : formatCountAxis(Number(v))
                  }
                  width={52}
                  tick={{ fontSize: 11, textAnchor: "end" }}
                />
                {leftId ? (
                  <Bar
                    yAxisId="left"
                    dataKey={leftId}
                    name={leftId}
                    fill={`var(--color-${leftId})`}
                    maxBarSize={40}
                    radius={[3, 3, 0, 0]}
                    stroke="transparent"
                    strokeWidth={0}
                  />
                ) : null}
              </>
            ) : (
              <>
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={0}
                  domain={
                    isSpend(leftId)
                      ? [0, Math.max(4, Math.ceil(leftMax * 1.1))]
                      : [0, Math.ceil(leftMax * 1.15)]
                  }
                  tickFormatter={(v) =>
                    isSpend(leftId)
                      ? formatSpendAxis(Number(v))
                      : formatCountAxis(Number(v))
                  }
                  width={52}
                  tick={{ fontSize: 11, textAnchor: "end" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={0}
                  domain={
                    spendImpressionsPair && rightId === "impressions"
                      ? [0, 1800]
                      : [0, Math.ceil(rightMax * 1.15)]
                  }
                  ticks={
                    spendImpressionsPair && rightId === "impressions"
                      ? [0, 450, 900, 1350, 1800]
                      : undefined
                  }
                  tickFormatter={(v) =>
                    isSpend(rightId)
                      ? formatSpendAxis(Number(v))
                      : formatCountAxis(Number(v))
                  }
                  width={52}
                  tick={{ fontSize: 11, textAnchor: "start" }}
                />
                {selected.map((id) => (
                  <Bar
                    key={id}
                    yAxisId={id === leftId ? "left" : "right"}
                    dataKey={id}
                    name={id}
                    fill={`var(--color-${id})`}
                    maxBarSize={36}
                    radius={[3, 3, 0, 0]}
                    stroke="transparent"
                    strokeWidth={0}
                  />
                ))}
              </>
            )}

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | (typeof CHART_DATA)[number]
                      | undefined
                    return row?.date ?? ""
                  }}
                  formatter={(value, name) => {
                    const id = name as MetricId
                    const num = Number(value)
                    const label =
                      METRICS.find((m) => m.id === id)?.label ?? ""
                    const formatted =
                      id === "spend"
                        ? `US$${num.toFixed(2)}`
                        : formatCountAxis(num)
                    return (
                      <div className="flex w-full flex-1 items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatted}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            </BarChart>
          </ChartContainer>
          </div>
        </div>

        {selected.length > 0 ? (
          <div className="flex w-full flex-wrap items-center justify-center gap-3 px-6 py-4 text-xs">
            {(selected.includes("spend") && selected.includes("impressions")
              ? (["spend", "impressions"] as const)
              : selected
            ).map((id) => {
              const m = METRICS.find((x) => x.id === id)
              if (!m) return null
              return (
                <div key={id} className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-none"
                    style={{ backgroundColor: m.chartColor }}
                  />
                  <span className="text-foreground">{m.label}</span>
                </div>
              )
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
