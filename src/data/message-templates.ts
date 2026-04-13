export const MESSAGE_TEMPLATES: { id: string; name: string }[] = [
  { id: "welcome-first-touch", name: "Welcome series — first touch" },
  { id: "abandoned-cart", name: "Abandoned cart reminder" },
  { id: "post-purchase-thanks", name: "Post-purchase thank you" },
  { id: "win-back-miss-you", name: "Win-back: we miss you" },
  { id: "birthday-anniversary", name: "Birthday & anniversary" },
  { id: "appointment-confirm", name: "Appointment confirmation" },
  { id: "flash-sale", name: "Flash sale announcement" },
  { id: "newsletter-digest", name: "Monthly newsletter digest" },
  { id: "product-launch", name: "Product launch teaser" },
  { id: "re-engagement-nudge", name: "Re-engagement nudge" },
  { id: "order-shipped", name: "Order shipped notification" },
  { id: "feedback-request", name: "Feedback request" },
]

export function getMessageTemplate(id: string | null | undefined) {
  if (!id) return undefined
  return MESSAGE_TEMPLATES.find((t) => t.id === id)
}
