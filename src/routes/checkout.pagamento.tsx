import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft, ChevronRight, MapPin, Ticket } from "lucide-react"
import { ShippingOptions } from "@/components/shipping-options"
import vanPreload from "@/assets/free-shipping-van.webp"
import type { ShippingSelection } from "@/lib/shipping"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { buildCheckoutOrderPayload } from "@/lib/checkout-order"
import { getSelectedVariant } from "@/lib/product-pricing"
import { ExitWarningModal } from "@/components/exit-warning-modal"
import { useRouter } from "@/lib/next-compat"

type Insurance = { months: number; price: number }
type Customer = { name?: string; cpf?: string; email?: string }
type Address = { street?: string; streetNumber?: string; cep?: string; receiverName?: string; email?: string }

const formatMoney = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`

function PagamentoPage() {
  const router = useRouter()
  const [insurance, setInsurance] = useState<Insurance | null>(null)
  const [customer, setCustomer] = useState<Customer>({})
  const [address, setAddress] = useState<Address>({})
  const [processing, setProcessing] = useState(false)
  const [greenSymbol, setGreenSymbol] = useState(false)
  const [engulfed, setEngulfed] = useState(false)
  const [shipping, setShipping] = useState<ShippingSelection | null>(null)

  const [redirecting, setRedirecting] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  const handleBack = () => setShowExitModal(true)
  const confirmLeave = () => {
    setShowExitModal(false)
    router.push("/")
  }

  useEffect(() => {
    try {
      const insuranceData = sessionStorage.getItem("checkout_insurance")
      const customerData = sessionStorage.getItem("checkout_customer")
      const addressData = sessionStorage.getItem("checkout_address")
      if (insuranceData) setInsurance(JSON.parse(insuranceData))
      if (customerData) setCustomer(JSON.parse(customerData))
      if (addressData) setAddress(JSON.parse(addressData) as Address)
    } catch {
      sessionStorage.removeItem("checkout_insurance")
    }
  }, [])

  const variant = getSelectedVariant()
  const productPrice = variant.price
  const shippingPrice = shipping?.price ?? 0
  const total = productPrice + (insurance?.price ?? 0) + shippingPrice
  const previousTotal = variant.original + (insurance?.price ?? 0) + shippingPrice
  const savings = previousTotal - total
  const hasAddress = Boolean(address.street && address.cep)
  const shippingIncomplete = shipping?.id === "personalizado" && !shipping.date

  const finish = async () => {
    if (shippingIncomplete) return
    if (!hasAddress) {
      setRedirecting(true)
      window.setTimeout(() => router.push("/checkout/novo-endereco"), 1400)
      return
    }
    setProcessing(true)
    const startedAt = Date.now()
    let pixData: Record<string, unknown>
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildCheckoutOrderPayload()),
      })
      pixData = (await response.json()) as Record<string, unknown>
      if (!response.ok || !pixData.brCode) {
        pixData = { error: (pixData.error as string) || "Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes." }
      }
    } catch {
      pixData = { error: "Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes." }
    }
    try {
      sessionStorage.setItem("checkout_pix_payment", JSON.stringify(pixData))
    } catch {
      /* ignora falha de armazenamento */
    }
    const wait = Math.max(0, 900 - (Date.now() - startedAt))
    window.setTimeout(() => {
      setProcessing(false)
      setGreenSymbol(true)
    }, wait)
    window.setTimeout(() => setEngulfed(true), wait + 650)
    window.setTimeout(() => router.push(`/checkout/pix?amount=${total.toFixed(2)}`), wait + 720)
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

  if (processing || redirecting) {
    return (
      <main className="checkout-screen bg-card" aria-live="polite">
        <div className="flex flex-1 flex-col items-center justify-center pb-20">
          <h1 className="text-[22px] font-semibold text-foreground">
            {redirecting ? "Só falta o endereço" : "Já é quase sua!"}
          </h1>
          <div className="checkout-spinner mt-8" aria-label="Carregando" />
        </div>
      </main>
    )
  }

  const displayAddress = hasAddress
    ? `${address.street}${address.streetNumber ? ` ${address.streetNumber}` : ""}${address.cep ? ` - CEP ${address.cep}` : ""}`
    : "Adicione um endereço de entrega"
  const billingName = customer.name || address.receiverName || "Adicione o endereço de entrega"
  const billingCpf = customer.cpf ? ` - CPF ${customer.cpf}` : ""
  const billingEmail = address.email || customer.email

  return (
    <main className="min-h-screen bg-secondary pb-28">
      <header className="sticky top-0 z-20 bg-primary px-4 py-3.5">
        <div className="mx-auto flex max-w-[740px] items-center gap-3">
          <button type="button" onClick={handleBack} aria-label="Voltar" className="text-primary-foreground"><ArrowLeft className="size-5" /></button>
          <h1 className="text-[17px] font-medium text-primary-foreground">Finalize sua compra</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[740px] bg-card">
        <section className="flex gap-3 border-b border-border px-4 py-4">
          <img src={variant.image} alt={variant.name} className="size-[60px] rounded-md border border-border object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] text-foreground">{variant.name}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Cor: Variada</p>
            {insurance && <p className="mt-0.5 text-[12px] text-muted-foreground">Garantia estendida de {insurance.months} meses</p>}
          </div>
        </section>

        <section className="border-b border-border px-4 py-5">
          <h2 className="text-[16px] font-semibold text-foreground">Forma de entrega</h2>
          <div className="mt-3 flex gap-2.5 rounded-lg border border-accent bg-ml-blue-light/40 px-3.5 py-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-snug text-foreground">{displayAddress}</p>
              <button className="mt-0.5 text-[13px] font-semibold text-accent" onClick={() => router.push("/checkout/novo-endereco")}>{hasAddress ? "Alterar endereço" : "Adicionar endereço"}</button>
            </div>
          </div>
          <div className="mt-5">
            <ShippingOptions onChange={setShipping} />
          </div>
        </section>

        <section className="border-b border-border px-4 py-5">
          <div className="flex items-center justify-between"><h2 className="text-[16px] font-semibold">Meios de pagamento</h2><span className="text-[13px] font-semibold text-accent">1 disponível</span></div>
          <label className="mt-4 flex items-center gap-3">
            <input type="radio" name="payment" defaultChecked className="size-4 accent-[var(--accent)]" />
            <span className="flex size-10 items-center justify-center rounded-full border border-border">
              <svg viewBox="0 0 512 512" width={24} height={24} role="img" aria-label="Pix" className="size-6">
                <path
                  fill="#32BCAD"
                  d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.798-5.384 20.16 0l76.989 76.968c14.184 14.192 33.052 22 53.112 22h15.098l-97.18 97.18c-30.36 30.359-79.588 30.359-109.95 0l-97.46-97.46h9.418zM392.64 120.38c-20.06 0-38.928 7.809-53.112 22l-76.989 76.98c-5.551 5.554-14.617 5.535-20.16-.004l-76.694-76.685c-14.192-14.193-33.064-22-53.12-22h-9.417l97.46-97.464c30.36-30.359 79.59-30.359 109.95 0l97.18 97.173h-15.098z"
                />
                <path
                  fill="#32BCAD"
                  d="M488.31 200.99l-58.913-58.913a21.36 21.36 0 01-7.882 1.607h-28.876c-13.84 0-27.4 5.608-37.18 15.394l-76.976 76.977c-7.152 7.15-16.55 10.73-25.947 10.73-9.394 0-18.792-3.58-25.94-10.723l-76.7-76.692c-9.78-9.786-23.34-15.394-37.18-15.394H77.11a21.363 21.363 0 01-7.454-1.443L10.5 200.99c-30.36 30.36-30.36 79.59 0 109.95l59.157 59.157a21.362 21.362 0 017.453-1.44h32.607c13.84 0 27.4-5.61 37.18-15.395l76.693-76.7c13.856-13.85 38.035-13.856 51.89.007l76.977 76.97c9.78 9.79 23.34 15.4 37.18 15.4h28.876c2.762 0 5.408.57 7.882 1.61l58.913-58.916c30.36-30.36 30.36-79.59 0-109.95"
                />
              </svg>
            </span>
            <span className="text-[15px] text-foreground">Pix</span>
          </label>

          {/* Cartão de crédito - indisponível */}
          <div className="mt-4 flex items-center gap-3 opacity-50">
            <input type="radio" name="payment" disabled className="size-4 accent-[var(--accent)]" />
            <div className="flex items-center gap-1">
              <div className="flex h-7 w-10 items-center justify-center rounded border border-border bg-white">
                <span className="text-[8px] font-bold italic tracking-tight text-[#1434CB]">VISA</span>
              </div>
              <div className="flex h-7 w-10 items-center justify-center rounded border border-border bg-white">
                <div className="relative flex">
                  <div className="size-3.5 rounded-full bg-[#EB001B]" />
                  <div className="size-3.5 -ml-1.5 rounded-full bg-[#F79E1B] mix-blend-multiply" />
                </div>
              </div>
              <div className="flex h-7 w-10 items-center justify-center rounded border border-border bg-white">
                <span className="text-[8px] font-bold lowercase text-[#00A4E0]">elo</span>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[15px] text-muted-foreground">Cartão de crédito</span>
              <p className="text-[11px] font-medium text-muted-foreground">Promoção válida apenas no Pix</p>
            </div>
          </div>

          {/* NuPay - indisponível */}
          <div className="mt-4 flex items-center gap-3 opacity-50">
            <input type="radio" name="payment" disabled className="size-4 accent-[var(--accent)]" />
            <div className="flex h-7 w-10 items-center justify-center rounded bg-[#820AD1]">
              <span className="text-[11px] font-bold text-white">nu</span>
            </div>
            <div className="flex-1">
              <span className="text-[15px] text-muted-foreground">NuPay</span>
              <p className="text-[11px] font-medium text-muted-foreground">Promoção válida apenas no Pix</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-5">
          <button type="button" onClick={() => router.push("/checkout/novo-endereco")} className="flex w-full items-center justify-between text-left">
            <h2 className="text-[16px] font-semibold">Faturamento</h2>
            <ChevronRight className="size-5 text-accent" />
          </button>
          <p className="mt-3 text-[14px] text-foreground">{billingName}{billingCpf}</p>
          {billingEmail && <p className="mt-1 text-[13px] text-muted-foreground">{billingEmail}</p>}
        </section>

        <section className="px-4 py-5">
          <h2 className="text-[16px] font-semibold">Resumo da compra</h2>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><dt>Produto</dt><dd>{formatMoney(variant.original)}</dd></div>
            <div className="flex justify-between"><dt>Desconto do produto</dt><dd className="text-ml-green">- {formatMoney(variant.original - productPrice)}</dd></div>
            {insurance && <div className="flex justify-between"><dt>Seguro e assistência</dt><dd>{formatMoney(insurance.price)}</dd></div>}
            <div className="flex justify-between">
              <dt>Frete{shipping ? ` (${shipping.label})` : ""}</dt>
              {shippingPrice > 0
                ? <dd>{formatMoney(shippingPrice)}</dd>
                : <dd className="text-ml-green">Grátis</dd>}
            </div>
            {shipping?.dateLabel && (
              <div className="text-[12px] text-muted-foreground">{shipping.dateLabel}</div>
            )}
          </dl>
          <button className="mt-4 flex items-center gap-2 text-[14px] font-semibold text-accent"><Ticket className="size-4" /> Inserir código do cupom</button>
          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
            <span className="text-[16px] font-semibold">Total</span>
            <div className="text-right">
              <span className="text-[13px] text-muted-foreground line-through">{formatMoney(previousTotal)}</span>
              <strong className="ml-2 text-[18px]">{formatMoney(total)}</strong>
              <p className="mt-1 text-[13px] font-semibold text-ml-green">Você economizou {formatMoney(savings)}</p>
            </div>
          </div>
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card px-4 py-3 shadow-[0_-8px_24px_color-mix(in_oklab,var(--foreground)_8%,transparent)]">
        <div className="mx-auto flex max-w-[700px] items-center gap-4">
          <div className="min-w-[92px]">
            <span className="text-[12px] text-muted-foreground line-through">{formatMoney(previousTotal)}</span>
            <p className="text-[18px] font-semibold">{formatMoney(total)}</p>
          </div>
          <Button onClick={finish} disabled={shippingIncomplete} className="h-11 flex-1 rounded-md bg-accent text-[15px] font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50">Pagar e finalizar</Button>
        </div>
      </footer>

      <ExitWarningModal
        open={showExitModal}
        onStay={() => setShowExitModal(false)}
        onLeave={confirmLeave}
      />
    </main>
  )
}

export const Route = createFileRoute("/checkout/pagamento")({
  head: () => ({ meta: [
    { title: "Revisão e pagamento | Checkout" },
    { name: "description", content: "Revise a entrega e finalize o pagamento por Pix." },
    { property: "og:title", content: "Revisão e pagamento | Checkout" },
    { property: "og:description", content: "Revise a entrega e finalize o pagamento por Pix." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ], links: [
    { rel: "preload", as: "image", href: vanPreload, fetchPriority: "high" },
  ] }),
  component: PagamentoPage,
})
