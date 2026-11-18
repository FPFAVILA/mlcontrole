import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@/lib/next-compat"
import { useState } from "react"
import { MercadoPagoHeader } from "@/components/mercado-pago-header"
import { CheckoutSidebar } from "@/components/checkout-sidebar"
import { CountdownTimer } from "@/components/countdown-timer"
import { Check } from "lucide-react"

function IdentificacaoPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [noEmail, setNoEmail] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateCpf(raw: string): boolean {
    const digits = raw.replace(/\D/g, "")
    if (digits.length !== 11) return false
    if (/^(\d)\1{10}$/.test(digits)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
    let rest = (sum * 10) % 11
    if (rest === 10) rest = 0
    if (rest !== parseInt(digits[9])) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
    rest = (sum * 10) % 11
    if (rest === 10) rest = 0
    if (rest !== parseInt(digits[10])) return false
    return true
  }

  function formatCpf(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ""
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!noEmail && !email.trim()) newErrors.email = "Campo obrigatorio"
    if (!phone.trim()) newErrors.phone = "Campo obrigatorio"
    else if (phone.replace(/\D/g, "").length < 10) newErrors.phone = "Telefone invalido"
    if (!name.trim()) newErrors.name = "Campo obrigatorio"
    if (!cpf.trim()) newErrors.cpf = "Campo obrigatorio"
    else if (!validateCpf(cpf)) newErrors.cpf = "CPF invalido"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    sessionStorage.setItem("checkout_customer", JSON.stringify({
      name: name.trim(),
      email: noEmail ? "" : email.trim(),
      phone: phone.trim(),
      cpf: cpf.trim().replace(/\D/g, ""),
    }))

    router.push("/checkout/endereco")
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
            <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#3483fa] text-white text-[11px] md:text-[13px] font-bold flex items-center justify-center">1</div>
            <span className="text-[12px] md:text-[14px] font-semibold text-[#333]">Identificação</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#e0e0e0] text-[#999] text-[11px] md:text-[13px] font-bold flex items-center justify-center">2</div>
            <span className="text-[12px] md:text-[14px] text-[#999]">Entrega</span>
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
              {/* Email & Phone */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => { const { email: _, ...rest } = p; return rest }) }}
                    disabled={noEmail}
                    className={inputClass("email")}
                  />
                  {errors.email && <span className="text-[11px] text-[#e44] mt-1 block">{errors.email}</span>}
                  <label className="flex items-center gap-2 mt-2 text-[13px] text-[#999]">
                    <input type="checkbox" className="accent-[#3483fa]" checked={noEmail} onChange={(e) => { setNoEmail(e.target.checked); if (e.target.checked) setErrors((p) => { const { email: _, ...rest } = p; return rest }) }} />
                    {'Não tenho e-mail'}
                  </label>
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Telefone</label>
                  <input
                    type="tel"
                    placeholder="(99) 99999-9999"
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setErrors((p) => { const { phone: _, ...rest } = p; return rest }) }}
                    className={inputClass("phone")}
                  />
                  {errors.phone && <span className="text-[11px] text-[#e44] mt-1 block">{errors.phone}</span>}
                </div>
              </div>

              {/* Name & CPF */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">Nome completo</label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => { const { name: _, ...rest } = p; return rest }) }}
                    className={inputClass("name")}
                  />
                  {errors.name && <span className="text-[11px] text-[#e44] mt-1 block">{errors.name}</span>}
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => { setCpf(formatCpf(e.target.value)); setErrors((p) => { const { cpf: _, ...rest } = p; return rest }) }}
                    maxLength={14}
                    className={inputClass("cpf")}
                  />
                  {errors.cpf && <span className="text-[11px] text-[#e44] mt-1 block">{errors.cpf}</span>}
                </div>
              </div>

              {/* Security info */}
              <div className="border-t border-dashed border-[#e0e0e0] pt-5 mt-4">
                <p className="text-[14px] font-semibold text-[#333] mb-4">
                  {'Usamos seus dados de forma 100% segura para garantir a sua satisfação:'}
                </p>
                <div className="space-y-2 mb-6">
                  {[
                    "Enviar o seu comprovante de compra e pagamento;",
                    "Ativar a sua garantia de devolução caso não fique satisfeito;",
                    "Acompanhar o andamento do seu pedido;",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-[18px] h-[18px] rounded-full bg-[#00a650] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[13px] text-[#333]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="h-[48px] px-8 bg-[#00a650] hover:bg-[#008c44] text-white rounded-[6px] font-bold text-[14px] uppercase cursor-pointer tracking-wide"
                  >
                    IR PARA A ENTREGA
                  </button>
                </div>
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

export const Route = createFileRoute("/checkout/identificacao")({
  head: () => ({
    meta: [
      { title: "Identificação | Mercado Livre" },
      { name: "description", content: "Informe seus dados de contato para continuar a compra." },
      { property: "og:title", content: "Identificação | Mercado Livre" },
      { property: "og:description", content: "Informe seus dados de contato para continuar a compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdentificacaoPage,
});
