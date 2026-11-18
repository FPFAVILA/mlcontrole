import { getSelectedVariant } from "@/lib/product-pricing"
import { createFileRoute } from "@tanstack/react-router"
import { Check, Clock3, Copy, Info, X } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/lib/next-compat"
import { trackPurchase } from "@/lib/track-purchase"

function FretePixContent() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderCode, setOrderCode] = useState<string | null>(null)
  const [amountCents, setAmountCents] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const amount = amountCents != null ? amountCents / 100 : 0
  const formattedAmount = `R$ ${amount.toFixed(2).replace(".", ",")}`

  // Esta tela só existe depois da confirmação do pagamento do produto.
  useEffect(() => {
    if (sessionStorage.getItem("checkout_paid") !== "1") {
      router.push("/")
      return
    }
    try {
      const cached = sessionStorage.getItem("checkout_frete_pix_payment")
      if (cached) {
        const data = JSON.parse(cached) as {
          brCode?: string
          orderId?: string
          orderCode?: string
          amountCents?: number
          paymentStatus?: string
          error?: string
        }
        if (data.brCode) {
          setPixCode(data.brCode)
          setOrderId(data.orderId ?? null)
          setOrderCode(data.orderCode ?? null)
          if (typeof data.amountCents === "number") setAmountCents(data.amountCents)
          if (data.paymentStatus) setPaymentStatus(data.paymentStatus)
        } else if (data.error) {
          setErrorMessage(data.error)
        }
      }
    } catch {
      /* ignora cache inválido */
    }
    setAllowed(true)
  }, [router])

  // Consulta o status oficial do pedido na API interna.
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

  // Evento de compra do frete confirmado.
  useEffect(() => {
    if (paymentStatus !== "paid") return
    trackPurchase({
      value: amountCents != null ? amountCents / 100 : 0,
      transactionId: orderCode,
      dedupeKey: "frete",
      contentName: `Frete - ${getSelectedVariant().name}`,
    })
  }, [paymentStatus, amountCents, orderCode])

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

  if (!allowed) {
    return <main className="checkout-screen bg-card"><div className="checkout-spinner m-auto" /></main>
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
          <h1 className="mx-auto mt-2 max-w-[580px] text-[22px] font-semibold leading-tight text-foreground">Pague {formattedAmount} via Pix para concluir o frete do seu pedido</h1>
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

function FretePixPage() {
  return <Suspense fallback={<main className="checkout-screen bg-card"><div className="checkout-spinner m-auto" /></main>}><FretePixContent /></Suspense>
}

export const Route = createFileRoute("/checkout/frete-pix")({
  head: () => ({ meta: [
    { title: "Pagamento do frete via Pix | Checkout" },
    { name: "description", content: "Copie o código Pix e finalize o pagamento do frete." },
    { property: "og:title", content: "Pagamento do frete via Pix | Checkout" },
    { property: "og:description", content: "Copie o código Pix e finalize o pagamento do frete." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FretePixPage,
})
