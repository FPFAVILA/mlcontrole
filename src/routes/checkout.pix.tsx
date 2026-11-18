import { createFileRoute } from "@tanstack/react-router"
import { Check, Clock3, Copy, Info, X } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { buildCheckoutOrderPayload } from "@/lib/checkout-order"
import { useRouter, useSearchParams } from "@/lib/next-compat"
import { trackPurchase } from "@/lib/track-purchase"

function PixContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fallbackAmount = Number(searchParams.get("amount") || 179.9)
  const [copied, setCopied] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderCode, setOrderCode] = useState<string | null>(null)
  const [amountCents, setAmountCents] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const amount = amountCents != null ? amountCents / 100 : fallbackAmount
  const formattedAmount = `R$ ${amount.toFixed(2).replace(".", ",")}`

  useEffect(() => {
    let active = true

    const apply = (data: {
      brCode?: string
      orderId?: string
      orderCode?: string
      amountCents?: number
      paymentStatus?: string
      error?: string
    }) => {
      if (data.brCode) {
        setPixCode(data.brCode)
        setOrderId(data.orderId ?? null)
        setOrderCode(data.orderCode ?? null)
        if (typeof data.amountCents === "number") setAmountCents(data.amountCents)
        if (data.paymentStatus) setPaymentStatus(data.paymentStatus)
        return true
      }
      if (data.error) setErrorMessage(data.error)
      return false
    }

    // O Pix já foi gerado na etapa anterior; usa o resultado imediatamente.
    try {
      const cached = sessionStorage.getItem("checkout_pix_payment")
      if (cached && apply(JSON.parse(cached))) {
        return () => {
          active = false
        }
      }
    } catch {
      /* ignora cache inválido */
    }

    const run = async () => {
      try {
        const response = await fetch("/api/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildCheckoutOrderPayload()),
        })
        const data = (await response.json()) as {
          brCode?: string
          orderId?: string
          orderCode?: string
          amountCents?: number
          paymentStatus?: string
          error?: string
        }

        if (!active) return

        if (!response.ok || !data.brCode) {
          setErrorMessage(
            data.error || "Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes.",
          )
          return
        }

        setPixCode(data.brCode)
        setOrderId(data.orderId ?? null)
        setOrderCode(data.orderCode ?? null)
        if (typeof data.amountCents === "number") setAmountCents(data.amountCents)
        if (data.paymentStatus) setPaymentStatus(data.paymentStatus)
      } catch {
        if (active) {
          setErrorMessage("Não foi possível gerar seu Pix agora. Tente novamente em alguns instantes.")
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [])

  // Consulta o status oficial do pedido na API interna (nunca na Pixzy).
  useEffect(() => {
    if (!orderId || paymentStatus === "paid") return
    let active = true

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/pix/status?orderId=${encodeURIComponent(orderId)}`)
        const data = (await response.json()) as { paymentStatus?: string }
        if (active && data.paymentStatus) setPaymentStatus(data.paymentStatus)
      } catch {
        /* mantem pendente */
      }
    }, 5000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [orderId, paymentStatus])

  // Apos a confirmacao do pagamento, segue para o ajuste do frete.
  useEffect(() => {
    if (paymentStatus !== "paid") return
    // Evento de compra: o pagamento do produto foi confirmado.
    trackPurchase({
      value: amountCents != null ? amountCents / 100 : fallbackAmount,
      transactionId: orderCode,
      dedupeKey: "produto",
    })
    try {
      sessionStorage.setItem("checkout_paid", "1")
    } catch {
      /* ignora */
    }
    const timer = window.setTimeout(() => router.push("/checkout/frete-indisponivel"), 1500)
    return () => window.clearTimeout(timer)
  }, [paymentStatus, router])

  const copyCode = async () => {
    if (!pixCode) return
    try {
      await navigator.clipboard.writeText(pixCode)
    } catch {
      const area = document.createElement("textarea")
      area.value = pixCode
      document.body.appendChild(area)
      area.select()
      document.execCommand("copy")
      document.body.removeChild(area)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }


  return (
    <main className="min-h-screen bg-secondary pb-12">
      <header className="h-[76px] bg-ml-green px-5">
        <div className="mx-auto flex h-full max-w-[740px] items-center justify-end" />
      </header>

      <div className="mx-auto max-w-[740px] px-4">
        <button type="button" onClick={() => router.push("/")} aria-label="Fechar" className="ml-auto mt-5 block text-muted-foreground"><X className="size-8" /></button>

        <section className="-mt-1 rounded-lg border border-border bg-card px-6 pb-8 pt-0 text-center shadow-sm">
          <div className="relative mx-auto -mt-9 flex size-[72px] items-center justify-center rounded-full border-[3px] border-ml-green bg-card">
            <div className="flex h-6 w-9 items-center justify-center gap-[5px] rounded-[3px] border-[2px] border-ml-green bg-card">
              <span className="size-[3px] rounded-full bg-ml-green" />
              <span className="text-[13px] font-bold leading-none text-ml-green">$</span>
              <span className="size-[3px] rounded-full bg-ml-green" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex size-6 items-center justify-center gap-[2.5px] rounded-full border-2 border-card bg-ml-green">
              <span className="size-[3px] rounded-full bg-card" />
              <span className="size-[3px] rounded-full bg-card" />
              <span className="size-[3px] rounded-full bg-card" />
            </span>
          </div>
          <p className="mt-5 text-[16px] text-muted-foreground">Falta pouco!</p>
          <h1 className="mx-auto mt-2 max-w-[580px] text-[22px] font-semibold leading-tight text-foreground">Pague {formattedAmount} via Pix para concluir sua compra</h1>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-5 py-4 text-[17px] font-semibold">Instruções de pagamento</h2>
          <div className="px-5 py-5">
            <ol className="space-y-3 text-[14px] leading-relaxed text-foreground">
              <li className="flex gap-3"><span>1.</span><span>Acesse seu Internet Banking ou app de pagamentos.</span></li>
              <li className="flex gap-3"><span>2.</span><span>Escolha pagar via Pix.</span></li>
              <li className="flex gap-3"><span>3.</span><span>Cole o código abaixo</span></li>
            </ol>

            <div className="mt-5 truncate rounded-lg border border-border px-3 py-3 text-[13px] text-muted-foreground">
              {pixCode || (errorMessage ? "—" : "Gerando código Pix...")}
            </div>
            {errorMessage ? (
              <p className="mt-3 text-[13px] font-semibold text-destructive">{errorMessage}</p>
            ) : null}
            {paymentStatus === "paid" ? (
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-ml-green/10 px-3 py-3 text-[14px] font-semibold text-ml-green">
                <Check className="size-4" /> Pagamento aprovado!
              </p>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-[13px]"><Clock3 className="size-4" /> {pixCode ? "Aguardando pagamento — será creditado na hora." : "Pague e será creditado na hora."}</p>
            )}
            {orderCode ? (
              <p className="mt-2 text-[12px] text-muted-foreground">Pedido {orderCode}</p>
            ) : null}


            <div className="mt-4 flex items-start gap-3 rounded-lg border-l-4 border-accent bg-secondary px-4 py-3 text-left text-[13px] leading-relaxed text-foreground">
              <Info className="size-4 flex-shrink-0 text-accent mt-[2px]" />
              <span>Confirmaremos a data de entrega quando o pagamento for aprovado.</span>
            </div>

            <Button onClick={copyCode} disabled={!pixCode} className="mt-5 h-12 w-full rounded-md bg-accent text-[16px] font-semibold text-accent-foreground hover:bg-accent/90">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Código copiado" : "Copiar código"}
            </Button>
            <button type="button" onClick={() => router.push("/")} className="mx-auto mt-5 block text-[14px] font-semibold text-accent">Ir para Minhas compras</button>
          </div>
        </section>
      </div>
    </main>
  )
}

function PixPage() {
  return <Suspense fallback={<main className="checkout-screen bg-card"><div className="checkout-spinner m-auto" /></main>}><PixContent /></Suspense>
}

export const Route = createFileRoute("/checkout/pix")({
  head: () => ({ meta: [
    { title: "Pagamento via Pix | Checkout" },
    { name: "description", content: "Copie o código Pix e finalize seu pagamento." },
    { property: "og:title", content: "Pagamento via Pix | Checkout" },
    { property: "og:description", content: "Copie o código Pix e finalize seu pagamento." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: PixPage,
})
