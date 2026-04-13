import * as React from "react"
import { Link } from "react-router-dom"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignEngagementCalendar } from "@/components/campaign-engagement-calendar"
import { CampaignDeliveryEngagement } from "@/components/campaign-delivery-engagement"
import {
  PerformanceOverChart,
  PerformanceOverChartHeaderRow,
} from "@/components/performance-over-chart"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardPage() {
  const [tab, setTab] = React.useState("1d")
  const [rangeOpen, setRangeOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  return (
    <div className="app-content-gutter">
      <div className="app-dashboard-stack">
        <div className="rounded-md py-[12px]">
          <div className="app-dashboard-header-row">
            <h2 className="app-dashboard-title">Dashboard</h2>
            <div className="app-dashboard-toolbar">
              <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
                <Tabs
                  value={tab}
                  onValueChange={(v) => {
                    setTab(v)
                    if (v === "custom") setRangeOpen(true)
                    else setRangeOpen(false)
                  }}
                  className="w-full sm:w-auto"
                >
                  <TabsList variant="default" className="app-range-tabs-list">
                    <TabsTrigger value="1d">1D</TabsTrigger>
                    <TabsTrigger value="1w">1W</TabsTrigger>
                    <TabsTrigger value="1m">1M</TabsTrigger>
                    <PopoverAnchor asChild>
                      <TabsTrigger
                        value="custom"
                        onClick={() => setRangeOpen(true)}
                      >
                        Custom range
                      </TabsTrigger>
                    </PopoverAnchor>
                  </TabsList>
                  <TabsContent value="1d" className="hidden" />
                  <TabsContent value="1w" className="hidden" />
                  <TabsContent value="1m" className="hidden" />
                  <TabsContent value="custom" className="hidden" />
                </Tabs>
                <PopoverContent
                  align="end"
                  className="w-auto p-0"
                  sideOffset={8}
                >
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="default"
                className="shrink-0 rounded-full"
                asChild
              >
                <Link to="/campaigns/new">Create New</Link>
              </Button>
            </div>
          </div>
        </div>

        <PerformanceOverChart className="mb-[6px]" />
        <CampaignDeliveryEngagement />
        <Card
          className={cn(
            "gap-0 rounded-[4px] border border-black-100 py-0 ring-0"
          )}
        >
          <PerformanceOverChartHeaderRow
            title="Engagement Heatmap"
            description="From April 1st, 2026 to April 30th, 2026"
          />
          <CardContent className="border-0 px-6 py-4">
            <CampaignEngagementCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
