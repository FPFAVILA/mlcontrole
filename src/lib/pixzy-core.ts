/**
 * Regras puras de pedido/pagamento Pix (Pixzy).
 * Este arquivo NAO contem segredos e pode ser importado em testes.
 * O token da Pixzy vive apenas em `src/lib/pixzy.server.ts` (process.env.PIXZY_API_TOKEN).
 */

export type ShippingId = "full" | "economico" | "personalizado" | "frete_20" | "frete_7"

/** Catalogo oficial de precos (fonte da verdade do servidor). */
export const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  "controle-edge-branco": {
    name: "Controle Sem Fio Dualsense Edge PS5 - Branco",
    price: 179.9,
  },
  "controle-edge-cinza": {
    name: "Controle Sem Fio Dualsense Edge Edição Limitada 30º Aniversário PS5 - Cinza",
    price: 249.8,
  },
  "controle-edge-preto": {
    name: "Controle Sem Fio Dualsense Edge Midnight Black PS5",
    price: 179.9,
  },
  // Alias legado de carrinhos antigos; cobra o preco base atual.
  "impressora-3d-k7": {
    name: "Controle Sem Fio Dualsense Edge PS5 - Branco",
    price: 179.9,
  },
}

export const DEFAULT_PRODUCT_ID = "controle-edge-branco"


/** CPF fixo usado em todas as cobrancas Pix. */
export const FIXED_CUSTOMER_DOC = "11144477735"

export const SHIPPING_CATALOG: Record<ShippingId, { name: string; price: number }> = {
  full: { name: "Frete Full", price: 0 },
  economico: { name: "Frete Economico", price: 23.99 },
  personalizado: { name: "Entrega no dia escolhido", price: 23.99 },
  frete_20: { name: "Frete economico (ate 20 dias uteis)", price: 37.99 },
  frete_7: { name: "Frete expresso (ate 7 dias uteis)", price: 64.99 },
}

export const INSURANCE_CATALOG: Record<number, { name: string; price: number }> = {
  12: { name: "Garantia estendida 1 ano", price: 6 },
  18: { name: "Garantia estendida 1 ano e meio", price: 9 },
  24: { name: "Garantia estendida 2 anos", price: 12 },
}

export type OrderItemInput = { id: string; quantity: number }

export type OrderInput = {
  checkoutRef: string
  items: OrderItemInput[]
  shippingId?: ShippingId | null
  shippingDate?: string | null
  insuranceMonths?: number | null
  freightOnly?: boolean
  customer: {
    name: string
    email: string
    doc: string
    phone?: string | null
  }
  address?: Record<string, unknown> | null
}

export type PricedLine = { name: string; priceCents: number; quantity: number }

export type PricedOrder = {
  amountCents: number
  lines: PricedLine[]
}

export function toCents(value: number): number {
  return Math.round(value * 100)
}

export function onlyDigits(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "")
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const digits = cpf.split("").map(Number)
  for (const [length, position] of [
    [9, 9],
    [10, 10],
  ] as const) {
    let sum = 0
    for (let i = 0; i < length; i++) sum += digits[i]! * (length + 1 - i)
    const check = (sum * 10) % 11 % 10
    if (check !== digits[position]) return false
  }
  return true
}

export function isValidCNPJ(value: string): boolean {
  const cnpj = onlyDigits(value)
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false
  const calc = (length: number) => {
    const weights = length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < length; i++) sum += Number(cnpj[i]) * weights[i]!
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13])
}

export function isValidDocument(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length === 11) return isValidCPF(digits)
  if (digits.length === 14) return isValidCNPJ(digits)
  return false
}

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrderValidationError"
  }
}

