import { useEffect } from "react"
import { ChevronUp, Zap } from "lucide-react"
import { useShipping } from "@/hooks/use-shipping"
import { type ShippingSelection } from "@/lib/shipping"

/** Preço no estilo Mercado Livre: "R$ 23" com "99" sobrescrito, sem vírgula. */
function PriceSuper({
  value,
  className = "",
  strike = false,
}: {
  value: number
  className?: string
  strike?: boolean
}) {
  const [reais, centavos] = value.toFixed(2).split(".")
  return (
    <span
      className={`whitespace-nowrap ${strike ? "line-through text-[#999]" : ""} ${className}`}
    >
      R$ {reais}
      <sup className="text-[0.6em] -top-[0.3em] relative ml-px">{centavos}</sup>
    </span>
  )
}

interface ShippingOptionsProps {
  onChange?: (selection: ShippingSelection) => void
  title?: string
}

export function ShippingOptions({ onChange, title = "Envio 1" }: ShippingOptionsProps) {
  const {
    selected,
    setSelected,
    customDate,
    setCustomDate,
    customOptions,
    fullLabel,
    economyLabel,
    customLabel,
    selection,
  } = useShipping()

  useEffect(() => {
    onChange?.(selection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection])

  const rowClass = (id: string) =>
    `flex items-start gap-3 rounded-lg px-2 py-3 text-[14px] cursor-pointer transition-colors ${
      selected === id ? "bg-[#f0f6ff]" : "hover:bg-[#fafafa]"
    }`

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#eee] pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-[#333]">{title}</h3>
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#00a650]">
            <Zap className="size-3 fill-[#00a650]" /> FULL
          </span>
        </div>
        <ChevronUp className="size-4 text-[#3483fa]" />
      </div>

      {/* Frete Full */}
      <label className={rowClass("full")}>
        <input
          type="radio"
          name="shipping"
          value="full"
          checked={selected === "full"}
          onChange={() => setSelected("full")}
          className="mt-0.5 size-4 accent-[#3483fa]"
        />
        <span className="flex-1 leading-snug text-[#333]">
          {fullLabel}
          <span className="mt-0.5 block text-[12px] text-[#999]">Frete Full — até 3 dias</span>
        </span>
        <span className="whitespace-nowrap text-right">
          <PriceSuper value={13.2} strike className="mr-1 text-[13px]" />
          <span className="text-[14px] font-semibold text-[#00a650]">Grátis</span>
        </span>
      </label>

      {/* Frete Econômico */}
      <label className={rowClass("economico")}>
        <input
          type="radio"
          name="shipping"
          value="economico"
          checked={selected === "economico"}
          onChange={() => setSelected("economico")}
          className="mt-0.5 size-4 accent-[#3483fa]"
        />
        <span className="flex-1 leading-snug text-[#333]">
          {economyLabel}
          <span className="mt-0.5 block text-[12px] text-[#999]">Frete Econômico — 4 a 7 dias</span>
        </span>
        <span className="whitespace-nowrap text-[14px] font-semibold text-[#333]">
          <PriceSuper value={36.9} strike className="mr-1 text-[13px]" />
          <PriceSuper value={23.99} />
        </span>
      </label>

      {/* Escolha o dia */}
      <label className={rowClass("personalizado")}>
        <input
          type="radio"
          name="shipping"
          value="personalizado"
          checked={selected === "personalizado"}
          onChange={() => setSelected("personalizado")}
          className="mt-0.5 size-4 accent-[#3483fa]"
        />
        <span className="flex-1 leading-snug text-[#333]">
          No dia que você preferir
          <span className="mt-0.5 block text-[12px] text-[#999]">{customLabel}</span>
        </span>
        <span className="whitespace-nowrap text-[14px] font-semibold text-[#333]">
          <PriceSuper value={36.9} strike className="mr-1 text-[13px]" />
          <PriceSuper value={23.99} />
        </span>
      </label>

      {selected === "personalizado" && (
        <div className="px-2 pb-2">
          <label className="mb-1 block text-[13px] font-medium text-[#333]">Escolha quando você quer receber</label>
          <select
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="h-[44px] w-full max-w-[320px] rounded border border-[#e0e0e0] bg-white px-3 text-[16px] text-[#333] outline-none focus:border-[#3483fa]"
          >
            <option value="">Selecionar data</option>
            {customOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {!customDate && (
            <p className="mt-1 text-[11px] text-[#e44]">Selecione uma data disponível para continuar.</p>
          )}
        </div>
      )}

      <p className="mt-2 text-[11px] text-[#999]">
        A previsão de entrega pode variar de acordo com a região e facilidade de acesso ao seu endereço.
      </p>
    </div>
  )
}
