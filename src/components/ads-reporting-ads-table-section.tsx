import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
/** Figma MCP assets (~7d TTL) — match ads lifetime card platform marks. */
const IMG_ADS_META =
  "https://www.figma.com/api/mcp/asset/479c62fb-bb5d-4e6c-9cee-634d6001da85"
const IMG_ADS_TIKTOK =
  "https://www.figma.com/api/mcp/asset/5fe73961-ff5b-4d44-816a-b69fdb138873"
const IMG_ADS_GOOGLE =
  "https://www.figma.com/api/mcp/asset/acff34b3-e646-485c-b8ef-1b8711c4e069"
/** Status icons: 1px stroke (Linear DS–aligned); Completed ≈ Figma node 22:1823 (check-in-circle). */
const STATUS_ICON_STROKE = 1

/** Table metric values — 12px mono, regular weight, grey-700 tone. */
const monoNum =
  "font-['JetBrains_Mono',monospace] text-[12px] font-normal tabular-nums tracking-tight leading-none text-[#4b5563]"

type Platform = "meta" | "tiktok" | "google"

type MetricValues = {
  spend: string
  impressions: string
  clicks: string
  ctr: string
  reach: string
  frequency: string
  conversations: string
  costPerMessage: string
  costPerConversation: string
  cpcLink: string
  purchases: string
  roas: string
}

type AdsTableRow = {
  id: string
  platform: Platform
  adName: string
  dateRange: string
  metrics: MetricValues
}

const METRIC_COLUMNS: {
  key: keyof MetricValues
  label: string
  nodeSuffix: string
}[] = [
  { key: "spend", label: "Ad Spend", nodeSuffix: "2750" },
  { key: "impressions", label: "Impressions", nodeSuffix: "ext-imp" },
  { key: "clicks", label: "Clicks", nodeSuffix: "ext-clk" },
  { key: "ctr", label: "CTR", nodeSuffix: "ext-ctr" },
  { key: "reach", label: "Reach", nodeSuffix: "ext-reach" },
  { key: "frequency", label: "Frequency", nodeSuffix: "ext-freq" },
  { key: "conversations", label: "Conversations started", nodeSuffix: "2756" },
  { key: "costPerMessage", label: "Cost per message", nodeSuffix: "2913" },
  { key: "costPerConversation", label: "Cost/conversation", nodeSuffix: "2759" },
  { key: "cpcLink", label: "CPC (link)", nodeSuffix: "ext-cpc" },
  { key: "purchases", label: "Purchases", nodeSuffix: "ext-pur" },
  { key: "roas", label: "ROAS", nodeSuffix: "ext-roas" },
]

const TOTALS_ROW: MetricValues = {
  spend: "$300",
  impressions: "1.2M",
  clicks: "48.2k",
  ctr: "4.02%",
  reach: "890k",
  frequency: "1.35",
  conversations: "57812",
  costPerMessage: "$12.00",
  costPerConversation: "8912",
  cpcLink: "$0.62",
  purchases: "3.4k",
  roas: "3.2:1",
}

function rowMetrics(
  platform: Platform,
  i: number
): MetricValues {
  const bump = i * 0.12
  return {
    spend: "$100",
    impressions: `${(120 + i * 8).toFixed(1)}k`,
    clicks: `${(2.4 + bump).toFixed(1)}k`,
    ctr: `${(3.8 + bump * 0.1).toFixed(2)}%`,
    reach: `${(88 + i * 3).toFixed(0)}k`,
    frequency: `${(1.2 + bump * 0.05).toFixed(2)}`,
    conversations: String(48 + i * 3),
    costPerMessage:
      platform === "tiktok" ? "$1.00" : platform === "google" ? "$4.80" : "$2.00",
    costPerConversation: "$2.1",
    cpcLink: `$${(0.45 + bump * 0.02).toFixed(2)}`,
    purchases: String(12 + i * 2),
    roas: `${(2.8 + bump * 0.1).toFixed(1)}:1`,
  }
}

