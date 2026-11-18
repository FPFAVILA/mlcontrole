import { sendFacebookConversion } from "@/lib/facebook-conversions"

const PRODUCT_ID = "controle-dualsense-edge"
const PRODUCT_NAME = "Controle Sem Fio Dualsense Edge PS5"

/**
 * Dispara o evento Purchase no Pixel e na API de Conversoes do Meta.
 * Idempotente por chave (sessionStorage), para nao contar duas vezes.
 */
export function trackPurchase(options: {
  value: number
  transactionId?: string | null
  dedupeKey?: string
  contentName?: string
}) {
  if (typeof window === "undefined") return
  const key = `fb_purchase_fired:${options.dedupeKey ?? options.transactionId ?? "default"}`
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, "1")
  } catch {
    /* segue mesmo sem sessionStorage */
  }

  const payload = {
    value: Number(options.value.toFixed(2)),
    currency: "BRL",
    content_type: "product",
    content_ids: [PRODUCT_ID],
    content_name: options.contentName ?? PRODUCT_NAME,
    transaction_id: options.transactionId ?? "",
  }

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (typeof fbq === "function") {
    fbq("track", "Purchase", payload)
  }

  void sendFacebookConversion({
    data: {
      event_name: "Purchase",
      event_id: options.transactionId ?? undefined,
      custom_data: payload,
    },
  }).catch(() => {})
}
