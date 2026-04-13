export const CAMPAIGN_OBJECTIVES: {
  id: string
  label: string
  subtitle?: string
}[] = [
  { id: "re-engage", label: "Re-engage" },
  { id: "upsell", label: "Upsell" },
  { id: "retention", label: "Retention" },
  { id: "awareness", label: "Awareness" },
]

export function getCampaignObjective(id: string | null | undefined) {
  if (!id) return undefined
  return CAMPAIGN_OBJECTIVES.find((o) => o.id === id)
}
