import { Link, useSearchParams } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PhonePreviewFrame } from "@/components/phone-preview-frame"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCampaignObjective,
  CAMPAIGN_OBJECTIVES,
} from "@/data/campaign-objectives"

export function ChooseCampaignTemplatePage() {
  const [params] = useSearchParams()
  const rawObjective = params.get("objective")
  const objective =
    getCampaignObjective(rawObjective) ??
    CAMPAIGN_OBJECTIVES[0]!

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col px-0">
      <div className="shrink-0 border-b border-border/50 bg-background px-6 py-4 md:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/campaigns/new">Create new campaign</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Choose message template</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Choose message template
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <span>Goal:</span>
          <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {objective.label}
          </span>
          {objective.subtitle ? (
            <span>— {objective.subtitle}</span>
          ) : null}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-muted/50">
        <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row">
          <aside className="flex w-full min-h-[50vh] shrink-0 flex-col border-border/50 bg-background lg:min-h-0 lg:min-w-0 lg:max-w-[min(720px,52vw)] lg:flex-none lg:border-r xl:max-w-[min(800px,50vw)]">
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 md:px-8">
              <div className="space-y-2">
                <Skeleton className="h-3 w-40" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </aside>

          <section className="relative flex min-h-[40vh] w-full min-w-0 flex-1 flex-col bg-muted/40 lg:min-h-0">
            <div className="absolute top-4 right-4 flex gap-2">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            <div className="grid min-h-0 w-full flex-1 place-content-center place-items-center px-5 py-8">
              <div className="-translate-y-2 justify-self-center">
                <PhonePreviewFrame />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
