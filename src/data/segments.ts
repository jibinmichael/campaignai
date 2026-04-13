export type SegmentOption = { id: string; label: string }

export const SEGMENTS: SegmentOption[] = [
  { id: "all-contacts", label: "All contacts" },
  { id: "engaged-30d", label: "Engaged in the last 30 days" },
  { id: "sms-opt-in", label: "SMS opt-in" },
]
