import { useEffect, useMemo, useState } from "react"
import {
  computeShippingDates,
  CUSTOM_PRICE,
  ECONOMY_PRICE,
  formatLongDate,
  formatShortDate,
  readShippingSelection,
  saveShippingSelection,
  toISODate,
  type ShippingId,
  type ShippingSelection,
} from "@/lib/shipping"

/** Recalcula as datas sempre que o dia muda (sem datas fixas no codigo). */
export function useShipping() {
  const [now, setNow] = useState<Date>(() => new Date())
  const [selected, setSelected] = useState<ShippingId>("full")
  const [customDate, setCustomDate] = useState<string>("")

  // Vira o dia com a pagina aberta -> recalcula
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow((prev) => {
        const next = new Date()
        return next.toDateString() === prev.toDateString() ? prev : next
      })
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const saved = readShippingSelection()
    if (saved) {
      setSelected(saved.id)
      if (saved.date) setCustomDate(saved.date)
    }
  }, [])

  const dates = useMemo(() => computeShippingDates(now), [now])

  const customOptions = useMemo(
    () => dates.customDates.map((d) => ({ value: toISODate(d), label: formatLongDate(d) })),
    [dates],
  )

  // Mantem a data personalizada sempre dentro do intervalo valido
  useEffect(() => {
    if (customDate && !customOptions.some((o) => o.value === customDate)) setCustomDate("")
  }, [customDate, customOptions])

  const fullLabel = `Chega até ${formatLongDate(dates.full)}`
  const economyLabel = `Chega entre ${formatLongDate(dates.economyStart)} e ${formatLongDate(dates.economyEnd)}`
  const economyShortLabel = `Chega entre ${formatShortDate(dates.economyStart)} e ${formatShortDate(dates.economyEnd)}`
  const customLabel = customDate
    ? `Chega em ${customOptions.find((o) => o.value === customDate)?.label ?? ""}`
    : "Escolha a data que deseja receber"

  const price = selected === "full" ? 0 : selected === "economico" ? ECONOMY_PRICE : CUSTOM_PRICE

  const selection: ShippingSelection = useMemo(
    () => ({
      id: selected,
      label:
        selected === "full" ? "Frete Full" : selected === "economico" ? "Frete Econômico" : "Escolha o dia da entrega",
      price,
      date: selected === "personalizado" ? customDate || undefined : selected === "full" ? toISODate(dates.full) : undefined,
      dateLabel: selected === "full" ? fullLabel : selected === "economico" ? economyLabel : customLabel,
    }),
    [selected, price, customDate, dates, fullLabel, economyLabel, customLabel],
  )

  useEffect(() => {
    saveShippingSelection(selection)
  }, [selection])

  return {
    dates,
    selected,
    setSelected,
    customDate,
    setCustomDate,
    customOptions,
    fullLabel,
    economyLabel,
    economyShortLabel,
    customLabel,
    price,
    selection,
  }
}
