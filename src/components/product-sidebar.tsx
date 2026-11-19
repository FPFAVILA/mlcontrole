import { useState, useEffect } from "react"
import { ShieldCheck, RotateCcw, ChevronRight, Zap, ShoppingCart, Bookmark } from "lucide-react"
import { useRouter } from "@/lib/next-compat"
import { useShipping } from "@/hooks/use-shipping"
import { useCart } from "@/hooks/use-cart"
import { getSelectedVariant } from "@/lib/product-pricing"
import { PRODUCT_IMAGE, PRODUCT_NAME } from "@/lib/product-catalog"


function QuantitySelector({ quantity, setQuantity }: { quantity: number; setQuantity: (n: number) => void }) {
  const [open, setOpen] = useState(false)
  const maxAvailable = 50

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const options = Array.from({ length: maxAvailable }, (_, i) => i + 1)

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-between gap-2 w-full h-[56px] px-4 bg-[#f5f5f5] hover:bg-[#eee] rounded-[8px] text-[14px] text-[#333] cursor-pointer border border-transparent"
      >
        <span className="flex items-baseline gap-1">
          <span className="text-[#333]">Quantidade: {quantity}</span>
          <span className="text-[12px] text-[#999]">(+{maxAvailable} disponíveis)</span>
        </span>
        <ChevronRight className="w-4 h-4 text-[#3483fa]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[120]">
          <div
            className="absolute inset-0 bg-black/50 animate-[sheet-fade-in_200ms_ease-out]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white rounded-t-[16px] flex flex-col overflow-hidden animate-[sheet-slide-up_250ms_cubic-bezier(0.16,1,0.3,1)]">
            <div className="relative flex items-center justify-center px-4 py-4 border-b border-[#eee] shrink-0">
              <p className="text-[18px] font-semibold text-[#333]">Escolha quantidade</p>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer bg-transparent border-none text-[#999] hover:text-[#333]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {options.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setQuantity(n)
                    setOpen(false)
                  }}
                  className={`w-full text-center py-[14px] text-[16px] cursor-pointer border-b border-[#f0f0f0] ${
                    n === quantity
                      ? "bg-[#f5f5f5] text-[#333] font-semibold"
                      : "bg-white text-[#333] hover:bg-[#fafafa]"
                  }`}
                >
                  {n} {n === 1 ? "unidade" : "unidades"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProductSidebar() {
  const router = useRouter()
  const { dates } = useShipping()
  const weekday = (d: Date) =>
    d.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" })
  const startDate = new Date(dates.full)
  startDate.setDate(startDate.getDate() - 1)
  const deliveryRange = `${weekday(startDate)} e ${weekday(dates.full)}`

  const { addItem, count } = useCart()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleBuyNow = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => router.push("/checkout"), 1600)
  }

  const handleAddToCart = () => {
    addItem({
      id: getSelectedVariant().id,
      title: PRODUCT_NAME,
      price: getSelectedVariant().price,
      image: PRODUCT_IMAGE,
    }, quantity)

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
          <p className="text-[20px] font-medium text-[#333] text-center px-6 mb-6">
            Preparando tudo para sua compra
          </p>
          <div className="w-[28px] h-[28px] rounded-full border-[3px] border-[#3483fa]/20 border-t-[#3483fa] animate-spin" />
        </div>
      )}
      <div className="bg-white">
        {/* Cashback meli+ */}
        <p className="text-[15px] text-[#333] leading-[1.4]">
          Até <span className="text-[#00a650] font-semibold">R$ 1<span className="text-[11px] align-super">65</span> de cashback</span> nesta compra assinando o{" "}
          <span className="inline-flex items-center bg-[#e6006e] text-white text-[12px] font-bold rounded-full px-[8px] py-[2px] align-middle">
            meli+
          </span>
        </p>
        <button className="text-[15px] text-[#3483fa] mb-4 cursor-pointer bg-transparent border-none p-0">
          Assinar
        </button>

        {/* Free shipping badge */}
        <div className="mb-4">
          <span className="inline-block bg-[#00a650] text-white text-[12px] font-semibold uppercase rounded-[4px] px-[8px] py-[4px] leading-none tracking-wide">
            Frete grátis acima de R$ 19
          </span>
        </div>

        {/* Delivery */}
        <p className="text-[15px] text-[#333] leading-[1.4]">
          <span className="text-[#00a650] font-semibold">Chegará grátis</span> entre {deliveryRange}
        </p>
        <button className="text-[15px] text-[#3483fa] mb-4 cursor-pointer bg-transparent border-none p-0 text-left">
          Mais detalhes e formas de entrega
        </button>

        {/* Pickup */}
        <p className="text-[15px] text-[#333] leading-[1.4]">
          <span className="text-[#00a650] font-semibold">Retire grátis</span> entre {deliveryRange} em uma agência
          Mercado Livre
        </p>
        <button className="text-[15px] text-[#3483fa] mb-5 cursor-pointer bg-transparent border-none p-0 text-left">
          Ver no mapa
        </button>



        {/* Stock */}
        <div className="mb-1">
          <p className="text-[14px] font-semibold text-[#000]">Estoque disponível</p>
        </div>
        <div className="flex items-center gap-1 mb-4 text-[13px] text-[#666]">
          Armazenado e enviado pelo
          <span className="flex items-center gap-0.5 font-bold text-[#00a650]">
            <Zap className="size-3 fill-[#00a650]" />FULL
          </span>
        </div>

        {/* Quantity */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />


        {/* Buy button */}
        <button
          onClick={handleBuyNow}
          className="w-full h-[48px] bg-[#3483fa] hover:bg-[#2968c8] text-white font-semibold text-[16px] rounded-[6px] mb-3 cursor-pointer"
        >
          Comprar agora
        </button>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="w-full h-[48px] bg-[#e3edfb] hover:bg-[#d5e3f8] text-[#3483fa] font-semibold text-[16px] rounded-[6px] mb-2 cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-[18px] h-[18px]" />
          {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
        </button>
        {count > 0 && (
          <p className="text-[12px] text-[#666] text-center mb-3">
            {count} {count === 1 ? "item" : "itens"} no carrinho
          </p>
        )}

        <div className="border-t border-[#eee] my-4" />

        {/* Vendido por */}
        <div className="flex items-center gap-2 mb-1">
          <img
            src={psLogo.url}
            alt="Loja de acessórios para celular"
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className="w-[32px] h-[32px] object-contain"
          />
          <p className="text-[14px] text-[#333]">
            Vendido por <span className="text-[#3483fa] font-medium">Cellfy</span>
          </p>
        </div>
        <p className="text-[14px] text-[#333] mb-4">+2.000 vendas</p>

        <div className="flex items-start gap-2 mb-3">
          <RotateCcw className="w-[16px] h-[16px] text-[#999] mt-[2px] flex-shrink-0" />
          <div className="text-[13px]">
            <span className="text-[#3483fa]">Devolução grátis.</span>{" "}
            <span className="text-[#999]">Você tem 30 dias a partir da data de recebimento.</span>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-3">
          <ShieldCheck className="w-[16px] h-[16px] text-[#999] mt-[2px] flex-shrink-0" />
          <div className="text-[13px]">
            <span className="text-[#3483fa]">Compra Garantida.</span>{" "}
            <span className="text-[#999]">Receba o produto que está esperando ou devolvemos o dinheiro.</span>
          </div>
        </div>

        <button className="flex items-center gap-2 text-[14px] text-[#3483fa] mb-1 cursor-pointer bg-transparent border-none p-0">
          <Bookmark className="w-[16px] h-[16px]" />
          Adicionar a uma lista
        </button>
      </div>
    </div>
  )
}
