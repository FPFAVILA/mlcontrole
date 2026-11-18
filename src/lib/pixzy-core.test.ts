import { describe, expect, it } from "vitest"
import {
  OrderValidationError,
  canTransition,
  friendlyProviderError,
  isValidCNPJ,
  isValidCPF,
  mapProviderStatus,
  parseOrderInput,
  priceOrder,
} from "./pixzy-core"

const validBase = {
  checkoutRef: "abc123",
  items: [{ id: "controle-edge-branco", quantity: 1 }],
  shippingId: "full",
  customer: { name: "Joao da Silva", email: "joao@email.com", doc: "529.982.247-25" },
}

describe("validacao de dados", () => {
  it("aceita um pedido valido", () => {
    const parsed = parseOrderInput(validBase)
    expect(parsed.customer.doc).toBe("11144477735")
    expect(parsed.items[0]!.quantity).toBe(1)
  })

  it("usa sempre o CPF fixo, ignorando o enviado", () => {
    const parsed = parseOrderInput({ ...validBase, customer: { ...validBase.customer, doc: "11111111111" } })
    expect(parsed.customer.doc).toBe("11144477735")
  })

  it("recusa e-mail invalido", () => {
    expect(() => parseOrderInput({ ...validBase, customer: { ...validBase.customer, email: "nao-email" } })).toThrow()
  })

  it("recusa nome vazio", () => {
    expect(() => parseOrderInput({ ...validBase, customer: { ...validBase.customer, name: "" } })).toThrow()
  })

  it("recusa produto fora do catalogo", () => {
    expect(() => parseOrderInput({ ...validBase, items: [{ id: "hack", quantity: 1 }] })).toThrow()
  })

  it("exige data quando o frete e personalizado", () => {
    expect(() => parseOrderInput({ ...validBase, shippingId: "personalizado" })).toThrow()
    expect(() =>
      parseOrderInput({ ...validBase, shippingId: "personalizado", shippingDate: "2026-09-20" }),
    ).not.toThrow()
  })

  it("valida CPF e CNPJ", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true)
    expect(isValidCPF("123.456.789-00")).toBe(false)
    expect(isValidCNPJ("11.222.333/0001-81")).toBe(true)
    expect(isValidCNPJ("11.222.333/0001-00")).toBe(false)
  })
})

describe("calculo do valor (fonte no backend)", () => {
  it("ignora qualquer valor enviado pelo frontend", () => {
    const parsed = parseOrderInput({ ...validBase, amount: 1 })
    expect(priceOrder(parsed).amountCents).toBe(17990)
  })

  it("soma frete e garantia", () => {
    const parsed = parseOrderInput({ ...validBase, shippingId: "economico", insuranceMonths: 12 })
    expect(priceOrder(parsed).amountCents).toBe(17990 + 2399 + 600)
  })

  it("multiplica pela quantidade", () => {
    const parsed = parseOrderInput({
      ...validBase,
      items: [{ id: "controle-edge-branco", quantity: 3 }],
    })
    expect(priceOrder(parsed).amountCents).toBe(53970)
  })

  it("cobra o preco da variante cinza", () => {
    const parsed = parseOrderInput({
      ...validBase,
      items: [{ id: "controle-edge-cinza", quantity: 1 }],
    })
    expect(priceOrder(parsed).amountCents).toBe(24980)
  })
})

describe("status e webhook", () => {
  it("traduz eventos da Pixzy", () => {
    expect(mapProviderStatus("paid")).toBe("paid")
    expect(mapProviderStatus("expired")).toBe("expired")
    expect(mapProviderStatus("failed")).toBe("failed")
    expect(mapProviderStatus("qualquer-coisa")).toBeNull()
  })

  it("so permite transicoes a partir de pendente (idempotencia)", () => {
    expect(canTransition("pending", "paid")).toBe(true)
    expect(canTransition("paid", "paid")).toBe(false)
    expect(canTransition("paid", "expired")).toBe(false)
    expect(canTransition("expired", "paid")).toBe(false)
  })
})

describe("erros do provedor", () => {
  it("nunca expoe detalhes tecnicos", () => {
    for (const status of [401, 403, 422, 429, 503]) {
      const message = friendlyProviderError(status)
      expect(message.length).toBeGreaterThan(10)
      expect(message.toLowerCase()).not.toContain("token")
      expect(message).not.toContain(String(status))
    }
  })
})