const AD_ROW_TEMPLATES: { adName: string; dateRange: string }[] = [
  { adName: "Summer flash — BOGO", dateRange: "Jun 2025 → Jul 2025" },
  {
    adName:
      "Enterprise B2B lead gen — whitepaper download + booked demo funnel, remarketing to 180d site visitors excluding converters",
    dateRange: "Jan 2026 → Mar 2026",
  },
  { adName: "App install SKAN", dateRange: "Nov 2025 → Dec 2025" },
  {
    adName:
      "Holiday gifting carousel — dynamic product ads for high-LTV customers in tier-1 cities with creative rotation A/B/C and UTM hygiene",
    dateRange: "Oct 2025 → Jan 2026",
  },
  { adName: "Brand lift study control", dateRange: "Aug 2025 → Sep 2025" },
  {
    adName:
      "American cat lovers CTWA — prospecting broad + interest stacking (pets, home decor) with Advantage+ shopping and cost cap",
    dateRange: "Sep 2024 → Oct 2025",
  },
  { adName: "Reels spark ads test", dateRange: "Feb 2026 → present" },
  {
    adName:
      "LATAM Spanish/Portuguese split — conversion optimized for purchase with catalog sets per country and localized headlines (long copy test)",
    dateRange: "May 2025 → Aug 2025",
  },
  { adName: "Lapsed buyers winback", dateRange: "Dec 2025 → Feb 2026" },
  {
    adName:
      "Search + PMax hybrid — brand defense + generic non-brand with negative keyword lists updated weekly and offline conversion import",
    dateRange: "Jul 2025 → present",
  },
  { adName: "Student discount push", dateRange: "Aug 2025 → Sep 2025" },
  {
    adName:
      "Creator whitelisting — 15s hooks, spark partnership, usage rights through Q4, dark post + public post duplication with CTA variants",
    dateRange: "Mar 2025 → Jun 2025",
  },
  { adName: "Free trial signup", dateRange: "Jan 2026 → Feb 2026" },
  {
    adName:
      "Cross-sell upsell sequence — post-purchase 7/14/30 day touchpoints, suppressed if refund or chargeback in last 90 days",
    dateRange: "Apr 2025 → present",
  },
  { adName: "Brand catalog remarketing", dateRange: "Mar 2026 → present" },
]

const TABLE_ROWS: AdsTableRow[] = Array.from({ length: 15 }, (_, i) => {
  const platforms: Platform[] = ["meta", "tiktok", "google"]
  const meta = AD_ROW_TEMPLATES[i] ?? AD_ROW_TEMPLATES[0]!
  return {
    id: String(i + 1),
    platform: platforms[i % 3]!,
    adName: meta.adName,
    dateRange: meta.dateRange,
    metrics: rowMetrics(platforms[i % 3]!, i),
  }
})

function PlatformBadge({ platform }: { platform: Platform }) {
  const src =
    platform === "meta"
      ? IMG_ADS_META
      : platform === "tiktok"
        ? IMG_ADS_TIKTOK
        : IMG_ADS_GOOGLE
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent"
      aria-hidden
    >
      <img alt="" src={src} className="size-4 object-contain" />
    </div>
  )
}

type AdCampaignStatus = "active" | "paused" | "completed"

/** Deterministic mix across demo rows: Active / Completed / Paused. */
function adCampaignStatusForRowId(rowId: string): AdCampaignStatus {
  const n = Number.parseInt(rowId, 10)
  if (!Number.isFinite(n)) return "paused"
  const r = n % 5
  if (r === 0) return "active"
  if (r === 1) return "completed"
  return "paused"
}

function AdCampaignStatusCell({ status }: { status: AdCampaignStatus }) {
  const iconCls = "size-4 shrink-0 text-gray-600"
  const icon =
    status === "active" ? (
      <LoaderCircleIcon
        className={iconCls}
        strokeWidth={STATUS_ICON_STROKE}
        aria-hidden
        data-node-id="22:1386"
      />
    ) : status === "completed" ? (
      <CheckCircle2Icon
        className={iconCls}
        strokeWidth={STATUS_ICON_STROKE}
        aria-hidden
        data-node-id="22:1823"
      />
    ) : (
      <CircleIcon
        className={iconCls}
        strokeWidth={STATUS_ICON_STROKE}
        aria-hidden
        data-node-id="19:743"
      />
    )
  const label =
    status === "active"
      ? "Active"
      : status === "completed"
        ? "Completed"
        : "Paused"
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-gray-600">
      {icon}
      <span className="truncate text-[12px] font-medium">{label}</span>
    </div>
  )
}

