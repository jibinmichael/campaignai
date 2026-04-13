import * as React from "react"
import { HelpCircleIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { AudienceSearchInputGroup } from "@/components/audience-search-input-group"
import { AudienceSegmentsMultiSelect } from "@/components/audience-segments-multi-select"
import { AudienceIntentBreakdownCard } from "@/components/audience-intent-breakdown-card"
import { SendWindowHourlyChart } from "@/components/send-window-hourly-chart"
import { getAudienceBreakdownForSegments } from "@/data/audience-breakdown"
import { CAMPAIGN_OBJECTIVES } from "@/data/campaign-objectives"

const CAMPAIGN_TYPES = [
  { id: "marketing", label: "Marketing" },
  { id: "utility", label: "Utility" },
] as const

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const [campaignTypeId, setCampaignTypeId] = React.useState<string>(
    CAMPAIGN_TYPES[0]!.id
  )
  const [objectiveId, setObjectiveId] = React.useState<string>(
    CAMPAIGN_OBJECTIVES[0]!.id
  )
  const [audienceSegmentIds, setAudienceSegmentIds] = React.useState<string[]>(
    []
  )
  const [audienceQuery, setAudienceQuery] = React.useState("")

  const audienceBreakdown = React.useMemo(
    () => getAudienceBreakdownForSegments(audienceSegmentIds),
    [audienceSegmentIds]
  )

  const closeToDashboard = React.useCallback(() => {
    navigate("/")
  }, [navigate])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <Dialog
        defaultOpen
        onOpenChange={(open) => {
          if (!open) closeToDashboard()
        }}
      >
        <DialogContent
          showCloseButton
          className="top-[4vh] bottom-[4vh] max-h-none w-[min(73vw,57rem)] max-w-none gap-0 overflow-hidden p-0 sm:max-w-none"
        >
          <DialogHeader className="py-6">
            <DialogTitle className="text-sm font-semibold tracking-tight">
              Plan campaign
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background lg:flex-row">
            <aside className="flex w-full min-h-[min(40vh,24rem)] shrink-0 flex-col border-border/50 bg-background lg:min-h-0 lg:min-w-0 lg:max-w-[min(800px,58%)] lg:flex-1 lg:border-r">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
                <div className="space-y-1.5">
                  <h2 className="text-[12px] font-normal leading-snug tracking-tight text-foreground">
                    Choose campaign type
                  </h2>
                  <Select
                    value={campaignTypeId}
                    onValueChange={setCampaignTypeId}
                  >
                    <SelectTrigger
                      id="campaign-type"
                      aria-label="Campaign type"
                      className="w-full max-w-md border-black-100 bg-background"
                    >
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      className="min-w-[var(--radix-select-trigger-width)]"
                    >
                      {CAMPAIGN_TYPES.map((t) => (
                        <SelectItem
                          key={t.id}
                          value={t.id}
                          textValue={t.label}
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-[12px] font-normal leading-snug tracking-tight text-foreground">
                    Choose campaign objective
                  </h2>
                  <Select value={objectiveId} onValueChange={setObjectiveId}>
                    <SelectTrigger
                      id="campaign-objective"
                      aria-label="Campaign objective"
                      className="w-full max-w-md border-black-100 bg-background"
                    >
                      <SelectValue placeholder="Objective" />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      className="min-w-[var(--radix-select-trigger-width)]"
                    >
                      {CAMPAIGN_OBJECTIVES.map((o) => (
                        <SelectItem
                          key={o.id}
                          value={o.id}
                          textValue={o.label}
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h2 className="text-[12px] font-normal leading-snug tracking-tight text-foreground">
                    Choose audience segments
                  </h2>
                  <AudienceSegmentsMultiSelect
                    id="campaign-audience-segments"
                    value={audienceSegmentIds}
                    onChange={setAudienceSegmentIds}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="campaign-audience"
                    className="text-[12px] font-normal leading-snug tracking-tight text-foreground"
                  >
                    Or define the audience
                  </Label>
                  <AudienceSearchInputGroup
                    id="campaign-audience"
                    className="max-w-md border-black-100"
                    value={audienceQuery}
                    onChange={setAudienceQuery}
                  />
                </div>

                <div className="space-y-2 pb-[6px] pt-8">
                  <div className="mb-[6px] flex items-center gap-1">
                    <h2 className="text-[12px] font-medium leading-snug tracking-tight text-foreground">
                      Best time to send
                    </h2>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label="About best time to send"
                        >
                          <HelpCircleIcon
                            className="size-3.5"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="start"
                        className="max-w-xs text-[12px]"
                      >
                        <p className="leading-snug text-muted-foreground">
                          We suggest a send window from your audience&apos;s
                          recent engagement patterns. You can refine this after
                          the campaign is created.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <SendWindowHourlyChart
                    footer={
                      <Button type="button" size="lg" onClick={() => {}}>
                        Create campaign
                      </Button>
                    }
                  />
                </div>
              </div>
            </aside>

            <section className="relative flex min-h-[min(36vh,20rem)] w-full shrink-0 flex-col bg-background lg:min-h-0 lg:min-w-0 lg:w-[min(22rem,36vw)] lg:max-w-[22rem] xl:max-w-[24rem]">
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
                <AudienceIntentBreakdownCard
                  breakdown={audienceBreakdown}
                  betweenPieAndIntelligence={
                    <div className="flex flex-col items-center pb-2 pt-1 text-center">
                      <p className="text-[12px] font-medium leading-snug text-foreground">
                        Potential engagement score{" "}
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">
                          89
                        </span>
                      </p>
                    </div>
                  }
                />
                <div
                  className="mt-6 shrink-0 rounded-t-xl border border-border/70 bg-muted/45 px-3 py-2.5 shadow-[0_-6px_18px_-8px_rgba(15,23,42,0.12)] dark:shadow-[0_-6px_18px_-8px_rgba(0,0,0,0.35)]"
                  role="region"
                  aria-label="Data freshness"
                >
                  <p className="text-[10px] font-normal leading-snug text-muted-foreground">
                    Intelligence is based on last 7 days data. For more accurate
                    data, sync historical data.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 w-full border-border/80 px-2 text-[10px] font-medium"
                    onClick={() => {}}
                  >
                    Sync last 90 days
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
