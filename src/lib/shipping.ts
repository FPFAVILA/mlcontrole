export const SHIPPING_TZ = "America/Sao_Paulo"
export const SHIPPING_LOCALE = "pt-BR"

export type ShippingId = "full" | "economico" | "personalizado"

export type ShippingSelection = {
  id: ShippingId
  label: string
  price: number
  /** ISO yyyy-mm-dd */
  date?: string
  dateLabel: string
}

/** Data "de hoje" no fuso de Sao Paulo, normalizada como UTC meio-dia. */
export function getTodayInSaoPaulo(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SHIPPING_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
  const [y, m, d] = parts.split("-").map(Number)
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1, 12, 0, 0))
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getTime())
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** "domingo, 13 de setembro" */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat(SHIPPING_LOCALE, {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date)
}

/** "13 de setembro" */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat(SHIPPING_LOCALE, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  }).format(date)
}

export const FULL_DAYS = 3
export const ECONOMY_MIN_DAYS = 4
export const ECONOMY_MAX_DAYS = 7
export const CUSTOM_MAX_DAYS = 30

export const ECONOMY_PRICE = 23.99
export const CUSTOM_PRICE = 23.99

export type ShippingDates = {
  today: Date
  full: Date
  economyStart: Date
  economyEnd: Date
  customDates: Date[]
}

export function computeShippingDates(now?: Date): ShippingDates {
  const today = getTodayInSaoPaulo(now)
  const customDates: Date[] = []
  for (let i = FULL_DAYS; i <= CUSTOM_MAX_DAYS; i++) customDates.push(addDays(today, i))
  return {
    today,
    full: addDays(today, FULL_DAYS),
    economyStart: addDays(today, ECONOMY_MIN_DAYS),
    economyEnd: addDays(today, ECONOMY_MAX_DAYS),
    customDates,
  }
}

export function formatMoney(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`
}

export const SHIPPING_STORAGE_KEY = "checkout_shipping"

export function readShippingSelection(): ShippingSelection | null {
  try {
    const raw = sessionStorage.getItem(SHIPPING_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ShippingSelection) : null
  } catch {
    return null
  }
}

export function saveShippingSelection(selection: ShippingSelection) {
  try {
    sessionStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(selection))
  } catch {}
}
