import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft, ChevronDown, Loader2, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import vanPreload from "@/assets/free-shipping-van.webp"
import { Button } from "@/components/ui/button"
import { ExitWarningModal } from "@/components/exit-warning-modal"
import { useRouter } from "@/lib/next-compat"


function NovoEnderecoPage() {
  const router = useRouter()
  const [showExitModal, setShowExitModal] = useState(false)
  const handleBack = () => setShowExitModal(true)
  const confirmLeave = () => {
    setShowExitModal(false)
    router.push("/")
  }
  const [cep, setCep] = useState("")
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [noNumber, setNoNumber] = useState(false)
  const [complement, setComplement] = useState("")
  const [name, setName] = useState("")
  
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [preferred, setPreferred] = useState(false)
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [cepLoading, setCepLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const numberRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const customer = sessionStorage.getItem("checkout_customer")
      if (customer) {
        const parsed = JSON.parse(customer) as { name?: string; phone?: string; email?: string }
        if (parsed.name) setName(parsed.name)
        if (parsed.phone) setPhone(parsed.phone)
        if (parsed.email) setEmail(parsed.email)
      }
    } catch {
      /* ignora dados inválidos */
    }
  }, [])

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  }

  const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }

  const lookupCep = async (digits: string) => {
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setStreet(data.logradouro || "")
        setNeighborhood(data.bairro || "")
        setCity(data.localidade || "")
        setState(data.uf || "")
        setErrors((p) => ({ ...p, cep: false, street: false, city: false, state: false }))
        setTimeout(() => numberRef.current?.focus(), 100)
      }
    } catch {
      /* mantém preenchimento manual */
    }
    setCepLoading(false)
  }

  const handleCep = (value: string) => {
    const formatted = formatCep(value)
    setCep(formatted)
    setErrors((p) => ({ ...p, cep: false }))
    const digits = formatted.replace(/\D/g, "")
    if (digits.length === 8) void lookupCep(digits)
  }

  const save = () => {
    const next: Record<string, boolean> = {}
    if (cep.replace(/\D/g, "").length !== 8) next.cep = true
    if (!street.trim()) next.street = true
    if (!noNumber && !number.trim()) next.number = true
    if (!city.trim()) next.city = true
    if (!state.trim()) next.state = true
    if (!name.trim()) next.name = true
    
    if (phone.replace(/\D/g, "").length < 10) next.phone = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = true
    setErrors(next)
    if (Object.keys(next).length > 0) return

    try {
      const raw = sessionStorage.getItem("checkout_customer")
      const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
      sessionStorage.setItem(
        "checkout_customer",
        JSON.stringify({
          ...parsed,
          name: name.trim(),
          email: email.trim(),
          phone,
        }),
      )
    } catch {
      /* ignora dados inválidos */
    }

    sessionStorage.setItem(
      "checkout_address",
      JSON.stringify({
        cep: cep.replace(/\D/g, ""),
        street: street.trim(),
        streetNumber: noNumber ? "S/N" : number.trim(),
        complement: complement.trim(),
        neighborhood,
        city,
        state,
        receiverName: name.trim(),
        receiverPhone: phone,
        email: email.trim(),
        preferred,
      }),
    )
    setSaving(true)
    window.setTimeout(() => router.push("/checkout/pagamento"), 1500)
  }

  const fieldClass = (field: string) =>
    `flex h-11 w-full items-center rounded-lg border bg-card px-3 text-[16px] text-foreground outline-none placeholder:text-muted-foreground ${
      errors[field] ? "border-destructive" : "border-border focus-within:border-accent"
    }`

  return (
    <main className="min-h-screen bg-card pb-8">
      {saving ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-card pb-20" aria-live="polite">
          <h1 className="text-[22px] font-semibold text-foreground">Salvando seu endereço</h1>
          <div className="checkout-spinner mt-8" aria-label="Carregando" />
        </div>
      ) : null}
      <header className="sticky top-0 z-20 bg-primary px-4 py-3.5">
        <div className="mx-auto flex max-w-[740px] items-center gap-3">
          <button type="button" onClick={handleBack} aria-label="Voltar" className="text-primary-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-[17px] font-medium text-primary-foreground">Adicione um endereço</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[740px] px-4 pt-4">
        <label className="block text-[13px] font-medium text-foreground" htmlFor="cep">CEP</label>
        <div className={`${fieldClass("cep")} mt-1.5 justify-between gap-2`}>
          <input
            id="cep"
            inputMode="numeric"
            placeholder="Ex.: 05410-001"
            value={cep}
            onChange={(e) => handleCep(e.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          {cepLoading ? (
            <Loader2 className="size-4 animate-spin text-accent" />
          ) : (
            <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noreferrer" className="shrink-0 text-[12px] font-medium text-accent underline">
              Não sei meu CEP
            </a>
          )}
        </div>

        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="rua">Rua / Avenida</label>
        <div className={`${fieldClass("street")} mt-1.5`}>
          <input
            id="rua"
            placeholder="Ex.: Avenida Paulista"
            value={street}
            onChange={(e) => { setStreet(e.target.value); setErrors((p) => ({ ...p, street: false })) }}
            className="w-full bg-transparent outline-none"
          />
        </div>

        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="numero">Número</label>
        <div className={`${fieldClass("number")} mt-1.5 justify-between gap-2`}>
          <input
            id="numero"
            ref={numberRef}
            inputMode="numeric"
            placeholder="Ex.: 1234"
            value={noNumber ? "" : number}
            disabled={noNumber}
            onChange={(e) => { setNumber(e.target.value); setErrors((p) => ({ ...p, number: false })) }}
            className="min-w-0 flex-1 bg-transparent outline-none disabled:opacity-50"
          />
          <label className="flex shrink-0 items-center gap-2 text-[13px] text-foreground">
            Sem número
            <input
              type="checkbox"
              checked={noNumber}
              onChange={(e) => { setNoNumber(e.target.checked); setErrors((p) => ({ ...p, number: false })) }}
              className="size-4 rounded border-border accent-[var(--accent)]"
            />
          </label>
        </div>

        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="complemento">Complemento (opcional)</label>
        <div className={`${fieldClass("complement")} mt-1.5`}>
          <input
            id="complemento"
            placeholder="Ex.: Apto 201"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <label className="block text-[13px] font-medium text-foreground" htmlFor="cidade">Cidade</label>
            <div className={`${fieldClass("city")} mt-1.5`}>
              <input
                id="cidade"
                placeholder="Ex.: São Paulo"
                value={city}
                onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: false })) }}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
          <div className="w-[110px] shrink-0">
            <label className="block text-[13px] font-medium text-foreground" htmlFor="estado">Estado</label>
            <div className={`${fieldClass("state")} mt-1.5`}>
              <select
                id="estado"
                value={state}
                onChange={(e) => { setState(e.target.value); setErrors((p) => ({ ...p, state: false })) }}
                className="w-full appearance-none bg-transparent text-[16px] outline-none"
              >
                <option value="" disabled>UF</option>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <h2 className="mt-7 text-[17px] font-semibold text-foreground">Dados de quem vai receber</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Usamos esses dados para avisar sobre a entrega.</p>

        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="nome">Nome completo</label>
        <div className={`${fieldClass("name")} mt-1.5`}>
          <input
            id="nome"
            placeholder="Nome e sobrenome"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })) }}
            className="w-full bg-transparent outline-none"
          />
        </div>


        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="email">E-mail</label>
        <div className={`${fieldClass("email")} mt-1.5 gap-2`}>
          <Mail className="size-4 shrink-0 text-muted-foreground" />
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: false })) }}
            className="w-full bg-transparent outline-none"
          />
        </div>
        <p className={`mt-1.5 text-[12px] ${errors.email ? "text-destructive" : "text-muted-foreground"}`}>
          {errors.email ? "Informe um e-mail válido para receber o rastreio." : "Enviaremos o código de rastreio para este e-mail."}
        </p>

        <label className="mt-4 block text-[13px] font-medium text-foreground" htmlFor="telefone">Telefone de contato</label>
        <div className="mt-1.5 flex gap-2">
          <div className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-[14px] text-foreground">
            <span aria-hidden>🇧🇷</span> +55 <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
          <div className={fieldClass("phone")}>
            <input
              id="telefone"
              inputMode="tel"
              placeholder="(11) 96123-4567"
              value={phone}
              onChange={(e) => { setPhone(formatPhone(e.target.value)); setErrors((p) => ({ ...p, phone: false })) }}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <label className="mt-5 flex items-center gap-3 text-[14px] text-foreground">
          <input
            type="checkbox"
            checked={preferred}
            onChange={(e) => setPreferred(e.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Escolher como predefinido
        </label>

        <Button onClick={save} className="mt-6 h-11 w-full rounded-md bg-accent text-[15px] font-semibold text-accent-foreground hover:bg-accent/90">
          Salvar
        </Button>
      </div>

      <ExitWarningModal
        open={showExitModal}
        onStay={() => setShowExitModal(false)}
        onLeave={confirmLeave}
      />
    </main>
  )
}

export const Route = createFileRoute("/checkout/novo-endereco")({
  head: () => ({
    meta: [
      { title: "Adicione um endereço | Checkout" },
      { name: "description", content: "Informe o endereço, e-mail e os dados de quem vai receber o pedido." },
      { property: "og:title", content: "Adicione um endereço | Checkout" },
      { property: "og:description", content: "Informe o endereço, e-mail e os dados de quem vai receber o pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preload", as: "image", href: vanPreload, fetchPriority: "high" },
    ],
  }),
  component: NovoEnderecoPage,
})
