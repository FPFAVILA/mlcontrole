import { getSelectedVariant } from "@/lib/product-pricing"
import { createFileRoute } from "@tanstack/react-router"
import { Check, CircleHelp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/lib/next-compat"

const plans = [
  { months: 12, label: "1 ano", price: 6 },
  { months: 18, label: "1 ano e meio", price: 9 },
  { months: 24, label: "2 anos", price: 12 },
]

function SeguroPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(12)
  const [loading, setLoading] = useState(false)

  const continueToPayment = (withInsurance: boolean) => {
    if (loading) return
    if (withInsurance) {
      const plan = plans.find((item) => item.months === selectedPlan)
      if (plan) sessionStorage.setItem("checkout_insurance", JSON.stringify({ months: plan.months, price: plan.price }))
    } else {
      sessionStorage.removeItem("checkout_insurance")
    }
    setLoading(true)
    window.setTimeout(() => router.push("/checkout/pagamento"), 1500)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-card" aria-live="polite">
        <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <div className="checkout-spinner" aria-label="Carregando" />
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-screen bg-card">
      <section className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-4 pb-32 pt-10 sm:px-6">
        <h1 className="text-[20px] font-semibold text-foreground">Adicione um seguro</h1>
        <p className="mt-2 text-[14px] leading-[1.45] text-muted-foreground">
          Estenda a garantia de fábrica por mais tempo e proteja seu produto contra falhas mecânicas.
        </p>
        <button type="button" className="mt-2 w-fit text-[13px] font-semibold text-accent">Ver detalhes</button>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border bg-secondary p-1">
            <img src={getSelectedVariant().image} alt="Produto com garantia" className="size-full object-cover" />
            <span className="absolute bottom-0 right-0 flex size-4 items-center justify-center rounded-full bg-ml-green text-accent-foreground">
              <Check className="size-2.5" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-muted-foreground">Garantia Estendida para:</p>
            <p className="truncate text-[13px] text-foreground">{getSelectedVariant().name}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Prazo da garantia">
          {plans.map((plan, index) => {
            const selected = selectedPlan === plan.months
            return (
              <button
                key={plan.months}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSelectedPlan(plan.months)}
                className={`relative flex min-h-[56px] w-full items-center gap-3 overflow-hidden rounded-lg px-4 text-left transition-colors ${selected ? "border-2 border-accent" : "border border-ml-gray-400"}`}
              >
                {index === 0 && <span className="absolute right-0 top-0 rounded-bl-md bg-foreground px-2 py-0.5 text-[10px] font-medium uppercase text-card">Recomendado</span>}
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-accent bg-accent" : "border-ml-gray-500"}`}>
                  {selected && <span className="size-1.5 rounded-full bg-card" />}
                </span>
                <span className="flex-1 text-[15px] font-semibold text-foreground">{plan.label}</span>
                <span className="text-[14px] text-foreground">R$ {plan.price}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[12px] text-muted-foreground">
          <CircleHelp className="size-4" />
          <span>Você pode cancelar a garantia quando quiser.</span>
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 px-5 pb-5 pt-4 backdrop-blur sm:pb-7">
        <div className="mx-auto grid max-w-[660px] grid-cols-2 gap-3">
          <Button variant="secondary" className="h-11 rounded-md bg-ml-blue-light text-[15px] font-semibold text-accent hover:bg-ml-blue-light" onClick={() => continueToPayment(false)}>Agora não</Button>
          <Button className="h-11 rounded-md bg-accent text-[15px] font-semibold text-accent-foreground hover:bg-accent/90" onClick={() => continueToPayment(true)}>Adicionar</Button>
        </div>
        <p className="mx-auto mt-4 max-w-[660px] text-center text-[12px] text-muted-foreground">Ao adicionar, você aceita as condições da garantia estendida.</p>
      </footer>
    </main>
  )
}

export const Route = createFileRoute("/checkout/seguro")({
  head: () => ({ meta: [
    { title: "Seguro opcional | Checkout" },
    { name: "description", content: "Escolha uma garantia estendida para o produto." },
    { property: "og:title", content: "Seguro opcional | Checkout" },
    { property: "og:description", content: "Escolha uma garantia estendida para o produto." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: SeguroPage,
})