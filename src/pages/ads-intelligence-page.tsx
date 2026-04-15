import * as React from "react"
import type { DateRange } from "react-day-picker"

import { AdsFunnelChartSection } from "@/components/ads-funnel-chart-section"
import { AdsFunnelMovesToolbar } from "@/components/ads-funnel-moves-toolbar"
import { AdsLifetimeSummaryCard } from "@/components/ads-lifetime-summary-card"
import { AdsReportingAdsTableSection } from "@/components/ads-reporting-ads-table-section"
import { AdsReportingFiltersRow } from "@/components/ads-reporting-filters-row"

export function AdsIntelligencePage() {
  const [range, setRange] = React.useState("1d")
  const [rangeOpen, setRangeOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const funnelToolbarProps = {
    range,
    onRangeChange: setRange,
    rangeOpen,
    onRangeOpenChange: setRangeOpen,
    dateRange,
    onDateRangeChange: setDateRange,
  }

  return (
    <div className="app-content-gutter">
      <div className="app-dashboard-stack">
        <AdsLifetimeSummaryCard />
        <AdsFunnelMovesToolbar
          {...funnelToolbarProps}
          showFigmaNodeIds={false}
          title="Ad Performance"
        />
        <AdsReportingFiltersRow />
        <AdsFunnelChartSection />
        <AdsReportingAdsTableSection className="!mt-2" />
      </div>
    </div>
  )
}
