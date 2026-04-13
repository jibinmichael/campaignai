import { CalendarRange, Home, LayoutDashboard, PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TAB_CAMPAIGN_HOME = "campaign-home"
const TAB_DASHBOARD = "dashboard"
const TAB_CAMPAIGN_PLANNER = "campaign-planner"

export type SiteTab =
  | typeof TAB_CAMPAIGN_HOME
  | typeof TAB_DASHBOARD
  | typeof TAB_CAMPAIGN_PLANNER

export const DEFAULT_SITE_TAB: SiteTab = TAB_CAMPAIGN_HOME

type SiteHeaderProps = {
  activeTab: SiteTab
  onTabChange: (tab: SiteTab) => void
}

export function SiteHeader({ activeTab, onTabChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center gap-4 px-4 md:gap-6 md:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <Avatar className="grayscale">
            <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
            <AvatarFallback>PP</AvatarFallback>
            <AvatarBadge>
              <PlusIcon />
            </AvatarBadge>
          </Avatar>
          <a href="/" className="text-sm font-semibold tracking-tight text-foreground">
            Campaign AI
          </a>
        </div>

        <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">
          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as SiteTab)}
            className="w-full max-w-xl"
          >
            <TabsList className="w-full min-w-0 sm:w-auto">
              <TabsTrigger value={TAB_CAMPAIGN_HOME} className="gap-1.5">
                <Home className="size-4" />
                Campaign home
              </TabsTrigger>
              <TabsTrigger value={TAB_DASHBOARD} className="gap-1.5">
                <LayoutDashboard className="size-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value={TAB_CAMPAIGN_PLANNER} className="gap-1.5">
                <CalendarRange className="size-4" />
                Campaign planner
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  )
}
