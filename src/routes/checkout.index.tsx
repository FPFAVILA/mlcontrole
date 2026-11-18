import { createFileRoute, redirect } from "@tanstack/react-router"

function hasAddress() {
  try {
    const raw = sessionStorage.getItem("checkout_address")
    if (!raw) return false
    const parsed = JSON.parse(raw) as { street?: string; cep?: string }
    return Boolean(parsed.street && parsed.cep)
  } catch {
    return false
  }
}

function CheckoutLoadingPage() {
  return null
}

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    throw redirect({ to: "/checkout/seguro" })
  },
  head: () => ({
    meta: [
      { title: "Preparando seu checkout" },
      { name: "description", content: "Estamos preparando sua compra." },
      { property: "og:title", content: "Preparando seu checkout" },
      { property: "og:description", content: "Estamos preparando sua compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutLoadingPage,
})