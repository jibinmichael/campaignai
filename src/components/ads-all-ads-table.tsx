import * as React from "react"
import { ChevronDownIcon, UploadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Figma PlYsn2j4gbkftQibcUwJNf / node 63:2122 */
const IMG_META_SYMBOL =
  "https://www.figma.com/api/mcp/asset/9e7487c1-2b89-4a5a-84de-7d14c4dce319"
const IMG_TIKTOK_INLINE =
  "https://www.figma.com/api/mcp/asset/10272e32-bc6e-4973-a704-d7644fab6e17"
const IMG_GOOGLE_INLINE =
  "https://www.figma.com/api/mcp/asset/0dd5dc38-c7e9-48e3-bb8b-27cc3d910f46"

function MetaBadge16({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "relative size-4 shrink-0 overflow-hidden rounded-2xl",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(-32.89deg, rgb(8, 105, 225) 20.46%, rgb(0, 100, 224) 88.17%)",
      }}
      {...props}
    >
      <img
        alt=""
        src={IMG_META_SYMBOL}
        className="pointer-events-none absolute inset-[20%] block size-[60%] max-w-none object-contain"
        draggable={false}
      />
    </div>
  )
}

function AdNameCell({
  variant,
  title,
  subtitle,
  nodeId,
}: {
  variant: "meta" | "tiktok" | "google"
  title: string
  subtitle: string
  nodeId: string
}) {
  return (
    <div
      className={cn(
        "flex min-w-[320px] max-w-[320px] shrink-0 items-start gap-2 overflow-hidden border-r border-solid border-[#e7e9e8] bg-white px-4 py-3"
      )}
      data-node-id={nodeId}
    >
      {variant === "meta" && <MetaBadge16 data-node-id="63:2142" />}
      {variant === "tiktok" && (
        <span
          className="relative flex size-[18px] shrink-0 items-center justify-center rounded-[32px] bg-black p-1"
          data-node-id="63:2264"
        >
          <span className="relative size-2.5 shrink-0" data-node-id="63:2265">
            <img
              alt=""
              src={IMG_TIKTOK_INLINE}
              className="absolute inset-0 block size-full max-w-none"
              draggable={false}
            />
          </span>
        </span>
      )}
      {variant === "google" && (
        <span
          className="relative flex size-[18px] shrink-0 items-center justify-center rounded-[32px] bg-[#f5f5f1] p-1"
          data-node-id="63:2273"
        >
          <span className="relative size-2.5 shrink-0" data-node-id="63:2274">
            <img
              alt=""
              src={IMG_GOOGLE_INLINE}
              className="absolute inset-0 block size-full max-w-none"
              draggable={false}
            />
          </span>
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0 text-[#353735]">
        <p className="text-sm font-medium leading-5">{title}</p>
        <p className="text-xs font-normal leading-4 text-[#848a86]">{subtitle}</p>
      </div>
    </div>
  )
}

function MetricCells({
  spend,
  conversations,
  cost,
  semibold,
  spendId,
  convId,
  costId,
}: {
  spend: string
  conversations: string
  cost: string
  semibold?: boolean
  spendId: string
  convId: string
  costId: string
}) {
  const valueClass = cn(
    "text-sm leading-5 text-[#353735]",
    semibold ? "font-semibold" : "font-normal"
  )
  return (
    <>
      <div
        className="flex w-[124px] shrink-0 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3"
        data-node-id={spendId}
      >
        <p className={cn(valueClass, "w-full text-right")}>{spend}</p>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3">
        <p className={cn(valueClass, "whitespace-nowrap")} data-node-id={convId}>
          {conversations}
        </p>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3">
        <p className={cn(valueClass, "whitespace-nowrap text-center")} data-node-id={costId}>
          {cost}
        </p>
      </div>
    </>
  )
}

function ActionsCell({ nodeId }: { nodeId: string }) {
  return (
    <div
      className="flex w-[164px] shrink-0 items-center gap-2 overflow-hidden bg-white px-6 py-3"
      data-node-id={nodeId}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#23a455] px-2 py-1 text-sm font-medium leading-5 text-white outline-none hover:bg-[#1f9350] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Retarget
            <ChevronDownIcon className="size-4 shrink-0 text-white" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          <DropdownMenuItem>Create retargeting audience</DropdownMenuItem>
          <DropdownMenuItem>Duplicate rule</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-7 shrink-0 rounded-lg border-[#e7e9e8] bg-[#f6f7f6] hover:bg-[#ebebeb]"
        aria-label="Export row"
      >
        <UploadIcon className="size-4 text-[#353735]" strokeWidth={1.75} />
      </Button>
    </div>
  )
}

export function AdsAllAdsTable({ className }: { className?: string }) {
  const subtitle = "September 2024 → October"
  const title = "American cat lovers ctwa ads "

  return (
    <div
      className={cn("w-full overflow-x-auto rounded border border-solid border-[#e7e9e8] bg-white", className)}
      data-node-id="63:2122"
    >
      <div className="flex min-w-[880px] flex-col">
        {/* Header */}
        <div
          className="flex w-full shrink-0 items-stretch overflow-hidden bg-[#f3f5f7]"
          data-node-id="63:2123"
        >
          <div
            className="flex min-w-[320px] max-w-[320px] shrink-0 items-center self-stretch border-b border-r border-solid border-[#e7e9e8] p-4"
            data-node-id="63:2124"
          >
            <p
              className="w-[134px] text-sm font-semibold leading-5 text-[#1b1d1c]"
              data-node-id="63:2125"
            >
              Ad name
            </p>
          </div>
          <div
            className="flex w-[124px] shrink-0 items-center justify-end self-stretch border-b border-r border-solid border-[#e7e9e8] px-3 py-4"
            data-node-id="63:2126"
          >
            <div className="flex items-center gap-1 p-px" data-node-id="63:2127">
              <MetaBadge16 data-node-id="63:2128" />
              <p
                className="whitespace-nowrap text-sm font-semibold leading-5 text-[#1b1d1c]"
                data-node-id="63:2131"
              >
                Ad Spend
              </p>
            </div>
          </div>
          <div
            className="flex min-w-0 flex-1 items-center justify-end self-stretch border-b border-r border-solid border-[#e7e9e8] px-3 py-4"
            data-node-id="63:2132"
          >
            <p
              className="max-w-full truncate text-sm font-semibold leading-5 text-[#1b1d1c]"
              data-node-id="63:2134"
            >
              Conversations started
            </p>
          </div>
          <div
            className="flex min-w-0 flex-1 items-center justify-end self-stretch border-b border-r border-solid border-[#e7e9e8] px-3 py-4"
            data-node-id="63:2135"
          >
            <p
              className="max-w-full truncate text-sm font-semibold leading-5 text-[#1b1d1c]"
              data-node-id="63:2137"
            >
              Cost/conversation
            </p>
          </div>
          <div
            className="flex w-[164px] shrink-0 items-center self-stretch border-b border-solid border-[#e7e9e8] px-6 py-4"
            data-node-id="63:2138"
          >
            <p
              className="whitespace-nowrap text-sm font-semibold leading-5 text-[#1b1d1c]"
              data-node-id="63:2139"
            >
              Actions
            </p>
          </div>
        </div>

        {/* Row 1 Meta */}
        <div className="flex w-full shrink-0 items-stretch border-b border-solid border-[#e7e9e8]" data-node-id="63:2140">
          <AdNameCell variant="meta" title={title} subtitle={subtitle} nodeId="63:2141" />
          <MetricCells
            spend="$100"
            conversations="48"
            cost="$2.1"
            spendId="63:2146"
            convId="63:2148"
            costId="63:2150"
          />
          <ActionsCell nodeId="63:2152" />
        </div>

        {/* Row 2 TikTok */}
        <div className="flex w-full shrink-0 items-stretch border-b border-solid border-[#e7e9e8]" data-node-id="63:2220">
          <AdNameCell variant="tiktok" title={title} subtitle={subtitle} nodeId="63:2221" />
          <MetricCells
            spend="$100"
            conversations="48"
            cost="$2.1"
            spendId="63:2226"
            convId="63:2228"
            costId="63:2230"
          />
          <ActionsCell nodeId="63:2232" />
        </div>

        {/* Row 3 Google */}
        <div className="flex w-full shrink-0 items-stretch border-b border-solid border-[#e7e9e8]" data-node-id="63:2242">
          <AdNameCell variant="google" title={title} subtitle={subtitle} nodeId="63:2243" />
          <MetricCells
            spend="$100"
            conversations="48"
            cost="$2.1"
            spendId="63:2248"
            convId="63:2250"
            costId="63:2252"
          />
          <ActionsCell nodeId="63:2254" />
        </div>

        {/* Totals */}
        <div
          className="flex w-full shrink-0 items-stretch border-t border-solid border-[#e7e9e8]"
          data-node-id="63:2155"
        >
          <div
            className="h-16 min-w-[320px] max-w-[320px] shrink-0 border-r border-solid border-[#e7e9e8] bg-white"
            data-node-id="63:2156"
            aria-hidden
          />
          <div
            className="flex w-[124px] shrink-0 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3"
            data-node-id="63:2157"
          >
            <p
              className="w-full text-right text-sm font-semibold leading-5 text-[#353735]"
              data-node-id="63:2158"
            >
              $300
            </p>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3">
            <p
              className="whitespace-nowrap text-sm font-semibold leading-5 text-[#353735]"
              data-node-id="63:2160"
            >
              57812
            </p>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end self-stretch border-r border-solid border-[#e7e9e8] bg-white p-3">
            <p
              className="whitespace-nowrap text-center text-sm font-semibold leading-5 text-[#353735]"
              data-node-id="63:2162"
            >
              8912
            </p>
          </div>
          <div
            className="w-[164px] shrink-0 self-stretch bg-white"
            data-node-id="63:2163"
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
