import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { getSelectedVariant } from "@/lib/product-pricing"

const testimonials = [
  { name: "Mariana S.", text: "A película chegou bem protegida, aplicou fácil e mudou bastante o visual do meu iPhone XR.", avatar: "/images/avatar-juliana.jpg" },
  { name: "Lucas A.", text: "Gostei do acabamento branco e das lentes decorativas. Ficou bonito e sem riscos na traseira.", avatar: "/images/avatar-antonio.jpg" },
  { name: "Camila R.", text: "Produto conforme o anúncio, veio completo e a aplicação foi simples.", avatar: "/images/avatar-camila.jpg" },
  { name: "Rafael M.", text: "Boa compra para transformar o celular sem precisar trocar de aparelho.", avatar: "/images/avatar-rafael.jpg" },
]

interface CheckoutSidebarProps {
  quantity?: number
  onQuantityChange?: (qty: number) => void
  insurancePrice?: number
  insuranceMonths?: number
}

export function CheckoutSidebar({ quantity: externalQty, onQuantityChange, insurancePrice: externalInsurancePrice, insuranceMonths: externalInsuranceMonths }: CheckoutSidebarProps) {
  const variant = getSelectedVariant()
  const [internalQty, setInternalQty] = useState(1)
  const [autoInsurancePrice, setAutoInsurancePrice] = useState(0)
  const [autoInsuranceMonths, setAutoInsuranceMonths] = useState(0)
  const [shippingPrice, setShippingPrice] = useState(0)
  const quantity = externalQty ?? internalQty

  useEffect(() => {
    if (externalInsurancePrice !== undefined) return
    try {
      const saved = sessionStorage.getItem("checkout_insurance")
      if (saved) {
        const data = JSON.parse(saved) as { price?: number; months?: number }
        setAutoInsurancePrice(data.price ?? 0)
        setAutoInsuranceMonths(data.months ?? 0)
      }
    } catch {
      setAutoInsurancePrice(0)
      setAutoInsuranceMonths(0)
    }
  }, [externalInsurancePrice])

  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("checkout_shipping")
        const data = raw ? JSON.parse(raw) as { price?: number } : null
        setShippingPrice(data?.price ?? 0)
      } catch {
        setShippingPrice(0)
      }
    }
    read()
    const id = window.setInterval(read, 500)
    return () => window.clearInterval(id)
  }, [])

  const insurancePrice = externalInsurancePrice ?? autoInsurancePrice
  const insuranceMonths = externalInsuranceMonths ?? autoInsuranceMonths
  const productSubtotal = variant.price * quantity
  const subtotal = productSubtotal + insurancePrice
  const cartCount = quantity + (insurancePrice > 0 ? 1 : 0)

  const handleSetQuantity = (newQty: number) => {
    if (newQty < 1) return
    onQuantityChange ? onQuantityChange(newQty) : setInternalQty(newQty)
  }

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 mb-4">
        <div className="flex items-center justify-between mb-4"><h3 className="text-[16px] font-semibold text-[#333]">Seu carrinho</h3><div className="w-[22px] h-[22px] rounded-full bg-[#3483fa] text-white text-[11px] flex items-center justify-center font-bold">{cartCount}</div></div>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#eee]">
          <div className="w-[48px] h-[48px] rounded bg-[#f5f5f5] overflow-hidden flex-shrink-0"><img src={variant.image} alt={variant.name} className="w-full h-full object-cover" /></div>
          <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-[#333]">Produto selecionado</p><p className="text-[12px] text-[#999]">{variant.name}</p></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => handleSetQuantity(quantity - 1)} className="w-[24px] h-[24px] rounded-full border border-[#e0e0e0] text-[#e44] text-[14px] flex items-center justify-center bg-white">-</button><span className="text-[14px] text-[#333]">{quantity}</span><button type="button" onClick={() => handleSetQuantity(quantity + 1)} className="w-[24px] h-[24px] rounded-full border border-[#e0e0e0] text-[#3483fa] text-[14px] flex items-center justify-center bg-white">+</button></div>
        </div>
        {insurancePrice > 0 && <div className="mb-4 pb-4 border-b border-[#eee]"><p className="text-[13px] font-semibold text-[#333] mb-2">Garantia estendida</p><div className="border border-[#e0e0e0] rounded-lg p-3 bg-[#f9f9f9]"><p className="text-[12px] font-semibold text-[#333]">{insuranceMonths} meses de Garantia estendida</p><p className="text-[13px] font-bold text-[#333] mt-1">R$ {insurancePrice.toFixed(2).replace(".", ",")}</p></div></div>}
        <div className="flex items-center justify-between mb-1 text-[13px]"><span className="text-[#333]">Subtotal</span><span className="text-[#333]">R$ {subtotal.toFixed(2).replace(".", ",")}</span></div>
        <div className="flex items-center justify-between mb-3 text-[13px]"><span className="text-[#333]">Frete</span>{shippingPrice > 0 ? <span className="text-[#333]">R$ {shippingPrice.toFixed(2).replace(".", ",")}</span> : <span className="text-[#00a650]">Grátis</span>}</div>
        <div className="flex items-center justify-between border-t border-[#eee] pt-3"><span className="text-[16px] font-semibold text-[#333]">Total</span><span className="text-[16px] font-bold text-[#333]">R$ {(subtotal + shippingPrice).toFixed(2).replace(".", ",")}</span></div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4"><div className="w-[20px] h-[20px] rounded-full bg-[#00a650] flex items-center justify-center"><span className="text-white text-[11px] font-bold">✓</span></div><span className="text-[13px] text-[#333]">Ambiente seguro</span></div>
      <div className="space-y-4">{testimonials.map((testimonial) => <div key={testimonial.name} className="bg-white rounded-lg border border-[#e0e0e0] p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0"><img src={testimonial.avatar} alt={testimonial.name} loading="lazy" decoding="async" className="w-full h-full object-cover" /></div><span className="text-[13px] font-semibold text-[#333]">{testimonial.name}</span></div><div className="flex">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="w-[14px] h-[14px] fill-[#f5a623] text-[#f5a623]" />)}</div></div><p className="text-[12px] text-[#333] leading-relaxed">{testimonial.text}</p></div>)}</div>
    </div>
  )
}
