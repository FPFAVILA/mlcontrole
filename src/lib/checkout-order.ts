/** Monta, no navegador, o pedido enviado para a API interna. O valor final e sempre calculado no servidor. */
import { getSelectedVariant } from "./product-pricing"

const REF_KEY = "checkout_ref"

export function getCheckoutRef(): string {
  try {
    const existing = sessionStorage.getItem(REF_KEY)
    if (existing) return existing
    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "").slice(0, 24)
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(REF_KEY, generated)
    return generated
  } catch {
    return `${Date.now().toString(36)}`
  }
}

export function clearCheckoutRef() {
  try {
    sessionStorage.removeItem(REF_KEY)
  } catch {
    /* ignore */
  }
}

function readJSON<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export type CheckoutOrderPayload = {
  checkoutRef: string
  items: { id: string; quantity: number }[]
  shippingId: string
  shippingDate: string | null
  insuranceMonths: number | null
  customer: { name: string; email: string; doc: string; phone: string | null }
  address: Record<string, unknown>
}

export function buildCheckoutOrderPayload(): CheckoutOrderPayload {
  const customer = readJSON<{ name?: string; cpf?: string; email?: string; phone?: string }>(
    sessionStorage,
    "checkout_customer",
  )
  const address = readJSON<Record<string, unknown>>(sessionStorage, "checkout_address") ?? {}
  const insurance = readJSON<{ months?: number }>(sessionStorage, "checkout_insurance")
  const shipping = readJSON<{ id?: string; date?: string }>(sessionStorage, "checkout_shipping")
  const cart = readJSON<{ id: string; qty: number }[]>(localStorage, "ml_cart") ?? []

  const items =
    cart.length > 0
      ? cart.map((item) => ({ id: item.id, quantity: item.qty }))
      : [{ id: getSelectedVariant().id, quantity: 1 }]

  return {
    checkoutRef: getCheckoutRef(),
    items,
    shippingId: shipping?.id ?? "full",
    shippingDate: shipping?.date ?? null,
    insuranceMonths: insurance?.months ?? null,
    customer: {
      name: customer?.name ?? String(address["receiverName"] ?? ""),
      email: customer?.email ?? String(address["email"] ?? ""),
      doc: customer?.cpf ?? "",
      phone: customer?.phone ?? (address["phone"] ? String(address["phone"]) : null),
    },
    address,
  }
}