/** Sticky first column — minimal depth, thin edge line (reference-style). */
const FROZEN_LEFT_SHADOW =
  "shadow-[1px_0_4px_-1px_rgba(0,0,0,0.04)] after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#e5e7eb] after:content-['']"

/** Sticky actions column */
const FROZEN_RIGHT_SHADOW =
  "shadow-[-1px_0_4px_-1px_rgba(0,0,0,0.04)] before:pointer-events-none before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-[#e5e7eb] before:content-['']"

/**
 * Fixed-height sticky thead rows — `top-12` on row 2 must match row 1 height (`h-12`)
 * so the totals band stays aligned while vertical scrolling.
 */
const THEAD_ROW_FIXED =
  "box-border h-12 min-h-12 max-h-12 py-2 align-middle leading-none"

/** Column header labels — 12px medium, gray-900. */
const TABLE_HEADER_TEXT =
  "text-[12px] font-medium leading-none text-gray-900"
/** Metric column titles — same mono stack as numeric cells for alignment. */
const TABLE_HEADER_METRIC_TITLE =
  "font-['JetBrains_Mono',monospace] text-[12px] font-medium tabular-nums tracking-tight leading-none text-gray-900"
/** Totals row numeric cells — same tone as body metrics */
const TABLE_HEADER_METRIC =
  "font-['JetBrains_Mono',monospace] text-[12px] font-normal tabular-nums tracking-tight leading-none text-[#4b5563]"

/** Date range under ad name — sans, not mono */
const TABLE_ROW_TIMESTAMP =
  "text-[12px] font-normal leading-snug text-[#737373]"

/** Checkbox column — ad name is sticky at `left-10` (2.5rem). Status sits after ad name (not sticky). */
const CHECKBOX_COL = "w-10 min-w-10"
/** Status column width (scrolls with table; not frozen). */
const STATUS_COL = "w-[120px] min-w-[120px] max-w-[120px]"

type SortableColumn = "adName" | keyof MetricValues

export type TableFilterOperator = "is" | "isNot" | "contains" | "notContains"

export type TableFilterField =
  | "adName"
  | "dateRange"
  | "platform"
  | keyof MetricValues

export type TableFilterRule = {
  id: string
  field: TableFilterField
  operator: TableFilterOperator
  value: string
}

type ColumnVisibilityKey = "status" | "adName" | "actions" | keyof MetricValues

const FILTER_OPERATORS: { value: TableFilterOperator; label: string }[] = [
  { value: "is", label: "is" },
  { value: "isNot", label: "is not" },
  { value: "contains", label: "contains" },
  { value: "notContains", label: "does not contain" },
]

const FILTER_FIELD_OPTIONS: { value: TableFilterField; label: string }[] = [
  { value: "adName", label: "Ad name" },
  { value: "dateRange", label: "Date range" },
  { value: "platform", label: "Platform" },
  ...METRIC_COLUMNS.map((c) => ({ value: c.key as TableFilterField, label: c.label })),
]

function filterFieldLabel(field: TableFilterField): string {
  return FILTER_FIELD_OPTIONS.find((o) => o.value === field)?.label ?? field
}

function operatorShortLabel(op: TableFilterOperator): string {
  return FILTER_OPERATORS.find((o) => o.value === op)?.label ?? op
}

function getRowFieldValue(row: AdsTableRow, field: TableFilterField): string {
  if (field === "adName") return row.adName
  if (field === "dateRange") return row.dateRange
  if (field === "platform") return row.platform
  return row.metrics[field]
}

function rowMatchesFilter(row: AdsTableRow, rule: TableFilterRule): boolean {
  const needle = rule.value.trim().toLowerCase()
  if (!needle) return true
  const hay = getRowFieldValue(row, rule.field).toLowerCase()
  switch (rule.operator) {
    case "is":
      return hay === needle
    case "isNot":
      return hay !== needle
    case "contains":
      return hay.includes(needle)
    case "notContains":
      return !hay.includes(needle)
    default:
      return true
  }
}

function defaultColumnVisibility(): Record<ColumnVisibilityKey, boolean> {
  const m = {} as Record<keyof MetricValues, boolean>
  for (const c of METRIC_COLUMNS) m[c.key] = true
  return { status: true, adName: true, actions: true, ...m }
}

