import { Link } from "react-router-dom"

export function BuildSegmentPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 py-8 md:px-8">
      <Link
        to="/campaigns/new"
        className="text-[13px] font-medium text-primary underline-offset-4 hover:underline"
      >
        ← Back to create campaign
      </Link>
      <p className="mt-6 text-[13px] text-muted-foreground">
        Build a segment — coming soon.
      </p>
    </div>
  )
}
