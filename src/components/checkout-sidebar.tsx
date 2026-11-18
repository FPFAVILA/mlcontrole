import { useState, useEffect } from "react"
import { Star, Trash2 } from "lucide-react"
import { getSelectedVariant } from "@/lib/product-pricing"

const testimonials = [
  {
    name: "Rodrigo N.",
    stars: 5,
    text: "Mano, chegou bem antes do que eu esperava kkkkk e o controle é simplesmente absurdo. Pegada muito boa e os botões traseiros fazem MUITA diferença 🔥",
    avatar: "/images/avatar-ricardo.jpg",
  },
  {
    name: "João A.",
    stars: 5,
    text: "Chegou certinho, bem embalado e sem nenhum detalhe. Tô apaixonado nesse controle kkkkkk agora voltar pro controle normal vai ser difícil 😂",
    avatar: "/images/avatar-antonio.jpg",
  },
  {
    name: "Felipe D.",
    stars: 5,
    text: "Rapaz… que controle!!! A qualidade é outra coisa, muito confortável e os ajustes são muito bons. Valeu cada centavo 👏🏻",
    avatar: "/images/avatar-rafael.jpg",
  },
  {
    name: "Anderson B.",
    stars: 5,
    text: "KKKKKK eu não sabia que precisava de um controle desses até comprar. O negócio é outro nível, sério. Já tô jogando tudo nele 😂",
    avatar: "/images/avatar-anderson.jpg",
  },
  {
    name: "Diego S.",
    stars: 5,
    text: "Chegou hoje e já fui testar no PS5. Funcionando perfeitamente, sem dor de cabeça nenhuma. Muito top mesmo!",
    avatar: "/images/avatar-fernanda.jpg",
  },
  {
    name: "Reclame Aqui",
    stars: 5,
    text: "A empresa Mercado Livre é uma empresa verificada com 100% de aprovação no Reclame Aqui e recebeu o prêmio de prontidão ao cliente!",
    avatar: "/images/avatar-reclameaqui.jpg",
  },
]

interface CheckoutSidebarProps {
  offerAdded?: boolean
  onRemoveOffer?: () => void
  quantity?: number
  onQuantityChange?: (qty: number) => void
  insurancePrice?: number | undefined
  insuranceMonths?: number | undefined
}

const OFFER_PRICE = 29.90


