import { useEffect, useState } from "react"

const SHOWN_KEY = "app_banner_shown"

export function AppOpenBanner() {
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    const alreadyShown = window.localStorage.getItem(SHOWN_KEY) === "1"
    if (!alreadyShown) {
      window.localStorage.setItem(SHOWN_KEY, "1")
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const handleOpenApp = () => {
    // Simula a abertura do app com uma animação de carregamento
    setOpening(true)
    setTimeout(() => {
      setOpen(false)
      setOpening(false)
    }, 1200)
  }

  if (opening) {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white">
        <div className="checkout-spinner" aria-label="Carregando" />
        <p className="mt-4 text-[15px] font-medium text-[#3483fa]">Abrindo o app…</p>
      </div>
    )
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45"
      role="dialog"
      aria-modal="true"
      aria-label="Abrir no aplicativo"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[480px] rounded-t-2xl bg-white px-6 pb-10 pt-12 text-center shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone do app sobrepondo a borda superior */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2">
          <img
            src="/favicon.png"
            alt="Mercado Livre"
            width={76}
            height={76}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="size-[76px] rounded-[20px] shadow-md"
          />
        </div>

        <p className="mt-2 text-[15px] text-[#999]">
          <span className="font-semibold text-[#333]">4.8</span>{" "}
          <span aria-hidden="true">★</span>{" "}
          <span className="font-medium">+300k opiniões</span>
        </p>

        <h2 className="mx-auto mt-5 max-w-[420px] text-[24px] font-semibold leading-snug text-[#1a1a1a] md:text-[28px]">
          Abra o app e ganhe frete grátis na sua primeira compra
        </h2>

        <button
          type="button"
          onClick={handleOpenApp}
          className="mt-7 h-[52px] w-full rounded-md bg-[#3483fa] text-[16px] font-semibold text-white transition-colors hover:bg-[#2968c8]"
        >
          Abrir app do Mercado Livre
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-5 text-[15px] font-medium text-[#3483fa] transition-colors hover:text-[#2968c8]"
        >
          Agora não
        </button>
      </div>
    </div>
  )
}
