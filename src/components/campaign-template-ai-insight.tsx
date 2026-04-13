import * as React from "react"

import { cn } from "@/lib/utils"

const ANALYZE_MS = 2800

/** `Brain-logomark-gradient.svg` from brand assets, served from `public/`. */
export const DEFAULT_CAMPAIGN_AI_ICON_SRC = "/brain-logomark-gradient.svg"

type Phase = "analyzing" | "ready"

export type CampaignTemplateAiInsightProps = {
  templateId: string
  /** Override AI mark (defaults to gradient brain in `public/brain-logomark-gradient.svg`). */
  assistantIconSrc?: string
}

export function CampaignTemplateAiInsight({
  templateId,
  assistantIconSrc = DEFAULT_CAMPAIGN_AI_ICON_SRC,
}: CampaignTemplateAiInsightProps) {
  const [phase, setPhase] = React.useState<Phase>("analyzing")

  React.useEffect(() => {
    if (!templateId) return
    setPhase("analyzing")
    const id = window.setTimeout(() => setPhase("ready"), ANALYZE_MS)
    return () => window.clearTimeout(id)
  }, [templateId])

  if (!templateId) return null

  const analyzing = phase === "analyzing"

  return (
    <div className="flex gap-2.5 pt-1">
      <div
        className="flex size-5 shrink-0 items-center justify-center pt-0.5"
        aria-hidden
      >
        <img
          src={assistantIconSrc}
          alt=""
          className={cn(
            "size-4 object-contain",
            analyzing && "motion-safe:animate-spin"
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        {analyzing ? (
          <p className="campaign-ai-analyze-shimmer text-[12px] font-normal leading-snug">
            Analyzing audience segments, engagement intent, and template fit…
          </p>
        ) : (
          <p className="text-[12px] font-normal leading-snug text-muted-foreground">
            Given your audience&apos;s engagement intent and this template,
            two message variants with a split audience could lift engagement.
          </p>
        )}
      </div>
    </div>
  )
}