export function CheckoutSidebar({ offerAdded = false, onRemoveOffer, quantity: externalQty, onQuantityChange, insurancePrice: externalInsurancePrice, insuranceMonths: externalInsuranceMonths }: CheckoutSidebarProps) {
  const variant = getSelectedVariant()
  const [internalQty, setInternalQty] = useState(1)
  const [autoInsurancePrice, setAutoInsurancePrice] = useState(0)
  const [autoInsuranceMonths, setAutoInsuranceMonths] = useState(0)
  const [shippingPrice, setShippingPrice] = useState(0)
  const quantity = externalQty ?? internalQty

  // Ler seguro do sessionStorage automaticamente quando props nao forem passadas
  useEffect(() => {
    if (externalInsurancePrice === undefined) {
      try {
        const saved = sessionStorage.getItem("checkout_insurance")
        if (saved) {
          const data = JSON.parse(saved)
          setAutoInsurancePrice(data.price || 0)
          setAutoInsuranceMonths(data.months || 0)
        }
      } catch {}
    }
  }, [externalInsurancePrice])

  // Ler frete escolhido (atualiza conforme a selecao muda)
  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("checkout_shipping")
        setShippingPrice(raw ? (JSON.parse(raw).price ?? 0) : 0)
      } catch {}
    }
    read()
    const id = window.setInterval(read, 500)
    return () => window.clearInterval(id)
  }, [])

  const insurancePrice = externalInsurancePrice ?? autoInsurancePrice
  const insuranceMonths = externalInsuranceMonths ?? autoInsuranceMonths

  const handleSetQuantity = (newQty: number) => {
    if (newQty < 1) return
    if (onQuantityChange) {
      onQuantityChange(newQty)
    } else {
      setInternalQty(newQty)
    }
  }

  const productSubtotal = variant.price * quantity
  const offerTotal = offerAdded ? OFFER_PRICE : 0
  const subtotal = productSubtotal + offerTotal + insurancePrice
  const cartCount = (offerAdded ? quantity + 1 : quantity) + (insurancePrice > 0 ? 1 : 0)

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      {/* Cart summary */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#333]">Seu carrinho</h3>
          <div className="w-[22px] h-[22px] rounded-full bg-[#3483fa] text-white text-[11px] flex items-center justify-center font-bold">{cartCount}</div>
        </div>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#eee]">
          <div className="w-[48px] h-[48px] rounded bg-[#f5f5f5] overflow-hidden flex-shrink-0">
            <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#333]">Produto Selecionado</p>
            <p className="text-[12px] text-[#999]">{variant.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetQuantity(quantity - 1)}
              className="w-[24px] h-[24px] rounded-full border border-[#e0e0e0] text-[#e44] text-[14px] flex items-center justify-center cursor-pointer bg-white hover:bg-[#fef0f0]"
            >-</button>
            <span className="text-[14px] text-[#333]">{quantity}</span>
            <button
              onClick={() => handleSetQuantity(quantity + 1)}
              className="w-[24px] h-[24px] rounded-full border border-[#e0e0e0] text-[#3483fa] text-[14px] flex items-center justify-center cursor-pointer bg-white hover:bg-[#f0f6ff]"
            >+</button>
          </div>
        </div>

        {/* Offer added section */}
        {offerAdded && (
          <div className="mb-4 pb-4 border-b border-[#eee]">
            <p className="text-[13px] font-semibold text-[#333] mb-2">1 oferta adquirida</p>
            <div className="border-2 border-dashed border-[#00a650] rounded-lg p-3 bg-[#f0fff5]">
              <div className="flex items-start gap-3">
                <div className="w-[48px] h-[48px] rounded bg-[#f5f5f5] overflow-hidden flex-shrink-0">
                  <img src="/images/product-7.jpg" alt="Filamento PLA 1,75 mm" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#333] leading-tight">Filamento PLA 1,75 mm 250g + Espatula</p>
                  <p className="text-[10px] text-[#999] mt-0.5">{'LEVE TAMBEM COM 78% DE DESCONTO (Filamento extra para voce imprimir muito mais!)'}</p>
                </div>
                <button
                  onClick={onRemoveOffer}
                  className="text-[#00a650] hover:text-[#008c44] flex-shrink-0 bg-transparent border-none cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[12px] text-[#333]">{'1x de R$ 29,90'}</span>
                <span className="bg-[#00a650] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{'R$110,00 OFF'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Insurance added section */}
        {insurancePrice > 0 && (
          <div className="mb-4 pb-4 border-b border-[#eee]">
            <p className="text-[13px] font-semibold text-[#333] mb-2">Garantia estendida</p>
            <div className="border border-[#e0e0e0] rounded-lg p-3 bg-[#f9f9f9]">
              <p className="text-[12px] font-semibold text-[#333]">{insuranceMonths} meses de Garantia estendida</p>
              <p className="text-[13px] font-bold text-[#333] mt-1">R$ {insurancePrice.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-1 text-[13px]">
          <span className="text-[#333]">Subtotal</span>
          <span className="text-[#333]">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex items-center justify-between mb-3 text-[13px]">
          <span className="text-[#333]">Frete</span>
          {shippingPrice > 0
            ? <span className="text-[#333]">R$ {shippingPrice.toFixed(2).replace('.', ',')}</span>
            : <span className="text-[#00a650]">{'Grátis'}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-[#eee] pt-3">
          <span className="text-[16px] font-semibold text-[#333]">Total</span>
          <span className="text-[16px] font-bold text-[#333]">R$ {(subtotal + shippingPrice).toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Ambiente seguro */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-[20px] h-[20px] rounded-full bg-[#00a650] flex items-center justify-center">
          <span className="text-white text-[11px] font-bold">{'✓'}</span>
        </div>
        <span className="text-[13px] text-[#333]">Ambiente seguro</span>
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0">
                  <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <span className="text-[13px] font-semibold text-[#333]">{t.name}</span>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-[14px] h-[14px] ${s < t.stars ? "fill-[#f5a623] text-[#f5a623]" : "fill-[#ddd] text-[#ddd]"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[12px] text-[#333] leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
