import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho de compras" },
      { name: "description", content: "Veja os itens do seu carrinho e continue para finalizar a compra." },
      { property: "og:title", content: "Carrinho de compras" },
      { property: "og:description", content: "Veja os itens do seu carrinho e continue para finalizar a compra." },
    ],
  }),
  component: CarrinhoPage,
})

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function CarrinhoPage() {
  const { items, setQty, removeItem, total } = useCart()

  return (
    <div className="min-h-screen bg-[#ededed]">
      <header className="bg-[#ffe600]">
        <div className="max-w-[800px] mx-auto px-4 h-[52px] flex items-center gap-3">
          <Link to="/" className="flex items-center justify-center w-[32px] h-[32px]" aria-label="Voltar">
            <ChevronLeft className="w-[24px] h-[24px] text-[#333]" />
          </Link>
          <h1 className="text-[18px] font-medium text-[#333]">Carrinho</h1>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-md p-10 flex flex-col items-center text-center">
            <ShoppingCart className="w-[48px] h-[48px] text-[#ccc] mb-4" />
            <p className="text-[16px] font-medium text-[#333] mb-1">Seu carrinho está vazio</p>
            <p className="text-[13px] text-[#999] mb-6">Adicione produtos para continuar sua compra.</p>
            <Link
              to="/"
              className="bg-[#3483fa] text-white text-[15px] font-medium px-6 py-[12px] rounded-md hover:bg-[#2968c8]"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-md divide-y divide-[#eee]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    className="w-[72px] h-[72px] object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#333] leading-snug line-clamp-2 mb-1">{item.title}</p>
                    <p className="text-[18px] font-semibold text-[#333] mb-3">{fmt(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#e0e0e0] rounded-md">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="w-[32px] h-[32px] text-[#3483fa] text-[18px] font-medium"
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="w-[32px] text-center text-[14px] text-[#333]">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="w-[32px] h-[32px] text-[#3483fa] text-[18px] font-medium"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-[13px] text-[#3483fa]"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-[16px] h-[16px]" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-md p-4 mt-3 flex items-center justify-between">
              <span className="text-[15px] text-[#333]">Total</span>
              <span className="text-[20px] font-semibold text-[#333]">{fmt(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-[#3483fa] text-white text-center text-[16px] font-medium py-[14px] rounded-md mt-3 hover:bg-[#2968c8]"
            >
              Continuar a compra
            </Link>
            <Link
              to="/"
              className="block w-full text-center text-[15px] text-[#3483fa] py-[12px] mt-2"
            >
              Ver mais produtos
            </Link>
          </>
        )}
      </main>
    </div>
  )
}
