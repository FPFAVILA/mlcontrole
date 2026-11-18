import { useState } from "react"
import { Search, ShoppingCart, ChevronDown, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function MLHeader() {
  const [showCepModal, setShowCepModal] = useState(false)
  const [cep, setCep] = useState("")
  const { count } = useCart()

  return (
    <>
      <header className="bg-[#ffe600] w-full">
        {/* Top bar */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center h-[58px] gap-2 md:gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 mr-1 md:mr-2">
              <img
                src="/images/mercado-livre-logo.png"
                alt="Mercado Livre"
                width={170}
                height={44}
                className="h-[28px] md:h-[34px] w-auto object-contain"
              />
            </div>

            {/* Search bar */}
            <div className="flex-1 min-w-0 max-w-[680px]">
              <div className="flex items-center bg-white rounded overflow-hidden shadow-sm">
                <input
                  type="text"
                  placeholder="Buscar produtos, muito mais..."
                  className="flex-1 min-w-0 h-[36px] md:h-[44px] px-2 md:px-4 text-[13px] md:text-[15px] text-[#333] bg-white border-none outline-none placeholder:text-[#999]"
                />
                <div className="w-[1px] h-[28px] bg-[#e0e0e0] hidden md:block" />
                <button
                  className="px-3 md:px-5 h-[36px] md:h-[44px] flex items-center justify-center bg-white hover:bg-[#f5f5f5]"
                  aria-label="Buscar"
                >
                  <Search className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-[#666]" />
                </button>
              </div>
            </div>

            {/* Right side: meli+ banner (desktop) */}
            <div className="hidden md:flex items-center ml-auto flex-shrink-0">
              <img
                src="/images/banner-meli-mega.webp"
                alt="Meli+ Mega - Assine agora - Bridgerton na Netflix"
                className="h-[50px] w-auto object-contain"
              />
            </div>

            {/* Cart icon (mobile) */}
            <a href="/carrinho" className="md:hidden relative flex-shrink-0 ml-auto flex items-center justify-center w-[40px] h-[40px]">
              <ShoppingCart className="w-[22px] h-[22px] text-[#333]" />
              {count > 0 && (
                <span className="absolute top-[2px] right-[2px] bg-[#00a650] text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </a>
          </div>

          {/* Bottom nav */}
          <div className="hidden md:flex items-center justify-between h-[36px] text-[13px] text-[#333]">
            <nav className="flex items-center gap-5">
              <a
                href="#"
                className="flex items-center gap-1 text-[13px] text-[#333] hover:text-[#1a1a1a]"
              >
                Categorias <ChevronDown className="w-3 h-3" />
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Ofertas
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Cupons
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Moda
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Mercado Play
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Vender
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Contato
              </a>
            </nav>
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="flex items-center gap-1 text-[13px] text-[#333] hover:text-[#1a1a1a]"
              >
                Minha conta <ChevronDown className="w-3 h-3" />
              </a>
              <a href="#" className="text-[13px] text-[#333] hover:text-[#1a1a1a]">
                Rastrear Pedido
              </a>
              <a href="/carrinho" className="relative cursor-pointer">
                <ShoppingCart className="w-[20px] h-[20px] text-[#333]" />
                <span className="absolute -top-[6px] -right-[8px] bg-[#00a650] text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  {count}
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* CEP Modal */}
      {showCepModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] p-8 relative">
            <button
              onClick={() => setShowCepModal(false)}
              className="absolute top-4 right-4 text-[#999] hover:text-[#333] bg-transparent border-none cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-[22px] font-semibold text-[#333] mb-2 pr-8">
              Selecione onde quer receber suas compras
            </h2>
            <p className="text-[14px] text-[#999] mb-6">
              {'Voce podera ver custos e prazos de entrega precisos em tudo que procurar.'}
            </p>
            <label className="text-[14px] font-medium text-[#333] mb-2 block">CEP</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#e0e0e0] rounded overflow-hidden focus-within:border-[#3483fa]">
                <input
                  type="text"
                  placeholder="Informar um CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="h-[44px] px-4 text-[14px] text-[#333] bg-white border-none outline-none w-[200px] placeholder:text-[#999]"
                />
                <button className="h-[44px] px-5 bg-[#3483fa] text-white text-[14px] font-medium hover:bg-[#2968c8] border-none cursor-pointer">
                  Usar
                </button>
              </div>
              <a
                href="#"
                className="text-[14px] text-[#3483fa] hover:text-[#2968c8] whitespace-nowrap"
              >
                {'Nao sei o meu CEP'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