/** Valida a entrada vinda do frontend e devolve um objeto normalizado. */
export function parseOrderInput(raw: unknown): OrderInput {
  const body = (raw ?? {}) as Record<string, unknown>
  const customerRaw = (body["customer"] ?? {}) as Record<string, unknown>

  const checkoutRef = String(body["checkoutRef"] ?? "").trim()
  if (!checkoutRef || checkoutRef.length > 80) {
    throw new OrderValidationError("Referencia do checkout invalida")
  }

  const name = String(customerRaw["name"] ?? "").trim()
  if (name.length < 3 || name.length > 120) {
    throw new OrderValidationError("Informe o nome completo")
  }

  const email = String(customerRaw["email"] ?? "").trim().toLowerCase()
  if (!isValidEmail(email)) throw new OrderValidationError("Informe um e-mail valido")

  // Documento fixo usado para todas as cobrancas (o checkout nao pede CPF).
  const doc = FIXED_CUSTOMER_DOC
  if (!isValidDocument(doc)) throw new OrderValidationError("Informe um CPF ou CNPJ valido")

  const phoneDigits = onlyDigits(String(customerRaw["phone"] ?? ""))
  const phone = phoneDigits.length >= 10 && phoneDigits.length <= 13 ? phoneDigits : null

  const itemsRaw = Array.isArray(body["items"]) ? (body["items"] as unknown[]) : []
  const items: OrderItemInput[] = itemsRaw
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>
      const id = String(record["id"] ?? "")
      const quantity = Math.trunc(Number(record["quantity"] ?? 1))
      return { id, quantity }
    })
    .filter((item) => item.id.length > 0)

  const freightOnly = body["freightOnly"] === true
  const normalizedItems =
    items.length > 0 ? items : freightOnly ? [] : [{ id: DEFAULT_PRODUCT_ID, quantity: 1 }]

  for (const item of normalizedItems) {
    if (!PRODUCT_CATALOG[item.id]) throw new OrderValidationError("Produto invalido no pedido")
    if (!Number.isFinite(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw new OrderValidationError("Quantidade invalida no pedido")
    }
  }

  const shippingIdRaw = body["shippingId"] == null ? null : String(body["shippingId"])
  if (shippingIdRaw && !SHIPPING_CATALOG[shippingIdRaw as ShippingId]) {
    throw new OrderValidationError("Opcao de frete invalida")
  }
  const shippingId = (shippingIdRaw as ShippingId | null) ?? "full"

  const shippingDateRaw = body["shippingDate"] == null ? null : String(body["shippingDate"])
  const shippingDate = shippingDateRaw && /^\d{4}-\d{2}-\d{2}$/.test(shippingDateRaw) ? shippingDateRaw : null
  if (shippingId === "personalizado" && !shippingDate) {
    throw new OrderValidationError("Escolha a data de entrega")
  }

  const insuranceRaw = body["insuranceMonths"]
  let insuranceMonths: number | null = null
  if (insuranceRaw != null && insuranceRaw !== "") {
    const months = Math.trunc(Number(insuranceRaw))
    if (!INSURANCE_CATALOG[months]) throw new OrderValidationError("Plano de garantia invalido")
    insuranceMonths = months
  }

  const address =
    body["address"] && typeof body["address"] === "object"
      ? (body["address"] as Record<string, unknown>)
      : null

  return {
    checkoutRef,
    items: normalizedItems,
    shippingId,
    shippingDate,
    insuranceMonths,
    freightOnly,
    customer: { name, email, doc, phone },
    address,
  }
}

/** O backend e a unica fonte do valor cobrado. */
export function priceOrder(input: OrderInput): PricedOrder {
  const lines: PricedLine[] = []
  let amountCents = 0

  for (const item of input.items) {
    const product = PRODUCT_CATALOG[item.id]
    if (!product) throw new OrderValidationError("Produto invalido no pedido")
    const priceCents = toCents(product.price)
    amountCents += priceCents * item.quantity
    lines.push({ name: product.name, priceCents, quantity: item.quantity })
  }

  const shipping = SHIPPING_CATALOG[(input.shippingId ?? "full") as ShippingId]
  if (shipping && shipping.price > 0) {
    const priceCents = toCents(shipping.price)
    amountCents += priceCents
    lines.push({ name: shipping.name, priceCents, quantity: 1 })
  }

  if (input.insuranceMonths) {
    const insurance = INSURANCE_CATALOG[input.insuranceMonths]
    if (insurance) {
      const priceCents = toCents(insurance.price)
      amountCents += priceCents
      lines.push({ name: insurance.name, priceCents, quantity: 1 })
    }
  }

  if (input.freightOnly) {
    const hasOnlyShipping = lines.length === 1 && lines[0]!.quantity === 1
    if (!hasOnlyShipping || amountCents < 100) {
      throw new OrderValidationError("Valor do frete invalido")
    }
  } else if (amountCents < 100) {
    throw new OrderValidationError("Valor do pedido invalido")
  }

  return { amountCents, lines }
}

export type PaymentStatus = "pending" | "paid" | "expired" | "failed" | "cancelled"

/** Traduz o evento/status da Pixzy para o status interno. */
export function mapProviderStatus(value: string | null | undefined): PaymentStatus | null {
  const status = (value ?? "").toLowerCase().trim()
  if (["paid", "approved", "completed", "confirmed", "success"].includes(status)) return "paid"
  if (["expired", "expirado"].includes(status)) return "expired"
  if (["failed", "refused", "error", "chargeback", "refunded"].includes(status)) return "failed"
  if (["cancelled", "canceled"].includes(status)) return "cancelled"
  if (["pending", "waiting_payment", "processing", "created"].includes(status)) return "pending"
  return null
}

/** Transicoes permitidas: um pedido pago nunca volta atras. */
export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return false
  if (from !== "pending") return false
  return to === "paid" || to === "expired" || to === "failed" || to === "cancelled"
}

/** Mensagens amigaveis (sem detalhes tecnicos) por status HTTP do provedor. */
export function friendlyProviderError(status: number): string {
  if (status === 401 || status === 403) {
    return "Pagamento indisponivel no momento. Tente novamente em alguns instantes."
  }
  if (status === 422) return "Confira seus dados e tente novamente."
  if (status === 429) return "Muitas tentativas. Aguarde alguns segundos e tente de novo."
  if (status >= 500) return "Nao foi possivel gerar seu Pix agora. Tente novamente em alguns instantes."
  return "Nao foi possivel gerar seu Pix agora. Tente novamente em alguns instantes."
}
