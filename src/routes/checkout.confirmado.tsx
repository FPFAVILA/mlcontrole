import { getSelectedVariant } from "@/lib/product-pricing"
import { createFileRoute } from "@tanstack/react-router";
import { useSearchParams } from "@/lib/next-compat"
import { Suspense } from "react"
import { Lock, ShieldCheck, Package, Truck } from "lucide-react"
import { addUtmsToHref } from "@/components/utm-handler"

function ConfirmadoContent() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "29.90"
  const transactionId = searchParams.get("tid") || ""

  const value = parseFloat(amount)
  const formattedAmount = `R$ ${value.toFixed(2).replace(".", ",")}`

  return (
    <div className="min-h-screen bg-[#ebebeb] flex flex-col">
      {/* Header */}
      <div className="bg-[#f5f5f5] py-5 flex items-center justify-center border-b border-[#e0e0e0]">
        <img src="/images/mercado-pago-logo.png" alt="Mercado Pago" className="h-[50px] w-auto object-contain" />
      </div>
      <div className="bg-[#00a650] h-[4px] w-full" />

      <main className="flex-1 max-w-[700px] mx-auto w-full px-4 py-8 md:py-12">
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Success banner */}
          <div className="bg-[#00a650] px-6 py-8 flex flex-col items-center text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-white mb-2">
              Pagamento confirmado!
            </h1>
            <p className="text-[14px] md:text-[16px] text-white/90">
              {"Seu pagamento de "}
              <strong>{formattedAmount}</strong>
              {" foi aprovado com sucesso."}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            {/* Order summary */}
            <div className="mb-6 pb-6 border-b border-[#eee]">
              <h2 className="text-[16px] font-semibold text-[#333] mb-4">Resumo do pedido</h2>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-[56px] h-[56px] rounded-lg bg-[#f5f5f5] border border-[#e0e0e0] overflow-hidden flex items-center justify-center p-1">
                  <img src={getSelectedVariant().image} alt={getSelectedVariant().name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#333]">{getSelectedVariant().name}</p>
                  <p className="text-[13px] text-[#999]">Quantidade: 1</p>
                </div>
                <span className="text-[14px] font-semibold text-[#333]">{formattedAmount}</span>
              </div>

            </div>

            {/* Totals */}
            <div className="mb-6 pb-6 border-b border-[#eee]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-[#666]">Subtotal</span>
                <span className="text-[14px] text-[#333]">{formattedAmount}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-[#666]">Frete</span>
                <span className="text-[14px] text-[#00a650] font-medium">{"Gratis"}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#eee]">
                <span className="text-[16px] font-bold text-[#333]">Total pago</span>
                <span className="text-[18px] font-bold text-[#00a650]">{formattedAmount}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6 pb-6 border-b border-[#eee]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[10px] h-[10px] rounded-full bg-[#00a650]" />
                <span className="text-[14px] font-semibold text-[#00a650]">{"Status: Pago (Paid)"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[10px] h-[10px] rounded-full bg-[#3483fa]" />
                <span className="text-[14px] text-[#333]">{"Metodo: PIX"}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="mb-6">
              <h3 className="text-[14px] font-semibold text-[#333] mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00a650]" />
                {"Previsao de entrega"}
              </h3>
              <div className="bg-[#f0fff5] border border-[#c8e6c9] rounded-lg px-4 py-3">
                <p className="text-[14px] text-[#333] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#00a650]" />
                  <span>{"Chegara entre "}<strong>5 a 12 dias uteis</strong></span>
                </p>
              </div>
            </div>

            {/* Transaction ID */}
            {transactionId && (
              <div className="bg-[#f9f9f9] rounded-lg px-4 py-3 mb-6">
                <p className="text-[12px] text-[#999] mb-1">ID da transacao</p>
                <p className="text-[13px] text-[#666] font-mono break-all">{transactionId}</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = addUtmsToHref("/")}
                className="flex-1 h-[48px] bg-[#3483fa] hover:bg-[#2968c8] text-white rounded-[6px] font-semibold text-[14px] cursor-pointer"
              >
                Voltar para a loja
              </button>
            </div>
          </div>
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-[#999]">
          <Lock className="w-3 h-3" />
          <span>{"Pagamento processado de forma segura pelo Mercado Pago"}</span>
        </div>
      </main>
    </div>
  )
}

function ConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <p className="text-[14px] text-[#666]">Carregando...</p>
      </div>
    }>
      <ConfirmadoContent />
    </Suspense>
  )
}

export const Route = createFileRoute("/checkout/confirmado")({
  head: () => ({
    meta: [
      { title: "Pagamento aprovado | Mercado Livre" },
      { name: "description", content: "Seu pagamento foi aprovado e o pedido já está sendo preparado." },
      { property: "og:title", content: "Pagamento aprovado | Mercado Livre" },
      { property: "og:description", content: "Seu pagamento foi aprovado e o pedido já está sendo preparado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfirmadoPage,
});
