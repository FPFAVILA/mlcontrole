import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@/lib/next-compat"
import { useState, useRef } from "react"
import { MercadoPagoHeader } from "@/components/mercado-pago-header"
import { CheckoutSidebar } from "@/components/checkout-sidebar"
import { CountdownTimer } from "@/components/countdown-timer"
import { ShippingOptions } from "@/components/shipping-options"
import { ArrowLeft, Check, Loader2 } from "lucide-react"

function EnderecoPage() {
  const router = useRouter()
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("MG")
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [cepFilled, setCepFilled] = useState(false)
  const numeroRef = useRef<HTMLInputElement>(null)

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
  }

  const fetchAddress = async (cepValue: string) => {
    const digits = cepValue.replace(/\D/g, "")
    if (digits.length !== 8) return

    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setEndereco(data.logradouro || "")
        setBairro(data.bairro || "")
        setCidade(data.localidade || "")
        setEstado(data.uf || "MG")
        setCepFilled(true)
        setErrors((p) => ({ ...p, cep: false, endereco: false, bairro: false, cidade: false, numero: true }))
        // Focar no campo numero apos preencher
        setTimeout(() => numeroRef.current?.focus(), 100)
      }
    } catch {}
    setCepLoading(false)
  }

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value)
    setCep(formatted)
    setErrors((p) => ({ ...p, cep: false }))
    const digits = formatted.replace(/\D/g, "")
    if (digits.length === 8) {
      fetchAddress(digits)
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}
    if (!cep.trim()) newErrors.cep = true
    if (!endereco.trim()) newErrors.endereco = true
    if (!numero.trim()) newErrors.numero = true
    if (!bairro.trim()) newErrors.bairro = true
    if (!cidade.trim()) newErrors.cidade = true
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    sessionStorage.setItem("checkout_address", JSON.stringify({
      cep: cep.trim().replace(/\D/g, ""),
      street: endereco.trim(),
      streetNumber: numero.trim(),
      neighborhood: bairro.trim(),
      city: cidade.trim(),
      state: estado,
    }))

    router.push("/checkout/pagamento")
  }

  const inputClass = (field: string) =>
    `w-full h-[44px] px-4 border rounded text-[16px] text-[#333] bg-white outline-none placeholder:text-[#ccc] ${
      errors[field] ? "border-[#e44] bg-[#fff5f5]" : "border-[#e0e0e0] focus:border-[#3483fa]"
    }`

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] pb-[60px]">
      <MercadoPagoHeader />

      {/* Content */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 py-6">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6 md:mb-8">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#00a650] text-white text-[11px] md:text-[13px] font-bold flex items-center justify-center">
              <Check className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <span className="text-[12px] md:text-[14px] text-[#999]">Identificação</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#3483fa] text-white text-[11px] md:text-[13px] font-bold flex items-center justify-center">2</div>
            <span className="text-[12px] md:text-[14px] font-semibold text-[#333]">Entrega</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#e0e0e0] text-[#999] text-[11px] md:text-[13px] font-bold flex items-center justify-center">3</div>
            <span className="text-[12px] md:text-[14px] text-[#999]">Pagamento</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 md:p-6">
              <h2 className="text-[18px] font-semibold text-[#333] mb-1">Entrega</h2>
              <p className="text-[13px] text-[#333] mb-5">
                {'Outra pessoa irá receber o pedido? '}
                <a href="#" className="text-[#3483fa] hover:underline">Clique aqui</a>
              </p>

              {/* CEP */}
              <div className="mb-4">
                <label className="text-[14px] font-medium text-[#333] mb-1 block">CEP</label>
                <div className="relative w-full sm:w-[200px]">
                  <input
                    type="text"
                    placeholder="12345-000"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    maxLength={9}
                    className={`w-full h-[44px] px-4 border rounded text-[16px] text-[#333] bg-white outline-none placeholder:text-[#ccc] ${errors.cep ? "border-[#e44] bg-[#fff5f5]" : "border-[#e0e0e0] focus:border-[#3483fa]"}`}
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#3483fa]" />
                    </div>
                  )}
                </div>
                {errors.cep && <span className="text-[11px] text-[#e44] mt-1 block">Campo obrigatorio</span>}
              </div>

              {/* Endereço & Número */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, Avenida, Alameda"
                    value={endereco}
                    onChange={(e) => { setEndereco(e.target.value); setErrors((p) => ({ ...p, endereco: false })) }}
                    className={inputClass("endereco")}
                  />
                  {errors.endereco && <span className="text-[11px] text-[#e44] mt-1 block">Campo obrigatorio</span>}
                </div>
                <div className="w-full sm:w-[140px]">
                  <label className={`text-[14px] font-medium mb-1 flex items-center gap-1 ${cepFilled && !numero.trim() ? "text-[#e44]" : "text-[#333]"}`}>
                    {'Numero'}
                    {cepFilled && !numero.trim() && <span className="text-[11px] text-[#e44] font-normal">{'(Obrigatorio)'}</span>}
                  </label>
                  <input
                    ref={numeroRef}
                    type="text"
                    placeholder="S/N"
                    value={numero}
                    onChange={(e) => { setNumero(e.target.value); setErrors((p) => ({ ...p, numero: false })); if (e.target.value.trim()) setCepFilled(false) }}
                    className={`w-full h-[44px] px-4 border-2 rounded text-[16px] text-[#333] bg-white outline-none placeholder:text-[#ccc] ${
                      cepFilled && !numero.trim()
                        ? "border-[#e44] bg-[#fff5f5] animate-pulse"
                        : errors.numero
                          ? "border-[#e44] bg-[#fff5f5]"
                          : "border-[#e0e0e0] focus:border-[#3483fa]"
                    }`}
                  />
                  {errors.numero && <span className="text-[11px] text-[#e44] mt-1 block">Campo obrigatorio</span>}
                </div>
              </div>

              {/* Complemento & Bairro */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Complemento</label>
                  <input
                    type="text"
                    placeholder="Apartamento, unidade, predio, ar"
                    className="w-full h-[44px] px-4 border border-[#e0e0e0] rounded text-[16px] text-[#333] bg-white outline-none focus:border-[#3483fa] placeholder:text-[#ccc]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Bairro</label>
                  <input
                    type="text"
                    placeholder="Centro"
                    value={bairro}
                    onChange={(e) => { setBairro(e.target.value); setErrors((p) => ({ ...p, bairro: false })) }}
                    className={inputClass("bairro")}
                  />
                  {errors.bairro && <span className="text-[11px] text-[#e44] mt-1 block">Campo obrigatorio</span>}
                </div>
              </div>

              {/* Cidade, Estado, País */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Cidade</label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={cidade}
                    onChange={(e) => { setCidade(e.target.value); setErrors((p) => ({ ...p, cidade: false })) }}
                    className={inputClass("cidade")}
                  />
                  {errors.cidade && <span className="text-[11px] text-[#e44] mt-1 block">Campo obrigatorio</span>}
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Estado</label>
                  <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full h-[44px] px-4 border border-[#e0e0e0] rounded text-[16px] text-[#333] bg-white outline-none focus:border-[#3483fa]">
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">País</label>
                  <select className="w-full h-[44px] px-4 border border-[#e0e0e0] rounded text-[16px] text-[#333] bg-white outline-none focus:border-[#3483fa]">
                    <option>Brasil</option>
                  </select>
                </div>
              </div>

              {/* Frete */}
              <p className="text-[14px] font-medium text-[#333] mb-3">Escolha o melhor frete para você</p>
              <div className="mb-6 rounded-lg border border-[#e0e0e0] p-4">
                <ShippingOptions />
              </div>


              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-1 text-[14px] text-[#3483fa] hover:underline bg-transparent border-none cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className="h-[48px] px-8 bg-[#00a650] hover:bg-[#008c44] text-white rounded-[6px] font-bold text-[14px] uppercase cursor-pointer tracking-wide"
                >
                  IR PARA O PAGAMENTO
                </button>
              </div>
            </div>
          </div>

          {/* Right - Sidebar */}
          <CheckoutSidebar />
        </div>
      </main>

      {/* MP Footer */}
      <div className="bg-[#c5ddf5] py-3 text-center mb-[44px]">
        <div className="flex flex-col items-center justify-center gap-2 text-[11px] text-[#666]">
          <span>{'Formas de pagamento'}</span>
          <img src="/images/card-pix.png" alt="Pix" className="h-[24px] w-auto object-contain" />
        </div>
      </div>
      <div className="text-center py-3 text-[12px] text-[#999]">
        {'© 2026 Mercado Pago'}
      </div>

      <CountdownTimer />
    </div>
  )
}

export const Route = createFileRoute("/checkout/endereco")({
  head: () => ({
    meta: [
      { title: "Endereço de entrega | Mercado Livre" },
      { name: "description", content: "Informe o endereço onde você quer receber o seu pedido." },
      { property: "og:title", content: "Endereço de entrega | Mercado Livre" },
      { property: "og:description", content: "Informe o endereço onde você quer receber o seu pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnderecoPage,
});
