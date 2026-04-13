import { cn } from "@/lib/utils"

const DEFAULT_DESCRIPTION =
  "How ready your audience is to act — not just browse"

type CampaignIntentScoreProps = {
  /** 0–100; drives fill width */
  score: number
  /** e.g. "↑ 8 pts vs last month" */
  trend: string
  /** Green when true, red when false */
  trendPositive: boolean
  /** Subcopy under trend */
  description?: string
  className?: string
}

export function CampaignIntentScore({
  score,
  trend,
  trendPositive,
  description = DEFAULT_DESCRIPTION,
  className,
}: CampaignIntentScoreProps) {
  const pct = Math.min(100, Math.max(0, score))
  const trendColor = trendPositive ? "#3A9459" : "#dc2626"

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-[18px]">
        <p
          className="shrink-0 tabular-nums leading-none"
          style={{
            fontSize: 72,
            fontWeight: 500,
            letterSpacing: "-4px",
            color: "#111",
          }}
        >
          {Math.round(score)}
        </p>
        <div className="flex min-w-0 flex-col gap-1">
          <p
            className="font-medium leading-snug"
            style={{ fontSize: 13, color: trendColor }}
          >
            {trend}
          </p>
          <p className="leading-snug" style={{ fontSize: 12, color: "#BBB" }}>
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div
          className="h-2 w-full rounded-[4px]"
          style={{ background: "#F0F0EB" }}
        >
          <div
            className="h-full rounded-[4px]"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, #C8E6C9 0%, #3A9459 100%)",
            }}
          />
        </div>
        <div
          className="mt-2 flex w-full justify-between"
          style={{ fontSize: 11, color: "#BBB" }}
        >
          <span>0 — audience drifting</span>
          <span>100 — audience converting</span>
        </div>
      </div>
    </div>
  )
}
