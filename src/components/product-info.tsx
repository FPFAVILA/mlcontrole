import { Star } from "lucide-react"
import { setSelectedVariant } from "@/lib/product-pricing"
import { PRODUCT_IMAGE, PRODUCT_NAME, PRODUCT_ID, PRODUCT_ORIGINAL_PRICE, PRODUCT_PRICE } from "@/lib/product-catalog"

export function ProductInfo() {
  const discount = Math.round((1 - PRODUCT_PRICE / PRODUCT_ORIGINAL_PRICE) * 100)
  const installments = (PRODUCT_PRICE / 2).toFixed(2).replace(".", ",")

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-[#999] mb-2">
        <span>Novo</span>
        <span>|</span>
        <span className="text-[#3483fa]">+2.000 vendidos</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="bg-[#ff7733] text-white text-[10px] font-bold uppercase px-[6px] py-[3px] rounded-[3px] tracking-wide leading-none">MAIS VENDIDO</span>
        <span className="text-[12px] text-[#3483fa]">1º em acessórios para celular</span>
      </div>

      <h1 className="text-[22px] font-semibold text-[#333] leading-[1.25] mb-2">{PRODUCT_NAME}</h1>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-[2px]" aria-label="Avaliação 4,9 de 5">
          {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-[15px] h-[15px] fill-[#3483fa] text-[#3483fa]" />)}
        </div>
        <span className="text-[14px] text-[#3483fa]">(46)</span>
      </div>

      <div className="mb-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] text-[#999] line-through">R$ {PRODUCT_ORIGINAL_PRICE.toFixed(2).replace(".", ",")}</span>
          <span className="text-[12px] text-[#00a650] font-medium">{discount}% OFF</span>
        </div>
        <div className="flex items-start gap-0">
          <span className="text-[36px] font-normal text-[#333] leading-none">R$</span>
          <span className="text-[36px] font-normal text-[#333] ml-1 leading-none">29</span>
          <span className="text-[14px] font-normal text-[#333] ml-[2px] leading-none">90</span>
        </div>
        <p className="text-[14px] text-[#00a650] mt-1">em <span className="font-semibold">2x R$ {installments}</span> sem juros no cartão - Mercado Pago</p>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-4 flex-wrap">
        <span className="text-[14px] text-[#3483fa]">Meios de pagamento</span>
        <div className="flex items-center -space-x-1.5">
          {[["/images/mercado-pago-logo.png", "Mercado Pago"], ["/images/pix.png", "Pix"], ["/images/mastercard.png", "Mastercard"], ["/images/visa.png", "Visa"], ["/images/elo.png", "Elo"], ["/images/boleto.png", "Boleto"]].map(([src, alt]) => <img key={src} src={src} alt={alt} width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />)}
          <span className="w-[22px] h-[22px] rounded-full bg-[#eaf1fb] border border-[#e0e0e0] text-[#3483fa] text-[11px] font-semibold flex items-center justify-center">+1</span>
        </div>
      </div>

      <div className="mt-6 mb-4">
        <p className="text-[14px] text-[#333] mb-2">Conteúdo: <span className="font-semibold">1 kit</span></p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Kit com película traseira branca" onClick={() => setSelectedVariant(PRODUCT_ID)} className="w-[48px] h-[48px] rounded-[4px] overflow-hidden p-0 cursor-pointer border-2 border-[#3483fa]">
            <img src={PRODUCT_IMAGE} alt="Kit de película traseira branca para iPhone XR" width={48} height={48} decoding="async" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  )
}
