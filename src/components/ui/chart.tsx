"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  valueAlignment = "spread",
  payloadListClassName,
  itemClassName,
  textAlign: textAlignProp = "left",
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    /** `spread`: label left, value right. `inline`: both left with gap (easier to scan). */
    valueAlignment?: "spread" | "inline"
    /** Merged onto the list wrapper around payload rows (e.g. `gap-2.5`). */
    payloadListClassName?: string
    /** Merged onto each payload row (e.g. `gap-2.5` between indicator and text). */
    itemClassName?: string
    /** Tooltip content alignment; `right` aligns label and rows to the trailing edge. */
    textAlign?: "left" | "right"
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()
  const textAlign = textAlignProp
  const isRtl = textAlign === "right"

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div
          className={cn(
            "font-medium",
            isRtl && "w-full text-right",
            labelClassName
          )}
        >
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return (
      <div
        className={cn("font-medium", isRtl && "w-full text-right", labelClassName)}
      >
        {value}
      </div>
    )
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
    isRtl,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        isRtl ? "items-end text-right" : "items-start text-left",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className={cn("grid gap-1.5", payloadListClassName)}>
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  isRtl ? "items-center justify-end" : "items-stretch",
                  indicator === "dot" && "items-center",
                  itemClassName
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {isRtl ? (
                      <div className="flex w-full justify-end">
                        <div
                          className={cn(
                            "flex min-w-0 max-w-full items-center gap-2 leading-snug",
                            indicator === "dot" && "items-center"
                          )}
                        >
                          {itemConfig?.icon ? (
                            <itemConfig.icon />
                          ) : (
                            !hideIndicator && (
                              <div
                                className={cn(
                                  "shrink-0 rounded-none border-(--color-border) bg-(--color-bg)",
                                  {
                                    "h-2.5 w-2.5": indicator === "dot",
                                    "w-1": indicator === "line",
                                    "w-0 border-[1.5px] border-dashed bg-transparent":
                                      indicator === "dashed",
                                    "my-0.5": nestLabel && indicator === "dashed",
                                  }
                                )}
                                style={
                                  {
                                    "--color-bg": indicatorColor,
                                    "--color-border": indicatorColor,
                                  } as React.CSSProperties
                                }
                              />
                            )
                          )}
                          <div
                            className={cn(
                              "flex min-w-0 leading-snug",
                              valueAlignment === "inline"
                                ? nestLabel
                                  ? "flex-col items-end gap-1.5"
                                  : "flex-row flex-wrap items-baseline justify-end gap-x-3 gap-y-1"
                                : nestLabel
                                  ? "flex-col items-end gap-1.5"
                                  : "items-center justify-end gap-3"
                            )}
                          >
                            <div
                              className={cn(
                                "grid gap-1.5",
                                valueAlignment === "inline" && !nestLabel && "gap-0",
                                "text-right"
                              )}
                            >
                              {nestLabel ? tooltipLabel : null}
                              <span className="text-right text-muted-foreground">
                                {itemConfig?.label ?? item.name}
                              </span>
                            </div>
                            {item.value != null && (
                              <span
                                className={cn(
                                  "text-right font-mono font-medium text-foreground tabular-nums",
                                  valueAlignment === "inline" && "shrink-0"
                                )}
                              >
                                {typeof item.value === "number"
                                  ? item.value.toLocaleString()
                                  : String(item.value)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {itemConfig?.icon ? (
                          <itemConfig.icon />
                        ) : (
                          !hideIndicator && (
                            <div
                              className={cn(
                                "shrink-0 rounded-none border-(--color-border) bg-(--color-bg)",
                                {
                                  "h-2.5 w-2.5": indicator === "dot",
                                  "w-1": indicator === "line",
                                  "w-0 border-[1.5px] border-dashed bg-transparent":
                                    indicator === "dashed",
                                  "my-0.5": nestLabel && indicator === "dashed",
                                }
                              )}
                              style={
                                {
                                  "--color-bg": indicatorColor,
                                  "--color-border": indicatorColor,
                                } as React.CSSProperties
                              }
                            />
                          )
                        )}
                        <div
                          className={cn(
                            "flex min-w-0 flex-1 leading-snug",
                            valueAlignment === "inline"
                              ? nestLabel
                                ? "flex-col items-start gap-1.5"
                                : "flex-row flex-wrap items-baseline justify-start gap-x-3 gap-y-1"
                              : nestLabel
                                ? "items-end justify-between"
                                : "items-center justify-between"
                          )}
                        >
                          <div
                            className={cn(
                              "grid gap-1.5",
                              valueAlignment === "inline" && !nestLabel && "gap-0",
                              valueAlignment === "spread" && "min-w-0 flex-1"
                            )}
                          >
                            {nestLabel ? tooltipLabel : null}
                            <span className="text-left text-muted-foreground">
                              {itemConfig?.label ?? item.name}
                            </span>
                          </div>
                          {item.value != null && (
                            <span
                              className={cn(
                                "font-mono font-medium text-foreground tabular-nums",
                                valueAlignment === "inline" && "shrink-0",
                                valueAlignment === "spread" && "shrink-0 text-right"
                              )}
                            >
                              {typeof item.value === "number"
                                ? item.value.toLocaleString()
                                : String(item.value)}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-none"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
