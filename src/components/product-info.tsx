import { useState } from "react"
import { Star, ChevronRight } from "lucide-react"
import { setSelectedVariant } from "@/lib/product-pricing"
import corBranco from "@/assets/colors/cor-branco.webp.asset.json"
import corCinza from "@/assets/colors/cor-cinza.webp.asset.json"
import corPreto from "@/assets/colors/cor-preto.webp.asset.json"

const colorOptions = [
  {
    name: "Branco",
    image: corBranco.url,
    title: "Controle Sony Dualsense Edge Ps5 cor branco",
    variantId: "controle-edge-branco",
    originalPrice: "R$ 1.169,90",
    discount: "85% OFF",
    priceReais: "179",
    priceCentavos: "90",
    installmentsReais: "14",
    installmentsCentavos: "99",
  },
  {
    name: "Cinza",
    image: corCinza.url,
    title: "Controle Sem Fio Dualsense Edge Edição Limitada 30º Aniversário PS5 Cinza",
    variantId: "controle-edge-cinza",
    originalPrice: "R$ 2.499,90",
    discount: "90% OFF",
    priceReais: "249",
    priceCentavos: "80",
    installmentsReais: "20",
    installmentsCentavos: "82",
  },
  {
    name: "Preto",
    image: corPreto.url,
    title: "Controle Sem Fio Dualsense Edge Midnight Black Ps5",
    variantId: "controle-edge-preto",
    originalPrice: "R$ 1.169,90",
    discount: "85% OFF",
    priceReais: "179",
    priceCentavos: "90",
    installmentsReais: "14",
    installmentsCentavos: "99",
  },
]

export function ProductInfo() {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])

  return (
    <div className="flex-1 min-w-0">
      {/* Condition & Sold */}
      <div className="flex items-center gap-2 text-[12px] text-[#999] mb-2">
        <span>Novo</span>
        <span>|</span>
        <span className="text-[#3483fa]">+8.432 vendidos</span>
      </div>

      {/* Best Seller Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-[#ff7733] text-white text-[10px] font-bold uppercase px-[6px] py-[3px] rounded-[3px] tracking-wide leading-none">MAIS VENDIDO</span>
        <span className="text-[12px] text-[#3483fa]">{'1\u00ba em Gamepads e Joysticks'}</span>
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-semibold text-[#333] leading-[1.25] mb-2">
        {selectedColor.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-[2px]">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-[15px] h-[15px] ${s <= 4 ? "fill-[#3483fa] text-[#3483fa]" : "fill-[#3483fa] text-[#3483fa]"}`}
            />
          ))}
        </div>
        <span className="text-[14px] text-[#3483fa]">(23)</span>
      </div>

      {/* Price */}
      <div className="mb-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] text-[#999] line-through">{selectedColor.originalPrice}</span>
          <span className="text-[12px] text-[#00a650] font-medium">{selectedColor.discount}</span>
        </div>
        <div className="flex items-start gap-0">
          <span className="text-[36px] font-normal text-[#333] leading-none">R$</span>
          <span className="text-[36px] font-normal text-[#333] ml-1 leading-none">{selectedColor.priceReais}</span>
          <span className="text-[14px] font-normal text-[#333] ml-[2px] leading-none">{selectedColor.priceCentavos}</span>
        </div>
        <p className="text-[14px] text-[#00a650] mt-1">
          em <span className="font-semibold">12x R$ {selectedColor.installmentsReais}<sup>{selectedColor.installmentsCentavos}</sup></span> sem juros no cartão - Mercado Pago
        </p>

      </div>

      {/* Meios de pagamento */}
      <div className="flex items-center gap-2 mt-4 mb-4 flex-wrap">
        <span className="text-[14px] text-[#3483fa]">Meios de pagamento</span>
        <div className="flex items-center -space-x-1.5">
          <img src="/images/mercado-pago-logo.png" alt="Mercado Pago" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <img src="/images/pix.png" alt="Pix" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <img src="/images/mastercard.png" alt="Mastercard" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <img src="/images/visa.png" alt="Visa" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <img src="/images/elo.png" alt="Elo" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <img src="/images/boleto.png" alt="Boleto" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] rounded-full bg-white border border-[#e0e0e0] object-contain p-[2px]" />
          <span className="w-[22px] h-[22px] rounded-full bg-[#eaf1fb] border border-[#e0e0e0] text-[#3483fa] text-[11px] font-semibold flex items-center justify-center">+1</span>
        </div>
      </div>

      {/* Color selector */}
      <div className="mt-6 mb-4">
        <p className="text-[14px] text-[#333] mb-2">
          <span>{'Cor: '}</span>
          <span className="font-semibold">{selectedColor.name}</span>
        </p>
        <div className="flex items-center gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                setSelectedColor(option)
                setSelectedVariant(option.variantId)
              }}
              className={`w-[48px] h-[48px] rounded-[4px] overflow-hidden p-0 cursor-pointer ${
                selectedColor.name === option.name
                  ? "border-2 border-[#3483fa]"
                  : "border border-[#e0e0e0]"
              }`}
              aria-label={option.name}
            >
              <img
                src={option.image}
                alt={`Controle na cor ${option.name.toLowerCase()}`}
                width={48}
                height={48}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

      </div>

    </div>
  )
}
