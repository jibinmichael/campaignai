import { cn } from "@/lib/utils"

export type AdsFunnelMovesToolbarProps = {
  className?: string
  /**
   * First instance: true (default) — Figma `data-node-id`s on this block.
   * Duplicate instance: false — same UI, no `data-node-id`s (avoids duplicate ids in the DOM).
   */
  showFigmaNodeIds?: boolean
  /** Default true. Set false on a title-only row (subtitle hidden). */
  showSubtitle?: boolean
  /** Main heading above the subtitle (when shown). */
  title?: string
}

function figmaNode(
  show: boolean,
  id: string,
): { "data-node-id": string } | Record<string, never> {
  return show ? { "data-node-id": id } : {}
}

/** Figma PlYsn2j4gbkftQibcUwJNf / node 84:1339 */
export function AdsFunnelMovesToolbar({
  className,
  showFigmaNodeIds = true,
  showSubtitle = true,
  title = "Where your leads come from",
}: AdsFunnelMovesToolbarProps) {
  return (
    <div
      className={cn("flex w-full items-center gap-1 pl-0", className)}
      {...figmaNode(showFigmaNodeIds, "84:1339")}
    >
      <div
        className="flex min-h-0 min-w-0 max-w-full flex-[0_1_auto] flex-col justify-center gap-0.5 py-0.5 pl-0 pr-1 sm:max-w-md"
        {...figmaNode(showFigmaNodeIds, "84:1340")}
      >
        <p
          className="min-w-0 text-balance text-[16px] font-semibold leading-snug text-[#1b1d1c]"
          {...figmaNode(showFigmaNodeIds, "84:1341")}
        >
          {title}
        </p>
        {showSubtitle ? (
          <p
            className="min-w-0 text-pretty text-sm font-normal leading-snug text-[#848a86] sm:whitespace-nowrap"
            {...figmaNode(showFigmaNodeIds, "84:1397")}
          >
            Spend vs conversations, leads and purchases
          </p>
        ) : null}
      </div>
    </div>
  )
}
