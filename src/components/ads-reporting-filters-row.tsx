import * as React from "react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Figma PlYsn2j4gbkftQibcUwJNf / node 88:1468 — MCP asset (~7d TTL). */
const IMG_CHEVRON_DOWN =
  "https://www.figma.com/api/mcp/asset/4c592c00-18f5-48d4-ab50-7d24165d0582"

const outlineMenuButtonClass =
  "inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#d4d4d4] bg-white px-3 py-1.5 text-sm font-medium leading-5 text-[#0a0a0a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-muted/40"

function MenuChevron({
  "data-node-id": dataNodeId,
}: {
  "data-node-id"?: string
}) {
  return (
    <span
      className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden"
      aria-hidden
      data-node-id={dataNodeId}
    >
      <img
        alt=""
        src={IMG_CHEVRON_DOWN}
        className="block h-[4.5px] w-2 max-w-none"
      />
    </span>
  )
}

/** Figma PlYsn2j4gbkftQibcUwJNf / node 88:1468 */
export function AdsReportingFiltersRow({ className }: { className?: string }) {
  const [accountScope, setAccountScope] = React.useState("all")

  return (
    <div
      className={cn("flex w-full items-center gap-3 py-2", className)}
      data-node-id="88:1468"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={outlineMenuButtonClass}
            data-node-id="88:1534"
          >
            <span data-node-id="I88:1534;8:196">
              {accountScope === "all" ? "All Accounts" : "Selected account"}
            </span>
            <MenuChevron data-node-id="I88:1534;1495:14442" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          <DropdownMenuItem
            onSelect={() => setAccountScope("all")}
            className={accountScope === "all" ? "font-medium" : undefined}
          >
            All Accounts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={outlineMenuButtonClass}
            data-node-id="88:1528"
          >
            <span data-node-id="I88:1528;8:196">Filter by</span>
            <MenuChevron data-node-id="I88:1528;1495:14442" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          <DropdownMenuItem>All activity</DropdownMenuItem>
          <DropdownMenuItem>Qualified leads only</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