function parseMetricForSort(key: keyof MetricValues, raw: string): number {
  const s = raw.trim().toLowerCase().replace(/,/g, "")

  if (key === "roas") {
    const m = /^([\d.]+)\s*:/.exec(s)
    return m ? parseFloat(m[1]!) : 0
  }

  if (/^[\d.]+m$/.test(s)) return parseFloat(s) * 1e6
  if (/^[\d.]+k$/.test(s)) return parseFloat(s) * 1e3

  if (s.startsWith("$")) {
    const n = parseFloat(s.slice(1).replace(/[^\d.-]/g, ""))
    return Number.isFinite(n) ? n : 0
  }
  if (s.endsWith("%")) {
    const n = parseFloat(s.slice(0, -1))
    return Number.isFinite(n) ? n : 0
  }

  const n = parseFloat(s.replace(/[^\d.-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function ColumnSortGlyph({
  active,
  direction,
}: {
  active: boolean
  direction: "asc" | "desc"
}) {
  const muted = "size-3 shrink-0 text-[#b0b3b2]"
  const activeCls = "size-3 shrink-0 text-[#6b7280]"
  if (!active) return <ArrowUpDownIcon className={muted} aria-hidden />
  return direction === "asc" ? (
    <ArrowUpIcon className={activeCls} aria-hidden />
  ) : (
    <ArrowDownIcon className={activeCls} aria-hidden />
  )
}

function RowActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-[#404040] hover:bg-[#f4f4f5]"
          aria-label="Row actions"
        >
          <MoreHorizontalIcon className="size-3.5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem>Create retargeting audience</DropdownMenuItem>
        <DropdownMenuItem>Duplicate rule</DropdownMenuItem>
        <DropdownMenuItem>Export row</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AdsTableFilterForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: { id?: string; field: TableFilterField; operator: TableFilterOperator; value: string }
  onSave: (rule: TableFilterRule) => void
  onCancel: () => void
}) {
  const [field, setField] = React.useState<TableFilterField>(initial.field)
  const [operator, setOperator] = React.useState<TableFilterOperator>(initial.operator)
  const [value, setValue] = React.useState(initial.value)

  React.useEffect(() => {
    setField(initial.field)
    setOperator(initial.operator)
    setValue(initial.value)
  }, [initial.field, initial.operator, initial.value])

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <span className="text-[13px] font-medium text-[#171717]">Field</span>
        <Select
          value={field}
          onValueChange={(v) => setField(v as TableFilterField)}
        >
          <SelectTrigger
            size="sm"
            className="h-8 w-full border-[#e5e7eb] bg-white text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-60 w-[var(--radix-select-trigger-width)]">
            {FILTER_FIELD_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-[13px]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <span className="text-[13px] font-medium text-[#171717]">Operator</span>
        <Select
          value={operator}
          onValueChange={(v) => setOperator(v as TableFilterOperator)}
        >
          <SelectTrigger
            size="sm"
            className="h-8 w-full border-[#e5e7eb] bg-white text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {FILTER_OPERATORS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-[13px]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <span className="text-[13px] font-medium text-[#171717]">Value</span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="h-8 border-[#e5e7eb] text-[13px]"
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-[#e5e7eb] pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[13px]"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          className="text-[13px]"
          onClick={() =>
            onSave({
              id: initial.id ?? `f-${Date.now()}`,
              field,
              operator,
              value,
            })
          }
        >
          {initial.id ? "Update" : "Add filter"}
        </Button>
      </div>
    </div>
  )
}

/** Toolbar pills — match Filter control (Gmail-like). */
const ADS_TOOLBAR_PILL_BTN =
  "inline-flex h-7 min-w-0 max-w-[min(100%,280px)] shrink-0 items-center gap-1.5 rounded-full border border-[#dadce0] bg-white py-0 pl-2 pr-2.5 text-left text-[12px] leading-none text-[#5f6368] transition-colors hover:bg-[#f1f3f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1967d2]/25"

const ADS_TOOLBAR_SEARCH_INPUT =
  "h-7 min-h-7 w-full max-w-[180px] min-w-0 rounded-full border border-[#dadce0] bg-white py-0 pl-2 pr-2.5 text-[12px] leading-none text-[#5f6368] outline-none transition-colors placeholder:text-[#5f6368]/55 hover:bg-[#f1f3f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1967d2]/25"

function formatAdsDateRangeLabel(range: DateRange | undefined) {
  if (!range?.from) return "Date range"
  const fmt = (d: Date) => format(d, "MMM d, yyyy")
  if (range.to) return `${fmt(range.from)} – ${fmt(range.to)}`
  return `${fmt(range.from)} – …`
}

function FilterChip({
  rule,
  onSave,
  onRemove,
}: {
  rule: TableFilterRule
  onSave: (rule: TableFilterRule) => void
  onRemove: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const valPreview = rule.value.trim()
  const valShort =
    valPreview.length > 14 ? `${valPreview.slice(0, 14)}…` : valPreview || "…"
  const summary = `${filterFieldLabel(rule.field)}: ${operatorShortLabel(rule.operator)} ${valShort}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex max-w-[min(100%,280px)] items-center rounded-full bg-[#e8f0fe] pr-0.5">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex min-w-0 flex-1 items-center gap-1 rounded-full py-0.5 pl-2.5 text-left text-[13px] text-[#1967d2] outline-none hover:bg-[#d2e3fc] focus-visible:ring-2 focus-visible:ring-[#1967d2]/30"
          >
            <span className="min-w-0 truncate font-['JetBrains_Mono',monospace] tabular-nums">
              {summary}
            </span>
            <ChevronDownIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
          </button>
        </PopoverTrigger>
        <button
          type="button"
          className="rounded-full p-1 text-[#1967d2] hover:bg-[#dadce0]/80"
          aria-label="Remove filter"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
        >
          <XIcon className="size-3.5" aria-hidden />
        </button>
      </div>
      <PopoverContent className="w-80 p-3" align="start" sideOffset={6}>
        <p className="mb-2 text-[13px] font-semibold text-[#171717]">Edit filter</p>
        <AdsTableFilterForm
          initial={{
            id: rule.id,
            field: rule.field,
            operator: rule.operator,
            value: rule.value,
          }}
          onSave={(r) => {
            onSave(r)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}

/** Figma PlYsn2j4gbkftQibcUwJNf — node 117:2731 toolbar + 117:2732 table (sticky col/rows). */
export function AdsReportingAdsTableSection({ className }: { className?: string }) {
  const [sortColumn, setSortColumn] = React.useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")
  const tableScrollRef = React.useRef<HTMLDivElement>(null)
  const [showFrozenLeftShadow, setShowFrozenLeftShadow] = React.useState(false)
  const [showFrozenRightShadow, setShowFrozenRightShadow] = React.useState(false)

  const onSortHeaderClick = React.useCallback((key: SortableColumn) => {
    setSortColumn((prev) => {
      if (prev !== key) {
        setSortDirection("desc")
        return key
      }
      setSortDirection((d) => (d === "desc" ? "asc" : "desc"))
      return key
    })
  }, [])

  const sortedTableRows = React.useMemo(() => {
    if (!sortColumn) return TABLE_ROWS
    const rows = [...TABLE_ROWS]
    rows.sort((a, b) => {
      if (sortColumn === "adName") {
        const cmp = a.adName.localeCompare(b.adName, undefined, { sensitivity: "base" })
        return sortDirection === "asc" ? cmp : -cmp
      }
      const va = parseMetricForSort(sortColumn, a.metrics[sortColumn])
      const vb = parseMetricForSort(sortColumn, b.metrics[sortColumn])
      const cmp = va - vb
      return sortDirection === "asc" ? cmp : -cmp
    })
    return rows
  }, [sortColumn, sortDirection])

  const [filters, setFilters] = React.useState<TableFilterRule[]>([])
  /** Column toggles UI removed for now; table shows all columns by default. */
  const columnVisibility = React.useMemo(() => defaultColumnVisibility(), [])
  const [addFilterOpen, setAddFilterOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredTableRows = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return sortedTableRows
      .filter((row) => filters.every((f) => rowMatchesFilter(row, f)))
      .filter((row) => {
        if (!q) return true
        return (
          row.adName.toLowerCase().includes(q) ||
          row.dateRange.toLowerCase().includes(q) ||
          row.platform.toLowerCase().includes(q)
        )
      })
  }, [sortedTableRows, filters, searchQuery])

  const visibleMetricColumns = React.useMemo(
    () => METRIC_COLUMNS.filter((c) => columnVisibility[c.key]),
    [columnVisibility]
  )

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set())

  const visibleRowIds = React.useMemo(
    () => filteredTableRows.map((r) => r.id),
    [filteredTableRows]
  )

  const allVisibleSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedIds.has(id))
  const someVisibleSelected = visibleRowIds.some((id) => selectedIds.has(id))

  const toggleSelectAll = React.useCallback(() => {
    setSelectedIds((prev) => {
      if (visibleRowIds.length === 0) return prev
      const next = new Set(prev)
      if (visibleRowIds.every((id) => next.has(id))) {
        for (const id of visibleRowIds) next.delete(id)
      } else {
        for (const id of visibleRowIds) next.add(id)
      }
      return next
    })
  }, [visibleRowIds])

  const toggleRowSelected = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const syncFrozenShadows = React.useCallback(() => {
    const el = tableScrollRef.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setShowFrozenLeftShadow(scrollLeft > 0)
    setShowFrozenRightShadow(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    syncFrozenShadows()
  }, [syncFrozenShadows])

  React.useEffect(() => {
    const el = tableScrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => syncFrozenShadows())
    ro.observe(el)
    return () => ro.disconnect()
  }, [syncFrozenShadows])

  React.useEffect(() => {
    syncFrozenShadows()
  }, [columnVisibility, visibleMetricColumns.length, syncFrozenShadows])

  return (
    <section
      className={cn(
        "w-full min-w-0 pb-16 text-[#404040] sm:pb-24 md:pb-32",
        className
      )}
      data-node-id="117:2731"
    >
      <div className="mb-3" data-node-id="117:2733">
        <h2
          className="min-w-0 max-w-full text-balance text-[16px] font-semibold leading-snug text-[#1b1d1c]"
          data-node-id="117:2734"
        >
          All ad campaigns across channels
        </h2>
      </div>

      <div className="mb-4 flex w-full flex-wrap items-center gap-1.5">
        {filters.map((rule) => (
          <FilterChip
            key={rule.id}
            rule={rule}
            onSave={(next) =>
              setFilters((prev) => prev.map((r) => (r.id === next.id ? next : r)))
            }
            onRemove={() =>
              setFilters((prev) => prev.filter((r) => r.id !== rule.id))
            }
          />
        ))}
        <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={ADS_TOOLBAR_PILL_BTN}>
              <PlusIcon className="size-3 shrink-0" aria-hidden />
              Filter
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start" sideOffset={6}>
            <p className="mb-2 text-[13px] font-semibold text-[#171717]">Add filter</p>
            <AdsTableFilterForm
              initial={{
                field: "adName",
                operator: "contains",
                value: "",
              }}
              onSave={(rule) => {
                setFilters((prev) => [...prev, rule])
                setAddFilterOpen(false)
              }}
              onCancel={() => setAddFilterOpen(false)}
            />
          </PopoverContent>
        </Popover>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
            <PopoverTrigger asChild>
              <button type="button" className={ADS_TOOLBAR_PILL_BTN}>
                <CalendarIcon className="size-3 shrink-0" aria-hidden />
                <span className="min-w-0 truncate font-['JetBrains_Mono',monospace] tabular-nums">
                  {formatAdsDateRangeLabel(dateRange)}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={6}>
              <div className="p-2">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from ?? new Date()}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full px-3 text-[12px] text-[#5f6368]"
                  onClick={() => {
                    setDateRange(undefined)
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 rounded-full px-3 text-[12px]"
                  onClick={() => setDateRangeOpen(false)}
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="relative w-full max-w-[180px] shrink-0">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-[#5f6368]/55"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ads…"
              className={cn(ADS_TOOLBAR_SEARCH_INPUT, "pl-8")}
              aria-label="Search ads"
            />
          </div>
        </div>
      </div>

      <div
        className="min-w-0 rounded-none border border-[#e5e7eb] bg-white"
        data-node-id="117:2732"
      >
        <div
          ref={tableScrollRef}
          onScroll={syncFrozenShadows}
          className="no-scrollbar max-h-[min(70vh,560px)] min-w-0 overflow-auto rounded-none"
          data-node-id="117:2746"
        >
          <table className="w-max min-w-full border-separate border-spacing-0 text-[12px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]" data-node-id="117:2747">
                <th
                  scope="col"
                  className={cn(
                    CHECKBOX_COL,
                    "sticky top-0 left-0 z-[48] border-b border-r border-[#e5e7eb] bg-white px-0 text-center",
                    THEAD_ROW_FIXED,
                    showFrozenLeftShadow &&
                      !columnVisibility.adName &&
                      FROZEN_LEFT_SHADOW
                  )}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        allVisibleSelected
                          ? true
                          : someVisibleSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={() => toggleSelectAll()}
                      aria-label="Select all ads"
                      className="border-[#d4d4d8] data-[state=checked]:border-primary"
                    />
                  </div>
                </th>
                {columnVisibility.adName ? (
                  <th
                    scope="col"
                    className={cn(
                      "relative min-w-[200px] max-w-[260px] border-b border-r border-[#e5e7eb] bg-white pl-3 pr-1.5 text-left",
                      TABLE_HEADER_TEXT,
                      THEAD_ROW_FIXED,
                      "sticky top-0 left-10 z-[47]",
                      showFrozenLeftShadow && columnVisibility.adName && FROZEN_LEFT_SHADOW
                    )}
                    data-node-id="117:2748"
                  >
                    <button
                      type="button"
                      onClick={() => onSortHeaderClick("adName")}
                      className="flex w-full min-w-0 items-center justify-start gap-1 rounded-md py-0 pr-0.5 text-left text-inherit hover:bg-[#f4f4f5]"
                      aria-sort={
                        sortColumn === "adName"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span>Ad name</span>
                      <ColumnSortGlyph
                        active={sortColumn === "adName"}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                ) : null}
                {columnVisibility.status ? (
                  <th
                    scope="col"
                    className={cn(
                      STATUS_COL,
                      "sticky top-0 z-[40] border-b border-r border-[#e5e7eb] bg-white px-2.5 text-left text-gray-600",
                      "text-[12px] font-medium leading-none",
                      THEAD_ROW_FIXED
                    )}
                  >
                    Status
                  </th>
                ) : null}
                {visibleMetricColumns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "sticky top-0 z-[35] min-w-[96px] whitespace-nowrap border-b border-r border-[#e5e7eb] bg-white px-2.5 text-right",
                      TABLE_HEADER_METRIC_TITLE,
                      THEAD_ROW_FIXED
                    )}
                    data-node-id={`117:${col.nodeSuffix}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSortHeaderClick(col.key)}
                      className="flex w-full min-w-0 items-center justify-end gap-1 rounded-md py-0 pl-0.5 text-right text-inherit hover:bg-[#f4f4f5]"
                      aria-sort={
                        sortColumn === col.key
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="min-w-0">{col.label}</span>
                      <ColumnSortGlyph
                        active={sortColumn === col.key}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                ))}
                {columnVisibility.actions ? (
                  <th
                    className={cn(
                      "relative sticky top-0 right-0 z-[44] w-12 min-w-12 border-b border-[#e5e7eb] bg-white px-1",
                      THEAD_ROW_FIXED,
                      showFrozenRightShadow && FROZEN_RIGHT_SHADOW
                    )}
                    aria-hidden
                    data-node-id="117:2762"
                  />
                ) : null}
              </tr>
              <tr className="border-b border-[#e5e7eb]" data-node-id="117:2817">
                <td
                  className={cn(
                    CHECKBOX_COL,
                    "sticky top-12 left-0 z-[47] border-b border-r border-[#e5e7eb] bg-white px-0 text-center",
                    THEAD_ROW_FIXED,
                    showFrozenLeftShadow &&
                      !columnVisibility.adName &&
                      FROZEN_LEFT_SHADOW
                  )}
                  aria-hidden
                />
                {columnVisibility.adName ? (
                  <td
                    className={cn(
                      "sticky top-12 left-10 z-[44] min-w-[200px] max-w-[260px] border-b border-r border-[#e5e7eb] bg-white px-3",
                      THEAD_ROW_FIXED,
                      showFrozenLeftShadow && columnVisibility.adName && FROZEN_LEFT_SHADOW
                    )}
                  />
                ) : null}
                {columnVisibility.status ? (
                  <td
                    className={cn(
                      STATUS_COL,
                      "sticky top-12 z-[32] border-b border-r border-[#e5e7eb] bg-white px-2.5",
                      THEAD_ROW_FIXED
                    )}
                    aria-hidden
                  />
                ) : null}
                {visibleMetricColumns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "sticky top-12 z-[28] min-w-[96px] whitespace-nowrap border-b border-r border-[#e5e7eb] bg-white px-2.5 text-right",
                      THEAD_ROW_FIXED,
                      TABLE_HEADER_METRIC
                    )}
                  >
                    {TOTALS_ROW[col.key]}
                  </td>
                ))}
                {columnVisibility.actions ? (
                  <td
                    className={cn(
                      "sticky top-12 right-0 z-[41] w-12 min-w-12 border-b border-[#e5e7eb] bg-white px-1",
                      THEAD_ROW_FIXED,
                      showFrozenRightShadow && FROZEN_RIGHT_SHADOW
                    )}
                  />
                ) : null}
              </tr>
            </thead>
            <tbody>
              {filteredTableRows.map((row) => (
                <tr
                  key={row.id}
                  className="group border-b border-[#e5e7eb] bg-white hover:bg-[#f9fafb]"
                >
                  <td
                    className={cn(
                      CHECKBOX_COL,
                      "sticky left-0 z-[14] border-b border-r border-[#e5e7eb] bg-white px-0 py-2 align-middle",
                      "group-hover:bg-[#f9fafb]",
                      showFrozenLeftShadow &&
                        !columnVisibility.adName &&
                        FROZEN_LEFT_SHADOW
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleRowSelected(row.id)}
                        aria-label={`Select ${row.adName}`}
                        className="border-[#d4d4d8] data-[state=checked]:border-primary"
                      />
                    </div>
                  </td>
                  {columnVisibility.adName ? (
                    <td
                      className={cn(
                        "relative min-w-[200px] max-w-[260px] border-b border-r border-[#e5e7eb] bg-white px-3 py-2 align-middle leading-4",
                        "sticky left-10 z-[17]",
                        showFrozenLeftShadow && columnVisibility.adName && FROZEN_LEFT_SHADOW,
                        "group-hover:bg-[#f9fafb]"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-1.5">
                        <PlatformBadge platform={row.platform} />
                        <div className="min-w-0 flex flex-1 flex-col gap-px">
                          <span
                            className="line-clamp-2 min-w-0 break-words text-[12px] font-medium leading-snug text-[#171717]"
                            title={row.adName}
                          >
                            {row.adName}
                          </span>
                          <span
                            className={cn(
                              "line-clamp-1 min-w-0 break-words",
                              TABLE_ROW_TIMESTAMP
                            )}
                          >
                            {row.dateRange}
                          </span>
                        </div>
                      </div>
                    </td>
                  ) : null}
                  {columnVisibility.status ? (
                    <td
                      className={cn(
                        STATUS_COL,
                        "border-b border-r border-[#e5e7eb] bg-white px-2.5 py-2 align-middle",
                        "group-hover:bg-[#f9fafb]"
                      )}
                    >
                      <AdCampaignStatusCell
                        status={adCampaignStatusForRowId(row.id)}
                      />
                    </td>
                  ) : null}
                  {visibleMetricColumns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "border-b border-r border-[#e5e7eb] bg-white px-2.5 py-2 text-right align-middle group-hover:bg-[#f9fafb]",
                        monoNum
                      )}
                    >
                      {row.metrics[col.key]}
                    </td>
                  ))}
                  {columnVisibility.actions ? (
                    <td
                      className={cn(
                        "relative w-12 min-w-12 border-b border-[#e5e7eb] bg-white px-1 py-2 align-middle",
                        "sticky right-0 z-[14]",
                        showFrozenRightShadow && FROZEN_RIGHT_SHADOW,
                        "group-hover:bg-[#f9fafb]"
                      )}
                    >
                      <div className="flex items-center justify-center">
                        <RowActionsMenu />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex w-full justify-end py-6 pr-0">
        <Pagination className="mx-0 w-auto justify-end pr-0">
          <PaginationContent className="justify-end pr-0">
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="gap-1 pl-2.5 pr-0 sm:pl-2.5 sm:pr-0"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  )
}
