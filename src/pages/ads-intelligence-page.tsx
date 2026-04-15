import { AdsFunnelChartSection } from "@/components/ads-funnel-chart-section"
import { AdsFunnelMovesToolbar } from "@/components/ads-funnel-moves-toolbar"
import { AdsLifetimeSummaryCard } from "@/components/ads-lifetime-summary-card"
import { AdsReportingAdsTableSection } from "@/components/ads-reporting-ads-table-section"
import { AdsReportingFiltersRow } from "@/components/ads-reporting-filters-row"

export function AdsIntelligencePage() {
  return (
    <div className="app-content-gutter">
      <div className="app-dashboard-stack">
        <AdsLifetimeSummaryCard />
        <AdsFunnelMovesToolbar />
        <AdsReportingFiltersRow />
        <AdsFunnelChartSection />
        <AdsReportingAdsTableSection className="!mt-2" />
      </div>
    </div>
  )
}
